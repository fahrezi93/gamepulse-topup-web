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
  EnvelopeIcon
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
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center shadow-2xl">
              <span className="text-white text-3xl font-bold">
                {user?.displayName?.charAt(0) || user?.email?.charAt(0)}
              </span>
            </div>
          </div>
          <h1 className="text-4xl font-black mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Profile Saya
            </span>
          </h1>
          <p className="text-gray-400">
            Kelola informasi akun dan preferensi kamu
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Informasi Personal</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center space-x-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition-colors"
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
                }`}>
                  {message}
                </div>
              )}

              {isEditing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full px-4 py-3 bg-gray-700/30 border border-gray-600 rounded-xl text-gray-400 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email tidak dapat diubah</p>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 disabled:opacity-50"
                    >
                      {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-xl">
                    <UserCircleIcon className="w-8 h-8 text-cyan-400" />
                    <div>
                      <p className="text-sm text-gray-400">Nama Lengkap</p>
                      <p className="text-white font-medium">
                        {user?.displayName || 'Belum diatur'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-xl">
                    <EnvelopeIcon className="w-8 h-8 text-cyan-400" />
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <p className="text-white font-medium">{user?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-xl">
                    <ShieldCheckIcon className="w-8 h-8 text-cyan-400" />
                    <div>
                      <p className="text-sm text-gray-400">Role</p>
                      <p className="text-white font-medium capitalize">User</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats & Quick Actions */}
          <div className="space-y-6">
            {/* Account Stats */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Statistik Akun</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total Transaksi</span>
                  <span className="text-white font-bold">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total Pengeluaran</span>
                  <span className="text-white font-bold">Rp 0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Member Sejak</span>
                  <span className="text-white font-bold">
                    {new Date().toLocaleDateString('id-ID', { 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <a
                  href="/profile/transactions"
                  className="block w-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-300 py-3 px-4 rounded-xl text-center font-medium hover:bg-gradient-to-r hover:from-cyan-500/30 hover:to-purple-500/30 transition-all"
                >
                  Lihat Riwayat Transaksi
                </a>
                <a
                  href="/games"
                  className="block w-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300 py-3 px-4 rounded-xl text-center font-medium hover:bg-gradient-to-r hover:from-purple-500/30 hover:to-pink-500/30 transition-all"
                >
                  Mulai Top Up
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
