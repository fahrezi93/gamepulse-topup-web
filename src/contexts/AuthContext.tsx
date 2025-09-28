'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, onAuthStateChanged, signOut, getRedirectResult } from 'firebase/auth'
import { auth, signInWithGoogle, signInWithEmail, signUpWithEmail } from '@/lib/firebase'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  loading: boolean
  loginWithGoogle: () => Promise<void>
  loginWithEmail: (email: string, password: string) => Promise<void>
  registerWithEmail: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    // Handle redirect result from Google sign-in
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          syncUserToDatabase(result.user)
          router.push('/')
        }
      })
      .catch((error) => {
        console.error('Redirect result error:', error)
      })

    return () => unsubscribe()
  }, [router])

  const loginWithGoogle = async () => {
    try {
      setLoading(true)
      const result = await signInWithGoogle()
      
      // Sync user to database
      if (result.user) {
        await syncUserToDatabase(result.user)
        router.push('/')
      }
    } catch (error: any) {
      console.error('Google sign in error:', error)
      setLoading(false)
      
      // Handle specific Firebase errors
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Login dibatalkan')
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Popup diblokir browser. Izinkan popup untuk login.')
      } else {
        throw new Error('Gagal login dengan Google')
      }
    } finally {
      setLoading(false)
    }
  }

  const loginWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true)
      await signInWithEmail(email, password)
      router.push('/')
    } catch (error) {
      console.error('Email sign in error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const registerWithEmail = async (email: string, password: string, name: string) => {
    try {
      setLoading(true)
      const result = await signUpWithEmail(email, password)
      
      // Sync user to database
      await syncUserToDatabase(result.user, name)
      
      router.push('/')
    } catch (error) {
      console.error('Email sign up error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      router.push('/auth/signin')
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  // Sync Firebase user to Prisma database
  const syncUserToDatabase = async (firebaseUser: User, displayName?: string) => {
    try {
      const response = await fetch('/api/auth/sync-firebase-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: displayName || firebaseUser.displayName || firebaseUser.email?.split('@')[0],
          photoURL: firebaseUser.photoURL,
        }),
      })

      if (!response.ok) {
        console.error('Failed to sync user to database')
      }
    } catch (error) {
      console.error('Error syncing user to database:', error)
    }
  }

  const value = {
    user,
    loading,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
