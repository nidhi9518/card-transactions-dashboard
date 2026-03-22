import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import TransactionsLayout from "./TransactionsProvider";

vi.mock("../../api/TransactionClientProvider", () => ({
  TransactionsClientProvider: ({ children, transactionsClient }: any) => (
    <div data-testid="provider" data-client={!!transactionsClient}>
      {children}
    </div>
  ),
}));

vi.mock("../../context/CardThemeProvider", () => ({
  CardThemeProvider: ({ children }: any) => (
    <div data-testid="theme-provider">{children}</div>
  ),
}));


describe("TransactionsLayout", () => {
  it("renders children", () => {
    render(
      <TransactionsLayout>
        <div data-testid="child">Hello</div>
      </TransactionsLayout>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("wraps children in both providers", () => {
    render(
      <TransactionsLayout>
        <div data-testid="child" />
      </TransactionsLayout>
    );

    expect(screen.getByTestId("provider")).toBeInTheDocument();
    expect(screen.getByTestId("theme-provider")).toBeInTheDocument();
  });
});
