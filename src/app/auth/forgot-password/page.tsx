'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeftIcon, EnvelopeIcon } from '@heroicons/react/24/outline'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess(false)

    try {
      await sendPasswordResetEmail(auth, email)
      setSuccess(true)
      setEmail('')
    } catch (error: any) {
      console.error('Password reset error:', error)
      
      let errorMessage = 'Terjadi kesalahan saat mengirim email reset password'
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Email tidak terdaftar.'
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Format email tidak valid.'
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Terlalu banyak percobaan. Silakan coba lagi nanti.'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      setError(errorMessage)
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
                <EnvelopeIcon className="w-8 h-8" style={{ color: '#7C3AED' }} />
              </div>
            </div>
          </div>
          
          <h2 className="text-4xl font-black" style={{ fontFamily: 'Playfair Display, serif' }}>
            <span style={{ color: '#7C3AED' }}>
              Lupa Password?
            </span>
          </h2>
          <p className="mt-2" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
            Masukkan email Anda dan kami akan mengirimkan link reset password
          </p>
        </div>

        {/* Form */}
        <div className="backdrop-blur-sm border rounded-2xl p-8" style={{ backgroundColor: '#161B22', borderColor: '#7C3AED' }}>
          {success ? (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center" style={{ backgroundColor: 'rgba(52, 211, 153, 0.1)' }}>
                <svg className="w-8 h-8" style={{ color: '#34D399' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#34D399', fontFamily: 'Playfair Display, serif' }}>
                  Email Terkirim!
                </h3>
                <p className="mb-6" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
                  Kami telah mengirimkan link reset password ke email Anda. Silakan cek inbox atau folder spam.
                </p>
              </div>

              <Link
                href="/auth/signin"
                className="inline-flex items-center justify-center w-full py-3 px-4 rounded-xl font-medium transition-all duration-300"
                style={{ backgroundColor: '#7C3AED', color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Kembali ke Login
              </Link>
            </div>
          ) : (
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                style={{ backgroundColor: '#7C3AED', color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}
              >
                {isLoading ? 'Mengirim...' : 'Kirim Link Reset Password'}
              </button>

              <div className="text-center">
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center text-sm transition-colors"
                  style={{ color: '#7C3AED', fontFamily: 'Manrope, sans-serif' }}
                >
                  <ArrowLeftIcon className="w-4 h-4 mr-2" />
                  Kembali ke Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
