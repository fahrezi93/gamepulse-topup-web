'use client'

import { useState } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function CheckTransactionPage() {
  const [transactionId, setTransactionId] = useState('')
  const [transaction, setTransaction] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!transactionId.trim()) {
      setError('Masukkan ID transaksi')
      return
    }

    setIsLoading(true)
    setError('')
    setTransaction(null)

    try {
      const response = await fetch(`/api/transaction/${transactionId}`)
      
      if (response.ok) {
        const data = await response.json()
        setTransaction(data.transaction)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Transaksi tidak ditemukan')
      }
    } catch (error) {
      console.error('Error:', error)
      setError('Terjadi kesalahan saat mencari transaksi')
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { bgColor: '#7C3AED', textColor: '#F0F6FC', text: 'Menunggu Pembayaran' },
      PROCESSING: { bgColor: '#34D399', textColor: '#F0F6FC', text: 'Sedang Diproses' },
      COMPLETED: { bgColor: '#34D399', textColor: '#F0F6FC', text: 'Berhasil' },
      FAILED: { bgColor: '#7C3AED', textColor: '#F0F6FC', text: 'Gagal' },
      CANCELLED: { bgColor: '#8B949E', textColor: '#F0F6FC', text: 'Dibatalkan' }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING

    return (
      <span 
        className="px-3 py-1 rounded-full text-sm font-medium"
        style={{ 
          backgroundColor: config.bgColor, 
          color: config.textColor,
          fontFamily: 'Manrope, sans-serif'
        }}
      >
        {config.text}
      </span>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0D1117' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            <span style={{ color: '#7C3AED' }}>
              Cek Status Transaksi
            </span>
          </h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
            Masukkan ID transaksi untuk melihat status pembayaran dan detail pesanan
          </p>
        </div>

        {/* Search Form */}
        <div className="backdrop-blur-sm border rounded-2xl p-8 mb-8" style={{ backgroundColor: '#161B22', borderColor: '#7C3AED' }}>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Masukkan ID Transaksi (contoh: clm...)"
                className="w-full px-4 py-3 border rounded-xl transition-all duration-200"
                style={{ 
                  backgroundColor: '#0D1117', 
                  borderColor: '#7C3AED', 
                  color: '#F0F6FC',
                  fontFamily: 'Manrope, sans-serif'
                }}
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
              style={{ 
                backgroundColor: '#7C3AED', 
                color: '#F0F6FC',
                fontFamily: 'Manrope, sans-serif'
              }}
            >
              {isLoading ? (
                'Mencari...'
              ) : (
                <>
                  <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
                  Cari Transaksi
                </>
              )}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="border rounded-xl p-4 mb-8" style={{ backgroundColor: 'rgba(124, 58, 237, 0.1)', borderColor: '#7C3AED' }}>
            <p style={{ color: '#7C3AED', fontFamily: 'Manrope, sans-serif' }}>{error}</p>
          </div>
        )}

        {/* Transaction Details */}
        {transaction && (
          <div className="backdrop-blur-sm border rounded-2xl shadow-lg" style={{ backgroundColor: '#161B22', borderColor: '#7C3AED' }}>
            <div className="p-8 border-b" style={{ borderColor: '#7C3AED' }}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold" style={{ color: '#F0F6FC', fontFamily: 'Playfair Display, serif' }}>Detail Transaksi</h2>
                {getStatusBadge(transaction.status)}
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>ID Transaksi</label>
                    <p className="font-mono text-sm border p-3 rounded-xl" style={{ backgroundColor: '#0D1117', borderColor: '#7C3AED', color: '#F0F6FC' }}>{transaction.id}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>Game</label>
                    <p className="font-medium text-lg" style={{ color: '#F0F6FC', fontFamily: 'Playfair Display, serif' }}>{transaction.game.name}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>User ID Game</label>
                    <p className="font-medium" style={{ color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}>{transaction.gameUserId}</p>
                  </div>

                  {transaction.playerName && (
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>Nama Player</label>
                      <p className="font-medium" style={{ color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}>{transaction.playerName}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>Item</label>
                    <p className="font-medium text-lg" style={{ color: '#F0F6FC', fontFamily: 'Playfair Display, serif' }}>{transaction.denomination.name}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>Metode Pembayaran</label>
                    <p className="font-medium uppercase" style={{ color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}>{transaction.paymentMethod}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>Total Harga</label>
                    <p className="font-bold text-2xl" style={{ color: '#7C3AED', fontFamily: 'Manrope, sans-serif' }}>{formatPrice(transaction.totalPrice)}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>Tanggal Transaksi</label>
                    <p className="font-medium" style={{ color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}>{formatDate(transaction.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Status Information */}
              <div className="mt-8 p-6 border rounded-xl" style={{ backgroundColor: '#0D1117', borderColor: '#7C3AED' }}>
                <h3 className="font-medium mb-4" style={{ color: '#F0F6FC', fontFamily: 'Playfair Display, serif' }}>Informasi Status</h3>
                {transaction.status === 'PENDING' && (
                  <p className="text-sm leading-relaxed" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
                    Transaksi menunggu pembayaran. Silakan lanjutkan pembayaran untuk menyelesaikan pesanan.
                  </p>
                )}
                {transaction.status === 'PROCESSING' && (
                  <p className="text-sm leading-relaxed" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
                    Pembayaran sedang diproses. Mohon tunggu beberapa saat.
                  </p>
                )}
                {transaction.status === 'COMPLETED' && (
                  <p className="text-sm leading-relaxed" style={{ color: '#34D399', fontFamily: 'Manrope, sans-serif' }}>
                    ✅ Pembayaran berhasil! Item sudah dikirim ke akun game Anda.
                  </p>
                )}
                {transaction.status === 'FAILED' && (
                  <p className="text-sm leading-relaxed" style={{ color: '#7C3AED', fontFamily: 'Manrope, sans-serif' }}>
                    ❌ Pembayaran gagal. Silakan hubungi customer service untuk bantuan.
                  </p>
                )}
                {transaction.status === 'CANCELLED' && (
                  <p className="text-sm leading-relaxed" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
                    Transaksi dibatalkan oleh pengguna.
                  </p>
                )}
              </div>

              {/* Action Button */}
              {transaction.status === 'PENDING' && (
                <div className="mt-8">
                  <a
                    href={`/topup/confirm/${transaction.id}`}
                    className="px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 inline-block shadow-lg"
                    style={{ 
                      backgroundColor: '#7C3AED', 
                      color: '#F0F6FC',
                      fontFamily: 'Manrope, sans-serif'
                    }}
                  >
                    Lanjutkan Pembayaran
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
