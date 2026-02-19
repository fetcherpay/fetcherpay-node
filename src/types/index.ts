/**
 * FetcherPay SDK Types
 */

export interface FetcherPayConfig {
  apiKey: string;
  environment?: 'sandbox' | 'production';
  baseUrl?: string;
  timeout?: number;
}

export interface Payment {
  id: string;
  object: 'payment';
  status: 'pending' | 'authorized' | 'processing' | 'settled' | 'failed' | 'cancelled' | 'refunded' | 'partially_refunded';
  amount: number;
  currency: string;
  rail: string;
  rail_selected: string;
  description?: string;
  source: PaymentSource;
  destination: PaymentDestination;
  fee?: Fee;
  timeline: TimelineEvent[];
  ledger_entry_ids: string[];
  refunds: Refund[];
  idempotency_key?: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface PaymentSource {
  payment_method_id: string;
  name?: string | null;
  type?: string;
}

export interface PaymentDestination {
  payment_method_id: string;
  name?: string | null;
  type?: string;
}

export interface Fee {
  amount: number;
  rate: string;
}

export interface TimelineEvent {
  status: string;
  timestamp: string;
  detail: string;
}

export interface Refund {
  id: string;
  payment_id: string;
  amount: number;
  reason?: string | null;
  status: string;
  created_at: string;
}

export interface CreatePaymentRequest {
  amount: number;
  currency?: string;
  rail?: 'auto' | 'ach' | 'rtp' | 'card' | 'crypto';
  rail_fallback_order?: string[];
  description?: string;
  source: PaymentSource;
  destination: PaymentDestination;
  metadata?: Record<string, any>;
}

export interface PaymentMethod {
  id: string;
  object: 'payment_method';
  type: 'bank_account' | 'card' | 'usdc_wallet';
  status: 'active' | 'inactive' | 'verification_required';
  bank_account?: BankAccount;
  card?: Card;
  usdc_wallet?: UsdcWallet;
  metadata: Record<string, any>;
  created_at: string;
}

export interface BankAccount {
  account_type: 'checking' | 'savings';
  bank_name?: string;
  routing_number_last4: string;
  account_number_last4: string;
}

export interface Card {
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
}

export interface UsdcWallet {
  address: string;
  network: 'ethereum' | 'polygon';
}

export interface CreatePaymentMethodRequest {
  type: 'bank_account' | 'card' | 'usdc_wallet';
  bank_account?: {
    account_number: string;
    routing_number: string;
    account_type: 'checking' | 'savings';
  };
  card?: {
    number: string;
    exp_month: number;
    exp_year: number;
    cvc: string;
  };
  usdc_wallet?: {
    address: string;
    network: string;
  };
  metadata?: Record<string, any>;
}

export interface LedgerAccount {
  id: string;
  object: 'ledger_account';
  name: string;
  type: 'asset' | 'liability' | 'revenue' | 'expense' | 'equity';
  currency: string;
  balance: {
    pending: number;
    posted: number;
    available: number;
  };
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface LedgerEntry {
  id: string;
  object: 'ledger_entry';
  journal_id: string;
  account_id: string;
  payment_id?: string;
  entry_type: 'debit' | 'credit';
  amount: number;
  currency: string;
  status: 'pending' | 'posted';
  description?: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface WebhookEndpoint {
  id: string;
  object: 'webhook_endpoint';
  url: string;
  events: string[];
  status: 'active' | 'disabled';
  secret: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface CreateWebhookRequest {
  url: string;
  events?: string[];
  metadata?: Record<string, any>;
}

export interface WebhookEvent {
  id: string;
  object: 'event';
  type: string;
  created_at: string;
  data: any;
}

export interface ListResponse<T> {
  data: T[];
  has_more: boolean;
  next_cursor: string | null;
}

export interface PaginationParams {
  cursor?: string;
  limit?: number;
}

export interface FilterParams {
  created_after?: string;
  created_before?: string;
}

export class FetcherPayError extends Error {
  constructor(
    message: string,
    public type: string,
    public statusCode?: number,
    public param?: string | null,
    public code?: string | null
  ) {
    super(message);
    this.name = 'FetcherPayError';
  }
}

export class AuthenticationError extends FetcherPayError {
  constructor(message: string) {
    super(message, 'authentication_error', 401);
  }
}

export class ValidationError extends FetcherPayError {
  constructor(message: string, param?: string) {
    super(message, 'validation_error', 422, param);
  }
}

export class NotFoundError extends FetcherPayError {
  constructor(message: string) {
    super(message, 'not_found', 404);
  }
}
