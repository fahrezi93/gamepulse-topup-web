// Firebase Admin SDK Configuration
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

let adminApp: any = null
let adminAuth: any = null
let adminDb: any = null

// Only initialize Firebase Admin if we have the required environment variables
if (process.env.FIREBASE_PRIVATE_KEY) {
  try {
    const firebaseAdminConfig = {
      credential: cert({
        projectId: "game-pulse-web",
        clientEmail: "firebase-adminsdk-fbsvc@game-pulse-web.iam.gserviceaccount.com",
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      projectId: "game-pulse-web",
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
