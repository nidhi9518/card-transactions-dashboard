import InfoPanel from "../info-panel/InfoPanel";
import type { Transaction } from "../../models/transaction";
import { formatCurrency } from "../../../../common/utils";
import styled from "styled-components";

type TransactionsProps = {
  transactions: Transaction[];
};

const TransactionList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export default function Transactions({ transactions }: TransactionsProps) {
  if (transactions.length === 0) {
    return <p className="text-center">No transactions found.</p>;
  }
  return (
    <>
      <p>{transactions.length} transaction{transactions.length !== 1 ? "s" : ""} found.</p>
      <TransactionList>
        {transactions.map((transaction) => (
          <li key={transaction.id} role="listitem">
            <InfoPanel
              description={transaction.description}
              amount={formatCurrency(transaction.amount)}
            />
          </li>
        ))}
      </TransactionList>
    </>
  );
}
