import test from 'node:test'
import assert from 'node:assert/strict'
import { parseRegistry, loadProductImageRegistry, applyProductImageRegistry } from '../src/productImageRegistry.js'
import { productFromDocument } from '../src/productContract.js'

const fixture = () => ({ schemaVersion: 1,
  products: [{ productId: 'fixture-product', productCode: null, storeImage: '/fixture.jpg' }],
  catalogImages: [
    { aiImageFilename: 'fixture.jpg', productId: 'fixture-product' as string | null, verified: true, evidence: 'Synthetic unit-test fixture' as string | null },
    { aiImageFilename: 'unmapped.jpg', productId: null as string | null, verified: false, evidence: null as string | null }
  ]
})
const filenames = new Set(['fixture.jpg', 'unmapped.jpg'])

test('production registry contains no verified assignments', () => {
  assert.equal(loadProductImageRegistry().size, 0)
})
test('verified fixture enriches the contract without mutating source data', () => {
  const product = productFromDocument('fixture-product', { name: 'Fixture', price: 50, currency: 'USD' })
  const [mapped] = applyProductImageRegistry([product], parseRegistry(fixture(), filenames))
  assert.equal(mapped?.aiImageFilename, 'fixture.jpg')
  assert.equal(mapped?.image, '/fixture.jpg')
  assert.equal(product.image, null)
  assert.equal(product.aiImageFilename, null)
})
test('unverified Firestore filename cannot bypass the registry', () => {
  const product = productFromDocument('fixture-product', { aiImageFilename: 'fixture.jpg' })
  assert.equal(applyProductImageRegistry([product], new Map())[0]?.aiImageFilename, null)
})
test('invalid and ambiguous assignments are rejected', () => {
  for (const change of [
    (r: ReturnType<typeof fixture>) => { r.catalogImages[0]!.evidence = null },
    (r: ReturnType<typeof fixture>) => { r.catalogImages[0]!.productId = 'unknown' },
    (r: ReturnType<typeof fixture>) => { r.catalogImages[0]!.verified = false },
    (r: ReturnType<typeof fixture>) => { r.catalogImages.pop() },
    (r: ReturnType<typeof fixture>) => { r.catalogImages.push({ ...r.catalogImages[0]! }) },
    (r: ReturnType<typeof fixture>) => { Object.assign(r.catalogImages[1]!, { productId: 'fixture-product', verified: true, evidence: 'Fixture' }) }
  ]) {
    const registry = fixture()
    change(registry)
    assert.throws(() => parseRegistry(registry, filenames))
  }
})
test('missing live products and conflicting metadata are rejected', () => {
  const links = parseRegistry(fixture(), filenames)
  assert.throws(() => applyProductImageRegistry([], links))
  assert.throws(() => applyProductImageRegistry([productFromDocument('fixture-product', { image: '/different.jpg' })], links))
})
