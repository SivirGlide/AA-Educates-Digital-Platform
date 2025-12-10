from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.conf import settings
from .models import PaymentTransaction, CRMContactLog
from .serializers import PaymentTransactionSerializer, CRMContactLogSerializer
import stripe
import os

# Initialize Stripe
stripe.api_key = os.environ.get('STRIPE_SECRET_KEY', '')


class PaymentTransactionViewSet(viewsets.ModelViewSet):
    queryset = PaymentTransaction.objects.all().order_by('-created_at')
    serializer_class = PaymentTransactionSerializer


class CRMContactLogViewSet(viewsets.ModelViewSet):
    queryset = CRMContactLog.objects.all().order_by('-timestamp')
    serializer_class = CRMContactLogSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_checkout_session(request):
    """
    Create a Stripe checkout session for various payment types:
    - workbook: Purchase a workbook (requires workbook_id)
    - corporate_payment: Corporate payment (requires amount, description)
    - subscription: Subscription payment (requires amount, description)
    """
    try:
        payment_type = request.data.get('payment_type')
        amount = request.data.get('amount')
        currency = request.data.get('currency', 'gbp')
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
        success_url = request.data.get('success_url', f'{frontend_url}/checkout/success?session_id={{CHECKOUT_SESSION_ID}}')
        cancel_url = request.data.get('cancel_url', f'{frontend_url}/checkout/cancel')
        
        line_items = []
        metadata = {
            'user_id': str(request.user.id),
            'payment_type': payment_type,
        }
        
        if payment_type == 'workbook':
            workbook_id = request.data.get('workbook_id')
            if not workbook_id:
                return Response({'error': 'workbook_id is required for workbook purchases'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Get workbook details (you may need to import Workbook model)
            from learning.models import Workbook
            try:
                workbook = Workbook.objects.get(id=workbook_id)
                amount = float(workbook.price)
                product_data = {
                    'name': workbook.title,
                }
                # Only add description if it's not empty
                if workbook.description and workbook.description.strip():
                    product_data['description'] = workbook.description.strip()
                else:
                    product_data['description'] = 'Workbook purchase'
                
                line_items.append({
                    'price_data': {
                        'currency': currency,
                        'product_data': product_data,
                        'unit_amount': int(amount * 100),  # Convert to pence/cents
                    },
                    'quantity': 1,
                })
                metadata['workbook_id'] = str(workbook_id)
            except Workbook.DoesNotExist:
                return Response({'error': 'Workbook not found'}, status=status.HTTP_404_NOT_FOUND)
        
        elif payment_type in ['corporate_payment', 'subscription', 'other']:
            description = request.data.get('description', 'Payment')
            if not amount:
                return Response({'error': 'amount is required'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Build product_data with required name
            product_data = {
                'name': description or 'Payment',
            }
            # Only add description if details are provided and not empty
            details = request.data.get('details', '').strip()
            if details:
                product_data['description'] = details
            else:
                # Provide a default description if none is provided
                product_data['description'] = f'{payment_type.replace("_", " ").title()} payment'
            
            line_items.append({
                'price_data': {
                    'currency': currency,
                    'product_data': product_data,
                    'unit_amount': int(float(amount) * 100),  # Convert to pence/cents
                },
                'quantity': 1,
            })
            metadata['description'] = description
        
        else:
            return Response({'error': 'Invalid payment_type'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create Stripe checkout session
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=line_items,
            mode='payment',
            success_url=success_url,
            cancel_url=cancel_url,
            metadata=metadata,
            customer_email=request.user.email,
        )
        
        # Create payment transaction record
        transaction = PaymentTransaction.objects.create(
            user=request.user,
            amount=amount,
            currency=currency.upper(),
            provider=PaymentTransaction.STRIPE,
            transaction_id=checkout_session.id,
            status=PaymentTransaction.PENDING,
        )
        
        return Response({
            'session_id': checkout_session.id,
            'url': checkout_session.url,
            'transaction_id': transaction.id,
        }, status=status.HTTP_201_CREATED)
        
    except stripe.error.StripeError as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_payment(request):
    """
    Verify a payment after Stripe checkout completion.
    This should be called from a webhook, but we also provide this endpoint for manual verification.
    """
    try:
        session_id = request.data.get('session_id')
        if not session_id:
            return Response({'error': 'session_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Retrieve the checkout session from Stripe
        session = stripe.checkout.Session.retrieve(session_id)
        
        # Update payment transaction
        try:
            transaction = PaymentTransaction.objects.get(transaction_id=session_id)
            if session.payment_status == 'paid':
                transaction.status = PaymentTransaction.SUCCEEDED
                transaction.save()
                
                # Handle workbook purchase if applicable
                if session.metadata.get('payment_type') == 'workbook' and session.metadata.get('workbook_id'):
                    from learning.models import Workbook, WorkbookPurchase
                    from users.models import ParentProfile, SchoolProfile
                    from django.contrib.contenttypes.models import ContentType
                    
                    workbook_id = int(session.metadata['workbook_id'])
                    user = request.user
                    
                    # Determine purchaser profile
                    purchaser = None
                    
                    if hasattr(user, 'parentprofile'):
                        purchaser = user.parentprofile
                    elif hasattr(user, 'schoolprofile'):
                        purchaser = user.schoolprofile
                    
                    if purchaser:
                        workbook = Workbook.objects.get(id=workbook_id)
                        WorkbookPurchase.objects.create(
                            workbook=workbook,
                            purchaser=purchaser,
                            payment_status=WorkbookPurchase.PAID,
                            transaction_id=session_id,
                        )
                
                return Response({
                    'status': 'success',
                    'transaction_id': transaction.id,
                    'message': 'Payment verified successfully',
                })
            else:
                transaction.status = PaymentTransaction.FAILED
                transaction.save()
                return Response({'error': 'Payment not completed'}, status=status.HTTP_400_BAD_REQUEST)
                
        except PaymentTransaction.DoesNotExist:
            return Response({'error': 'Transaction not found'}, status=status.HTTP_404_NOT_FOUND)
            
    except stripe.error.StripeError as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
