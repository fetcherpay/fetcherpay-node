import { AxiosInstance } from 'axios';
import { Payment, CreatePaymentRequest, ListResponse, PaginationParams, FilterParams } from '../types';
/**
 * Payments API client
 */
export declare class PaymentsClient {
    private http;
    constructor(http: AxiosInstance);
    /**
     * Create a new payment
     */
    create(params: CreatePaymentRequest, idempotencyKey?: string): Promise<Payment>;
    /**
     * Retrieve a payment by ID
     */
    retrieve(paymentId: string): Promise<Payment>;
    /**
     * List all payments
     */
    list(params?: PaginationParams & FilterParams & {
        status?: string;
        rail?: string;
    }): Promise<ListResponse<Payment>>;
    /**
     * Cancel a pending payment
     */
    cancel(paymentId: string, reason?: string, idempotencyKey?: string): Promise<Payment>;
    /**
     * Refund a settled payment
     */
    refund(paymentId: string, params?: {
        amount?: number;
        reason?: string;
    }, idempotencyKey?: string): Promise<Payment>;
}
