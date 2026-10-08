import type { Product } from "../types/product";
import { matchesSearch, productName, displayPrice } from "../utils/product";
export interface AssistantReply {
  text: string;
  ids: string[];
  action?: { to: string; label: string };
}
// Deterministic catalog adapter; a later tool-calling agent can implement this boundary.
export function assistantReply(
  query: string,
  products: Product[],
): AssistantReply {
  const normalized = query.trim().toLowerCase();
  if (/visual search|find my shoe/.test(normalized))
    return {
      text: "Upload a JPG or PNG shoe photograph. CLIP encodes it into a normalized image embedding and ranks catalog references by cosine similarity. Scores are similarity, not confidence. Store product linking remains pending until verified.",
      ids: [],
      action: { to: "/visual-search", label: "Try visual search" },
    };
  if (normalized.startsWith("compare ")) {
    const names = normalized.slice(8).split(/\s+(?:and|vs\.?|versus)\s+/);
    const matches = names.map((name) =>
      products.find((product) =>
        product.name?.toLowerCase().includes(name.trim()),
      ),
    );
    if (
      matches.length !== 2 ||
      !matches[0] ||
      !matches[1] ||
      matches[0].id === matches[1].id
    )
      return {
        text: "Name two different catalog products to compare. I can compare their listed prices and descriptions; fit, performance and unverified attributes are not inferred.",
        ids: [],
      };
    return {
      text:
        matches
          .map(
            (product) =>
              `${productName(product!)} — ${displayPrice(product!)}. ${product!.description ?? "Description pending."}`,
          )
          .join("\n") +
        "\nThis compares recorded facts, not fit or performance.",
      ids: matches.map((product) => product!.id),
    };
  }
  if (/list|current products|current collection|show all/.test(normalized))
    return {
      text: "Here is the current real catalog. Missing product facts remain pending.",
      ids: products.map((product) => product.id),
    };
  const budget = normalized.match(
    /(?:under|below|less than)\s*\$?\s*(\d+(?:\.\d+)?)/,
  );
  let matches: Product[];
  let explanation = "Here are catalog styles that match your request.";
  if (budget) {
    matches = products.filter(
      (product) =>
        product.price !== null &&
        product.currency === "USD" &&
        product.price < Number(budget[1]),
    );
    explanation = `These are listed below USD ${budget[1]}. This is price filtering, not a quality ranking.`;
  } else if (/new drops|newest/.test(normalized)) {
    const tagged = products.filter((product) => product.isNew === true);
    matches = tagged.length ? tagged : products;
    explanation = tagged.length
      ? "These products are marked new in the catalog."
      : "New-drop flags are pending. Here is the current real collection.";
  } else {
    const words = normalized
      .replace(/[^a-z0-9 ]/g, " ")
      .split(/\s+/)
      .filter(
        (word) =>
          word.length > 2 &&
          ![
            "find",
            "help",
            "choose",
            "shoe",
            "shoes",
            "show",
            "best",
            "the",
            "for",
            "and",
            "your",
            "pair",
            "tell",
            "about",
            "what",
            "description",
          ].includes(word),
      );
    matches = products.filter((product) =>
      words.every(
        (word) =>
          matchesSearch(product, word) ||
          product.colors.some((color) => color.toLowerCase().includes(word)),
      ),
    );
    if (matches.length === 1)
      explanation = matches[0]!.description ?? "Product description pending.";
  }
  if (!matches.length)
    return {
      text: "No verified catalog attributes match that request. Try a product name or budget, or use visual search. Missing colors and categories are not guessed.",
      ids: [],
    };
  return { text: explanation, ids: matches.map((product) => product.id) };
}
