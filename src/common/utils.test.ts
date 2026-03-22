import { describe, it, expect } from "vitest";
import { formatCurrency } from "./utils";

describe("formatCurrency", () => {
  it("formats number as EUR by default", () => {
    expect(formatCurrency(1234.56).replace(/\s/g, " ")).toContain("1.234,56 €");
  });

  it("formats negative values correctly", () => {
    expect(formatCurrency(-50).replace(/\s/g, " ")).toContain("-50,00 €");
  });

  it("formats decimal values", () => {
    expect(formatCurrency(12.3).replace(/\s/g, " ")).toContain("12,30 €");
  });

  it("formats large numbers", () => {
    expect(formatCurrency(1000000).replace(/\s/g, " ")).toContain(
      "1.000.000,00 €",
    );
  });
});
