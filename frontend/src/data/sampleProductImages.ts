/** Temporary presentation imagery only. Never use this registry for catalog,
 * Firestore, cart records, product ownership or CLIP image assignments. */
export const sampleProductImages: Record<
  string,
  {
    src: string;
    isSampleImage: true;
  }
> = {
  "HX-01A": { src: "/presentation/products/runner.webp", isSampleImage: true },
  "HX-02F": { src: "/presentation/products/trail.webp", isSampleImage: true },
  "HX-03C": { src: "/presentation/products/slide.webp", isSampleImage: true },
  "HX-04E": { src: "/presentation/products/mono.webp", isSampleImage: true },
};
