import { test, expect } from "@playwright/test";

const UI_URL = "http://localhost:5173/";

test.beforeEach(async ({ page }) => {
  await page.goto(UI_URL);

  //get the sign in button

  await page.getByRole("link", { name: "Sign In" }).click();

  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  await page.locator("[name=email]").fill("pankajsingh@gmail.com");

  await page.locator("[name=password]").fill("pankajsingh");

  await page.getByRole("button", { name: "Log In" }).click();

  await expect(page.getByText("Sign in Successful!")).toBeVisible();
});

test("Should show hotel search results", async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByPlaceholder("Where are you going?").fill("Pankaj");
  await page.getByRole("button", { name: "Search" }).click();

  await expect(page.getByText("Hotels found in Pankaj")).toBeVisible();
  await expect(page.getByText("Pankaj Singh")).toBeVisible();
});