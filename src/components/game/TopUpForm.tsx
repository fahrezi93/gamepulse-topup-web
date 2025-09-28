'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Game, Denomination } from '@prisma/client'

interface TopUpFormProps {
  game: Game
  denominations: Denomination[]
}

export default function TopUpForm({ game, denominations }: TopUpFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    gameUserId: '',
    playerName: '',
    denominationId: '',
    paymentMethod: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDenomination, setSelectedDenomination] = useState<Denomination | null>(null)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const handleDenominationSelect = (denomination: Denomination) => {
    setSelectedDenomination(denomination)
    setFormData(prev => ({
      ...prev,
      denominationId: denomination.id
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.gameUserId || !formData.denominationId || !formData.paymentMethod) {
      alert('Mohon lengkapi semua field yang diperlukan')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/topup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId: game.id,
          gameUserId: formData.gameUserId,
          playerName: formData.playerName,
          denominationId: formData.denominationId,
          paymentMethod: formData.paymentMethod
        }),
      })

      const result = await response.json()

      if (response.ok) {
        // Redirect ke halaman konfirmasi
        router.push(`/topup/confirm/${result.transactionId}`)
      } else {
        alert(result.error || 'Terjadi kesalahan saat memproses transaksi')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Terjadi kesalahan saat memproses transaksi')
    } finally {
      setIsLoading(false)
    }
  }

  const paymentMethods = [
    { id: 'dana', name: 'DANA', icon: '💳' },
    { id: 'ovo', name: 'OVO', icon: '💙' },
    { id: 'gopay', name: 'GoPay', icon: '💚' },
    { id: 'qris', name: 'QRIS', icon: '📱' },
  ]

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-8">Form Top Up</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User ID Input */}
        <div>
          <label htmlFor="gameUserId" className="block text-sm font-medium text-gray-300 mb-2">
            User ID / Player ID *
          </label>
          <input
            type="text"
            id="gameUserId"
            required
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200"
            placeholder="Masukkan User ID game kamu"
            value={formData.gameUserId}
            onChange={(e) => setFormData(prev => ({ ...prev, gameUserId: e.target.value }))}
          />
        </div>

        {/* Player Name (Optional) */}
        <div>
          <label htmlFor="playerName" className="block text-sm font-medium text-gray-300 mb-2">
            Nama Player (Opsional)
          </label>
          <input
            type="text"
            id="playerName"
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200"
            placeholder="Nama player untuk verifikasi"
            value={formData.playerName}
            onChange={(e) => setFormData(prev => ({ ...prev, playerName: e.target.value }))}
          />
        </div>

        {/* Denomination Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Pilih Nominal *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {denominations.map((denomination) => (
              <button
                key={denomination.id}
                type="button"
                onClick={() => handleDenominationSelect(denomination)}
                className={`p-4 border rounded-xl text-left transition-all duration-200 ${
                  selectedDenomination?.id === denomination.id
                    ? 'border-cyan-500 bg-cyan-500/10 ring-2 ring-cyan-500/20'
                    : 'border-gray-600 bg-gray-700/30 hover:border-cyan-400 hover:bg-gray-700/50'
                }`}
              >
                <div className="font-medium text-white">{denomination.name}</div>
                <div className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mt-1">
                  {formatPrice(denomination.price)}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Payment Method Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Metode Pembayaran *
          </label>
          <div className="grid grid-cols-2 gap-4">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method.id }))}
                className={`p-4 border rounded-xl text-center transition-all duration-200 ${
                  formData.paymentMethod === method.id
                    ? 'border-purple-500 bg-purple-500/10 ring-2 ring-purple-500/20'
                    : 'border-gray-600 bg-gray-700/30 hover:border-purple-400 hover:bg-gray-700/50'
                }`}
              >
                <div className="text-2xl mb-2">{method.icon}</div>
                <div className="font-medium text-sm text-white">{method.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        {selectedDenomination && (
          <div className="bg-gray-700/30 border border-gray-600 rounded-xl p-6">
            <h3 className="font-medium text-white mb-4">Ringkasan Pesanan</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Game:</span>
                <span className="font-medium text-white">{game.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Item:</span>
                <span className="font-medium text-white">{selectedDenomination.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Harga:</span>
                <span className="font-medium text-white">{formatPrice(selectedDenomination.price)}</span>
              </div>
              <hr className="border-gray-600 my-3" />
              <div className="flex justify-between font-bold text-lg">
                <span className="text-white">Total:</span>
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  {formatPrice(selectedDenomination.price)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !formData.gameUserId || !formData.denominationId || !formData.paymentMethod}
          className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-cyan-500/25"
        >
          {isLoading ? 'Memproses...' : 'Lanjutkan Pembayaran'}
        </button>
      </form>
    </div>
  )
}
