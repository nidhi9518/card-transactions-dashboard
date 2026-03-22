import type { IHttpClient } from "../../../api/Http";
import type { Card } from "../models/card";
import type { Transactions } from "../models/transaction";

export class TransactionsClient {
  private http: IHttpClient;
  constructor(http: IHttpClient) {
    this.http = http;
  }

  getCards() {
    return this.http.get<Card[]>("cards");
  }

  getTransactions() {
    return this.http.get<Transactions>(`transactions`);
  }
}
