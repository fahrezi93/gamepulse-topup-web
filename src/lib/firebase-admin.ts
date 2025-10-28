// Firebase Admin SDK Configuration
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

let adminApp: any = null
let adminAuth: any = null
let adminDb: any = null

// Only initialize Firebase Admin if we have the required environment variables
if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL) {
  try {
    const firebaseAdminConfig = {
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      projectId: process.env.FIREBASE_PROJECT_ID,
    }

    adminApp = getApps().length === 0 ? initializeApp(firebaseAdminConfig, 'admin') : getApps()[0]
    adminAuth = getAuth(adminApp)
    adminDb = getFirestore(adminApp)
  } catch (error) {
    console.warn('Firebase Admin initialization failed:', error)
  }
}

export { adminAuth, adminDb }
export default adminApp
