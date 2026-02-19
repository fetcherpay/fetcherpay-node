/**
 * FetcherPay Node.js SDK - Webhook Verification Example
 */

import { FetcherPay } from '../src';

const client = new FetcherPay({
  apiKey: 'sandbox',
  environment: 'sandbox',
});

// Example webhook payload
const payload = JSON.stringify({
  id: 'evt_123',
  type: 'payment.settled',
  created_at: '2026-02-18T20:00:00Z',
  data: {
    id: 'pay_456',
    status: 'settled',
    amount: 10000,
  },
});

// Your webhook secret from the dashboard
const webhookSecret = 'whsec_your_secret_here';

// Simulate receiving a webhook
const signature = 'sha256=...'; // From X-FetcherPay-Signature header

// Verify the signature
const isValid = client.verifyWebhookSignature(payload, signature, webhookSecret);

if (isValid) {
  console.log('✅ Webhook signature verified');
  // Process the webhook event
  const event = JSON.parse(payload);
  console.log('Event type:', event.type);
} else {
  console.log('❌ Invalid webhook signature');
}
