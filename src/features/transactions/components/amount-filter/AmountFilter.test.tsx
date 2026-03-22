import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AmountFilter from "./AmountFilter";

describe("AmountFilter", () => {
  it("renders a labeled input", () => {
    render(<AmountFilter onChange={vi.fn()} />);
    expect(screen.getByLabelText(/amount filter/i)).toBeInTheDocument();
  });

  it("renders with the correct placeholder", () => {
    render(<AmountFilter onChange={vi.fn()} />);
    expect(screen.getByPlaceholderText("Amount")).toBeInTheDocument();
  });

  it("renders with provided value", () => {
    render(<AmountFilter value={100} onChange={vi.fn()} />);
    expect(screen.getByLabelText(/amount filter/i)).toHaveValue(100);
  });

  it("renders empty when no value is provided", () => {
    render(<AmountFilter onChange={vi.fn()} />);
    expect(screen.getByLabelText(/amount filter/i)).toHaveValue(null);
  });

  it("calls onChange with the typed value", async () => {
    const handleChange = vi.fn();
    render(<AmountFilter onChange={handleChange} />);

    fireEvent.change(screen.getByLabelText(/amount filter/i), {
      target: { value: "50" },
    });

    expect(handleChange).toHaveBeenCalled();
    expect(handleChange).toHaveBeenLastCalledWith(50);
  });

  it("renders as a number input", () => {
    render(<AmountFilter onChange={vi.fn()} />);
    expect(screen.getByLabelText(/amount filter/i)).toHaveAttribute(
      "type",
      "number"
    );
  });
});
