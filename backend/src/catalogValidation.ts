import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseRegistry } from './productImageRegistry.js'
import type { StoreProduct } from './productContract.js'

export const catalogFields = ['id', 'code', 'name', 'description', 'price', 'currency', 'category', 'gender', 'image', 'images', 'aiImageFilename', 'availableSizes', 'colors', 'stock', 'isNew', 'featured', 'createdAt'] as const
export interface CatalogManifest { schemaVersion: number; products: StoreProduct[] }
interface Options { requireImages?: boolean; imageExists?: (url: string, id: string) => boolean }
const record = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value)
const text = (value: unknown): value is string => typeof value === 'string' && !!value.trim() && value === value.trim()

export function validateCatalog(manifest: unknown, registry: unknown, filenames: string[], options: Options = {}) {
  const errors: string[] = []
  const warnings: string[] = []
  const unresolved: { id: string; fields: string[] }[] = []
  const ids = new Set<string>(), codes = new Set<string>(), aiNames = new Set<string>()
  if (!record(manifest) || manifest.schemaVersion !== 1 || !Array.isArray(manifest.products)) {
    return { errors: ['Manifest must have schemaVersion 1 and a products array.'], warnings, unresolved }
  }
  let links: ReturnType<typeof parseRegistry> = new Map()
  try { links = parseRegistry(registry, new Set(filenames)) }
  catch (error) { errors.push(`AI registry: ${error instanceof Error ? error.message : 'Invalid registry.'}`) }
  if (new Set(filenames).size !== filenames.length) errors.push('Duplicate AI embedding filenames.')
  for (const [index, product] of manifest.products.entries()) {
    const label = record(product) && text(product.id) ? product.id : `record ${index + 1}`
    const issue = (message: string) => errors.push(`${label}: ${message}`)
    if (!record(product)) { issue('Product must be an object.'); continue }
    for (const field of catalogFields) if (!Object.hasOwn(product, field)) issue(`Missing field ${field}.`)
    for (const field of Object.keys(product)) if (!(catalogFields as readonly string[]).includes(field)) issue(`Unsupported field ${field}.`)
    if (!text(product.id)) issue('Invalid or missing canonical ID.')
    else { if (ids.has(product.id)) issue('Duplicate product ID.'); ids.add(product.id) }
    if (!text(product.name)) issue('Missing or invalid name.')
    if (typeof product.price !== 'number' || !Number.isFinite(product.price) || product.price < 0) issue('Price must be a finite nonnegative number.')
    for (const field of ['code', 'description', 'category', 'gender', 'image', 'aiImageFilename']) {
      if (product[field] !== null && !text(product[field])) issue(`${field} must be null or a nonempty string without surrounding whitespace.`)
    }
    if (product.currency !== null && (typeof product.currency !== 'string' || !/^[A-Z]{3}$/.test(product.currency))) issue('Currency must be null or a three-letter uppercase code.')
    if (text(product.code)) { if (codes.has(product.code)) issue('Duplicate product code.'); codes.add(product.code) }
    for (const field of ['images', 'colors']) {
      if (!Array.isArray(product[field]) || !product[field].every(text)) issue(`${field} must be an array of nonempty strings.`)
    }
    if (!Array.isArray(product.availableSizes) || !product.availableSizes.every(size => text(size) || (typeof size === 'number' && Number.isFinite(size) && size > 0))) issue('availableSizes must contain valid strings or positive finite numbers.')
    if (product.stock !== null && (typeof product.stock !== 'number' || !Number.isInteger(product.stock) || product.stock < 0)) issue('Stock must be null or a nonnegative integer.')
    for (const field of ['isNew', 'featured']) if (product[field] !== null && typeof product[field] !== 'boolean') issue(`${field} must be null or boolean.`)
    if (product.createdAt !== null && (!text(product.createdAt) || !/^\d{4}-\d{2}-\d{2}T/.test(product.createdAt) || Number.isNaN(Date.parse(product.createdAt)))) issue('createdAt must be null or an ISO date-time string.')
    const imageExpected = options.requireImages || (Array.isArray(product.images) && product.images.length > 0) || text(product.aiImageFilename)
    if (imageExpected && !text(product.image)) issue('Primary image is required when images are expected.')
    const images = [product.image, ...(Array.isArray(product.images) ? product.images : [])].filter(text)
    for (const image of images) if (options.imageExists && !options.imageExists(image, label)) issue(`Image must exist under this product folder with its ID in the filename: ${image}`)
    const link = links.get(label)
    if (text(product.aiImageFilename)) {
      if (aiNames.has(product.aiImageFilename)) issue('Duplicate AI filename.')
      aiNames.add(product.aiImageFilename)
      if (!filenames.includes(product.aiImageFilename)) issue('AI filename is not covered by the embedding catalog.')
      if (!link || link.filename !== product.aiImageFilename) issue('AI filename lacks a matching verified registry assignment.')
    } else if (link) issue('Verified registry assignment is missing from the manifest.')
    if (link && ((link.productCode && link.productCode !== product.code) || (link.storeImage && link.storeImage !== product.image))) issue('Manifest conflicts with verified registry metadata.')
    const fields = catalogFields.filter(field => product[field] === null || (Array.isArray(product[field]) && product[field].length === 0))
    unresolved.push({ id: label, fields })
    if (fields.length) warnings.push(`${label}: unresolved fields: ${fields.join(', ')}.`)
  }
  if (record(registry) && Array.isArray(registry.products)) {
    for (const product of registry.products) if (record(product) && text(product.productId) && !ids.has(product.productId)) errors.push(`Registry product ${product.productId} is missing from the manifest.`)
  }
  for (const id of links.keys()) if (!ids.has(id)) errors.push(`Verified mapping references missing manifest product ${id}.`)
  const mapped = new Set([...links.values()].map(link => link.filename))
  const unmapped = filenames.filter(filename => !mapped.has(filename))
  if (unmapped.length) warnings.push(`Unresolved AI catalog mappings: ${unmapped.join(', ')}.`)
  return { errors, warnings, unresolved }
}

