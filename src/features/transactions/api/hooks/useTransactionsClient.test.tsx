import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useTransactionClient } from "./useTransactionsClient";
import { TransactionsClientProvider } from "../TransactionClientProvider";
import { TransactionsClient } from "../TransactionsClient";

const mockClient = {} as TransactionsClient;

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <TransactionsClientProvider transactionsClient={mockClient}>
    {children}
  </TransactionsClientProvider>
);

describe("useTransactionClient", () => {
  it("returns the transactionsClient from context", () => {
    const { result } = renderHook(() => useTransactionClient(), { wrapper });
    expect(result.current).toBe(mockClient);
  });

  it("throws when used outside TransactionsClientProvider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useTransactionClient())).toThrow(
      "useTransactionsContext must be used within a TransactionsClientProvider"
    );
    consoleSpy.mockRestore();
  });
});
