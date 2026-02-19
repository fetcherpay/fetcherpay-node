import { AxiosInstance } from 'axios';
import {
  LedgerAccount,
  LedgerEntry,
  ListResponse,
  PaginationParams,
} from '../types';

/**
 * Ledger API client
 */
export class LedgerClient {
  constructor(private http: AxiosInstance) {}

  /**
   * List all ledger accounts
   */
  async listAccounts(params?: PaginationParams & { type?: string }): Promise<ListResponse<LedgerAccount>> {
    const response = await this.http.get('/ledger/accounts', { params });
    return response.data;
  }

  /**
   * Retrieve a ledger account by ID
   */
  async retrieveAccount(accountId: string): Promise<LedgerAccount> {
    const response = await this.http.get(`/ledger/accounts/${accountId}`);
    return response.data;
  }

  /**
   * List all ledger entries
   */
  async listEntries(params?: PaginationParams & {
    account_id?: string;
    payment_id?: string;
    entry_type?: string;
  }): Promise<ListResponse<LedgerEntry>> {
    const response = await this.http.get('/ledger/entries', { params });
    return response.data;
  }

  /**
   * Retrieve a ledger entry by ID
   */
  async retrieveEntry(entryId: string): Promise<LedgerEntry> {
    const response = await this.http.get(`/ledger/entries/${entryId}`);
    return response.data;
  }
}
