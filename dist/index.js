'use strict';

var axios = require('axios');

/**
 * FetcherPay SDK Types
 */
class FetcherPayError extends Error {
    constructor(message, type, statusCode, param, code) {
        super(message);
        this.type = type;
        this.statusCode = statusCode;
        this.param = param;
        this.code = code;
        this.name = 'FetcherPayError';
    }
}
class AuthenticationError extends FetcherPayError {
    constructor(message) {
        super(message, 'authentication_error', 401);
    }
}
class ValidationError extends FetcherPayError {
    constructor(message, param) {
        super(message, 'validation_error', 422, param);
    }
}
class NotFoundError extends FetcherPayError {
    constructor(message) {
        super(message, 'not_found', 404);
    }
}

/**
 * Payments API client
 */
class PaymentsClient {
    constructor(http) {
        this.http = http;
    }
    /**
     * Create a new payment
     */
    async create(params, idempotencyKey) {
        const headers = {};
        if (idempotencyKey) {
            headers['Idempotency-Key'] = idempotencyKey;
        }
        const response = await this.http.post('/payments', params, { headers });
        return response.data;
    }
    /**
     * Retrieve a payment by ID
     */
    async retrieve(paymentId) {
        const response = await this.http.get(`/payments/${paymentId}`);
        return response.data;
    }
    /**
     * List all payments
     */
    async list(params) {
        const response = await this.http.get('/payments', { params });
        return response.data;
    }
    /**
     * Cancel a pending payment
     */
    async cancel(paymentId, reason, idempotencyKey) {
        const headers = {};
        if (idempotencyKey) {
            headers['Idempotency-Key'] = idempotencyKey;
        }
        const response = await this.http.post(`/payments/${paymentId}/cancel`, reason ? { reason } : {}, { headers });
        return response.data;
    }
    /**
     * Refund a settled payment
     */
    async refund(paymentId, params, idempotencyKey) {
        const headers = {};
        if (idempotencyKey) {
            headers['Idempotency-Key'] = idempotencyKey;
        }
        const response = await this.http.post(`/payments/${paymentId}/refund`, params || {}, { headers });
        return response.data;
    }
}

/**
 * Ledger API client
 */
class LedgerClient {
    constructor(http) {
        this.http = http;
    }
    /**
     * List all ledger accounts
     */
    async listAccounts(params) {
        const response = await this.http.get('/ledger/accounts', { params });
        return response.data;
    }
    /**
     * Retrieve a ledger account by ID
     */
    async retrieveAccount(accountId) {
        const response = await this.http.get(`/ledger/accounts/${accountId}`);
        return response.data;
    }
    /**
     * List all ledger entries
     */
    async listEntries(params) {
        const response = await this.http.get('/ledger/entries', { params });
        return response.data;
    }
    /**
     * Retrieve a ledger entry by ID
     */
    async retrieveEntry(entryId) {
        const response = await this.http.get(`/ledger/entries/${entryId}`);
        return response.data;
    }
}

/**
 * Payment Methods API client
 */
class PaymentMethodsClient {
    constructor(http) {
        this.http = http;
    }
    /**
     * Create a new payment method
     */
    async create(params, idempotencyKey) {
        const headers = {};
        if (idempotencyKey) {
            headers['Idempotency-Key'] = idempotencyKey;
        }
        const response = await this.http.post('/payment-methods', params, { headers });
        return response.data;
    }
    /**
     * Retrieve a payment method by ID
     */
    async retrieve(paymentMethodId) {
        const response = await this.http.get(`/payment-methods/${paymentMethodId}`);
        return response.data;
    }
    /**
     * List all payment methods
     */
    async list(params) {
        const response = await this.http.get('/payment-methods', { params });
        return response.data;
    }
    /**
     * Delete a payment method
     */
    async delete(paymentMethodId) {
        await this.http.delete(`/payment-methods/${paymentMethodId}`);
    }
}

/**
 * Webhooks API client
 */
class WebhooksClient {
    constructor(http) {
        this.http = http;
    }
    /**
     * Create a new webhook endpoint
     */
    async create(params, idempotencyKey) {
        const headers = {};
        if (idempotencyKey) {
            headers['Idempotency-Key'] = idempotencyKey;
        }
        const response = await this.http.post('/webhooks', params, { headers });
        return response.data;
    }
    /**
     * Retrieve a webhook endpoint by ID
     */
    async retrieve(webhookId) {
        const response = await this.http.get(`/webhooks/${webhookId}`);
        return response.data;
    }
    /**
     * List all webhook endpoints
     */
    async list(params) {
        const response = await this.http.get('/webhooks', { params });
        return response.data;
    }
    /**
     * Update a webhook endpoint
     */
    async update(webhookId, params) {
        const response = await this.http.put(`/webhooks/${webhookId}`, params);
        return response.data;
    }
    /**
     * Delete a webhook endpoint
     */
    async delete(webhookId) {
        await this.http.delete(`/webhooks/${webhookId}`);
    }
}

/**
 * Main FetcherPay client
 */
class FetcherPay {
    constructor(config) {
        const baseUrl = config.baseUrl || (config.environment === 'production'
            ? 'https://api.fetcherpay.com/v1'
            : 'https://sandbox.fetcherpay.com/v1');
        this.http = axios.create({
            baseURL: baseUrl,
            timeout: config.timeout || 30000,
            headers: {
                'Authorization': `Bearer ${config.apiKey}`,
                'Content-Type': 'application/json',
            },
        });
        // Response interceptor for error handling
        this.http.interceptors.response.use((response) => response, (error) => {
            if (error.response) {
                const { status, data } = error.response;
                const errorData = data?.error || {};
                switch (status) {
                    case 401:
                        throw new AuthenticationError(errorData.message || 'Authentication failed');
                    case 404:
                        throw new NotFoundError(errorData.message || 'Resource not found');
                    case 422:
                        throw new ValidationError(errorData.message || 'Validation failed', errorData.param);
                    default:
                        throw new FetcherPayError(errorData.message || 'An error occurred', errorData.type || 'api_error', status, errorData.param, errorData.code);
                }
            }
            throw error;
        });
        // Initialize API clients
        this.payments = new PaymentsClient(this.http);
        this.ledger = new LedgerClient(this.http);
        this.paymentMethods = new PaymentMethodsClient(this.http);
        this.webhooks = new WebhooksClient(this.http);
    }
    /**
     * Verify webhook signature
     */
    verifyWebhookSignature(payload, signature, secret) {
        const crypto = require('crypto');
        const expected = crypto
            .createHmac('sha256', secret)
            .update(payload)
            .digest('hex');
        try {
            return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
        }
        catch {
            return false;
        }
    }
}

exports.AuthenticationError = AuthenticationError;
exports.FetcherPay = FetcherPay;
exports.FetcherPayError = FetcherPayError;
exports.LedgerClient = LedgerClient;
exports.NotFoundError = NotFoundError;
exports.PaymentMethodsClient = PaymentMethodsClient;
exports.PaymentsClient = PaymentsClient;
exports.ValidationError = ValidationError;
exports.WebhooksClient = WebhooksClient;
//# sourceMappingURL=index.js.map
