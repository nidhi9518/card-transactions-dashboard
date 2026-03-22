import { useMemo } from "react";
import { useDebounce } from "../../../common/custom-hooks/useDebounce";
import type { Transactions } from "../models/transaction";

export function useFilteredTransactions(
  transactions: Transactions | undefined,
  selectedCardId: string | undefined,
  amountFilter: number | undefined,
) {
  const debounced = useDebounce(amountFilter, 300);
  const filterValue = amountFilter == null ? undefined : debounced;

  return useMemo(() => {
    if (!transactions || !selectedCardId) return [];
    const list = transactions[selectedCardId] ?? [];
    if (filterValue == null) return list;
    return list.filter((item) => item.amount >= filterValue);
  }, [transactions, selectedCardId, filterValue]);
}
