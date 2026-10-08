import { readFileSync } from 'node:fs'
import type { ServiceAccount } from 'firebase-admin/app'

/** Server-only credentials. Never include source values in startup errors. */
export function loadServiceAccount(
  environmentJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON,
  localFile = new URL('../serviceAccountKey.json', import.meta.url),
): ServiceAccount {
  let json: string
  if (environmentJson?.trim()) {
    json = environmentJson
  } else {
    try { json = readFileSync(localFile, 'utf8') }
    catch {
      throw new Error('Firebase Admin credentials are unavailable. Set FIREBASE_SERVICE_ACCOUNT_JSON or provide backend/serviceAccountKey.json for local development.')
    }
  }
  try {
    const value: unknown = JSON.parse(json)
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error()
    const account = value as Record<string, unknown>
    const { project_id, client_email, private_key } = account
    if (![project_id, client_email, private_key].every(field => typeof field === 'string' && field.trim())) throw new Error()
    return { projectId: project_id as string, clientEmail: client_email as string, privateKey: private_key as string }
  } catch {
    throw new Error('Firebase Admin credentials are invalid. Supply a valid service-account JSON containing project_id, client_email and private_key.')
  }
}
