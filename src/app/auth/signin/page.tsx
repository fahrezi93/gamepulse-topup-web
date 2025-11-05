'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { EyeIcon, EyeSlashIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/contexts/AuthContext'

export default function SignInPage() {
  const router = useRouter()
  const { loginWithEmail, loginWithGoogle, loading } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await loginWithEmail(formData.email, formData.password)
    } catch (error: any) {
      console.error('Login error:', error)
      
      // Handle specific Firebase error codes
      let errorMessage = 'Terjadi kesalahan saat login'
      
      if (error.code === 'auth/wrong-password') {
        errorMessage = 'Password salah. Silakan coba lagi atau reset password.'
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'Email tidak terdaftar. Silakan daftar terlebih dahulu.'
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Format email tidak valid.'
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'Akun Anda telah dinonaktifkan.'
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Terlalu banyak percobaan login. Silakan coba lagi nanti.'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      console.log('Starting Google sign in...')
      setError('')
      setIsLoading(true)
      await loginWithGoogle()
      console.log('Google sign in successful!')
    } catch (error: any) {
      console.error('Google sign in failed:', error)
      setError(error.message || 'Gagal login dengan Google')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#0D1117' }}>
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl" style={{ backgroundColor: '#161B22' }}>
                <span className="text-4xl">🎮</span>
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full animate-pulse" style={{ backgroundColor: '#34D399' }}></div>
            </div>
          </div>
          
          <h2 className="text-4xl font-black" style={{ fontFamily: 'Playfair Display, serif' }}>
            <span style={{ color: '#7C3AED' }}>
              Masuk
            </span>
          </h2>
          <p className="mt-2" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
            Masuk ke akun GamePulse kamu
          </p>
        </div>

        {/* Form */}
        <div className="backdrop-blur-sm border rounded-2xl p-8" style={{ backgroundColor: '#161B22', borderColor: '#7C3AED' }}>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="border px-4 py-3 rounded-xl text-sm" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.2)', color: '#F87171' }}>
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:ring-2 focus:outline-none"
                style={{ backgroundColor: '#0D1117', borderColor: '#7C3AED', color: '#F0F6FC' }}
                placeholder="nama@email.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}>
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full px-4 py-3 pr-12 border rounded-xl transition-all duration-200 focus:ring-2 focus:outline-none"
                  style={{ backgroundColor: '#0D1117', borderColor: '#7C3AED', color: '#F0F6FC' }}
                  placeholder="Masukkan password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center transition-colors"
                  style={{ color: '#8B949E' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#F0F6FC'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#8B949E'}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded"
                  style={{ accentColor: '#7C3AED' }}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
                  Ingat saya
                </label>
              </div>

              <div className="text-sm">
                <Link href="/auth/forgot-password" className="transition-colors" style={{ color: '#7C3AED', fontFamily: 'Manrope, sans-serif' }}>
                  Lupa password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              style={{ backgroundColor: '#7C3AED', color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}
            >
              {isLoading ? 'Masuk...' : 'Masuk'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: '#7C3AED' }} />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2" style={{ backgroundColor: '#161B22', color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>Atau</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGoogleSignIn}
                disabled={loading || isLoading}
                className="w-full flex items-center justify-center px-4 py-3 border rounded-xl font-medium transition-all duration-200 disabled:opacity-50"
                style={{ borderColor: '#7C3AED', backgroundColor: '#0D1117', color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 mr-3 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Memproses...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Masuk dengan Google
                  </>
                )}
              </button>
            </div>

            <div className="mt-6 text-center">
              <p style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
                Belum punya akun?{' '}
                <Link href="/auth/signup" className="font-medium transition-colors" style={{ color: '#7C3AED' }}>
                  Daftar sekarang
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
