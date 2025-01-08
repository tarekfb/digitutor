import { expect } from "@playwright/test";
import { test } from "../env-options";

test("fetch profile", async ({ page, profileId }) => {
  await page.goto(`${process.env.BASE_URL || ""}/profile/${profileId}`);
  await expect(
    page.getByRole("heading", { name: "Recensioner" }),
  ).toBeVisible();
});
