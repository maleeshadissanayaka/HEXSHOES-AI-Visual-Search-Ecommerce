import { deleteApp, getApp } from 'firebase-admin/app'
import { loadCatalogInputs, catalogFields, type CatalogManifest } from '../src/catalogValidation.js'

// Read-only by construction: no set, update, add, delete, batch or write mode.
async function preview() {
  const input = loadCatalogInputs()
  if (input.report.errors.length) {
    console.error(JSON.stringify(input.report, null, 2))
    process.exitCode = 1
    return
  }
  const manifest = input.manifest as CatalogManifest
  const { db } = await import('../src/firebase.js')
  try {
    const snapshot = await db.collection('products').get()
    const existing = new Map(snapshot.docs.map(doc => [doc.id, doc.data()]))
    const documents = manifest.products.map(product => {
      const raw = existing.get(product.id)
      const fields = catalogFields.map(field => {
        const present = !!raw && Object.hasOwn(raw, field)
        const value: unknown = present ? raw![field] : null
        const before = value && typeof value === 'object' && 'toDate' in value && typeof value.toDate === 'function' ? value.toDate().toISOString() : value
        const proposed = product[field]
        return { field, existing: { present, value: before }, proposed, changed: !present || JSON.stringify(before) !== JSON.stringify(proposed) }
      })
      return {
        documentPath: `products/${product.id}`, existingDocument: !!raw,
        proposedOperation: 'merge these exact fields; NOT EXECUTED', proposedPayload: product,
        fields, fieldsThatWouldChange: fields.filter(field => field.changed).map(field => field.field),
        fieldsRemainingUnresolved: input.report.unresolved.find(item => item.id === product.id)?.fields ?? [],
        existingLegacyValues: Object.fromEntries(['desc', 'tag'].filter(field => raw && Object.hasOwn(raw, field)).map(field => [field, raw![field]])),
        existingFieldsPreservedByMerge: Object.keys(raw ?? {}).filter(field => !(catalogFields as readonly string[]).includes(field))
      }
    })
    console.log(JSON.stringify({ dryRun: true, writesPerformed: 0, comparison: 'Raw Firestore fields, not normalized Express values', warnings: input.report.warnings, documents, existingProductsOutsideManifest: [...existing.keys()].filter(id => !manifest.products.some(product => product.id === id)) }, null, 2))
  } finally {
    await deleteApp(getApp())
  }
}
preview().catch(() => {
  console.error('Read-only Firestore preview failed. Check the existing backend credentials and connectivity. No writes were attempted.')
  process.exitCode = 1
})
