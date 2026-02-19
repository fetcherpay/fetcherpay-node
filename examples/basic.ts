/**
 * FetcherPay Node.js SDK - Basic Example
 */

import { FetcherPay } from '../src';

// Initialize client
const client = new FetcherPay({
  apiKey: process.env.FETCHERPAY_API_KEY || 'sandbox',
  environment: 'sandbox',
});

async function main() {
  try {
    // Create a payment
    console.log('Creating payment...');
    const payment = await client.payments.create({
      amount: 10000, // $100.00 in cents
      currency: 'USD',
      source: {
        payment_method_id: 'pm_bank_123',
      },
      destination: {
        payment_method_id: 'pm_merchant_456',
      },
      rail: 'auto', // Let FetcherPay choose optimal rail
    });
    console.log('Payment created:', payment.id, 'Status:', payment.status);

    // Retrieve the payment
    console.log('\nRetrieving payment...');
    const retrieved = await client.payments.retrieve(payment.id);
    console.log('Retrieved:', retrieved.id, 'Timeline:', retrieved.timeline.length, 'events');

    // List payments
    console.log('\nListing payments...');
    const payments = await client.payments.list({ limit: 5 });
    console.log(`Found ${payments.data.length} payments`);

    // List ledger accounts
    console.log('\nListing ledger accounts...');
    const accounts = await client.ledger.listAccounts();
    console.log(`Found ${accounts.data.length} accounts`);
    accounts.data.forEach(acc => {
      console.log(`  - ${acc.name}: $${acc.balance.available / 100} available`);
    });

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
