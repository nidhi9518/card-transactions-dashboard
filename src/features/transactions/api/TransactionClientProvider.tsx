import { createContext, useContext } from "react";
import { TransactionsClient } from "./TransactionsClient";

interface TransactionsProviderProps {
  transactionsClient: TransactionsClient;
  children: React.ReactNode;
}

interface TransactionsContextProps {
  transactionsClient: TransactionsClient;
}

const TransactionsContext = createContext<TransactionsContextProps | null>(null);

export function TransactionsClientProvider({
  transactionsClient,
  children,
}: TransactionsProviderProps) {
  return (
    <TransactionsContext.Provider value={{ transactionsClient }}>
      {children}
    </TransactionsContext.Provider>
  );
}


export function useTransactionsContext(): TransactionsContextProps {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error(
      "useTransactionsContext must be used within a TransactionsClientProvider"
    );
  }
  return context;
}

