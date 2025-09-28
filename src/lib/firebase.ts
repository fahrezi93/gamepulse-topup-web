// Firebase Client Configuration
import { initializeApp, getApps } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: "AIzaSyCnQpIZhOmlNO7buMCp4Y5Jyl9ftU6Q2Nc",
  authDomain: "game-pulse-web.firebaseapp.com",
  projectId: "game-pulse-web",
  storageBucket: "game-pulse-web.firebasestorage.app",
  messagingSenderId: "478163117073",
  appId: "1:478163117073:web:39cf7027214b5cb8d43db0",
  measurementId: "G-777PDFPFLL"
}

// Debug Firebase config
console.log('Firebase config loaded:', {
  apiKey: firebaseConfig.apiKey ? 'Present' : 'Missing',
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId
})

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()

// Configure Google provider to skip verification
googleProvider.setCustomParameters({
  prompt: 'select_account'
})

// Add scopes for basic profile info
googleProvider.addScope('email')
googleProvider.addScope('profile')

// Initialize Analytics (only in browser)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null

// Firebase Auth functions - Use popup for easier testing
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider)
export const signInWithGoogleRedirect = () => signInWithRedirect(auth, googleProvider)
export const signInWithEmail = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password)
export const signUpWithEmail = (email: string, password: string) => createUserWithEmailAndPassword(auth, email, password)

export default app
