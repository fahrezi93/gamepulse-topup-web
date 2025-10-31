// Firebase Admin SDK Configuration
import { initializeApp, getApps, cert, ServiceAccount } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import * as path from 'path'
import * as fs from 'fs'

let adminApp: any = null
let adminAuth: any = null
let adminDb: any = null

try {
  let serviceAccount: ServiceAccount | null = null

  // Method 1: Try to use FIREBASE_ADMIN_SDK_JSON environment variable (for Vercel/Production)
  if (process.env.FIREBASE_ADMIN_SDK_JSON) {
    try {
      serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK_JSON)
      console.log('✅ Firebase Admin: Using FIREBASE_ADMIN_SDK_JSON from environment')
    } catch (error) {
      console.error('❌ Failed to parse FIREBASE_ADMIN_SDK_JSON:', error)
    }
  }

  // Method 2: Try to use individual environment variables
  if (!serviceAccount && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL) {
    serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    } as ServiceAccount
    console.log('✅ Firebase Admin: Using individual environment variables')
  }

  // Method 3: Try to read from local service account file (for development)
  if (!serviceAccount) {
    const serviceAccountPath = path.join(process.cwd(), 'game-pulse-web-firebase-adminsdk-fbsvc-889709e41a.json')
    if (fs.existsSync(serviceAccountPath)) {
      serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'))
      console.log('✅ Firebase Admin: Using local service account file')
    }
  }

  if (serviceAccount) {
    const firebaseAdminConfig = {
      credential: cert(serviceAccount),
      projectId: serviceAccount.projectId,
    }

    adminApp = getApps().length === 0 ? initializeApp(firebaseAdminConfig, 'admin') : getApps()[0]
    adminAuth = getAuth(adminApp)
    adminDb = getFirestore(adminApp)
    console.log('✅ Firebase Admin SDK initialized successfully')
  } else {
    console.warn('⚠️ Firebase Admin SDK not initialized - no credentials found')
  }
} catch (error) {
  console.error('❌ Firebase Admin initialization failed:', error)
}

export { adminAuth, adminDb }
export default adminApp
