import { createBrowserRouter, Navigate } from "react-router-dom";
import TransactionsDashboard from "./features/transactions/components/transactions-dashboard/TransactionsDashboard";
import TransactionProvider from "./features/transactions/components/transactions-provider/TransactionsProvider";

export const router = createBrowserRouter([
  {
    path: "dashboard",
    element: (
      <TransactionProvider>
        <TransactionsDashboard />
      </TransactionProvider>
    ),
  },
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
]);
