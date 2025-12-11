import Head from 'next/head';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useMemo, useState, useEffect } from 'react';
import { DashboardLayout } from '@/src/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { api } from '../../lib/api';
import { Loader2 } from 'lucide-react';
import type { PaymentTransaction } from '../../lib/payments.api';

const transactions = [
  { id: 'INV-4021', account: 'Corporate partner', amount: 1250, status: 'Paid', date: '2025-10-18T10:32:00Z' },
  { id: 'INV-4019', account: 'School subscription', amount: 880, status: 'Pending', date: '2025-10-16T14:05:00Z' },
  { id: 'INV-4017', account: 'Parent membership', amount: 45, status: 'Failed', date: '2025-10-15T08:11:00Z' },
];

const AdminPaymentsPage: NextPage = () => {
  const [status, setStatus] = useState('ALL');
  const [paymentTransactions, setPaymentTransactions] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((txn) => (status === 'ALL' ? true : txn.status === status));
  }, [status]);

  const total = useMemo(() => {
    return filteredTransactions.reduce((sum, txn) => (txn.status === 'Paid' ? sum + txn.amount : sum), 0);
  }, [filteredTransactions]);

  useEffect(() => {
    const fetchPaymentTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.getPaymentTransactions();
        if (response.error) {
          setError(response.error);
        } else if (response.data) {
          setPaymentTransactions(response.data);
        }
      } catch (err) {
        setError('Failed to fetch payment transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentTransactions();
  }, []);

  const formatStatus = (status: string) => {
    switch (status) {
      case 'SUCCEEDED':
        return 'Paid';
      case 'PENDING':
        return 'Pending';
      case 'FAILED':
        return 'Failed';
      default:
        return status;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'SUCCEEDED':
        return 'default';
      case 'PENDING':
        return 'secondary';
      case 'FAILED':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const paymentTransactionsTotal = useMemo(() => {
    return paymentTransactions
      .filter(txn => txn.status === 'SUCCEEDED')
      .reduce((sum, txn) => sum + parseFloat(txn.amount), 0);
  }, [paymentTransactions]);

  return (
    <>
      <Head>
        <title>Admin Payments | AA Educates</title>
      </Head>
      <DashboardLayout backgroundClassName="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="space-y-10">
          <header className="space-y-3">
            <h1 className="text-3xl font-extrabold">Payments</h1>
            <p className="text-muted-foreground max-w-3xl">Track invoices, subscriptions, and membership payments across AA Educates.</p>
          </header>

          {/* Payment Transactions Section */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Transactions</CardTitle>
              <CardDescription>
                Real-time payment transactions from Stripe and other payment providers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : error ? (
                <div className="text-sm text-destructive py-4">{error}</div>
              ) : paymentTransactions.length === 0 ? (
                <div className="text-sm text-muted-foreground py-4 text-center">No payment transactions found.</div>
              ) : (
                <>
                  <div className="text-sm text-muted-foreground mb-4">
                    Total successful payments: <span className="font-semibold">£{paymentTransactionsTotal.toFixed(2)}</span>
                  </div>
                  <div className="space-y-2 divide-y divide-border">
                    {paymentTransactions.map((txn) => (
                      <div key={txn.id} className="py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold">Transaction #{txn.transaction_id.slice(0, 20)}...</h3>
                            <Badge variant="outline" className="text-xs">
                              {txn.provider}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            User ID: {txn.user} • {new Date(txn.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                          <span className="text-lg font-semibold">
                            {txn.currency} {parseFloat(txn.amount).toFixed(2)}
                          </span>
                          <Badge variant={getStatusVariant(txn.status) as any}>
                            {formatStatus(txn.status)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex gap-3">
                  <Button variant={status === 'ALL' ? 'default' : 'outline'} onClick={() => setStatus('ALL')}>
                    All
                  </Button>
                  <Button variant={status === 'Paid' ? 'default' : 'outline'} onClick={() => setStatus('Paid')}>
                    Paid
                  </Button>
                  <Button variant={status === 'Pending' ? 'default' : 'outline'} onClick={() => setStatus('Pending')}>
                    Pending
                  </Button>
                  <Button variant={status === 'Failed' ? 'default' : 'outline'} onClick={() => setStatus('Failed')}>
                    Failed
                  </Button>
                </div>
                <div className="ml-auto text-sm text-muted-foreground">
                  Paid total (visible): <span className="font-semibold">{total.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0 divide-y divide-border">
              {filteredTransactions.map((txn) => (
                <div key={txn.id} className="px-6 py-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">{txn.account}</h2>
                    <p className="text-sm text-muted-foreground">Invoice {txn.id}</p>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                    <span className="text-sm font-semibold">£{txn.amount.toLocaleString()}</span>
                    <Badge variant={
                      txn.status === 'Paid' ? 'default' :
                      txn.status === 'Pending' ? 'secondary' :
                      'destructive'
                    }>
                      {txn.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{new Date(txn.date).toLocaleString()}</span>
                    <Button variant="outline" size="sm">View receipt</Button>
                  </div>
                </div>
              ))}
              {filteredTransactions.length === 0 && (
                <div className="px-6 py-10 text-center text-muted-foreground text-sm">No transactions in this view yet.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
};

export default AdminPaymentsPage;
