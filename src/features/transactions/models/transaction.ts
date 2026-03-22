export interface Transaction {
  id: string;
  amount: number;
  description: string;
}

export interface Transactions {
  [key: string]: Transaction[]
}