import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  FetcherPayConfig,
  FetcherPayError,
  AuthenticationError,
  ValidationError,
  NotFoundError,
} from './types';
import { PaymentsClient } from './api/payments';
import { LedgerClient } from './api/ledger';
import { PaymentMethodsClient } from './api/payment-methods';
import { WebhooksClient } from './api/webhooks';

/**
 * Main FetcherPay client
 */
export class FetcherPay {
  private http: AxiosInstance;
  public payments: PaymentsClient;
  public ledger: LedgerClient;
  public paymentMethods: PaymentMethodsClient;
  public webhooks: WebhooksClient;

  constructor(config: FetcherPayConfig) {
    const baseUrl = config.baseUrl || (
      config.environment === 'production'
        ? 'https://api.fetcherpay.com/v1'
        : 'https://sandbox.fetcherpay.com/v1'
    );

    this.http = axios.create({
      baseURL: baseUrl,
      timeout: config.timeout || 30000,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    // Response interceptor for error handling
    this.http.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response) {
          const { status, data } = error.response;
          const errorData = (data as any)?.error || {};

          switch (status) {
            case 401:
              throw new AuthenticationError(errorData.message || 'Authentication failed');
            case 404:
              throw new NotFoundError(errorData.message || 'Resource not found');
            case 422:
              throw new ValidationError(errorData.message || 'Validation failed', errorData.param);
            default:
              throw new FetcherPayError(
                errorData.message || 'An error occurred',
                errorData.type || 'api_error',
                status,
                errorData.param,
                errorData.code
              );
          }
        }
        throw error;
      }
    );

    // Initialize API clients
    this.payments = new PaymentsClient(this.http);
    this.ledger = new LedgerClient(this.http);
    this.paymentMethods = new PaymentMethodsClient(this.http);
    this.webhooks = new WebhooksClient(this.http);
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
    const crypto = require('crypto');
    const expected = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    try {
      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expected)
      );
    } catch {
      return false;
    }
  }
}

export default FetcherPay;
