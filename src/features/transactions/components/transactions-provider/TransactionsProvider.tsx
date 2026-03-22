import { useMemo } from "react";
import { Http } from "../../../../api/Http";
import { TransactionsClientProvider } from "../../api/TransactionClientProvider";
import { TransactionsClient } from "../../api/TransactionsClient";
import { CardThemeProvider } from "../../context/CardThemeProvider";
import { baseUrl } from "../../../../api/config";

type TransactionProviderProps = {
  children: React.ReactNode;
};

export default function TransactionProvider({
  children,
}: TransactionProviderProps) {
  const transactionsClient = useMemo(
    () => new TransactionsClient(new Http(baseUrl)),
    []
  );
  return (
    <TransactionsClientProvider transactionsClient={transactionsClient}>
      <CardThemeProvider>{children}</CardThemeProvider>
    </TransactionsClientProvider>
  );
}
