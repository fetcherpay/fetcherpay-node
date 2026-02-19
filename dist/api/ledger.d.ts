import { AxiosInstance } from 'axios';
import { LedgerAccount, LedgerEntry, ListResponse, PaginationParams } from '../types';
/**
 * Ledger API client
 */
export declare class LedgerClient {
    private http;
    constructor(http: AxiosInstance);
    /**
     * List all ledger accounts
     */
    listAccounts(params?: PaginationParams & {
        type?: string;
    }): Promise<ListResponse<LedgerAccount>>;
    /**
     * Retrieve a ledger account by ID
     */
    retrieveAccount(accountId: string): Promise<LedgerAccount>;
    /**
     * List all ledger entries
     */
    listEntries(params?: PaginationParams & {
        account_id?: string;
        payment_id?: string;
        entry_type?: string;
    }): Promise<ListResponse<LedgerEntry>>;
    /**
     * Retrieve a ledger entry by ID
     */
    retrieveEntry(entryId: string): Promise<LedgerEntry>;
}
