import { AxiosInstance } from 'axios';
import { PaymentMethod, CreatePaymentMethodRequest, ListResponse, PaginationParams } from '../types';
/**
 * Payment Methods API client
 */
export declare class PaymentMethodsClient {
    private http;
    constructor(http: AxiosInstance);
    /**
     * Create a new payment method
     */
    create(params: CreatePaymentMethodRequest, idempotencyKey?: string): Promise<PaymentMethod>;
    /**
     * Retrieve a payment method by ID
     */
    retrieve(paymentMethodId: string): Promise<PaymentMethod>;
    /**
     * List all payment methods
     */
    list(params?: PaginationParams & {
        type?: string;
    }): Promise<ListResponse<PaymentMethod>>;
    /**
     * Delete a payment method
     */
    delete(paymentMethodId: string): Promise<void>;
}
