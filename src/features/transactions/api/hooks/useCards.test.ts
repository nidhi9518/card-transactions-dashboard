import { describe, it, expect, vi, type Mock } from "vitest";
import { renderHook } from "@testing-library/react";
import useSWR from "swr";
import { useCards } from "./useCards";
import * as useTransactionClientHooks from "./useTransactionsClient";

vi.mock("swr");
vi.mock("./useTransactionClient");

const getCardsMock = vi.fn();
const useTransactionsmock = { getCards: getCardsMock } as any;
const swrResponse = { data: [{ id: 1 }] };

describe("useCards", () => {
  beforeEach(() => {
    vi.spyOn(useTransactionClientHooks, "useTransactionClient").mockReturnValue(
      useTransactionsmock,
    );
    (useSWR as Mock).mockReturnValue(swrResponse);
  });
  
  it("calls useSWR with correct key and fetcher", () => {
    renderHook(() => useCards());
    const [, fetcher] = (useSWR as any).mock.calls[0];
    fetcher();
    expect(getCardsMock).toHaveBeenCalled();
  });

  it("returns SWR response", () => {
    const { result } = renderHook(() => useCards());
    expect(result.current).toBe(swrResponse);
  });
});
