import { AxiosInstance } from 'axios';
import {
  Payment,
  CreatePaymentRequest,
  ListResponse,
  PaginationParams,
  FilterParams,
} from '../types';

/**
 * Payments API client
 */
export class PaymentsClient {
  constructor(private http: AxiosInstance) {}

  /**
   * Create a new payment
   */
  async create(params: CreatePaymentRequest, idempotencyKey?: string): Promise<Payment> {
    const headers: Record<string, string> = {};
    if (idempotencyKey) {
      headers['Idempotency-Key'] = idempotencyKey;
    }

    const response = await this.http.post('/payments', params, { headers });
    return response.data;
  }

  /**
   * Retrieve a payment by ID
   */
  async retrieve(paymentId: string): Promise<Payment> {
    const response = await this.http.get(`/payments/${paymentId}`);
    return response.data;
  }

  /**
   * List all payments
   */
  async list(params?: PaginationParams & FilterParams & { status?: string; rail?: string }): Promise<ListResponse<Payment>> {
    const response = await this.http.get('/payments', { params });
    return response.data;
  }

  /**
   * Cancel a pending payment
   */
  async cancel(paymentId: string, reason?: string, idempotencyKey?: string): Promise<Payment> {
    const headers: Record<string, string> = {};
    if (idempotencyKey) {
      headers['Idempotency-Key'] = idempotencyKey;
    }

    const response = await this.http.post(
      `/payments/${paymentId}/cancel`,
      reason ? { reason } : {},
      { headers }
    );
    return response.data;
  }

  /**
   * Refund a settled payment
   */
  async refund(
    paymentId: string,
    params?: { amount?: number; reason?: string },
    idempotencyKey?: string
  ): Promise<Payment> {
    const headers: Record<string, string> = {};
    if (idempotencyKey) {
      headers['Idempotency-Key'] = idempotencyKey;
    }

    const response = await this.http.post(
      `/payments/${paymentId}/refund`,
      params || {},
      { headers }
    );
    return response.data;
  }
}
