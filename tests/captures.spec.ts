import { expect, test } from "@playwright/test";

const pages = [
  ["accueil", "/"],
  ["projets", "/projets/"],
  ["cybernova", "/projets/cybernova/"],
  ["bibliotheque", "/projets/bibliotheque/"],
  ["patients", "/projets/gestion-patients/"],
  ["releves", "/projets/releves-de-notes/"],
  ["mellifica", "/projets/mellifica/"],
  ["parcours", "/parcours/"],
  ["contact", "/contact/"],
] as const;

for (const theme of ["sombre", "clair"] as const) {
  for (const [nom, url] of pages) {
    test(`${nom} · ${theme}`, async ({ page }, info) => {
      await page.addInitScript((t) => localStorage.setItem("theme", t), theme);
      await page.goto(url, { waitUntil: "networkidle" });
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      // Faire défiler pour déclencher les apparitions au défilement.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 300) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 120));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(1200);
      await page.screenshot({
        path: `tests/captures/${info.project.name}/${nom}-${theme}.png`,
        fullPage: true,
      });
    });
  }
}

test("la bascule change de thème et s’en souvient", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const html = page.locator("html");
  const avant = await html.getAttribute("data-theme");
  await page
    .getByRole("button", { name: /Passer en mode/ })
    .filter({ visible: true })
    .first()
    .click();
  await expect(html).not.toHaveAttribute("data-theme", avant ?? "");
  await page.reload();
  await expect(html).not.toHaveAttribute("data-theme", avant ?? "");
});

test("le filtre Réseaux n’affiche que le projet réseau", async ({ page }) => {
  await page.goto("/projets/", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Réseaux/ }).click();
  await expect(page.getByRole("heading", { name: "Réseau d’une agence" })).toHaveCount(1);
  await expect(page.getByRole("heading", { name: "Mellifica" })).toHaveCount(0);
});
