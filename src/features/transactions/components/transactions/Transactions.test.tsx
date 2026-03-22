import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Transactions from "./Transactions";

vi.mock("../info-panel/InfoPanel", () => ({
  default: vi.fn(() => <div data-testid="info-panel" />),
}));

vi.mock("../../../../common/utils", () => ({
  formatCurrency: vi.fn((value) => `formatted-${value}`),
}));

describe("Transactions component", () => {
  it("renders 'no transactions' message when list is empty", () => {
    render(<Transactions transactions={[]} />);
    expect(
      screen.getByText(/No transactions found\./i),
    ).toBeInTheDocument();
  });

  it("renders a list of transactions", () => {
    const transactions = [
      { id: "1", description: "Coffee", amount: 3.5 },
      { id: "2", description: "Groceries", amount: 25 },
    ];
    render(<Transactions transactions={transactions} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getAllByTestId("info-panel")).toHaveLength(2);
  });
});
