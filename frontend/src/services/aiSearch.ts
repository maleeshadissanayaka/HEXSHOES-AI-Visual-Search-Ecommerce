import type { VisualMatch } from "../types/product";
import { AI_API_URL } from "./config";
export function validateShoeImage(file: File): string | null {
  if (!["image/jpeg", "image/png"].includes(file.type))
    return "Please upload a JPG or PNG image.";
  if (file.size > 10 * 1024 * 1024)
    return "Please choose an image smaller than 10 MB.";
  if (!file.size) return "Please choose an image that is not empty.";
  return null;
}
export async function searchImage(
  file: File,
  signal?: AbortSignal,
): Promise<VisualMatch[]> {
  const validation = validateShoeImage(file);
  if (validation) throw new Error(validation);
  const form = new FormData();
  form.append("file", file);
  const response = await fetch(`${AI_API_URL}/search`, {
    method: "POST",
    body: form,
    signal: signal ?? AbortSignal.timeout(120000),
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(
      typeof data.detail === "string"
        ? data.detail
        : "Visual search is temporarily unavailable.",
    );
  if (
    !Array.isArray(data.matches) ||
    !data.matches.every(
      (m: VisualMatch) =>
        typeof m.filename === "string" &&
        Number.isFinite(m.score) &&
        (m.productId === null ||
          (typeof m.productId === "string" && m.productId.length > 0)),
    )
  )
    throw new Error("Invalid visual-search response.");
  return data.matches;
}
export const catalogImage = (filename: string) =>
  `${AI_API_URL}/catalog/${encodeURIComponent(filename)}`;
