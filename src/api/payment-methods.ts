import { AxiosInstance } from 'axios';
import {
  PaymentMethod,
  CreatePaymentMethodRequest,
  ListResponse,
  PaginationParams,
} from '../types';

/**
 * Payment Methods API client
 */
export class PaymentMethodsClient {
  constructor(private http: AxiosInstance) {}

  /**
   * Create a new payment method
   */
  async create(params: CreatePaymentMethodRequest, idempotencyKey?: string): Promise<PaymentMethod> {
    const headers: Record<string, string> = {};
    if (idempotencyKey) {
      headers['Idempotency-Key'] = idempotencyKey;
    }

    const response = await this.http.post('/payment-methods', params, { headers });
    return response.data;
  }

  /**
   * Retrieve a payment method by ID
   */
  async retrieve(paymentMethodId: string): Promise<PaymentMethod> {
    const response = await this.http.get(`/payment-methods/${paymentMethodId}`);
    return response.data;
  }

  /**
   * List all payment methods
   */
  async list(params?: PaginationParams & { type?: string }): Promise<ListResponse<PaymentMethod>> {
    const response = await this.http.get('/payment-methods', { params });
    return response.data;
  }

  /**
   * Delete a payment method
   */
  async delete(paymentMethodId: string): Promise<void> {
    await this.http.delete(`/payment-methods/${paymentMethodId}`);
  }
}
