import Head from 'next/head';
import { useRouter } from 'next/router';
import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/src/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Badge } from '@/src/components/ui/badge';
import { api } from '../../lib/api';
import { Loader2, CreditCard, BookOpen, Building2, DollarSign } from 'lucide-react';

interface CheckoutPageProps {
  paymentType?: 'workbook' | 'corporate_payment' | 'subscription' | 'other';
  workbookId?: number;
  amount?: number;
  description?: string;
}

const CheckoutPage: NextPage = () => {
  const router = useRouter();
  const { payment_type, workbook_id, amount, description } = router.query;
  
  const [paymentType, setPaymentType] = useState<string>(
    (payment_type as string) || 'workbook'
  );
  const [workbookId, setWorkbookId] = useState<number | undefined>(
    workbook_id ? parseInt(workbook_id as string, 10) : undefined
  );
  const [customAmount, setCustomAmount] = useState<string>(
    amount ? (amount as string) : ''
  );
  const [customDescription, setCustomDescription] = useState<string>(
    description ? (description as string) : ''
  );
  const [currency, setCurrency] = useState<string>('gbp');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [workbook, setWorkbook] = useState<any>(null);

  useEffect(() => {
    if (paymentType === 'workbook' && workbookId) {
      // Fetch workbook details if workbook_id is provided
      // This would require a getWorkbook API endpoint
      // For now, we'll just use the ID
    }
  }, [paymentType, workbookId]);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const checkoutData: any = {
        payment_type: paymentType,
        currency: currency,
      };

      if (paymentType === 'workbook') {
        if (!workbookId) {
          setError('Please select a workbook to purchase');
          setLoading(false);
          return;
        }
        checkoutData.workbook_id = workbookId;
      } else {
        if (!customAmount || parseFloat(customAmount) <= 0) {
          setError('Please enter a valid amount');
          setLoading(false);
          return;
        }
        checkoutData.amount = parseFloat(customAmount);
        checkoutData.description = customDescription || 'Payment';
      }

      const response = await api.createCheckoutSession(checkoutData);
      
      if (response.error) {
        setError(response.error);
        setLoading(false);
        return;
      }

      if (response.data?.url) {
        // Redirect to Stripe checkout
        window.location.href = response.data.url;
      } else {
        setError('Failed to create checkout session');
        setLoading(false);
      }
    } catch (err) {
      setError('An error occurred while creating the checkout session');
      setLoading(false);
    }
  };

  const getPaymentTypeIcon = () => {
    switch (paymentType) {
      case 'workbook':
        return <BookOpen className="h-5 w-5" />;
      case 'corporate_payment':
        return <Building2 className="h-5 w-5" />;
      case 'subscription':
        return <DollarSign className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  return (
    <>
      <Head>
        <title>Checkout | AA Educates</title>
      </Head>
      <DashboardLayout backgroundClassName="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="max-w-2xl mx-auto space-y-8">
          <header className="space-y-3">
            <h1 className="text-3xl font-extrabold">Checkout</h1>
            <p className="text-muted-foreground">Complete your payment securely with Stripe</p>
          </header>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getPaymentTypeIcon()}
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Payment Type Selection */}
              <div>
                <Label htmlFor="payment_type">Payment Type</Label>
                <select
                  id="payment_type"
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value)}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring mt-2"
                >
                  <option value="workbook">Workbook Purchase</option>
                  <option value="corporate_payment">Corporate Payment</option>
                  <option value="subscription">Subscription</option>
                  <option value="other">Other Payment</option>
                </select>
              </div>

              {/* Workbook Selection */}
              {paymentType === 'workbook' && (
                <div>
                  <Label htmlFor="workbook_id">Workbook ID</Label>
                  <Input
                    id="workbook_id"
                    type="number"
                    value={workbookId || ''}
                    onChange={(e) => setWorkbookId(e.target.value ? parseInt(e.target.value, 10) : undefined)}
                    placeholder="Enter workbook ID"
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    The workbook price will be retrieved automatically
                  </p>
                </div>
              )}

              {/* Custom Amount for non-workbook payments */}
              {paymentType !== 'workbook' && (
                <>
                  <div>
                    <Label htmlFor="amount">Amount (£)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="0.00"
                      className="mt-2"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      type="text"
                      value={customDescription}
                      onChange={(e) => setCustomDescription(e.target.value)}
                      placeholder="Payment description"
                      className="mt-2"
                    />
                  </div>
                </>
              )}

              {/* Currency Selection */}
              <div>
                <Label htmlFor="currency">Currency</Label>
                <select
                  id="currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring mt-2"
                >
                  <option value="gbp">GBP (£)</option>
                  <option value="usd">USD ($)</option>
                  <option value="eur">EUR (€)</option>
                </select>
              </div>

              {error && (
                <Card className="border-destructive bg-destructive/10">
                  <CardContent className="p-4">
                    <p className="text-sm text-destructive">{error}</p>
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-4 pt-4">
                <Button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Proceed to Payment
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>

              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground text-center">
                  Payments are processed securely by Stripe. Your payment information is encrypted and secure.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
};

export default CheckoutPage;
