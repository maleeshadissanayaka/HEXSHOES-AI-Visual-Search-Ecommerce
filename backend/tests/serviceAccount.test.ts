import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { loadServiceAccount } from '../src/serviceAccount.js'

const fixture = { project_id: 'test-project', client_email: 'test@example.invalid', private_key: 'synthetic-test-value' }
test('environment credentials take precedence without reading the local file', () => {
  assert.deepEqual(loadServiceAccount(JSON.stringify(fixture), new URL('file:///missing.json')),
    { projectId: fixture.project_id, clientEmail: fixture.client_email, privateKey: fixture.private_key })
})
test('local fallback uses its absolute module-based path regardless of working directory', () => {
  const directory = mkdtempSync(join(tmpdir(), 'hexshoes-credentials-'))
  const previous = process.cwd()
  try {
    const file = join(directory, 'serviceAccountKey.json')
    writeFileSync(file, JSON.stringify(fixture))
    process.chdir(tmpdir())
    assert.equal(loadServiceAccount('', pathToFileURL(file)).projectId, fixture.project_id)
  } finally {
    process.chdir(previous)
    rmSync(directory, { recursive: true, force: true })
  }
})
test('missing credentials produce an actionable sanitized error', () => {
  assert.throws(() => loadServiceAccount('', new URL('file:///missing.json')), /credentials are unavailable.*FIREBASE_SERVICE_ACCOUNT_JSON/)
})
test('invalid environment JSON never falls back or leaks source values', () => {
  for (const value of ['sensitive-invalid-input', '{}', '[]', 'null', JSON.stringify({ ...fixture, private_key: 1 })]) {
    assert.throws(() => loadServiceAccount(value), error => {
      assert.ok(error instanceof Error)
      assert.match(error.message, /credentials are invalid/)
      assert.ok(!error.message.includes(value))
      return true
    })
  }
})
