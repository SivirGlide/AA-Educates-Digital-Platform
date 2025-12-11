/**
 * Payments API: Stripe checkout and payment verification
 */

import { fetchApi, ApiResponse } from './api';

export interface CheckoutSessionRequest {
  payment_type: 'workbook' | 'corporate_payment' | 'subscription' | 'other';
  workbook_id?: number;
  amount?: number;
  currency?: string;
  description?: string;
  details?: string;
  success_url?: string;
  cancel_url?: string;
}

export interface CheckoutSessionResponse {
  session_id: string;
  url: string;
  transaction_id: number;
}

export interface VerifyPaymentRequest {
  session_id: string;
}

export interface VerifyPaymentResponse {
  status: string;
  transaction_id: number;
  message: string;
}

/**
 * Create a Stripe checkout session
 */
export function createCheckoutSession(data: CheckoutSessionRequest): Promise<ApiResponse<CheckoutSessionResponse>> {
  return fetchApi<CheckoutSessionResponse>('/payments/create-checkout-session/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Verify a payment after Stripe checkout completion
 */
export function verifyPayment(data: VerifyPaymentRequest): Promise<ApiResponse<VerifyPaymentResponse>> {
  return fetchApi<VerifyPaymentResponse>('/payments/verify-payment/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export interface PaymentTransaction {
  id: number;
  user: number;
  amount: string;
  currency: string;
  provider: string;
  transaction_id: string;
  status: string;
  created_at: string;
}

/**
 * Get all payment transactions
 */
export function getPaymentTransactions(): Promise<ApiResponse<PaymentTransaction[]>> {
  return fetchApi<PaymentTransaction[]>('/payments/payment-transactions/', {
    method: 'GET',
  });
}
