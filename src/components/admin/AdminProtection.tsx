'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useAdminRole } from '@/hooks/useAdminRole'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface AdminProtectionProps {
  children: React.ReactNode
}

export default function AdminProtection({ children }: AdminProtectionProps) {
  const { user, loading: authLoading } = useAuth()
  const { isAdmin, loading: adminLoading } = useAdminRole()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !adminLoading) {
      if (!user) {
        // User not logged in, redirect to signin
        router.push('/auth/signin')
        return
      }

      if (!isAdmin) {
        // User logged in but not admin, redirect to home
        router.push('/')
        return
      }
    }
  }, [user, isAdmin, authLoading, adminLoading, router])

  // Show loading while checking auth and admin status
  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Memverifikasi akses admin...</p>
        </div>
      </div>
    )
  }

  // Show unauthorized if not admin
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-white mb-2">Akses Ditolak</h1>
          <p className="text-gray-400 mb-6">Anda tidak memiliki izin untuk mengakses halaman admin.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    )
  }

  // User is admin, show admin content
  return <>{children}</>
}
