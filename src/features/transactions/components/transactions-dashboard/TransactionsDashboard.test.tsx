import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TransactionsDashboard from "./TransactionsDashboard";
import { useCards } from "../../api/hooks/useCards";
import { useTransactions } from "../../api/hooks/useTransactions";
import { CardThemeContext } from "../../context/CardThemeProvider";
import { useDebounce } from "../../../../common/custom-hooks/useDebounce";

vi.mock("../../api/hooks/useCards");
vi.mock("../../api/hooks/useTransactions");
vi.mock("../../../../common/custom-hooks/useDebounce");
const mockedUseCards = vi.mocked(useCards);
const mockDebounce = vi.mocked(useDebounce);
const mockTransactions = vi.mocked(useTransactions);

vi.mock("../bank-card/BankCard", () => ({
  default: ({ description, id, onClick }: any) => (
    <button data-testid="bank-card" onClick={onClick}>
      {description}-{id}
    </button>
  ),
}));

vi.mock("../transactions/Transactions", () => ({
  default: ({ transactions }: any) => (
    <div data-testid="transactions">{JSON.stringify(transactions)}</div>
  ),
}));

vi.mock("../../../../common/components/input/Input", () => ({
  default: ({ onChange, value }: any) => (
    <input
      data-testid="amount-input"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

const mockTransactionsData = {
  "1": [
    { id: "t1", amount: 10, description: "test" },
    { id: "t2", amount: 50, description: "test1" },
  ],
  "2": [{ id: "t3", amount: 100, description: "test3" }],
};
describe("TransactionsDashboard", () => {
  const setSelectedCard = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockDebounce.mockImplementation((value) => value);
    mockedUseCards.mockReturnValue({
      data: [
        { id: "1", description: "Visa" },
        { id: "2", description: "Mastercard" },
      ],
      error: null,
      mutate: vi.fn(),
      isValidating: false,
      isLoading: false,
    });

    mockTransactions.mockReturnValue({
      data: mockTransactionsData,
      error: null,
      mutate: vi.fn(),
      isValidating: false,
      isLoading: false,
    });
  });

  function renderWithContext() {
    return render(
      <CardThemeContext.Provider
        value={{ selectedCard: { id: "1", description: "Visa" }, setSelectedCard, theme: "#0999" }}
      >
        <TransactionsDashboard />
      </CardThemeContext.Provider>,
    );
  }

  it("renders cards from useCards", () => {
    renderWithContext();
    const cards = screen.getAllByTestId("bank-card");
    expect(cards).toHaveLength(2);
  });

  it("auto-selects the first card on mount", () => {
    render(
      <CardThemeContext.Provider
        value={{ selectedCard: null, setSelectedCard, theme: "#0999" }}
      >
        <TransactionsDashboard />
      </CardThemeContext.Provider>,
    );
    expect(setSelectedCard).toHaveBeenCalledWith({ id: "1", description: "Visa" });
  });

  it("updates selected card when clicking a card", () => {
    renderWithContext();
    const cards = screen.getAllByTestId("bank-card");
    fireEvent.click(cards[1]);
    expect(setSelectedCard).toHaveBeenCalledWith({ id: "2", description: "Mastercard" });
  });

  it("shows all transactions for selected card initially", () => {
    renderWithContext();
    const tx = screen.getByTestId("transactions");
    expect(tx).toHaveTextContent(JSON.stringify(mockTransactionsData["1"]));
  });

  it("filters transactions by amount", () => {
    renderWithContext();
    fireEvent.change(screen.getByTestId("amount-input"), {
      target: { value: "30" },
    });
    const tx = screen.getByTestId("transactions");
    expect(tx).toHaveTextContent(
      JSON.stringify({ id: "t2", amount: 50, description: "test1" }),
    );
  });

  it("resets amount filter when switching cards", () => {
    renderWithContext();
    fireEvent.change(screen.getByTestId("amount-input"), {
      target: { value: "30" },
    });
    expect(screen.getByTestId("transactions")).not.toHaveTextContent('"id":"t1"');

    const cards = screen.getAllByTestId("bank-card");
    fireEvent.click(cards[1]);

    expect(screen.getByTestId("transactions")).toHaveTextContent('"id":"t1"');
    expect(setSelectedCard).toHaveBeenCalledWith({ id: "2", description: "Mastercard" });
  });

  it("shows loading state while data is fetching", () => {
    mockedUseCards.mockReturnValueOnce({
      data: undefined,
      error: null,
      mutate: vi.fn(),
      isValidating: true,
      isLoading: true,
    });
    renderWithContext();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows error state when data fails to load", () => {
    mockedUseCards.mockReturnValueOnce({
      data: undefined,
      error: new Error("Network error"),
      mutate: vi.fn(),
      isValidating: false,
      isLoading: false,
    });
    renderWithContext();
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(
      screen.getByText("Failed to load data. Please check your connection and try again."),
    ).toBeInTheDocument();
  });
});
