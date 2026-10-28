import { test, expect } from "@playwright/test";

test("first-run setup configures a code, unlocks and opens apps manually", async ({ page }) => {
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.addInitScript(() => localStorage.clear());

  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Choisissez votre langue" })).toBeVisible();

  // Move to the account step and create an optional session PIN.
  for (let step = 0; step < 5; step += 1) {
    await page.locator(".setup-next-button").click();
  }
  await expect(page.getByRole("heading", { name: "Créez votre compte" })).toBeVisible();
  await page.locator('input[name="setup-passcode"]').fill("2468");
  await page.locator('input[name="setup-passcode-confirm"]').fill("2468");

  for (let step = 5; step < 7; step += 1) {
    await page.locator(".setup-next-button").click();
  }
  await expect(page.getByRole("heading", { name: "Tout est prêt." })).toBeVisible();
  await page.getByRole("button", { name: /Démarrer la session/ }).click();

  await expect(page.locator(".lockscreen")).toBeVisible({ timeout: 10_000 });
  await page.locator("#session-unlock-code").fill("2468");
  await page.locator(".lock-code-form .primary").click();

  const desktop = page.locator(".desktop");
  await expect(desktop).toBeVisible();
  await expect(page.locator(".appwindow")).toHaveCount(0);
  await expect(page.locator(".photos-window")).toHaveCount(0);
  await expect(page.locator(".control-panel-macos")).toHaveCount(0);
  await expect(page.locator(".screen-notch")).toHaveCount(0);

  // Launch Finder deliberately, then verify only its title bar drags the window.
  await page.locator('.dock button[title="Finder"]').click();
  const appWindow = page.locator(".appwindow").first();
  await expect(appWindow).toBeVisible();
  // Wait for the Framer Motion entrance animation before measuring drag coordinates.
  await page.waitForTimeout(500);
  const dragSurface = page.locator(".react-draggable").first();
  const before = await dragSurface.boundingBox();
  const body = await page.locator(".windowbody").first().boundingBox();
  await page.mouse.move(body.x + body.width * 0.6, body.y + body.height * 0.5);
  await page.mouse.down();
  await page.mouse.move(body.x + body.width * 0.6 + 70, body.y + body.height * 0.5 + 40, { steps: 6 });
  await page.mouse.up();
  const afterContentDrag = await dragSurface.boundingBox();
  expect(Math.abs(afterContentDrag.x - before.x)).toBeLessThan(3);
  expect(Math.abs(afterContentDrag.y - before.y)).toBeLessThan(3);

  const title = await page.locator(".windowtitle").first().boundingBox();
  await page.mouse.move(title.x + title.width - 24, title.y + title.height / 2);
  await page.mouse.down();
  await page.mouse.move(title.x + title.width + 55, title.y + title.height / 2 + 35, { steps: 8 });
  await page.mouse.up();
  await expect.poll(async () => (await dragSurface.boundingBox()).x).not.toBe(before.x);

  expect(pageErrors, "browser runtime errors").toEqual([]);
});

test("a returning session can unlock, update and use its code in Settings", async ({ page }) => {
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.addInitScript(() => {
    localStorage.setItem("gg-setup", "true");
    localStorage.setItem("gg-passcode", JSON.stringify("1234"));
  });

  await page.goto("/");
  await expect(page.locator(".lockscreen")).toBeVisible();
  await page.locator("#session-unlock-code").fill("1234");
  await page.locator(".lock-code-form .primary").click();
  await expect(page.locator(".desktop")).toBeVisible();
  await expect(page.locator(".appwindow")).toHaveCount(0);

  await page.locator('.dock button[title="Réglages"]').click();
  await expect(page.locator(".appwindow")).toContainText("Réglages Système");
  await page.getByRole("button", { name: "Sécurité", exact: true }).click();
  await page.locator('input[placeholder="Code actuel"]').fill("1234");
  await page.locator('input[placeholder="4 à 8 chiffres"]').fill("5678");
  await page.locator('input[placeholder="Répète le code"]').fill("5678");
  await page.locator(".passcode-save").click();
  await expect(page.getByRole("status")).toContainText("Code de déverrouillage enregistré.");

  await page.locator(".desktop-corner button[title='Verrouiller']").click();
  await expect(page.locator(".lockscreen")).toBeVisible();
  await page.locator("#session-unlock-code").fill("5678");
  await page.locator(".lock-code-form .primary").click();
  await expect(page.locator(".desktop")).toBeVisible();
  expect(pageErrors, "browser runtime errors").toEqual([]);
});

