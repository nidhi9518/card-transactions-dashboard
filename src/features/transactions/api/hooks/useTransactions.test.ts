import { describe, it, expect, vi, type Mock } from "vitest";
import { renderHook } from "@testing-library/react";
import useSWR from "swr";
import * as useTransactionClientHooks from "./useTransactionsClient";
import { useTransactions } from "./useTransactions";

vi.mock("swr");
vi.mock("./useTransactionClient");
const getTransactionsMock = vi.fn();
const useTransactionsmock = { getTransactions: getTransactionsMock } as any;
const swrResponse = {};

describe("useTransactions", () => {
  beforeEach(() => {
    vi.spyOn(useTransactionClientHooks, "useTransactionClient").mockReturnValue(
      useTransactionsmock,
    );
    (useSWR as Mock).mockReturnValue(swrResponse);
  });

  it("calls useSWR with correct key and fetcher", () => {
    renderHook(() => useTransactions());
    const [, fetcher] = (useSWR as any).mock.calls[0];
    fetcher();
    expect(getTransactionsMock).toHaveBeenCalled();
  });
  
  it("returns SWR response", () => {
    const { result } = renderHook(() => useTransactions());
    expect(result.current).toBe(swrResponse);
  });
});
