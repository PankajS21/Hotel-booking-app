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

test("should show hotel detail", async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByPlaceholder("Where are you going?").fill("Pankaj");
  await page.getByRole("button", { name: "Search" }).click();

  await page.getByText("Pankaj Singh Rawat").click();
  await expect(page).toHaveURL(/detail/);
  await expect(page.getByRole("button", { name: "Book now" })).toBeVisible();
});

test("should book hotel", async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByPlaceholder("Where are you going?").fill("Pankaj");

  const date = new Date();
  date.setDate(date.getDate() + 3);
  const formattedDate = date.toISOString().split("T")[0];
  await page.getByPlaceholder("Check-out Date").fill(formattedDate);

  await page.getByRole("button", { name: "Search" }).click();

  await page.getByText("Pankaj Singh Rawat").click();
  //   await expect(page).toHaveURL(/detail/);
  await page.getByRole("button", { name: "Book now" }).click();

  await expect(page.getByText("Total Cost: £13029.00")).toBeVisible();

  const stripeFrame = page.frameLocator("iframe").first();
  await stripeFrame
    .locator('[placeholder="Card number"]')
    .fill("4242424242424242");

  await stripeFrame.locator('[placeholder="MM / YY"]').fill("05/38");
  await stripeFrame.locator('[placeholder="CVC"]').fill("989");
  await stripeFrame.locator('[placeholder="ZIP"]').fill("09887");

  await page.getByRole("button", { name: "Confirm Booking" }).click();
  await expect(page.getByText("Booking Saved!")).toBeVisible();

  await page.getByRole("link", { name: "My Bookings" }).click();
  await expect(page.getByText("Pankaj SIngh")).toBeVisible();
});
