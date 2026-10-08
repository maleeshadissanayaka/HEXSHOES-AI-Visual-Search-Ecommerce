import { test, expect } from "@playwright/test";
import fs from "node:fs";
const api = "http://localhost:4000";
const ai = "http://127.0.0.1:8000";

test("canonical real Firestore API and CORS", async ({ request }) => {
  const response = await request.get(`${api}/api/products`, {
    headers: { Origin: "http://localhost:5173" },
  });
  expect(response.status()).toBe(200);
  expect(response.headers()["access-control-allow-origin"]).toBe(
    "http://localhost:5173",
  );
  const products = await response.json();
  expect(products.length).toBeGreaterThan(0);
  for (const product of products) {
    expect(typeof product.id).toBe("string");
    for (const key of [
      "code",
      "description",
      "price",
      "category",
      "gender",
      "image",
      "images",
      "aiImageFilename",
      "availableSizes",
      "colors",
      "stock",
      "isNew",
      "featured",
      "createdAt",
    ])
      expect(product).toHaveProperty(key);
  }
  const untrusted = await request.get(`${api}/api/products`, {
    headers: { Origin: "https://untrusted.example" },
  });
  expect(untrusted.headers()["access-control-allow-origin"]).toBeUndefined();
  expect((await request.get(`${api}/missing`)).status()).toBe(404);
});

test("persistent wishlist/cart, quick view, product search and demo checkout", async ({
  page,
  request,
}) => {
  const products = await (await request.get(`${api}/api/products`)).json();
  const first = products[0];
  await page.goto("/");
  await expect(page.locator(".prod-card")).toHaveCount(
    Math.min(5, products.length),
  );
  await page
    .getByRole("button", { name: `Add ${first.name} to wishlist`, exact: true })
    .click();
  await page.reload();
  await expect(
    page.getByRole("button", {
      name: `Remove ${first.name} from wishlist`,
      exact: true,
    }),
  ).toBeVisible();
  await page.locator(".prod-card").first().hover();
  await page
    .getByRole("button", { name: "Quick View", exact: true })
    .first()
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  expect(
    await page.evaluate(
      () => !!document.activeElement?.closest('[role="dialog"]'),
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "ADD TO CART", exact: true }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "Added to your cart." }),
  ).toBeVisible();
  await page.keyboard.press("Tab");
  expect(
    await page.evaluate(
      () => !!document.activeElement?.closest('[role="dialog"]'),
    ),
  ).toBe(true);
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Quick View", exact: true }).first(),
  ).toBeFocused();
  await page.goto("/cart");
  await expect(page.locator(".cart-line")).toHaveCount(1);
  await page
    .getByRole("button", { name: `Increase ${first.name} quantity` })
    .click();
  await page.reload();
  await expect(page.locator(".quantity-control span")).toHaveText("2");
  await page
    .getByRole("button", { name: "Search products", exact: true })
    .click();
  await page
    .getByRole("searchbox", { name: "Search products" })
    .fill(first.name);
  await expect(page.locator(".search-results>a")).toHaveCount(1);
  await page.locator(".search-results>a").click();
  await expect(page).toHaveURL(new RegExp(`/product/${first.id}`));
  await expect(page.locator(".product-information h1")).toHaveText(first.name);
  await page.goto("/wishlist");
  await expect(page.locator(".prod-card")).toHaveCount(1);
  await page.goto("/checkout");
  for (const [label, value] of [
    ["Full name", "Sample Customer"],
    ["Email", "sample@example.com"],
    ["Phone", "0000000000"],
    ["Address", "Sample Address"],
    ["City", "Sample City"],
    ["Postal code", "00000"],
    ["Country", "Sample Country"],
  ])
    await page.getByLabel(label, { exact: true }).fill(value);
  await page.getByRole("button", { name: "REVIEW DEMO CHECKOUT" }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "No order has been placed" }),
  ).toBeVisible();
  expect(await page.locator('input[name*="card"]').count()).toBe(0);
  await page.goto("/cart");
  await page.getByRole("button", { name: "Clear cart", exact: true }).click();
  await expect(
    page.getByText("Room for your next pair", { exact: true }),
  ).toBeVisible();
});

