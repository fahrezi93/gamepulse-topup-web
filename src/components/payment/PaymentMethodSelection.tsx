'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Transaction, Game, Denomination } from '@prisma/client'
import { 
  CheckCircleIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'

interface PaymentMethodSelectionProps {
  transaction: Transaction & {
    game: Game
    denomination: Denomination
  }
}

type PaymentMethod = 'DANA' | 'OVO' | 'GOPAY' | 'QRIS'

const paymentMethods = [
  {
    id: 'DANA' as PaymentMethod,
    name: 'DANA',
    icon: '💳',
    description: 'Bayar dengan DANA',
    color: '#118EEA'
  },
  {
    id: 'OVO' as PaymentMethod,
    name: 'OVO',
    icon: '💜',
    description: 'Bayar dengan OVO',
    color: '#4C3494'
  },
  {
    id: 'GOPAY' as PaymentMethod,
    name: 'GoPay',
    icon: '💚',
    description: 'Bayar dengan GoPay',
    color: '#00AA13'
  },
  {
    id: 'QRIS' as PaymentMethod,
    name: 'QRIS',
    icon: '📱',
    description: 'Bayar dengan QRIS',
    color: '#FF6B6B'
  }
]

export default function PaymentMethodSelection({ transaction }: PaymentMethodSelectionProps) {
  const router = useRouter()
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const shortenTransactionId = (id: string) => {
    if (id.length <= 12) return id
    return `${id.substring(0, 8)}...${id.substring(id.length - 4)}`
  }

  const copyTransactionId = async () => {
    try {
      await navigator.clipboard.writeText(transaction.id)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handlePayment = async () => {
    if (!selectedMethod) return

    setIsProcessing(true)

    try {
      const response = await fetch(`/api/payment/doku/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionId: transaction.id,
          paymentMethod: selectedMethod,
        }),
      })

      const result = await response.json()

      if (response.ok && result.paymentUrl) {
        // Redirect to DOKU Checkout page
        window.location.href = result.paymentUrl
      } else {
        alert(result.error || 'Terjadi kesalahan saat memproses pembayaran')
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('Terjadi kesalahan saat memproses pembayaran')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-4 transition-colors"
          style={{ color: '#8B949E' }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#F0F6FC'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#8B949E'}
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span style={{ fontFamily: 'Manrope, sans-serif' }}>Kembali</span>
        </button>
        <h1 className="text-3xl font-bold" style={{ color: '#F0F6FC', fontFamily: 'Playfair Display, serif' }}>
          Pilih Metode Pembayaran
        </h1>
        <p className="mt-2" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
          Pilih metode pembayaran yang Anda inginkan
        </p>
      </div>

      {/* Transaction Summary */}
      <div className="rounded-xl shadow-sm p-6 mb-6 border" style={{ backgroundColor: '#161B22', borderColor: '#7C3AED' }}>
        <h2 className="text-lg font-bold mb-4" style={{ color: '#F0F6FC', fontFamily: 'Playfair Display, serif' }}>
          Ringkasan Pesanan
        </h2>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: '#7C3AED' }}>
            <span style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>ID Transaksi:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm" style={{ color: '#F0F6FC' }}>
                {shortenTransactionId(transaction.id)}
              </span>
              <button
                onClick={copyTransactionId}
                className="p-1.5 rounded-lg transition-all hover:scale-110"
                style={{ backgroundColor: isCopied ? '#34D399' : '#7C3AED' }}
                title="Salin ID Transaksi"
              >
                {isCopied ? (
                  <CheckIcon className="w-4 h-4" style={{ color: '#F0F6FC' }} />
                ) : (
                  <ClipboardDocumentIcon className="w-4 h-4" style={{ color: '#F0F6FC' }} />
                )}
              </button>
            </div>
          </div>
          
          <div className="flex justify-between py-2 border-b" style={{ borderColor: '#7C3AED' }}>
            <span style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>Game:</span>
            <span className="font-medium" style={{ color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}>{transaction.game.name}</span>
          </div>
          
          <div className="flex justify-between py-2 border-b" style={{ borderColor: '#7C3AED' }}>
            <span style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>Item:</span>
            <span className="font-medium" style={{ color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}>{transaction.denomination.name}</span>
          </div>
          
          <div className="flex justify-between py-3 px-4 rounded-lg" style={{ backgroundColor: '#0D1117' }}>
            <span className="font-semibold" style={{ color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}>Total Pembayaran:</span>
            <span className="font-bold text-xl" style={{ color: '#34D399', fontFamily: 'Manrope, sans-serif' }}>
              {formatPrice(transaction.totalPrice)}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="rounded-xl shadow-sm p-6 mb-6 border" style={{ backgroundColor: '#161B22', borderColor: '#7C3AED' }}>
        <h2 className="text-lg font-bold mb-4" style={{ color: '#F0F6FC', fontFamily: 'Playfair Display, serif' }}>
          Metode Pembayaran <span className="text-sm" style={{ color: '#34D399' }}>*</span>
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className="relative p-4 rounded-xl border-2 transition-all hover:scale-105"
              style={{
                backgroundColor: selectedMethod === method.id ? '#0D1117' : '#161B22',
                borderColor: selectedMethod === method.id ? method.color : '#7C3AED',
                boxShadow: selectedMethod === method.id ? `0 0 20px ${method.color}40` : 'none'
              }}
            >
              {selectedMethod === method.id && (
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: method.color }}>
                  <CheckCircleIcon className="w-4 h-4" style={{ color: '#F0F6FC' }} />
                </div>
              )}
              
              <div className="flex flex-col items-center gap-2">
                <div className="text-4xl">{method.icon}</div>
                <div className="font-bold" style={{ color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}>
                  {method.name}
                </div>
                <div className="text-xs text-center" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
                  {method.description}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handlePayment}
        disabled={!selectedMethod || isProcessing}
        className="w-full py-4 px-6 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 hover:shadow-lg active:scale-95"
        style={{ 
          backgroundColor: '#7C3AED', 
          color: '#F0F6FC',
          fontFamily: 'Manrope, sans-serif',
          boxShadow: '0 4px 14px 0 rgba(124, 58, 237, 0.39)'
        }}
      >
        {isProcessing ? '⏳ Memproses...' : 'Lanjutkan Pembayaran'}
      </button>
    </div>
  )
}
