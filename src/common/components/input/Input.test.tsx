import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Input from "./Input";

describe("Input Component", () => {
  it("should render input with required indicator", () => {
    render(<Input label="Email" required />);
    const label = screen.getByText(/Email/);
    expect(label.textContent).toContain("*");
  });

  it("should render input with placeholder", () => {
    render(<Input label="Name" placeholder="Enter your name" />);
    const input = screen.getByPlaceholderText("Enter your name");
    expect(input).toBeInTheDocument();
  });

  it('should have default type of "text"', () => {
    render(<Input label="Username" />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.type).toBe("text");
  });

  it("should render number input type", () => {
    render(<Input label="Age" type="number" />);
    const input = screen.getByRole("spinbutton") as HTMLInputElement;
    expect(input.type).toBe("number");
  });

  it("should call onChange handler when input value changes", async () => {
    const handleChange = vi.fn();
    render(<Input label="Username" onChange={handleChange} value="test"/>);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "25" } });
    expect(handleChange).toHaveBeenCalled();
  });
});