test("setup language changes the displayed assistant language immediately", async ({ page }) => {
  await page.addInitScript(() => localStorage.clear());
  await page.goto("/?setup=1");
  await expect(page.getByRole("heading", { name: "Choisissez votre langue" })).toBeVisible();
  await page.getByRole("button", { name: /English/ }).click();
  await expect(page.getByRole("heading", { name: "Choose your language" })).toBeVisible();
  await page.getByRole("button", { name: /Spanish/ }).click();
  await expect(page.getByRole("heading", { name: "Elige tu idioma" })).toBeVisible();
});

test("App Store can install an app and minimized windows restore instead of closing", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("gg-setup", "true"));
  await page.goto("/");
  await expect(page.locator(".lockscreen")).toBeVisible();
  await page.locator(".lockscreen .primary").click();
  await expect(page.locator(".desktop")).toBeVisible();

  await page.locator('.dock button[title="App Store"]').click();
  await expect(page.locator(".appwindow")).toContainText("Applications Golden Gate");
  await expect(page.locator(".appwindow")).toContainText("ArtCraft");
  await expect(page.locator(".appwindow")).toContainText("ArtCraft Team et contributeurs");
  await page.locator(".store-card").filter({ hasText: "Météo" }).getByRole("button", { name: "Ajouter" }).click();
  await expect(page.locator('.dock button[title="Météo"]')).toBeVisible();

  await page.locator('.dock button[title="Finder"]').click();
  const finder = page.locator(".appwindow").filter({ hasText: "Nouveau dossier" }).first();
  await expect(finder).toBeVisible();
  await page.waitForTimeout(450);
  await finder.locator(".traffic button").nth(1).click();
  await expect(finder).toHaveCount(1);
  await expect(finder).not.toBeVisible();
  await page.locator('.dock button[title="Finder"]').click();
  await expect(finder).toBeVisible();
});

test("Music defaults to full-length official NCS playback and isolates 30-second previews", async ({ page }) => {
  const pageErrors = [];
  page.on("pageerror", error => pageErrors.push(error.message));
  await page.addInitScript(() => localStorage.setItem("gg-setup", "true"));
  await page.goto("/");
  await expect(page.locator(".lockscreen")).toBeVisible();
  await page.locator(".lockscreen .primary").click();
  await expect(page.locator(".desktop")).toBeVisible();

  await page.locator('.dock button[title="Musique"]').click();
  const music = page.locator(".appwindow").filter({ hasText: "NOCOPYRIGHTSOUNDS" });
  await expect(music.locator(".youtube-player-shell iframe")).toHaveAttribute("src", /youtube-nocookie.com\/embed\/mZhuH_qeRRU/);
  await expect(music).toContainText("Le lecteur officiel YouTube diffuse la vidéo complète");
  await expect(music.locator(".music-audio-host")).toHaveCSS("display", "none");

  await music.getByRole("button", { name: /Aperçus iTunes/ }).click();
  await expect(music.locator(".music-preview-view")).toBeVisible();
  await expect(music).toContainText("limités par le catalogue iTunes");
  await music.getByRole("button", { name: /NCS — complet/ }).click();
  await expect(music.locator(".youtube-player-shell iframe")).toHaveAttribute("src", /youtube-nocookie.com\/embed\/mZhuH_qeRRU/);
  expect(pageErrors, "browser runtime errors").toEqual([]);
});

test("creative software cards link to official downloads and identify the creator", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("gg-setup", "true"));
  await page.goto("/");
  await expect(page.locator(".lockscreen")).toBeVisible();
  await page.locator(".lockscreen .primary").click();
  await page.locator('.dock button[title="App Store"]').click();
  const store = page.locator(".appwindow");
  const names = ["ArtCraft", "PhotoCraft", "FilmCraft", "LightCraft"];
  for (const [index, name] of names.entries()) {
    const card = store.locator(".creative-card").nth(index);
    await expect(card.locator(".creative-card-title h4")).toHaveText(name);
    await expect(card).toContainText("ArtCraft Team et contributeurs");
    await expect(card.getByRole("button", { name: /Voir les téléchargements/ })).toBeVisible();
    await expect(card.getByRole("button", { name: /Code source/ })).toBeVisible();
  }
});
