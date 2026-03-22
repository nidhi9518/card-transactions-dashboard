import { describe, it, expect, vi, type Mock } from "vitest";
import { TransactionsClient } from "./TransactionsClient";
import type { Http } from "../../../api/Http";
import type { Card } from "../models/card";
import type { Transactions } from "../models/transaction";
const mockHttp: Partial<Http> = {
  get: vi.fn()
};
describe("TransactionsClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls http.get with 'cards' when getCards is called", () => {
    const client = new TransactionsClient(mockHttp as Http);
    const mockCards: Card[] = [
      { id: "1", description: "Visa" },
      { id: "2", description: "Mastercard" },
    ];
    (mockHttp.get as Mock).mockResolvedValue(mockCards)
    const result = client.getCards();
    expect(mockHttp.get).toHaveBeenCalledWith("cards");
    expect(result).resolves.toEqual(mockCards);
  });

  it("calls http.get with 'transactions' when getTransactions is called", () => {
    const client = new TransactionsClient(mockHttp as Http);
    const mockTransactions: Transactions = {
      "1": [{ id: "t1", amount: 10, description: "test" }],
      "2": [{ id: "t2", amount: 20,  description: "test" }],
    };
    (mockHttp.get as Mock).mockResolvedValue(mockTransactions)
    const result = client.getTransactions();
    expect(mockHttp.get).toHaveBeenCalledWith("transactions");
    expect(result).resolves.toEqual(mockTransactions);
  });
});
