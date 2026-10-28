import { test, expect } from "@playwright/test";

test("first-run setup reaches the desktop without a runtime error", async ({ page }) => {
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.addInitScript(() => localStorage.clear());

  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Choisissez votre langue" })).toBeVisible();

  // Walk through the seven choices and reach the final confirmation step.
  for (let step = 0; step < 7; step += 1) {
    await page.locator(".setup-next-button").click();
  }
  await expect(page.getByRole("heading", { name: "Tout est prêt." })).toBeVisible();
  await page.getByRole("button", { name: /Démarrer la session/ }).click();

  await expect(page.locator(".lockscreen")).toBeVisible({ timeout: 10_000 });
  await page.locator(".lockscreen .primary").click();
  await page.waitForTimeout(300);
  console.log("AFTER UNLOCK BODY:", await page.locator("body").innerText());
  console.log("AFTER UNLOCK PAGE ERRORS:", JSON.stringify(pageErrors));
  await expect(page.locator(".desktop")).toBeVisible();
  await expect(page.locator(".photos-window")).toBeVisible();
  await expect(page.locator(".control-panel-macos")).toBeVisible();
  expect(pageErrors, "browser runtime errors").toEqual([]);
});

test("a returning session can unlock to the desktop", async ({ page }) => {
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.addInitScript(() => localStorage.setItem("gg-setup", "true"));

  await page.goto("/");
  await expect(page.locator(".lockscreen")).toBeVisible();
  await page.locator(".lockscreen .primary").click();
  await expect(page.locator(".desktop")).toBeVisible();
  await expect(page.locator(".photos-window")).toBeVisible();
  expect(pageErrors, "browser runtime errors").toEqual([]);
});
