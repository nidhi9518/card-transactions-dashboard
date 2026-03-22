import { useCards } from "../../api/hooks/useCards";
import { useTransactions } from "../../api/hooks/useTransactions";
import type { Card } from "../../models/card";
import Transactions from "../transactions/Transactions";
import { useContext, useEffect, useState } from "react";
import { useFilteredTransactions } from "../../custom-hooks/useFilteredTransactions";
import BankCardList from "../bank-card-list/BankCardList";
import { CardThemeContext } from "../../context/CardThemeProvider";
import AmountFilter from "../amount-filter/AmountFilter";
import { getErrorMessage } from "../../../../api/HttpError";

export default function TransactionsDashboard() {
  const [amountFilter, setAmountFilter] = useState<number>();
  const {
    data: cards = [],
    isLoading: cardsLoading,
    error: cardsError,
  } = useCards();
  const {
    data: transactions,
    isLoading: txLoading,
    error: txError,
  } = useTransactions();
  const { selectedCard, setSelectedCard } = useContext(CardThemeContext);

  useEffect(() => {
    if (cards.length > 0 && !selectedCard) {
      setSelectedCard(cards[0]);
    }
  }, [cards, selectedCard, setSelectedCard]);

  const filteredTransactions = useFilteredTransactions(
    transactions,
    selectedCard?.id,
    amountFilter,
  );

  function handleSelectCard(card: Card) {
    if (selectedCard?.id !== card.id) setAmountFilter(undefined);
    setSelectedCard(card);
  }

  if (cardsError) {
    return <p role="alert">{getErrorMessage(cardsError)}</p>;
  }

  const isLoading = cardsLoading || txLoading;
  const hasTransactions =
    !isLoading &&
    !txError &&
    selectedCard?.id &&
    transactions?.[selectedCard.id];

  const transactionContent = txError ? (
    <p role="alert">{getErrorMessage(txError)}</p>
  ) : (
    <Transactions transactions={filteredTransactions} />
  );

  return (
    <div className="flex flex-column align-center mt-2">
      <div className="w-50 flex flex-column gap-2">
        {isLoading && <p>Loading...</p>}
        {!cardsLoading && (
          <BankCardList cards={cards} handleSelectCard={handleSelectCard} />
        )}
        {hasTransactions && (
          <AmountFilter value={amountFilter} onChange={setAmountFilter} />
        )}
        <div aria-live="polite" aria-atomic="false" className="w-100 mt-2">
          {!isLoading && transactionContent}
        </div>
      </div>
    </div>
  );
}
