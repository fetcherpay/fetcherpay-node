# FetcherPay Node.js SDK

Official Node.js SDK for the FetcherPay API — One API. Every Rail.

## Installation

```bash
npm install @fetcherpay/node
```

## Quick Start

```typescript
import { FetcherPay } from '@fetcherpay/node';

const client = new FetcherPay({
  apiKey: 'fp_test_your_key',
  environment: 'sandbox', // or 'production'
});

// Create a payment
const payment = await client.payments.create({
  amount: 10000, // $100.00 in cents
  currency: 'USD',
  source: { payment_method_id: 'pm_123' },
  destination: { payment_method_id: 'pm_456' },
  rail: 'auto', // Auto-select optimal rail
});

console.log(payment.id, payment.status);
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiKey` | string | required | Your FetcherPay API key |
| `environment` | 'sandbox' \| 'production' | 'sandbox' | API environment |
| `baseUrl` | string | auto | Override base URL |
| `timeout` | number | 30000 | Request timeout (ms) |

## API Reference

### Payments

```typescript
// Create payment
const payment = await client.payments.create({
  amount: 10000,
  source: { payment_method_id: 'pm_123' },
  destination: { payment_method_id: 'pm_456' },
}, 'unique-idempotency-key');

// Retrieve payment
const payment = await client.payments.retrieve('pay_xxx');

// List payments
const payments = await client.payments.list({ limit: 10 });

// Cancel payment
await client.payments.cancel('pay_xxx', 'Customer request');

// Refund payment
await client.payments.refund('pay_xxx', { amount: 5000, reason: 'Partial refund' });
```

### Ledger

```typescript
// List accounts
const accounts = await client.ledger.listAccounts();

// Get account balance
const account = await client.ledger.retrieveAccount('la_xxx');
console.log(account.balance.available);

// List entries
const entries = await client.ledger.listEntries({ account_id: 'la_xxx' });
```

### Payment Methods

```typescript
// Create bank account
const pm = await client.paymentMethods.create({
  type: 'bank_account',
  bank_account: {
    account_number: '000123456789',
    routing_number: '011000015',
    account_type: 'checking',
  },
});

// List payment methods
const methods = await client.paymentMethods.list();
```

### Webhooks

```typescript
// Create webhook endpoint
const webhook = await client.webhooks.create({
  url: 'https://your-app.com/webhooks',
  events: ['payment.settled', 'payment.failed'],
});

// Verify webhook signature
const isValid = client.verifyWebhookSignature(
  payload,
  signature, // from X-FetcherPay-Signature header
  webhook.secret
);
```

## Error Handling

```typescript
import { FetcherPayError, AuthenticationError, ValidationError } from '@fetcherpay/node';

try {
  await client.payments.create({...});
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Invalid API key');
  } else if (error instanceof ValidationError) {
    console.error('Validation failed:', error.param);
  } else if (error instanceof FetcherPayError) {
    console.error('API error:', error.type, error.statusCode);
  }
}
```

## TypeScript

Full TypeScript support with exported types:

```typescript
import { Payment, CreatePaymentRequest, PaymentStatus } from '@fetcherpay/node';
```

## License

MIT
