import type { Product } from "../types/product";
import { matchesSearch } from "../utils/product";
export function assistantReply(
  query: string,
  products: Product[],
): { text: string; ids: string[] } {
  const normalized = query.toLowerCase();
  const budget = normalized.match(
    /(?:under|below|less than)\s*\$?\s*(\d+(?:\.\d+)?)/,
  );
  let matches = products;
  let explanation = "Here are catalog styles that match your request.";
  if (budget) {
    matches = matches.filter(
      (p) =>
        p.price !== null && p.currency === "USD" && p.price < Number(budget[1]),
    );
    explanation = `These are listed below USD ${budget[1]}. This is price filtering, not a quality ranking.`;
  } else if (/new drops|newest/.test(normalized)) {
    const tagged = products.filter((p) => p.isNew === true);
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
          ].includes(word),
      );
    matches = products.filter((p) =>
      words.every(
        (word) =>
          matchesSearch(p, word) ||
          p.colors.some((c) => c.toLowerCase().includes(word)),
      ),
    );
  }
  if (!matches.length)
    return {
      text: "No verified catalog attributes match that request. Try a product name or budget, or use visual search. Missing colors and categories are not guessed.",
      ids: [],
    };
  return { text: explanation, ids: matches.slice(0, 3).map((p) => p.id) };
}
