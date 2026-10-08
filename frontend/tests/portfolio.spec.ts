import { test, expect } from "@playwright/test";
import fs from "node:fs";

for (const width of [1440, 390]) {
  test(`portfolio keyboard discovery and assistant at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/shop");
    if (width <= 768)
      await page.getByRole("button", { name: "FILTER & SORT" }).click();
    for (const name of ["Category", "Gender", "Size", "Color"])
      await expect(
        page.getByRole("combobox", { name, exact: true }),
      ).toBeDisabled();
    if (width <= 768)
      await page.getByRole("button", { name: "SHOW 4 PRODUCTS" }).click();
    await page
      .getByRole("button", { name: "Search products", exact: true })
      .click();
    await expect(page.locator("#global-search")).toBeFocused();
    await expect(page.locator("#root")).toHaveAttribute("inert", "");
    await page
      .getByRole("searchbox", { name: "Search products", exact: true })
      .fill("Hex");
    await expect(page.locator(".search-results>a")).toHaveCount(4);
    await page.keyboard.press("ArrowDown");
    await expect(page.locator(".search-results>a").first()).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(page.locator(".search-results>a").nth(1)).toBeFocused();
    await page.keyboard.press("ArrowUp");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL("/product/HX-01A");
    await expect(page.locator("#root")).not.toHaveAttribute("inert", "");
    await page
      .getByRole("button", { name: "HEX Assistant", exact: true })
      .click();
    await expect(
      page.getByText("Catalog-based assistant · Advanced AI agent planned", {
        exact: true,
      }),
    ).toBeVisible();
    await page
      .getByRole("button", {
        name: "Compare Hex Runner and Hex Mono",
        exact: true,
      })
      .click();
    const answer = page.locator(".assistant-message.assistant").last();
    await expect(answer).toContainText("Low-profile, matte canvas");
    await expect(answer).toContainText("Tonal knit, sock-fit");
    await expect(answer).toContainText("$128.00");
    await expect(answer).toContainText("$142.00");
    await expect(answer.locator("a")).toHaveCount(2);
    await page
      .getByRole("button", { name: "Show New Drops", exact: true })
      .click();
    await expect(
      page.locator(".assistant-message.assistant").last(),
    ).toContainText("flags are pending");
    await page
      .getByRole("button", { name: "What is visual search?", exact: true })
      .click();
    await page
      .getByRole("link", { name: "Try visual search", exact: true })
      .click();
    await expect(page).toHaveURL("/visual-search");
    await page
      .getByRole("button", { name: "Search products", exact: true })
      .click();
    await page.keyboard.press("Escape");
    await expect(
      page.getByRole("button", { name: "Search products", exact: true }),
    ).toBeFocused();
    await page.goto("/technology");
    await expect(
      page.getByText("React + TypeScript", { exact: true }),
    ).toBeVisible();
    await expect(page.locator("main")).toContainText("512-dimensional");
    await expect(page.locator("#roadmap article")).toHaveCount(5);
    await page.goto("/");
    await expect(page.locator(".intelligence-feature")).toHaveCount(1);
    await expect(
      page.locator(".intelligence-secondary .intelligence-card"),
    ).toHaveCount(2);
    await expect(page.locator(".intelligence-research a")).toHaveCount(3);
    await page.getByRole("button", { name: "WATCH FILM", exact: true }).click();
    await expect(
      page.getByRole("dialog", { name: "Campaign preview" }),
    ).toBeVisible();
    await expect(page.locator("#root")).toHaveAttribute("inert", "");
    await page.keyboard.press("Escape");
    await expect(
      page.getByRole("button", { name: "WATCH FILM", exact: true }),
    ).toBeFocused();
  });

  test(`portfolio forms, local data and accessible labels at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() =>
      localStorage.setItem(
        "hexshoes.cart.v1",
        JSON.stringify([
          { productId: "HX-01A", price: -1, quantity: 1000, image: {} },
        ]),
      ),
    );
    await page.goto("/cart");
    await page.reload();
    await expect(
      page.getByText("Room for your next pair", { exact: true }),
    ).toBeVisible();
    await page.goto("/product/HX-01A");
    await page
      .getByRole("button", { name: "Add to wishlist", exact: true })
      .click();
    await page
      .getByRole("button", { name: "ADD TO CART", exact: true })
      .click();
    await page.goto("/checkout");
    await expect(page.locator("main")).toContainText(
      "not a server-verified quote",
    );
    for (const [label, value] of [
      ["Full name", "Sample Customer"],
      ["Email", "sample@example.com"],
      ["Phone", "0000000000"],
      ["Address", "Sample Address"],
      ["City", "Sample City"],
      ["Postal code", "00000"],
      ["Country", "Sample Country"],
    ])
      await page.getByLabel(label!, { exact: true }).fill(value!);
    await page.getByLabel("Phone", { exact: true }).fill("letters-only");
    await page.getByRole("button", { name: "REVIEW DEMO CHECKOUT" }).click();
    expect(
      await page
        .getByLabel("Phone", { exact: true })
        .evaluate((input: HTMLInputElement) => input.validity.patternMismatch),
    ).toBe(true);
    await page.getByLabel("Phone", { exact: true }).fill("0000000000");
    await page.getByRole("button", { name: "REVIEW DEMO CHECKOUT" }).click();
    await expect(
      page.getByRole("status").filter({ hasText: "No order has been placed" }),
    ).toBeVisible();
    await page.getByLabel("City", { exact: true }).fill("Changed Sample City");
    await expect(
      page.getByRole("status").filter({ hasText: "No order has been placed" }),
    ).toHaveCount(0);
    for (const route of [
      "/",
      "/shop",
      "/product/HX-01A",
      "/wishlist",
      "/cart",
      "/checkout",
      "/visual-search",
      "/about",
      "/technology",
      "/contact",
      "/account",
      "/missing-page",
    ]) {
      await page.goto(route, { waitUntil: "networkidle" });
      await expect(page.locator(".loading-state")).toHaveCount(0);
      const issues = await page.evaluate(() => {
        const issues: string[] = [];
        for (const image of document.querySelectorAll("img"))
          if (!image.hasAttribute("alt")) issues.push("Image missing alt");
        for (const input of document.querySelectorAll(
          "input,select,textarea",
        )) {
          const field = input as HTMLInputElement;
          if (
            field.type !== "hidden" &&
            !field.labels?.length &&
            !field.getAttribute("aria-label") &&
            !field.getAttribute("aria-labelledby")
          )
            issues.push("Form control missing label");
        }
        for (const button of document.querySelectorAll("button"))
          if (
            !button.textContent?.trim() &&
            !button.getAttribute("aria-label") &&
            !button.getAttribute("aria-labelledby")
          )
            issues.push("Button missing name");
        return issues;
      });
      expect(issues, route).toEqual([]);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
        route,
      ).toBe(width);
      if (["/wishlist", "/cart", "/checkout"].includes(route))
        await page.screenshot({
          path: `test-results/phase4/${width}/populated-${route.slice(1)}.png`,
          fullPage: true,
        });
    }
    await page.goto("/contact");
    for (const [label, value] of [
      ["Name", "   "],
      ["Email", "sample@example.com"],
      ["Message", "Sample portfolio enquiry message."],
    ])
      await page.getByLabel(label!, { exact: true }).fill(value!);
    await page.getByLabel("Subject").selectOption("General enquiries");
    await page.getByRole("button", { name: "REVIEW MESSAGE" }).click();
    expect(
      await page
        .getByLabel("Name", { exact: true })
        .evaluate((input: HTMLInputElement) => input.validity.customError),
    ).toBe(true);
    await page.getByLabel("Name", { exact: true }).fill("Sample Customer");
    await page.getByRole("button", { name: "REVIEW MESSAGE" }).click();
    await expect(
      page.getByRole("status").filter({
        hasText: "Message form demo — delivery integration pending",
      }),
    ).toBeVisible();
  });
}

test("AI endpoint rejects unsafe extensions, empty/corrupt images and disguised GIFs", async ({
  request,
}) => {
  const cases = [
    {
      name: "photo.exe",
      mimeType: "image/jpeg",
      buffer: fs.readFileSync("../ai-service/test_query.jpg"),
      expected: 415,
    },
    {
      name: "empty.jpg",
      mimeType: "image/jpeg",
      buffer: Buffer.alloc(0),
      expected: 422,
    },
    {
      name: "corrupt.jpg",
      mimeType: "image/jpeg",
      buffer: Buffer.from([0xff, 0xd8, 0xff]),
      expected: 422,
    },
    {
      name: "disguised.png",
      mimeType: "image/png",
      buffer: Buffer.from(
        "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        "base64",
      ),
      expected: 415,
    },
  ];
  for (const { expected, ...file } of cases) {
    const response = await request.post("http://127.0.0.1:8000/search", {
      multipart: { file },
    });
    expect(response.status()).toBe(expected);
    const text = await response.text();
    expect(text).not.toMatch(/Traceback|serviceAccount|site-packages/);
  }
});
