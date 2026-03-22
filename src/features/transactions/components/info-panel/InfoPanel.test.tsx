import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import InfoPanel from "./InfoPanel";
import { CardThemeContext } from "../../context/CardThemeProvider";

const mockContext = {
  theme: "#123456",
  selectedCard: null,
  setSelectedCard: vi.fn(),
};

describe("InfoPanel", () => {
  it("renders description and amount", () => {
    render(
      <CardThemeContext.Provider value={mockContext}>
        <InfoPanel description="Coffee" amount="3,50 €" />
      </CardThemeContext.Provider>,
    );

    expect(screen.getByText("Coffee")).toBeInTheDocument();
    expect(screen.getByText("3,50 €")).toBeInTheDocument();
  });

  it("sets correct ARIA labels", () => {
    render(
      <CardThemeContext.Provider value={mockContext}>
        <InfoPanel description="Groceries" amount="25,00 €" />
      </CardThemeContext.Provider>,
    );

    expect(
      screen.getByLabelText("Transaction information"),
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Transaction description Groceries"),
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Transaction amount 25,00 €"),
    ).toBeInTheDocument();
  });
});
