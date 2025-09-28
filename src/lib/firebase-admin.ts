// Firebase Admin SDK Configuration
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

// Initialize Firebase Admin
const firebaseAdminConfig = {
  credential: cert({
    projectId: "game-pulse-web",
    clientEmail: "firebase-adminsdk-fbsvc@game-pulse-web.iam.gserviceaccount.com",
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
  projectId: "game-pulse-web",
}

const adminApp = getApps().length === 0 ? initializeApp(firebaseAdminConfig, 'admin') : getApps()[0]

export const adminAuth = getAuth(adminApp)
export const adminDb = getFirestore(adminApp)

export default adminApp
