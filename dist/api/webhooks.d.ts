import { AxiosInstance } from 'axios';
import { WebhookEndpoint, CreateWebhookRequest, ListResponse, PaginationParams } from '../types';
/**
 * Webhooks API client
 */
export declare class WebhooksClient {
    private http;
    constructor(http: AxiosInstance);
    /**
     * Create a new webhook endpoint
     */
    create(params: CreateWebhookRequest, idempotencyKey?: string): Promise<WebhookEndpoint>;
    /**
     * Retrieve a webhook endpoint by ID
     */
    retrieve(webhookId: string): Promise<WebhookEndpoint>;
    /**
     * List all webhook endpoints
     */
    list(params?: PaginationParams): Promise<ListResponse<WebhookEndpoint>>;
    /**
     * Update a webhook endpoint
     */
    update(webhookId: string, params: Partial<CreateWebhookRequest>): Promise<WebhookEndpoint>;
    /**
     * Delete a webhook endpoint
     */
    delete(webhookId: string): Promise<void>;
}
