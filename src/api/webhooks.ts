import { AxiosInstance } from 'axios';
import {
  WebhookEndpoint,
  CreateWebhookRequest,
  ListResponse,
  PaginationParams,
} from '../types';

/**
 * Webhooks API client
 */
export class WebhooksClient {
  constructor(private http: AxiosInstance) {}

  /**
   * Create a new webhook endpoint
   */
  async create(params: CreateWebhookRequest, idempotencyKey?: string): Promise<WebhookEndpoint> {
    const headers: Record<string, string> = {};
    if (idempotencyKey) {
      headers['Idempotency-Key'] = idempotencyKey;
    }

    const response = await this.http.post('/webhooks', params, { headers });
    return response.data;
  }

  /**
   * Retrieve a webhook endpoint by ID
   */
  async retrieve(webhookId: string): Promise<WebhookEndpoint> {
    const response = await this.http.get(`/webhooks/${webhookId}`);
    return response.data;
  }

  /**
   * List all webhook endpoints
   */
  async list(params?: PaginationParams): Promise<ListResponse<WebhookEndpoint>> {
    const response = await this.http.get('/webhooks', { params });
    return response.data;
  }

  /**
   * Update a webhook endpoint
   */
  async update(webhookId: string, params: Partial<CreateWebhookRequest>): Promise<WebhookEndpoint> {
    const response = await this.http.put(`/webhooks/${webhookId}`, params);
    return response.data;
  }

  /**
   * Delete a webhook endpoint
   */
  async delete(webhookId: string): Promise<void> {
    await this.http.delete(`/webhooks/${webhookId}`);
  }
}
