import useSWR from "swr";
import { Keys } from "../../../../api/keys";
import { useTransactionClient } from "./useTransactionsClient";

export function useCards() {
  const transactionClient = useTransactionClient();
  return useSWR([Keys.cards], () => transactionClient.getCards());
}