export function loadCatalogInputs() {
  const root = fileURLToPath(new URL('../../', import.meta.url))
  const load = (path: string): unknown => JSON.parse(readFileSync(resolve(root, path), 'utf8'))
  const manifest = load('catalog/products.json')
  const registry = load('ai-service/product_mapping.json')
  const embeddings = load('ai-service/catalog_embeddings.json')
  if (!Array.isArray(embeddings) || !embeddings.every(item => record(item) && text(item.filename))) throw new Error('Invalid AI embedding catalog filenames.')
  const filenames: string[] = embeddings.map(item => item.filename)
  const imageExists = (url: string, id: string) => {
    const prefix = `/products/${id}/`
    if (!url.startsWith(prefix) || /[?#\\]/.test(url)) return false
    const basename = url.slice(prefix.length)
    if (!basename.includes(id) || basename.includes('/') || !/\.(jpe?g|png|webp)$/i.test(basename)) return false
    const productsRoot = resolve(root, 'frontend/public/products')
    const directory = resolve(productsRoot, id)
    if (!directory.startsWith(productsRoot + sep)) return false
    const path = resolve(directory, basename)
    return path.startsWith(directory + sep) && existsSync(path) && statSync(path).isFile()
  }
  const files = readdirSync(resolve(root, 'ai-service/catalog_images')).filter(name => /\.(jpe?g|png|webp)$/i.test(name))
  const report = validateCatalog(manifest, registry, filenames, { imageExists })
  for (const filename of filenames) if (!files.includes(filename)) report.errors.push(`AI embedding image file is missing: ${filename}`)
  for (const filename of files) if (!filenames.includes(filename)) report.errors.push(`AI image lacks embedding coverage: ${filename}`)
  return { manifest, registry, filenames, imageExists, report }
}
