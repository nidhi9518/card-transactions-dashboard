import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useFilteredTransactions } from "./useFilteredTransactions";
import type { Transactions } from "../models/transaction";

vi.mock("../../../common/custom-hooks/useDebounce", () => ({
  useDebounce: (value: unknown) => value,
}));

const mockTransactions: Transactions = {
  "card-1": [
    { id: "t1", amount: 100, description: "Groceries" },
    { id: "t2", amount: 200, description: "Electronics" },
    { id: "t3", amount: 50, description: "Coffee" },
  ],
  "card-2": [
    { id: "t4", amount: 300, description: "Travel" },
    { id: "t5", amount: 75, description: "Books" },
  ],
};

describe("useFilteredTransactions", () => {
  describe("No data scenarios", () => {
    it("should return empty array when transactions is undefined", () => {
      const { result } = renderHook(() =>
        useFilteredTransactions(undefined, "card-1", undefined)
      );
      expect(result.current).toEqual([]);
    });

    it("should return empty array when selectedCardId is undefined", () => {
      const { result } = renderHook(() =>
        useFilteredTransactions(mockTransactions, undefined, undefined)
      );
      expect(result.current).toEqual([]);
    });

    it("should return empty array when both are undefined", () => {
      const { result } = renderHook(() =>
        useFilteredTransactions(undefined, undefined, undefined)
      );
      expect(result.current).toEqual([]);
    });

    it("should return empty array when selectedCardId has no transactions", () => {
      const { result } = renderHook(() =>
        useFilteredTransactions(mockTransactions, "card-999", undefined)
      );
      expect(result.current).toEqual([]);
    });
  });

  describe("No amount filter", () => {
    it("should return all transactions for selected card", () => {
      const { result } = renderHook(() =>
        useFilteredTransactions(mockTransactions, "card-1", undefined)
      );
      expect(result.current).toEqual(mockTransactions["card-1"]);
      expect(result.current).toHaveLength(3);
    });

    it("should return correct transactions for different card", () => {
      const { result } = renderHook(() =>
        useFilteredTransactions(mockTransactions, "card-2", undefined)
      );
      expect(result.current).toEqual(mockTransactions["card-2"]);
      expect(result.current).toHaveLength(2);
    });
  });

  describe("Amount filter", () => {
    it("should filter transactions by minimum amount", () => {
      const { result } = renderHook(() =>
        useFilteredTransactions(mockTransactions, "card-1", 100)
      );
      expect(result.current).toHaveLength(2);
      expect(result.current).toEqual([
        { id: "t1", amount: 100, description: "Groceries" },
        { id: "t2", amount: 200, description: "Electronics" },
      ]);
    });

    it("should include transactions equal to filter amount", () => {
      const { result } = renderHook(() =>
        useFilteredTransactions(mockTransactions, "card-1", 100)
      );
      const amounts = result.current.map((t) => t.amount);
      expect(amounts).toContain(100);
    });

    it("should return empty array when filter exceeds all amounts", () => {
      const { result } = renderHook(() =>
        useFilteredTransactions(mockTransactions, "card-1", 1000)
      );
      expect(result.current).toEqual([]);
    });

    it("should return all transactions when filter is 0", () => {
      const { result } = renderHook(() =>
        useFilteredTransactions(mockTransactions, "card-1", 0)
      );
      expect(result.current).toHaveLength(3);
    });
  });

  describe("Card switching", () => {
    it("should return transactions for new card after switch", () => {
      const { result, rerender } = renderHook(
        ({ cardId }: { cardId: string }) =>
          useFilteredTransactions(mockTransactions, cardId, undefined),
        { initialProps: { cardId: "card-1" } }
      );

      expect(result.current).toHaveLength(3);

      rerender({ cardId: "card-2" });

      expect(result.current).toHaveLength(2);
    });
  });
});
