import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "./ErrorBoundary";

describe("ErrorBoundary", () => {
  it("should render children without errors", () => {
    render(
      <ErrorBoundary>
        <div>Test Content</div>
      </ErrorBoundary>,
    );

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("should render default fallback on error", () => {
    const ThrowError = () => {
      throw new Error("Test error");
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Something went wrong.")).toBeInTheDocument();
  });

  it('should render error UI with role="alert" and aria-live="assertive"', () => {
    const ThrowError = () => {
      throw new Error("Test error");
    };

    const { container } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    );

    const alertElement = container.querySelector('[role="alert"]');
    expect(alertElement).toBeInTheDocument();
    const liveRegion = container.querySelector('[aria-live="assertive"]');
    expect(liveRegion).toBeInTheDocument();
  });
});