test("discovery, forms, scripted assistant, pending auth and 404", async ({
  page,
}) => {
  await page.goto("/shop");
  await page.getByRole("searchbox").fill("no-existing-style");
  await expect(
    page.getByText("No styles found", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Clear filters", exact: true })
    .click();
  await expect(page.locator(".prod-card")).toHaveCount(4);
  await page
    .getByRole("combobox", { name: "Sort by", exact: true })
    .selectOption("price-asc");
  await expect(page.locator(".prod-card .price").first()).toContainText("74");
  await page.goto("/account");
  await expect(
    page.getByRole("button", { name: "SIGN IN", exact: true }),
  ).toBeDisabled();
  await page
    .getByRole("button", { name: "Create an account", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "CREATE ACCOUNT", exact: true }),
  ).toBeDisabled();
  await page.goto("/contact");
  await page.getByRole("button", { name: "REVIEW MESSAGE" }).click();
  expect(
    await page
      .locator('input[name="name"]')
      .evaluate((input: HTMLInputElement) => input.validity.valueMissing),
  ).toBe(true);
  await page.getByLabel("Name", { exact: true }).fill("Sample Name");
  await page.getByLabel("Email", { exact: true }).fill("sample@example.com");
  await page.getByLabel("Subject").selectOption("General enquiries");
  await page
    .getByLabel("Message", { exact: true })
    .fill("Sample portfolio enquiry message.");
  await page.getByRole("button", { name: "REVIEW MESSAGE" }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "It has not been sent" }),
  ).toBeVisible();
  await page.goto("/");
  await page
    .getByLabel("Email address", { exact: true })
    .fill("sample@example.com");
  await page.getByRole("button", { name: "SUBSCRIBE", exact: true }).click();
  await expect(
    page
      .getByRole("status")
      .filter({ hasText: "Your email has not been stored" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "HEX Assistant", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Find a shoe under $150", exact: true })
    .click();
  await expect(page.locator(".assistant-message a")).toHaveCount(3);
  await expect(
    page.getByText("This is price filtering, not a quality ranking.", {
      exact: false,
    }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  for (const route of [
    "/men",
    "/women",
    "/new-drops",
    "/about",
    "/technology",
    "/visual-search",
    "/missing-page",
  ]) {
    await page.goto(route);
    await expect(page.locator("main")).not.toBeEmpty();
    await expect(page.locator(".loading-state")).toHaveCount(0);
  }
  await expect(page.getByText("Off the grid.", { exact: true })).toBeVisible();
});

test("real CLIP results and upload hardening", async ({ page, request }) => {
  const health = await (await request.get(`${ai}/health`)).json();
  expect(health.model).toBe("ViT-B-32");
  expect(health.catalogSize).toBe(10);
  for (const [name, mimeType, buffer, status] of [
    ["invalid.txt", "text/plain", Buffer.from("bad"), 415],
    ["invalid.png", "image/png", Buffer.from("bad"), 422],
    ["large.png", "image/png", Buffer.alloc(10 * 1024 * 1024 + 1), 413],
  ] as const) {
    const response = await request.post(`${ai}/search`, {
      multipart: { file: { name, mimeType, buffer } },
    });
    expect(response.status()).toBe(status);
  }
  await page.goto("/visual-search");
  const response = page.waitForResponse((r) => r.url() === `${ai}/search`);
  await page
    .locator("#file-input")
    .setInputFiles("../ai-service/test_query.jpg");
  const body = await (await response).json();
  expect(body.matches).toHaveLength(5);
  expect(body.metric).toBe("cosine_similarity");
  expect(
    body.matches.every(
      (m: { score: number }, i: number) =>
        i === 0 || m.score <= body.matches[i - 1].score,
    ),
  ).toBe(true);
  await expect(page.locator(".result-tile")).toHaveCount(5);
  await expect(
    page.getByText("Product mapping pending", { exact: true }),
  ).toHaveCount(5);
  await page.locator(".results").scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      page
        .locator(".result-tile img")
        .evaluateAll((images: HTMLImageElement[]) =>
          images.every((image) => image.complete && image.naturalWidth > 0),
        ),
    )
    .toBe(true);
  fs.mkdirSync("verification", { recursive: true });
  fs.writeFileSync(
    "verification/platform-ai-results.json",
    JSON.stringify(body, null, 2),
  );
  await page
    .locator("#ai-search")
    .screenshot({ path: "verification/platform-ai-1440.png" });
});

for (const width of [1440, 1366, 1024, 768, 390])
  test(`responsive ${width}: routes, menu, filters and genuine drag/drop`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/");
    await expect(page.locator(".prod-card")).toHaveCount(4);
    await page.evaluate(() => document.fonts.ready);
    for (
      let y = 0;
      y < (await page.evaluate(() => document.documentElement.scrollHeight));
      y += 600
    ) {
      await page.evaluate((y) => scrollTo(0, y), y);
      await page.waitForTimeout(70);
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(300);
    await page.screenshot({
      path: `verification/platform-home-${width}.png`,
      fullPage: true,
    });
    if (width <= 1024) {
      await page.getByRole("button", { name: "Menu", exact: true }).click();
      await expect(
        page.getByRole("dialog", { name: "Navigation menu" }),
      ).toBeVisible();
      await page
        .getByRole("navigation", { name: "Mobile navigation" })
        .getByRole("link", { name: "MEN", exact: true })
        .click();
      await expect(page).toHaveURL("/men");
    }
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const route of [
      "/shop",
      "/men",
      "/women",
      "/new-drops",
      "/wishlist",
      "/cart",
      "/checkout",
      "/account",
      "/contact",
      "/about",
      "/technology",
      "/visual-search",
      "/product/HX-01A",
      "/missing-page",
    ]) {
      await page.goto(route);
      await expect(page.locator(".loading-state")).toHaveCount(0);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(200);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBe(width);
      await page.screenshot({
        path: `test-results/phase4/${width}/${route.replaceAll("/", "-")}.png`,
        fullPage: true,
      });
    }
    if (width <= 768) {
      await page.goto("/shop");
      await page.getByRole("button", { name: "FILTER & SORT" }).click();
      await expect(
        page.getByRole("dialog", { name: "Filter products" }),
      ).toBeVisible();
      await page.getByRole("dialog").getByRole("searchbox").fill("no-style");
      await page.getByRole("button", { name: "SHOW 0 PRODUCTS" }).click();
      await expect(
        page.getByText("No styles found", { exact: true }),
      ).toBeVisible();
    }
    if (width === 390) {
      await page.goto("/visual-search");
      const bytes = fs
        .readFileSync("../ai-service/test_query.jpg")
        .toString("base64");
      const response = page.waitForResponse((r) => r.url() === `${ai}/search`);
      await page.locator(".drop-zone").evaluate((zone, bytes) => {
        const data = new DataTransfer();
        data.items.add(
          new File(
            [Uint8Array.from(atob(bytes), (c) => c.charCodeAt(0))],
            "dropped.jpg",
            { type: "image/jpeg" },
          ),
        );
        zone.dispatchEvent(
          new DragEvent("drop", { bubbles: true, dataTransfer: data }),
        );
      }, bytes);
      expect((await response).status()).toBe(200);
      await expect(page.locator(".result-tile")).toHaveCount(5);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBe(width);
      await page
        .locator("#ai-search")
        .screenshot({ path: "verification/platform-ai-390.png" });
    }
    expect(errors).toEqual([]);
  });
