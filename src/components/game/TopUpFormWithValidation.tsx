'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Game, Denomination } from '@prisma/client'

interface TopUpFormProps {
  game: Game
  denominations: Denomination[]
}

export default function TopUpFormWithValidation({ game, denominations }: TopUpFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    gameUserId: '',
    zoneId: '',
    playerName: '',
    denominationId: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<{
    valid: boolean
    username?: string
    message?: string
  } | null>(null)
  const [selectedDenomination, setSelectedDenomination] = useState<Denomination | null>(null)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  // Cek apakah game perlu Zone ID
  const needsZoneId = ['Mobile Legends', 'Genshin Impact'].includes(game.name)

  // Validate User ID dengan Digiflazz
  const handleValidateUser = async () => {
    if (!formData.gameUserId) {
      alert('Masukkan User ID terlebih dahulu')
      return
    }

    if (needsZoneId && !formData.zoneId) {
      alert('Masukkan Zone ID terlebih dahulu')
      return
    }

    setIsValidating(true)
    setValidationResult(null)

    try {
      // Get SKU code from denomination (or use default based on game)
      // You'll need to configure this properly
      const buyerSkuCode = getBuyerSkuCode(game.name)

      const response = await fetch('/api/game/validate-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          buyerSkuCode,
          userId: formData.gameUserId,
          zoneId: formData.zoneId || undefined,
        }),
      })

      const result = await response.json()

      if (result.valid) {
        setValidationResult({
          valid: true,
          username: result.username,
          message: result.message,
        })
        // Auto-fill player name
        setFormData(prev => ({
          ...prev,
          playerName: result.username || prev.playerName
        }))
      } else {
        setValidationResult({
          valid: false,
          message: result.message || 'User ID tidak valid',
        })
      }
    } catch (error) {
      console.error('Validation error:', error)
      setValidationResult({
        valid: false,
        message: 'Gagal memvalidasi User ID. Coba lagi.',
      })
    } finally {
      setIsValidating(false)
    }
  }

  // Helper function to get SKU code based on game name
  // You should configure this properly in your database
  const getBuyerSkuCode = (gameName: string): string => {
    const skuMap: Record<string, string> = {
      'Mobile Legends': 'ml75',
      'Free Fire': 'ff50',
      'PUBG Mobile': 'pubg60',
      'Genshin Impact': 'gi60',
      'Valorant': 'val125',
      'Honkai Star Rail': 'hsr60',
    }
    return skuMap[gameName] || 'ml75'
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

    // Check if user ID is validated
    if (!validationResult?.valid) {
      alert('Silakan validasi User ID terlebih dahulu')
      return
    }

    setIsLoading(true)

    try {
      const userId = needsZoneId 
        ? `${formData.gameUserId}|${formData.zoneId}`
        : formData.gameUserId

      const response = await fetch('/api/topup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId: game.id,
          gameUserId: userId,
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
              borderColor: validationResult?.valid ? '#34D399' : '#7C3AED', 
              color: '#F0F6FC',
              fontFamily: 'Manrope, sans-serif'
            }}
            placeholder="Masukkan User ID game kamu"
            value={formData.gameUserId}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, gameUserId: e.target.value }))
              setValidationResult(null) // Reset validation when user changes ID
            }}
          />
        </div>

        {/* Zone ID Input (conditional) */}
        {needsZoneId && (
          <div>
            <label htmlFor="zoneId" className="block text-sm font-medium mb-2" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
              Zone ID / Server ID *
            </label>
            <input
              type="text"
              id="zoneId"
              required
              className="w-full px-4 py-3 border rounded-xl transition-all duration-200"
              style={{ 
                backgroundColor: '#0D1117', 
                borderColor: '#7C3AED', 
                color: '#F0F6FC',
                fontFamily: 'Manrope, sans-serif'
              }}
              placeholder="Masukkan Zone ID"
              value={formData.zoneId}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, zoneId: e.target.value }))
                setValidationResult(null)
              }}
            />
          </div>
        )}

        {/* Validate Button */}
        <button
          type="button"
          onClick={handleValidateUser}
          disabled={isValidating || !formData.gameUserId || (needsZoneId && !formData.zoneId)}
          className="w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ 
            backgroundColor: '#34D399', 
            color: '#0D1117',
            fontFamily: 'Manrope, sans-serif'
          }}
        >
          {isValidating ? '🔍 Memvalidasi...' : '✓ Validasi User ID'}
        </button>

        {/* Validation Result */}
        {validationResult && (
          <div 
            className="p-4 rounded-xl border"
            style={{
              backgroundColor: validationResult.valid ? 'rgba(52, 211, 153, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              borderColor: validationResult.valid ? '#34D399' : '#EF4444'
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{validationResult.valid ? '✅' : '❌'}</span>
              <div>
                {validationResult.valid && (
                  <div>
                    <p className="font-medium" style={{ color: '#34D399' }}>User ID Valid!</p>
                    <p className="text-sm mt-1" style={{ color: '#8B949E' }}>
                      Nickname: <span style={{ color: '#F0F6FC' }}>{validationResult.username}</span>
                    </p>
                  </div>
                )}
                {!validationResult.valid && (
                  <div>
                    <p className="font-medium" style={{ color: '#EF4444' }}>Validasi Gagal</p>
                    <p className="text-sm mt-1" style={{ color: '#8B949E' }}>
                      {validationResult.message}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Player Name (Auto-filled after validation) */}
        <div>
          <label htmlFor="playerName" className="block text-sm font-medium mb-2" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
            Nama Player
          </label>
          <input
            type="text"
            id="playerName"
            readOnly
            className="w-full px-4 py-3 border rounded-xl transition-all duration-200 bg-opacity-50"
            style={{ 
              backgroundColor: '#0D1117', 
              borderColor: '#7C3AED', 
              color: '#F0F6FC',
              fontFamily: 'Manrope, sans-serif'
            }}
            placeholder="Akan terisi otomatis setelah validasi"
            value={formData.playerName}
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
          disabled={
            isLoading || 
            !formData.gameUserId || 
            !formData.denominationId ||
            !validationResult?.valid
          }
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
