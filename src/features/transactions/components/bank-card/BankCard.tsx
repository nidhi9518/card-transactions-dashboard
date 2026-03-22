import styled from "styled-components";
import { CardThemeContext } from "../../context/CardThemeProvider";
import { useContext } from "react";
import { CARD_THEME_MAP } from "../../constants/cardTheme";

type BankCardProps = {
  description: string;
  id: string;
  onClick?: () => void;
};
const CardButton = styled.button<{ $description: string; $selected?: boolean }>`
  border-radius: var(--border-radius);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding-left: var(--padding-card);
  width: 45%;
  height: 150px;
  box-shadow: var(--shadow-default);
  background-color: ${({ $description }) =>
    CARD_THEME_MAP[$description] ?? CARD_THEME_MAP.Default};
  border: 3px solid
    ${({ $selected }) =>
      $selected
        ? "var(--color-selected-border)"
        : "var(--color-transparent-border)"};

  &:focus-visible {
    outline: 2px solid var(--color-focus);
    outline-offset: 2px;
  }
`;


export default function BankCard({ description, id, onClick }: BankCardProps) {
  const { selectedCard } = useContext(CardThemeContext);
  const isSelected = selectedCard?.description === description;

  return (
    <CardButton
      type="button"
      $description={description}
      $selected={isSelected}
      onClick={onClick}
      aria-label={`${description} card, card ID: ${id}`}
      aria-pressed={isSelected}
    >
      <h3>{description}</h3>
      <span>{id}</span>
    </CardButton>
  );
}
