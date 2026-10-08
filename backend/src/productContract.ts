export interface StoreProduct {
  id: string
  code: string | null
  name: string | null
  description: string | null
  price: number | null
  currency: string | null
  category: string | null
  gender: string | null
  image: string | null
  images: string[]
  aiImageFilename: string | null
  availableSizes: (string | number)[]
  colors: string[]
  stock: number | null
  isNew: boolean | null
  featured: boolean | null
  createdAt: string | null
}
const text = (value: unknown): string | null => typeof value === 'string' && value.trim() ? value.trim() : null
const strings = (value: unknown): string[] => Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string' && !!item.trim()) : []
export function productFromDocument(id: string, data: Record<string, unknown>): StoreProduct {
  // Explicit compatibility for the existing catalog's desc and dollar-price fields.
  const legacyPrice = typeof data.price === 'string' ? data.price.match(/^\$(\d+(?:\.\d{1,2})?)$/) : null
  const numericPrice = typeof data.price === 'number' ? data.price : legacyPrice ? Number(legacyPrice[1]) : null
  const price = numericPrice !== null && Number.isFinite(numericPrice) && numericPrice >= 0 ? numericPrice : null
  const created = data.createdAt as { toDate?: () => Date } | undefined
  let createdAt: string | null = null
  if (typeof created?.toDate === 'function') createdAt = created.toDate().toISOString()
  else if (typeof data.createdAt === 'string' && !Number.isNaN(Date.parse(data.createdAt))) createdAt = new Date(data.createdAt).toISOString()
  return {
    id, code: text(data.code), name: text(data.name), description: text(data.description) ?? text(data.desc),
    price, currency: text(data.currency) ?? (legacyPrice ? 'USD' : null),
    category: text(data.category), gender: text(data.gender), image: text(data.image), images: strings(data.images),
    aiImageFilename: text(data.aiImageFilename),
    availableSizes: Array.isArray(data.availableSizes) ? data.availableSizes.filter((size): size is string | number => (typeof size === 'number' && Number.isFinite(size)) || (typeof size === 'string' && !!size.trim())) : [],
    colors: strings(data.colors), stock: typeof data.stock === 'number' && Number.isInteger(data.stock) && data.stock >= 0 ? data.stock : null,
    isNew: typeof data.isNew === 'boolean' ? data.isNew : null,
    featured: typeof data.featured === 'boolean' ? data.featured : null, createdAt,
  }
}
