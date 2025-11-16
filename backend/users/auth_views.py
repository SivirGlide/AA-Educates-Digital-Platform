from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User, StudentProfile, CorporatePartnerProfile, ParentProfile, AdminProfile


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """
    Login endpoint that returns JWT tokens and user information
    """
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response(
            {'error': 'Email and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response(
            {'error': 'Invalid email or password'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    if not user.check_password(password):
        return Response(
            {'error': 'Invalid email or password'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    if not user.is_active:
        return Response(
            {'error': 'User account is disabled'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    # Generate tokens
    refresh = RefreshToken.for_user(user)
    access_token = refresh.access_token

    # Get user profile ID based on role
    profile_id = None
    if user.role == User.STUDENT:
        try:
            profile = StudentProfile.objects.get(user=user)
            profile_id = profile.id
        except StudentProfile.DoesNotExist:
            pass
    elif user.role == User.CORPORATE_PARTNER:
        try:
            profile = CorporatePartnerProfile.objects.get(user=user)
            profile_id = profile.id
        except CorporatePartnerProfile.DoesNotExist:
            pass
    elif user.role == User.PARENT:
        try:
            profile = ParentProfile.objects.get(user=user)
            profile_id = profile.id
        except ParentProfile.DoesNotExist:
            pass
    elif user.role == User.ADMIN:
        try:
            profile = AdminProfile.objects.get(user=user)
            profile_id = profile.id
        except AdminProfile.DoesNotExist:
            pass

    return Response({
        'access': str(access_token),
        'refresh': str(refresh),
        'user': {
            'id': user.id,
            'email': user.email,
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'role': user.role,
            'profile_id': profile_id,
        }
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """
    Registration endpoint to create new users
    """
    email = request.data.get('email')
    password = request.data.get('password')
    username = request.data.get('username', email.split('@')[0])
    first_name = request.data.get('first_name', '')
    last_name = request.data.get('last_name', '')
    role = request.data.get('role', User.STUDENT)

    if not email or not password:
        return Response(
            {'error': 'Email and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(email=email).exists():
        return Response(
            {'error': 'User with this email already exists'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {'error': 'Username already taken'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Create user
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name,
        role=role,
    )

    # Generate tokens
    refresh = RefreshToken.for_user(user)
    access_token = refresh.access_token

    return Response({
        'access': str(access_token),
        'refresh': str(refresh),
        'user': {
            'id': user.id,
            'email': user.email,
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'role': user.role,
            'profile_id': None,  # Profile needs to be created separately
        }
    }, status=status.HTTP_201_CREATED)

