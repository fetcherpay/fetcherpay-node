/**
 * FetcherPay Node.js SDK
 * One API. Every Rail.
 * 
 * @example
 * ```typescript
 * import { FetcherPay } from '@fetcherpay/node';
 * 
 * const client = new FetcherPay({
 *   apiKey: 'fp_test_your_key',
 *   environment: 'sandbox'
 * });
 * 
 * const payment = await client.payments.create({
 *   amount: 10000,
 *   currency: 'USD',
 *   source: { payment_method_id: 'pm_123' },
 *   destination: { payment_method_id: 'pm_456' }
 * });
 * ```
 */

export { FetcherPay } from './client';
export { PaymentsClient } from './api/payments';
export { LedgerClient } from './api/ledger';
export { PaymentMethodsClient } from './api/payment-methods';
export { WebhooksClient } from './api/webhooks';
export * from './types';
