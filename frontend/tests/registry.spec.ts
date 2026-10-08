import { test, expect } from "@playwright/test";
import type { Product } from "../src/types/product.js";

// Isolated synthetic fixtures exercise unavailable live mapping/variant branches.
// They are never written to Firestore, the registry, or production API responses.
const fixtureProduct = (id: string, name: string): Product => ({
  id,
  name,
  code: null,
  description: "Synthetic browser-test product",
  price: 50,
  currency: "USD",
  category: null,
  gender: null,
  image: "/editorial/trail.webp",
  images: [],
  aiImageFilename: "shoe1.jpg",
  availableSizes: ["S", "M"],
  colors: ["Red", "Blue"],
  stock: 10,
  isNew: null,
  featured: null,
  createdAt: null,
});

test("live Firestore catalog and genuine CLIP upload preserve canonical identities", async ({
  page,
  request,
}) => {
  const response = await request.get("http://localhost:4000/api/products");
  expect(response.status()).toBe(200);
  const products: Product[] = await response.json();
  expect(products.length).toBeGreaterThan(0);
  for (const product of products) {
    for (const key of [
      "id",
      "code",
      "name",
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
      "createdAt",
    ])
      expect(product).toHaveProperty(key);
  }
  await page.goto("/shop");
  await expect(page.locator(".prod-card")).toHaveCount(products.length);
  const product = products[0]!;
  await page.goto(`/product/${encodeURIComponent(product.id)}`);
  await expect(page.locator(".product-information h1")).toHaveText(
    product.name || "Unnamed product",
  );
  const health = await (
    await request.get("http://127.0.0.1:8000/health")
  ).json();
  expect(health.status).toBe("ready");
  expect(health.model).toBe("ViT-B-32");
  expect(health.unmappedCatalogImages).toBe(
    health.catalogSize - health.mappedProducts,
  );
  await page.goto("/visual-search");
  const ranking = page.waitForResponse(
    (r) => r.url() === "http://127.0.0.1:8000/search",
  );
  await page
    .locator("#file-input")
    .setInputFiles("../ai-service/test_query.jpg");
  const search = await ranking;
  expect(search.status()).toBe(200);
  const data = await search.json();
  expect(data.metric).toBe("cosine_similarity");
  expect(data.matches).toHaveLength(Math.min(5, health.catalogSize));
  for (const [index, match] of data.matches.entries()) {
    expect(Number.isFinite(match.score)).toBe(true);
    if (index > 0)
      expect(match.score).toBeLessThanOrEqual(data.matches[index - 1].score);
    if (match.productId !== null) {
      expect(
        products.some(
          (p) =>
            p.id === match.productId && p.aiImageFilename === match.filename,
        ),
      ).toBe(true);
    }
  }
  await expect(page.locator(".result-tile")).toHaveCount(data.matches.length);
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
  const unmapped = data.matches.filter(
    (match: { productId: string | null }) => match.productId === null,
  );
  await expect(
    page.getByText("Product mapping pending", { exact: true }),
  ).toHaveCount(unmapped.length);
});

test("isolated mapped result, unmapped result, and safe product navigation", async ({
  page,
}) => {
  const product = fixtureProduct("fixture-product-a", "Synthetic fixture A");
  await page.route("http://localhost:4000/api/products", (route) =>
    route.fulfill({ json: [product] }),
  );
  await page.route("http://127.0.0.1:8000/search", (route) =>
    route.fulfill({
      json: {
        metric: "cosine_similarity",
        matches: [
          { filename: "shoe1.jpg", score: 0.9, productId: product.id },
          { filename: "shoe2.jpg", score: 0.8, productId: null },
          // A product ID without agreement from the backend is also kept unmapped.
          { filename: "shoe3.jpg", score: 0.7, productId: product.id },
          { filename: "shoe4.jpg", score: 0.6, productId: "unknown-fixture" },
        ],
      },
    }),
  );
  await page.goto("/visual-search");
  await page
    .locator("#file-input")
    .setInputFiles("../ai-service/test_query.jpg");
  const mapped = page.locator(".result-tile").first();
  await expect(mapped).toContainText(product.name!);
  await expect(mapped).toContainText("$50.00");
  await expect(mapped).toContainText("0.9000 similarity");
  await expect(mapped.locator("img")).toHaveAttribute("src", product.image!);
  await expect(page.locator(".result-tile")).toHaveCount(4);
  await expect(
    page.getByText("Catalog reference", { exact: true }),
  ).toHaveCount(3);
  await expect(page.locator(".result-tile a")).toHaveCount(1);
  await mapped.getByRole("link", { name: "View Product" }).click();
  await expect(page).toHaveURL(`/product/${product.id}`);
  await expect(page.locator(".product-information h1")).toHaveText(
    product.name!,
  );
});

test("product route resets quantity, size and color; Contact copy is corrected", async ({
  page,
}) => {
  const first = fixtureProduct("fixture-product-a", "Synthetic fixture A");
  const second = fixtureProduct("fixture-product-b", "Synthetic fixture B");
  await page.route("http://localhost:4000/api/products", (route) =>
    route.fulfill({ json: [first, second] }),
  );
  await page.goto(`/product/${first.id}`);
  await page.getByLabel("Quantity", { exact: true }).fill("3");
  await page.getByRole("button", { name: "M", exact: true }).click();
  await page.getByRole("button", { name: "Red", exact: true }).click();
  await expect(
    page.locator('.product-options button[aria-pressed="true"]'),
  ).toHaveCount(2);
  await page
    .getByRole("button", { name: "Search products", exact: true })
    .click();
  await page
    .getByRole("searchbox", { name: "Search products", exact: true })
    .fill(second.name!);
  await page.locator(".search-results>a").click();
  await expect(page).toHaveURL(`/product/${second.id}`);
  await expect(page.getByLabel("Quantity", { exact: true })).toHaveValue("1");
  await expect(
    page.locator('.product-options button[aria-pressed="true"]'),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "ADD TO CART", exact: true }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "Select an available size." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "S", exact: true }).click();
  await page.getByRole("button", { name: "ADD TO CART", exact: true }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "Select an available color." }),
  ).toBeVisible();
  await page.goto("/contact");
  await expect(page.locator("main .eyebrow").first()).toHaveText(
    "LET'S CONNECT",
  );
});
