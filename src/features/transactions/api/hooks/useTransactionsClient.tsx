import { useTransactionsContext } from "../TransactionClientProvider";

export function useTransactionClient() {
    const { transactionsClient } = useTransactionsContext();
    return transactionsClient;
}