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
      PENDING: { color: 'bg-yellow-100 text-yellow-800', text: 'Menunggu Pembayaran' },
      PROCESSING: { color: 'bg-blue-100 text-blue-800', text: 'Sedang Diproses' },
      COMPLETED: { color: 'bg-green-100 text-green-800', text: 'Berhasil' },
      FAILED: { color: 'bg-red-100 text-red-800', text: 'Gagal' },
      CANCELLED: { color: 'bg-gray-100 text-gray-800', text: 'Dibatalkan' }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.text}
      </span>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-6">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Cek Status Transaksi
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Masukkan ID transaksi untuk melihat status pembayaran dan detail pesanan
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Masukkan ID Transaksi (contoh: clm...)"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-cyan-500/25"
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
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-8">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Transaction Details */}
        {transaction && (
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-lg">
            <div className="p-8 border-b border-gray-700">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-white">Detail Transaksi</h2>
                {getStatusBadge(transaction.status)}
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">ID Transaksi</label>
                    <p className="font-mono text-sm bg-gray-700/50 border border-gray-600 p-3 rounded-xl text-white">{transaction.id}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Game</label>
                    <p className="font-medium text-white text-lg">{transaction.game.name}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">User ID Game</label>
                    <p className="font-medium text-white">{transaction.gameUserId}</p>
                  </div>

                  {transaction.playerName && (
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Nama Player</label>
                      <p className="font-medium text-white">{transaction.playerName}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Item</label>
                    <p className="font-medium text-white text-lg">{transaction.denomination.name}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Metode Pembayaran</label>
                    <p className="font-medium text-white uppercase">{transaction.paymentMethod}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Total Harga</label>
                    <p className="font-bold text-2xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">{formatPrice(transaction.totalPrice)}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Tanggal Transaksi</label>
                    <p className="font-medium text-white">{formatDate(transaction.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Status Information */}
              <div className="mt-8 p-6 bg-gray-700/30 border border-gray-600 rounded-xl">
                <h3 className="font-medium text-white mb-4">Informasi Status</h3>
                {transaction.status === 'PENDING' && (
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Transaksi menunggu pembayaran. Silakan lanjutkan pembayaran untuk menyelesaikan pesanan.
                  </p>
                )}
                {transaction.status === 'PROCESSING' && (
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Pembayaran sedang diproses. Mohon tunggu beberapa saat.
                  </p>
                )}
                {transaction.status === 'COMPLETED' && (
                  <p className="text-sm text-green-400 leading-relaxed">
                    ✅ Pembayaran berhasil! Item sudah dikirim ke akun game Anda.
                  </p>
                )}
                {transaction.status === 'FAILED' && (
                  <p className="text-sm text-red-400 leading-relaxed">
                    ❌ Pembayaran gagal. Silakan hubungi customer service untuk bantuan.
                  </p>
                )}
                {transaction.status === 'CANCELLED' && (
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Transaksi dibatalkan oleh pengguna.
                  </p>
                )}
              </div>

              {/* Action Button */}
              {transaction.status === 'PENDING' && (
                <div className="mt-8">
                  <a
                    href={`/topup/confirm/${transaction.id}`}
                    className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 inline-block shadow-lg hover:shadow-cyan-500/25"
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
