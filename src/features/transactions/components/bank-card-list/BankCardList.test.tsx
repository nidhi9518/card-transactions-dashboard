import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import BankCardList from "./BankCardList";
import { CardThemeContext } from "../../context/CardThemeProvider";
import type { Card } from "../../models/card";

const mockContext = {
  theme: "#000",
  selectedCard: null,
  setSelectedCard: vi.fn(),
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CardThemeContext.Provider value={mockContext}>
    {children}
  </CardThemeContext.Provider>
);

const cards: Card[] = [
  { id: "1", description: "Visa" },
  { id: "2", description: "Mastercard" },
];

describe("BankCardList", () => {
  it("renders all cards", () => {
    render(<BankCardList cards={cards} />, { wrapper });

    expect(screen.getByText("Visa")).toBeInTheDocument();
    expect(screen.getByText("Mastercard")).toBeInTheDocument();
  });

  it("renders nothing when cards array is empty", () => {
    const { container } = render(<BankCardList cards={[]} />, { wrapper });

    expect(container.querySelectorAll("button")).toHaveLength(0);
  });

  it("does not throw when handleSelectCard is not provided", () => {
    expect(() =>
      render(<BankCardList cards={cards} />, { wrapper })
    ).not.toThrow();
  });

  it("calls handleSelectCard with the clicked card", () => {
    const handleSelectCard = vi.fn();

    render(<BankCardList cards={cards} handleSelectCard={handleSelectCard} />, {
      wrapper,
    });

    fireEvent.click(screen.getByLabelText("Mastercard card, card ID: 2"));
    expect(handleSelectCard).toHaveBeenCalledWith(cards[1]);
  });
});
