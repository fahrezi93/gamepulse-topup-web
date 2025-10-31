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
    denominationId: ''
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
    
    if (!formData.gameUserId || !formData.denominationId) {
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
          denominationId: formData.denominationId
        }),
      })

      const result = await response.json()

      if (response.ok) {
        // Redirect ke halaman pilih metode pembayaran
        router.push(`/payment/${result.transactionId}`)
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


  return (
    <div className="backdrop-blur-sm rounded-2xl shadow-lg p-8 border" style={{ backgroundColor: '#161B22', borderColor: '#7C3AED' }}>
      <h2 className="text-2xl font-bold mb-8" style={{ color: '#F0F6FC', fontFamily: 'Playfair Display, serif' }}>Form Top Up</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User ID Input */}
        <div>
          <label htmlFor="gameUserId" className="block text-sm font-medium mb-2" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
            User ID / Player ID *
          </label>
          <input
            type="text"
            id="gameUserId"
            required
            className="w-full px-4 py-3 border rounded-xl transition-all duration-200"
            style={{ 
              backgroundColor: '#0D1117', 
              borderColor: '#7C3AED', 
              color: '#F0F6FC',
              fontFamily: 'Manrope, sans-serif'
            }}
            placeholder="Masukkan User ID game kamu"
            value={formData.gameUserId}
            onChange={(e) => setFormData(prev => ({ ...prev, gameUserId: e.target.value }))}
          />
        </div>

        {/* Player Name (Optional) */}
        <div>
          <label htmlFor="playerName" className="block text-sm font-medium mb-2" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
            Nama Player (Opsional)
          </label>
          <input
            type="text"
            id="playerName"
            className="w-full px-4 py-3 border rounded-xl transition-all duration-200"
            style={{ 
              backgroundColor: '#0D1117', 
              borderColor: '#7C3AED', 
              color: '#F0F6FC',
              fontFamily: 'Manrope, sans-serif'
            }}
            placeholder="Nama player untuk verifikasi"
            value={formData.playerName}
            onChange={(e) => setFormData(prev => ({ ...prev, playerName: e.target.value }))}
          />
        </div>

        {/* Denomination Selection */}
        <div>
          <label className="block text-sm font-medium mb-3" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
            Pilih Nominal *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {denominations.map((denomination) => (
              <button
                key={denomination.id}
                type="button"
                onClick={() => handleDenominationSelect(denomination)}
                className="p-4 border rounded-xl text-left transition-all duration-200"
                style={{
                  backgroundColor: selectedDenomination?.id === denomination.id ? 'rgba(124, 58, 237, 0.1)' : '#0D1117',
                  borderColor: selectedDenomination?.id === denomination.id ? '#7C3AED' : '#8B949E'
                }}
              >
                <div className="font-medium" style={{ color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}>{denomination.name}</div>
                <div className="text-lg font-bold mt-1" style={{ color: '#7C3AED', fontFamily: 'Manrope, sans-serif' }}>
                  {formatPrice(denomination.price)}
                </div>
              </button>
            ))}
          </div>
        </div>


        {/* Order Summary */}
        {selectedDenomination && (
          <div className="border rounded-xl p-6" style={{ backgroundColor: '#0D1117', borderColor: '#34D399' }}>
            <h3 className="font-medium mb-4" style={{ color: '#F0F6FC', fontFamily: 'Playfair Display, serif' }}>Ringkasan Pesanan</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>Game:</span>
                <span className="font-medium" style={{ color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}>{game.name}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>Item:</span>
                <span className="font-medium" style={{ color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}>{selectedDenomination.name}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>Harga:</span>
                <span className="font-medium" style={{ color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}>{formatPrice(selectedDenomination.price)}</span>
              </div>
              <hr className="my-3" style={{ borderColor: '#34D399' }} />
              <div className="flex justify-between font-bold text-lg">
                <span style={{ color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}>Total:</span>
                <span style={{ color: '#34D399', fontFamily: 'Manrope, sans-serif' }}>
                  {formatPrice(selectedDenomination.price)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !formData.gameUserId || !formData.denominationId}
          className="w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          style={{ 
            backgroundColor: '#7C3AED', 
            color: '#F0F6FC',
            fontFamily: 'Manrope, sans-serif'
          }}
        >
          {isLoading ? 'Memproses...' : 'Lanjutkan Pembayaran'}
        </button>
      </form>
    </div>
  )
}
