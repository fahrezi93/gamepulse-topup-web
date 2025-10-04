'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useState, useEffect } from 'react'
import { redirect } from 'next/navigation'
import { updateProfile } from 'firebase/auth'
import { 
  UserCircleIcon, 
  PencilIcon, 
  ShieldCheckIcon,
  CalendarIcon,
  EnvelopeIcon,
  CreditCardIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.displayName || '',
        email: user.email || ''
      })
    }
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  if (!user) {
    redirect('/auth/signin')
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      // Update Firebase profile
      if (user && formData.name !== user.displayName) {
        await updateProfile(user, {
          displayName: formData.name
        })
      }

      // Update database
      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          uid: user?.uid
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Profile berhasil diperbarui!')
        setIsEditing(false)
      } else {
        setMessage(data.error || 'Terjadi kesalahan')
      }
    } catch (error) {
      console.error('Update profile error:', error)
      setMessage('Terjadi kesalahan saat memperbarui profile')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0D1117' }}>
      {/* Header Section */}
      <section className="relative py-12 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(124, 58, 237, 0.1)' }}></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-16 h-16 rounded-full blur-xl animate-pulse" style={{ backgroundColor: 'rgba(124, 58, 237, 0.3)' }}></div>
        <div className="absolute bottom-10 right-20 w-20 h-20 rounded-full blur-xl animate-pulse delay-1000" style={{ backgroundColor: 'rgba(52, 211, 153, 0.25)' }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl" style={{ backgroundColor: '#7C3AED' }}>
                <span className="text-3xl font-black" style={{ color: '#F0F6FC' }}>
                  {user?.displayName?.charAt(0) || user?.email?.charAt(0)}
                </span>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-black mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              <span style={{ color: '#7C3AED' }}>
                Profile
              </span>
              <span style={{ color: '#F0F6FC' }}> Saya</span>
            </h1>
            
            <p className="text-lg max-w-3xl mx-auto leading-relaxed" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
              Kelola informasi akun dan preferensi kamu
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info */}
            <div className="lg:col-span-2">
              <div 
                className="group relative backdrop-blur-sm border p-8 rounded-2xl transition-all duration-300"
                style={{ 
                  backgroundColor: '#161B22', 
                  borderColor: '#7C3AED'
                }}
              >
                {/* Background Hover Effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" style={{ backgroundColor: '#7C3AED' }}></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold" style={{ color: '#F0F6FC', fontFamily: 'Playfair Display, serif' }}>Informasi Personal</h2>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                      style={{ backgroundColor: '#7C3AED', color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}
                    >
                      <PencilIcon className="w-4 h-4" />
                      <span>{isEditing ? 'Batal' : 'Edit'}</span>
                    </button>
                  </div>

                  {message && (
                    <div className={`mb-6 p-4 rounded-xl ${
                      message.includes('berhasil') 
                        ? 'bg-green-500/10 border border-green-500/20 text-green-400' 
                        : 'bg-red-500/10 border border-red-500/20 text-red-400'
                    }`} style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {message}
                    </div>
                  )}

              {isEditing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 border rounded-xl placeholder-gray-400 focus:ring-2 focus:border-transparent transition-all duration-300"
                        style={{ 
                          backgroundColor: '#0D1117', 
                          borderColor: '#7C3AED',
                          color: '#F0F6FC',
                          fontFamily: 'Manrope, sans-serif'
                        }}
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full px-4 py-3 border rounded-xl cursor-not-allowed"
                        style={{ 
                          backgroundColor: '#161B22', 
                          borderColor: '#34D399',
                          color: '#8B949E',
                          fontFamily: 'Manrope, sans-serif'
                        }}
                      />
                      <p className="text-xs mt-1" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>Email tidak dapat diubah</p>
                    </div>

                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 hover:scale-105 shadow-lg hover:shadow-xl"
                        style={{ backgroundColor: '#7C3AED', color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}
                      >
                        {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                      </button>
                    </div>
                </form>
              ) : (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4 p-4 rounded-xl" style={{ backgroundColor: '#0D1117' }}>
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#7C3AED' }}>
                        <UserCircleIcon className="w-6 h-6" style={{ color: '#F0F6FC' }} />
                      </div>
                      <div>
                        <p className="text-sm mb-1" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>Nama Lengkap</p>
                        <p className="font-medium" style={{ color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}>
                          {user?.displayName || 'admin'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 rounded-xl" style={{ backgroundColor: '#0D1117' }}>
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#34D399' }}>
                        <EnvelopeIcon className="w-6 h-6" style={{ color: '#F0F6FC' }} />
                      </div>
                      <div>
                        <p className="text-sm mb-1" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>Email</p>
                        <p className="font-medium" style={{ color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}>{user?.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 rounded-xl" style={{ backgroundColor: '#0D1117' }}>
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#F59E0B' }}>
                        <ShieldCheckIcon className="w-6 h-6" style={{ color: '#F0F6FC' }} />
                      </div>
                      <div>
                        <p className="text-sm mb-1" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>Role</p>
                        <p className="font-medium capitalize" style={{ color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}>Admin</p>
                      </div>
                    </div>
                  </div>
                )}
                </div>
              </div>
            </div>

            {/* Stats & Quick Actions */}
            <div className="space-y-6">
              {/* Account Stats */}
              <div 
                className="group relative backdrop-blur-sm border p-6 rounded-2xl transition-all duration-300 hover:scale-105 transform"
                style={{ 
                  backgroundColor: '#161B22', 
                  borderColor: '#34D399'
                }}
              >
                {/* Background Hover Effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" style={{ backgroundColor: '#34D399' }}></div>
                
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-4" style={{ color: '#F0F6FC', fontFamily: 'Playfair Display, serif' }}>Statistik Akun</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#34D399' }}>
                          <ChartBarIcon className="w-4 h-4" style={{ color: '#F0F6FC' }} />
                        </div>
                        <span style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>Total Transaksi</span>
                      </div>
                      <span className="font-bold" style={{ color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}>0</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#7C3AED' }}>
                          <CreditCardIcon className="w-4 h-4" style={{ color: '#F0F6FC' }} />
                        </div>
                        <span style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>Total Pengeluaran</span>
                      </div>
                      <span className="font-bold" style={{ color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}>Rp 0</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F59E0B' }}>
                          <ClockIcon className="w-4 h-4" style={{ color: '#F0F6FC' }} />
                        </div>
                        <span style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>Member Sejak</span>
                      </div>
                      <span className="font-bold" style={{ color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}>
                        Okt 2025
                      </span>
                    </div>
                  </div>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10 blur-xl" style={{ backgroundColor: '#34D399' }}></div>
              </div>

              {/* Quick Actions */}
              <div 
                className="group relative backdrop-blur-sm border p-6 rounded-2xl transition-all duration-300 hover:scale-105 transform"
                style={{ 
                  backgroundColor: '#161B22', 
                  borderColor: '#7C3AED'
                }}
              >
                {/* Background Hover Effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" style={{ backgroundColor: '#7C3AED' }}></div>
                
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-4" style={{ color: '#F0F6FC', fontFamily: 'Playfair Display, serif' }}>Quick Actions</h3>
                  <div className="space-y-3">
                    <a
                      href="/profile/transactions"
                      className="flex items-center justify-center space-x-2 w-full py-3 px-4 rounded-xl text-center font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                      style={{ backgroundColor: '#34D399', color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}
                    >
                      <CreditCardIcon className="w-5 h-5" />
                      <span>Lihat Riwayat Transaksi</span>
                    </a>
                    <a
                      href="/games"
                      className="flex items-center justify-center space-x-2 w-full py-3 px-4 rounded-xl text-center font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                      style={{ backgroundColor: '#7C3AED', color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}
                    >
                      <span>🎮</span>
                      <span>Mulai Top Up</span>
                    </a>
                  </div>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10 blur-xl" style={{ backgroundColor: '#7C3AED' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
