import { test, expect } from "@playwright/test";

const CARDS = [
  { id: "card-001", description: "Private Card" },
  { id: "card-002", description: "Business Card" },
];

const TRANSACTIONS = {
  "card-001": [
    { id: "tx-001", amount: 123.88, description: "Food" },
    { id: "tx-002", amount: 33.48,  description: "Snack" },
    { id: "tx-003", amount: 288.38, description: "Tickets" },
  ],
  "card-002": [
    { id: "tx-004", amount: 21.88,  description: "T-Shirt" },
    { id: "tx-005", amount: 533.48, description: "Smart Phone" },
    { id: "tx-006", amount: 2.58,   description: "Chocolate Bar" },
  ],
};

async function mockApi(page: import("@playwright/test").Page) {
  await page.route("**/cards", (route) =>
    route.fulfill({ json: CARDS })
  );
  await page.route("**/transactions", (route) =>
    route.fulfill({ json: TRANSACTIONS })
  );
}

test.describe("Navigation", () => {
  test("redirects from / to /dashboard", async ({ page }) => {
    await mockApi(page);
    await page.goto("/");
    await expect(page).toHaveURL(/\/dashboard/);
  });
});

test.describe("Card list", () => {
  test.beforeEach(async ({ page }) => {
    await mockApi(page);
    await page.goto("/dashboard");
  });

  test("displays all cards", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: /private card/i })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /business card/i })
    ).toBeVisible();
  });

  test("first card is auto-selected on load", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: /private card/i })
    ).toHaveAttribute("aria-pressed", "true");
    await expect(
      page.getByRole("button", { name: /business card/i })
    ).toHaveAttribute("aria-pressed", "false");
  });

  test("clicking a card marks it as selected", async ({ page }) => {
    await page.getByRole("button", { name: /business card/i }).click();

    await expect(
      page.getByRole("button", { name: /business card/i })
    ).toHaveAttribute("aria-pressed", "true");
    await expect(
      page.getByRole("button", { name: /private card/i })
    ).toHaveAttribute("aria-pressed", "false");
  });
});

test.describe("Transactions", () => {
  test.beforeEach(async ({ page }) => {
    await mockApi(page);
    await page.goto("/dashboard");
    await expect(page.getByText("Food")).toBeVisible();
  });

  test("shows transactions for the auto-selected card", async ({ page }) => {
    await expect(page.getByText("Food")).toBeVisible();
    await expect(page.getByText("Snack")).toBeVisible();
    await expect(page.getByText("Tickets")).toBeVisible();
  });

  test("switching cards shows the correct transactions", async ({ page }) => {
    await page.getByRole("button", { name: /business card/i }).click();

    await expect(page.getByText("T-Shirt", { exact: true })).toBeVisible();
    await expect(page.getByText("Smart Phone", { exact: true })).toBeVisible();
    await expect(page.getByText("Chocolate Bar", { exact: true })).toBeVisible();

    await expect(page.getByText("Food", { exact: true })).not.toBeVisible();
    await expect(page.getByText("Snack", { exact: true })).not.toBeVisible();
  });

  test("transaction amounts are formatted as currency (de-DE / EUR)", async ({
    page,
  }) => {
    await expect(page.getByText("123,88\u00a0€")).toBeVisible();
    await expect(page.getByText("33,48\u00a0€")).toBeVisible();
    await expect(page.getByText("288,38\u00a0€")).toBeVisible();
  });

  test("each transaction panel has accessible label", async ({ page }) => {
    const panels = page.getByLabel("Transaction information");
    await expect(panels.first()).toBeVisible();
    await expect(panels).toHaveCount(3);
  });
});

test.describe("Amount filter", () => {
  test.beforeEach(async ({ page }) => {
    await mockApi(page);
    await page.goto("/dashboard");
    await expect(page.getByText("Food")).toBeVisible();
  });

  test("amount filter input is visible", async ({ page }) => {
    await expect(page.getByLabel(/amount filter/i)).toBeVisible();
  });

  test("filters out transactions below the entered amount", async ({ page }) => {
    await page.getByLabel(/amount filter/i).fill("100");

    await expect(page.getByText("Food")).toBeVisible();    // 123.88 >= 100
    await expect(page.getByText("Tickets")).toBeVisible(); // 288.38 >= 100
    await expect(page.getByText("Snack")).not.toBeVisible(); // 33.48 < 100
  });

  test("shows all transactions when filter is cleared", async ({ page }) => {
    await page.getByLabel(/amount filter/i).fill("100");
    await expect(page.getByText("Snack")).not.toBeVisible();

    await page.getByLabel(/amount filter/i).clear();

    await expect(page.getByText("Snack")).toBeVisible();
    await expect(page.getByText("Food")).toBeVisible();
    await expect(page.getByText("Tickets")).toBeVisible();
  });

  test("shows 'No transactions found.' when filter exceeds all amounts", async ({
    page,
  }) => {
    await page.getByLabel(/amount filter/i).fill("9999");
    await expect(page.getByText("No transactions found.")).toBeVisible();
  });

  test("filter resets when switching to another card", async ({ page }) => {
    await page.getByLabel(/amount filter/i).fill("100");
    await expect(page.getByText("Snack")).not.toBeVisible();

    await page.getByRole("button", { name: /business card/i }).click();

    await expect(page.getByLabel(/amount filter/i)).toHaveValue("");
    await expect(page.getByText("T-Shirt")).toBeVisible();
    await expect(page.getByText("Chocolate Bar")).toBeVisible();
  });

  test("boundary value: exact amount is included (>=)", async ({ page }) => {
    await page.getByLabel(/amount filter/i).fill("33.48");
    await expect(page.getByText("Snack")).toBeVisible();
  });
});

test.describe("Error handling", () => {
  test("shows server error message when cards API returns 500", async ({ page }) => {
    await page.route("**/cards", (route) =>
      route.fulfill({ status: 500, body: "Internal Server Error" })
    );
    await page.route("**/transactions", (route) =>
      route.fulfill({ json: TRANSACTIONS })
    );

    await page.goto("/dashboard");
    await expect(page.getByRole("alert")).toHaveText("Server error. Please try again later.");
  });

  test("shows server error message when transactions API returns 500", async ({ page }) => {
    await page.route("**/cards", (route) =>
      route.fulfill({ json: CARDS })
    );
    await page.route("**/transactions", (route) =>
      route.fulfill({ status: 500, body: "Internal Server Error" })
    );

    await page.goto("/dashboard");
    await expect(page.getByRole("alert")).toHaveText("Server error. Please try again later.");
  });

  test("shows not found message when transactions API returns 404", async ({ page }) => {
    await page.route("**/cards", (route) =>
      route.fulfill({ json: CARDS })
    );
    await page.route("**/transactions", (route) =>
      route.fulfill({ status: 404, body: "Not Found" })
    );

    await page.goto("/dashboard");
    await expect(page.getByRole("alert")).toHaveText("The requested data could not be found.");
  });

  test("shows unauthorised message when cards API returns 401", async ({ page }) => {
    await page.route("**/cards", (route) =>
      route.fulfill({ status: 401, body: "Unauthorised" })
    );
    await page.route("**/transactions", (route) =>
      route.fulfill({ json: TRANSACTIONS })
    );

    await page.goto("/dashboard");
    await expect(page.getByRole("alert")).toHaveText("You are not authorised to view this data.");
  });
});
