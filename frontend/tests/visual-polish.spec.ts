import { test, expect } from "@playwright/test";
import fs from "node:fs";
import type { Page } from "@playwright/test";

async function settlePhotography(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  const height = await page.evaluate(
    () => document.documentElement.scrollHeight,
  );
  for (let y = 0; y < height; y += 600) {
    await page.evaluate((offset) => scrollTo(0, offset), y);
    await page.waitForTimeout(45);
  }
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(250);
  await expect
    .poll(() =>
      page
        .locator("img")
        .evaluateAll((images) =>
          images.every(
            (image) =>
              (image as HTMLImageElement).complete &&
              (image as HTMLImageElement).naturalWidth > 0,
          ),
        ),
    )
    .toBe(true);
}

test("sample imagery stays presentation-only and leaves catalog/cart facts intact", async ({
  page,
  request,
}) => {
  const products = await (
    await request.get("http://localhost:4000/api/products")
  ).json();
  expect(products).toHaveLength(4);
  for (const product of products) {
    expect(product.image).toBeNull();
    expect(product.aiImageFilename).toBeNull();
  }
  await page.goto("/shop");
  await expect(
    page.locator(".prod-card img[data-sample-image=true]"),
  ).toHaveCount(4);
  for (const img of await page.locator(".prod-card img").all()) {
    await expect(img).toHaveJSProperty("complete", true);
    expect(
      await img.evaluate((el) => (el as HTMLImageElement).naturalWidth),
    ).toBeGreaterThan(0);
  }
  await page
    .getByRole("button", { name: "Add Hex Runner 02 to cart", exact: true })
    .click();
  const stored = await page.evaluate(() => {
    const raw = localStorage.getItem("hexshoes.cart.v1");
    return raw ? JSON.parse(raw) : null;
  });
  expect(stored).toHaveLength(1);
  expect(stored[0].image).toBeNull();
  expect(JSON.stringify(stored)).not.toContain("/presentation/");
  await page.goto("/product/HX-01A");
  await expect(
    page.locator(".gallery-main img[data-sample-image=true]"),
  ).toBeVisible();
  await expect(page.getByText("Sample presentation / HX-01A")).toBeVisible();
});

test("hero video respects reduced motion, supports pause and falls back on failure", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(page.locator(".hero-video")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Pause background video", exact: true }),
  ).toBeVisible();
  await page.waitForTimeout(800);
  await page.screenshot({
    path: "verification/phase5/1440/home-video.png",
    fullPage: false,
  });
  await page
    .getByRole("button", { name: "Pause background video", exact: true })
    .click();
  await expect(page.locator(".hero-video")).toHaveJSProperty("paused", true);
  await page
    .getByRole("button", { name: "Play background video", exact: true })
    .click();
  await expect(page.locator(".hero-video")).toHaveJSProperty("paused", false);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".hero-video")).toHaveCount(0);
  await expect(page.locator(".hero-image")).toBeVisible();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(".hero-video")).toHaveCount(0);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.route("**/campaign-running.mp4", (route) => route.abort());
  await page.reload();
  await expect(page.locator(".hero-video")).toHaveCount(0);
  await expect(page.locator(".hero-image")).toBeVisible();
});

for (const width of [1440, 390]) {
  test(`premium visual evidence at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const [name, route] of [
      ["home", "/"],
      ["shop", "/shop"],
      ["product", "/product/HX-01A"],
      ["visual-search", "/visual-search"],
      ["technology", "/technology"],
      ["about", "/about"],
      ["contact", "/contact"],
      ["cart", "/cart"],
      ["wishlist", "/wishlist"],
    ]) {
      await page.goto(route);
      await expect(page.locator(".loading-state")).toHaveCount(0);
      await settlePhotography(page);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBe(width);
      await page.screenshot({
        path: `verification/phase5/${width}/${name}.png`,
        fullPage: true,
      });
    }
    await page.goto("/visual-search");
    await page.getByLabel("Upload shoe image").setInputFiles({
      name: "test_query.jpg",
      mimeType: "image/jpeg",
      buffer: fs.readFileSync("../ai-service/test_query.jpg"),
    });
    await expect(page.locator(".result-tile")).toHaveCount(5, {
      timeout: 90000,
    });
    await settlePhotography(page);
    await page.screenshot({
      path: `verification/phase5/${width}/visual-search-results.png`,
      fullPage: true,
    });
    await page.goto("/shop");
    await expect(page.locator(".prod-card")).toHaveCount(4);
    await page
      .getByRole("button", {
        name: "Add Hex Runner 02 to wishlist",
        exact: true,
      })
      .click();
    await page
      .getByRole("button", { name: "Add Hex Runner 02 to cart", exact: true })
      .click();
    for (const route of ["cart", "wishlist"]) {
      await page.goto(`/${route}`);
      await settlePhotography(page);
      await page.screenshot({
        path: `verification/phase5/${width}/${route}-populated.png`,
        fullPage: true,
      });
    }
    await page
      .getByRole("button", { name: "HEX Assistant", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Find a shoe under $150", exact: true })
      .click();
    await expect(page.locator(".assistant-product")).toHaveCount(3);
    await page.screenshot({
      path: `verification/phase5/${width}/assistant.png`,
      fullPage: true,
    });
    expect(errors).toEqual([]);
  });
}
