import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";

vi.mock("./AppRoutes", () => ({
  router: {},
}));

vi.mock("react-router-dom", () => ({
  RouterProvider: vi.fn(() => <div data-testid="router-provider">Router Content</div>),
}));

describe("App", () => {
  it("renders a main landmark element", () => {
    render(<App />);
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("renders the router provider inside main", () => {
    render(<App />);
    const main = screen.getByRole("main");
    expect(main).toContainElement(screen.getByTestId("router-provider"));
  });

  it("renders children normally when no error occurs", () => {
    render(<App />);
    expect(screen.getByText("Router Content")).toBeInTheDocument();
  });
});
