import { readFileSync } from 'node:fs'
import type { StoreProduct } from './productContract.js'

interface VerifiedLink {
  filename: string
  productCode: string | null
  storeImage: string | null
}
const object = (value: unknown): Record<string, unknown> => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid registry entry.')
  return value as Record<string, unknown>
}
const nullableText = (value: unknown): string | null => {
  if (value === null || value === undefined) return null
  if (typeof value !== 'string' || !value.trim()) throw new Error('Invalid registry metadata.')
  return value
}

export function parseRegistry(value: unknown, filenames: Set<string>): Map<string, VerifiedLink> {
  const registry = object(value)
  if (registry.schemaVersion !== 1 || !Array.isArray(registry.products) || !Array.isArray(registry.catalogImages)) {
    throw new Error('Unsupported product-image registry schema.')
  }
  const products = new Map<string, { productCode: string | null; storeImage: string | null }>()
  for (const value of registry.products) {
    const product = object(value)
    const id = nullableText(product.productId)
    if (!id || products.has(id)) throw new Error('Registry product IDs must be unique nonempty strings.')
    nullableText(product.name)
    products.set(id, { productCode: nullableText(product.productCode), storeImage: nullableText(product.storeImage) })
  }
  const seen = new Set<string>()
  const links = new Map<string, VerifiedLink>()
  for (const value of registry.catalogImages) {
    const image = object(value)
    const filename = nullableText(image.aiImageFilename)
    if (!filename || !filenames.has(filename) || seen.has(filename)) throw new Error('Registry filenames must be unique catalog entries.')
    seen.add(filename)
    if (typeof image.verified !== 'boolean') throw new Error('Every registry image must explicitly declare verified.')
    if (!image.verified) {
      if (image.productId !== null || image.evidence !== null) throw new Error('Unresolved images must have null productId and evidence.')
      continue
    }
    const id = nullableText(image.productId)
    const product = id ? products.get(id) : undefined
    if (!id || !product || links.has(id)) throw new Error('Verified images require a unique registered product ID.')
    if (!nullableText(image.evidence)) throw new Error('Verified mappings require documented confirmation evidence.')
    links.set(id, { filename, ...product })
  }
  if (seen.size !== filenames.size) throw new Error('Every catalog image must be explicitly listed in the registry.')
  return links
}

export function loadProductImageRegistry(): Map<string, VerifiedLink> {
  const registry: unknown = JSON.parse(readFileSync(new URL('../../ai-service/product_mapping.json', import.meta.url), 'utf8'))
  const catalog: { filename: string }[] = JSON.parse(readFileSync(new URL('../../ai-service/catalog_embeddings.json', import.meta.url), 'utf8'))
  return parseRegistry(registry, new Set(catalog.map(item => item.filename)))
}

export function applyProductImageRegistry(products: StoreProduct[], links: Map<string, VerifiedLink>): StoreProduct[] {
  const ids = new Set(products.map(product => product.id))
  for (const id of links.keys()) {
    if (!ids.has(id)) throw new Error('Registry references a product missing from Firestore.')
  }
  return products.map(product => {
    const link = links.get(product.id)
    if (!link) return { ...product, aiImageFilename: null }
    if ((product.aiImageFilename && product.aiImageFilename !== link.filename) ||
        (product.code && link.productCode && product.code !== link.productCode) ||
        (product.image && link.storeImage && product.image !== link.storeImage)) {
      throw new Error('Registry conflicts with Firestore product metadata.')
    }
    return { ...product, code: product.code ?? link.productCode, image: product.image ?? link.storeImage, aiImageFilename: link.filename }
  })
}
