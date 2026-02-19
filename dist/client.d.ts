import { FetcherPayConfig } from './types';
import { PaymentsClient } from './api/payments';
import { LedgerClient } from './api/ledger';
import { PaymentMethodsClient } from './api/payment-methods';
import { WebhooksClient } from './api/webhooks';
/**
 * Main FetcherPay client
 */
export declare class FetcherPay {
    private http;
    payments: PaymentsClient;
    ledger: LedgerClient;
    paymentMethods: PaymentMethodsClient;
    webhooks: WebhooksClient;
    constructor(config: FetcherPayConfig);
    /**
     * Verify webhook signature
     */
    verifyWebhookSignature(payload: string, signature: string, secret: string): boolean;
}
export default FetcherPay;
