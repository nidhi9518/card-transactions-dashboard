import { createContext, useMemo, useState } from "react";
import { CARD_THEME_MAP } from "../constants/cardTheme";
import type { Card } from "../models/card";

interface CardThemeContextType {
  theme: string;
  selectedCard: Card | null;
  setSelectedCard: (value: Card | null) => void;
}

export const CardThemeContext = createContext<CardThemeContextType>({
  theme: CARD_THEME_MAP.Default,
  selectedCard: null,
  setSelectedCard: () => {},
});

export function CardThemeProvider({ children }: { children: React.ReactNode }) {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const value = useMemo(
    () => ({
      theme: selectedCard ? CARD_THEME_MAP[selectedCard.description] : CARD_THEME_MAP.Default,
      selectedCard,
      setSelectedCard,
    }),
    [selectedCard]
  );

  return (
    <CardThemeContext.Provider value={value}>
      {children}
    </CardThemeContext.Provider>
  );
}
