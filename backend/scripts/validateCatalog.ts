import { loadCatalogInputs, validateCatalog } from '../src/catalogValidation.js'

try {
  const input = loadCatalogInputs()
  if (process.argv.includes('--require-images')) {
    const strict = validateCatalog(input.manifest, input.registry, input.filenames, { requireImages: true, imageExists: input.imageExists })
    input.report.errors.push(...strict.errors.filter(error => !input.report.errors.includes(error)))
  }
  console.log(JSON.stringify(input.report, null, 2))
  process.exitCode = input.report.errors.length ? 1 : 0
} catch {
  console.error('Catalog validation could not read or parse the manifest, registry, or AI catalog. No data was changed.')
  process.exitCode = 1
}
