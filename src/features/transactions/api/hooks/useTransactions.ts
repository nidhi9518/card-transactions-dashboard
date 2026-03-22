import useSWR from "swr";
import { Keys } from "../../../../api/keys";
import { useTransactionClient } from "./useTransactionsClient";

export function useTransactions() {
  const transactionClient = useTransactionClient();
  return useSWR([Keys.transactions], () => transactionClient.getTransactions());
}