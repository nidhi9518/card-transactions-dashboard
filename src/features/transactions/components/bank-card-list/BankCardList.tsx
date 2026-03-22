import type { Card } from "../../models/card";
import BankCard from "../bank-card/BankCard";

type BankCardListProps = {
  cards: Card[];
  handleSelectCard?: (card: Card) => void
};
export default function BankCardList({ cards, handleSelectCard }: BankCardListProps) {
  return (
    <div className="flex flex-wrap justify-center gap-1 mt-2 mb-2">
      {cards.map((card: Card) => (
        <BankCard
          key={card.id}
          description={card.description}
          id={card.id}
          onClick={() => handleSelectCard && handleSelectCard(card)}
        />
      ))}
    </div>
  );
}
