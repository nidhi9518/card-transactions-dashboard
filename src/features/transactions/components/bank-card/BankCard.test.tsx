import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import BankCard from "./BankCard";
import { CardThemeContext } from "../../context/CardThemeProvider";

describe("BankCard", () => {
  const baseContext = {
    theme: "#0999",
    selectedCard: null,
    setSelectedCard: vi.fn(),
  };

  it("renders description and id", () => {
    render(
      <CardThemeContext.Provider value={baseContext}>
        <BankCard description="Visa" id="1234" />
      </CardThemeContext.Provider>
    );

    expect(screen.getByText("Visa")).toBeInTheDocument();
    expect(screen.getByText("1234")).toBeInTheDocument();
  });

  it("sets aria-pressed based on selection", () => {
    const ctx = { ...baseContext, selectedCard: { id: "1234", description: "Visa" } };

    render(
      <CardThemeContext.Provider value={ctx}>
        <BankCard description="Visa" id="1234" />
      </CardThemeContext.Provider>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-pressed", "true");
  });

  it("sets aria-pressed to false when not selected", () => {
    const ctx = { ...baseContext, selectedCard: { id: "9999", description: "Mastercard" } };

    render(
      <CardThemeContext.Provider value={ctx}>
        <BankCard description="Visa" id="1234" />
      </CardThemeContext.Provider>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("calls onClick when clicked", () => {
    const handleClick = vi.fn();

    render(
      <CardThemeContext.Provider value={baseContext}>
        <BankCard description="Visa" id="1234" onClick={handleClick} />
      </CardThemeContext.Provider>
    );

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalled();
  });

  it("sets correct aria-label", () => {
    render(
      <CardThemeContext.Provider value={baseContext}>
        <BankCard description="Visa" id="1234" />
      </CardThemeContext.Provider>
    );

    expect(
      screen.getByLabelText("Visa card, card ID: 1234")
    ).toBeInTheDocument();
  });
});
