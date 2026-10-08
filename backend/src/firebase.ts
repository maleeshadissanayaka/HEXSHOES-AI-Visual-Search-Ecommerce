import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { loadServiceAccount } from './serviceAccount.js'

const serviceAccount = loadServiceAccount()

try {
  initializeApp({ credential: cert(serviceAccount) })
} catch {
  throw new Error('Firebase Admin initialization failed. Check the configured service-account credentials.')
}

export const db = getFirestore()
