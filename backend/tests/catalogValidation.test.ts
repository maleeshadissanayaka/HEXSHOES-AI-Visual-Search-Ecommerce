import test from 'node:test'
import assert from 'node:assert/strict'
import { validateCatalog, loadCatalogInputs } from '../src/catalogValidation.js'
import { productFromDocument } from '../src/productContract.js'

function fixture() {
  return {
    manifest: { schemaVersion: 1, products: [productFromDocument('fixture-a', { name: 'Test fixture', price: 50, currency: 'USD' })] },
    registry: { schemaVersion: 1, products: [{ productId: 'fixture-a', productCode: null, storeImage: null }], catalogImages: [{ aiImageFilename: 'reference.jpg', productId: null as string | null, verified: false, evidence: null as string | null }] },
    filenames: ['reference.jpg']
  }
}
test('real draft preserves four records and has only unresolved-data warnings', () => {
  const input = loadCatalogInputs()
  assert.deepEqual(input.report.errors, [])
  assert.deepEqual(input.report.unresolved.map(product => product.id), ['HX-01A', 'HX-02F', 'HX-03C', 'HX-04E'])
  assert.equal(input.report.unresolved.length, 4)
  assert.ok(input.report.warnings.some(warning => warning.includes('Unresolved AI catalog mappings:')))
})
test('draft validation is read-only and strict image readiness fails clearly', () => {
  const input = fixture()
  const before = JSON.stringify(input)
  assert.deepEqual(validateCatalog(input.manifest, input.registry, input.filenames).errors, [])
  assert.ok(validateCatalog(input.manifest, input.registry, input.filenames, { requireImages: true }).errors.some(error => error.includes('Primary image')))
  assert.equal(JSON.stringify(input), before)
})
test('rejects duplicate IDs and codes, missing names and invalid prices', () => {
  const input = fixture()
  input.manifest.products.push({ ...input.manifest.products[0]!, name: null, price: -1, code: 'TEST' })
  input.manifest.products[0]!.code = 'TEST'
  const errors = validateCatalog(input.manifest, input.registry, input.filenames).errors.join('\n')
  for (const message of ['Duplicate product ID', 'Duplicate product code', 'Missing or invalid name', 'Price must']) assert.ok(errors.includes(message))
})
test('rejects unverified and duplicate AI filenames and missing catalog coverage', () => {
  const input = fixture()
  input.manifest.products[0]!.aiImageFilename = 'reference.jpg'
  input.manifest.products.push({ ...input.manifest.products[0]!, id: 'fixture-b' })
  input.registry.catalogImages = []
  const errors = validateCatalog(input.manifest, input.registry, input.filenames).errors.join('\n')
  for (const message of ['Duplicate AI filename', 'matching verified registry', 'Every catalog image']) assert.ok(errors.includes(message))
})
test('rejects verified mapping disagreements and missing primary/gallery files', () => {
  const input = fixture()
  input.registry.catalogImages[0] = { aiImageFilename: 'reference.jpg', productId: 'fixture-a', verified: true, evidence: 'Synthetic test evidence' }
  input.manifest.products[0]!.images = ['/products/fixture-a/fixture-a-gallery.jpg']
  const errors = validateCatalog(input.manifest, input.registry, input.filenames, { imageExists: () => false }).errors.join('\n')
  for (const message of ['Primary image', 'missing from the manifest', 'Image must exist']) assert.ok(errors.includes(message))
})
test('verified synthetic assignment passes only with complete matching image data', () => {
  const input = fixture()
  input.registry.catalogImages[0] = { aiImageFilename: 'reference.jpg', productId: 'fixture-a', verified: true, evidence: 'Synthetic test evidence' }
  input.manifest.products[0]!.aiImageFilename = 'reference.jpg'
  input.manifest.products[0]!.image = '/products/fixture-a/fixture-a-primary.jpg'
  assert.deepEqual(validateCatalog(input.manifest, input.registry, input.filenames, { imageExists: () => true }).errors, [])
})
