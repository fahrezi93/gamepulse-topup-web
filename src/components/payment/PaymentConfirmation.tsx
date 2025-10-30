'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Transaction, Game, Denomination } from '@prisma/client'
import { 
  CheckCircleIcon, 
  ClockIcon, 
  XCircleIcon,
  CreditCardIcon,
  ClipboardDocumentIcon,
  CheckIcon
} from '@heroicons/react/24/outline'

interface PaymentConfirmationProps {
  transaction: Transaction & {
    game: Game
    denomination: Denomination
  }
}

export default function PaymentConfirmation({ transaction }: PaymentConfirmationProps) {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  
  // Card form state
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [cardName, setCardName] = useState('')
  
  // Set initial payment status based on transaction status
  const getInitialStatus = (): 'pending' | 'processing' | 'completed' | 'failed' => {
    if (transaction.status === 'COMPLETED') return 'completed'
    if (transaction.status === 'FAILED') return 'failed'
    return 'pending'
  }
  
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'completed' | 'failed'>(getInitialStatus())

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  // Shorten transaction ID for display
  const shortenTransactionId = (id: string) => {
    if (id.length <= 12) return id
    return `${id.substring(0, 8)}...${id.substring(id.length - 4)}`
  }

  // Copy transaction ID to clipboard
  const copyTransactionId = async () => {
    try {
      await navigator.clipboard.writeText(transaction.id)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  // Format card number with spaces (4 digits)
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '')
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned
    return formatted.substring(0, 19) // Max 16 digits + 3 spaces
  }

  // Format expiry MM/YY
  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length >= 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`
    }
    return cleaned
  }

  const handlePayment = async () => {
    setIsProcessing(true)
    setPaymentStatus('processing')

    try {
      // Prepare card details if provided
      let cardDetails = null
      
      if (cardNumber && cardExpiry && cardCvv) {
        const [expMonth, expYear] = cardExpiry.split('/')
        cardDetails = {
          cardNumber: cardNumber.replace(/\s/g, ''),
          cardExpMonth: expMonth,
          cardExpYear: expYear,
          cardCvv: cardCvv,
        }
      }

      const response = await fetch(`/api/payment/${transaction.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethod: cardDetails ? 'credit_card' : 'simulation',
          cardDetails,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setPaymentStatus(result.status === 'COMPLETED' ? 'completed' : 'failed')
      } else {
        // If transaction already processed, show appropriate status
        if (response.status === 400 && result.error?.includes('sudah diproses')) {
          alert('Transaksi ini sudah diproses sebelumnya. Silakan refresh halaman untuk melihat status terbaru.')
          window.location.reload()
        } else {
          setPaymentStatus('failed')
        }
      }
    } catch (error) {
      console.error('Payment error:', error)
      setPaymentStatus('failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancel = async () => {
    if (confirm('Apakah Anda yakin ingin membatalkan transaksi ini?')) {
      try {
        await fetch(`/api/payment/${transaction.id}`, {
          method: 'DELETE',
        })
        router.push('/')
      } catch (error) {
        console.error('Cancel error:', error)
      }
    }
  }

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'completed':
        return <CheckCircleIcon className="w-16 h-16" style={{ color: '#34D399' }} />
      case 'failed':
        return <XCircleIcon className="w-16 h-16" style={{ color: '#7C3AED' }} />
      case 'processing':
        return <ClockIcon className="w-16 h-16 animate-spin" style={{ color: '#34D399' }} />
      default:
        return <CreditCardIcon className="w-16 h-16" style={{ color: '#8B949E' }} />
    }
  }

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'completed':
        return {
          title: 'Pembayaran Berhasil! 🎉',
          message: 'Top up berhasil diproses. Item akan segera masuk ke akun game Anda dalam 1-5 menit.',
          color: '#34D399'
        }
      case 'failed':
        return {
          title: 'Pembayaran Gagal 😞',
          message: 'Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi atau hubungi customer service.',
          color: '#7C3AED'
        }
      case 'processing':
        return {
          title: 'Memproses Pembayaran...',
          message: 'Mohon tunggu, kami sedang memproses pembayaran Anda.',
          color: '#34D399'
        }
      default:
        return {
          title: 'Konfirmasi Pembayaran',
          message: 'Periksa kembali detail pesanan Anda sebelum melakukan pembayaran.',
          color: '#8B949E'
        }
    }
  }

  const statusInfo = getStatusMessage()

  return (
    <div className="max-w-2xl mx-auto">
      {/* Status Section */}
      <div className="rounded-xl shadow-sm p-8 text-center mb-6 border" style={{ backgroundColor: '#161B22', borderColor: statusInfo.color }}>
        <div className="flex justify-center mb-4">
          {getStatusIcon()}
        </div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: statusInfo.color, fontFamily: 'Playfair Display, serif' }}>
          {statusInfo.title}
        </h1>
        <p style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
          {statusInfo.message}
        </p>
      </div>

      {/* Transaction Details */}
      <div className="rounded-xl shadow-sm p-6 mb-6 border" style={{ backgroundColor: '#161B22', borderColor: '#7C3AED' }}>
        <h2 className="text-xl font-bold mb-4" style={{ color: '#F0F6FC', fontFamily: 'Playfair Display, serif' }}>Detail Transaksi</h2>
        
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
            <span style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>User ID:</span>
            <span className="font-medium" style={{ color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}>{transaction.gameUserId}</span>
          </div>
          
          {transaction.playerName && (
            <div className="flex justify-between py-2 border-b" style={{ borderColor: '#7C3AED' }}>
              <span style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>Nama Player:</span>
              <span className="font-medium" style={{ color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}>{transaction.playerName}</span>
            </div>
          )}
          
          <div className="flex justify-between py-2 border-b" style={{ borderColor: '#7C3AED' }}>
            <span style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>Item:</span>
            <span className="font-medium" style={{ color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}>{transaction.denomination.name}</span>
          </div>
          
          <div className="flex justify-between py-2 border-b" style={{ borderColor: '#7C3AED' }}>
            <span style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>Metode Pembayaran:</span>
            <span className="font-medium uppercase" style={{ color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}>{transaction.paymentMethod}</span>
          </div>
          
          <div className="flex justify-between py-3 px-4 rounded-lg" style={{ backgroundColor: '#0D1117' }}>
            <span className="font-semibold" style={{ color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}>Total Pembayaran:</span>
            <span className="font-bold text-xl" style={{ color: '#34D399', fontFamily: 'Manrope, sans-serif' }}>
              {formatPrice(transaction.totalPrice)}
            </span>
          </div>
        </div>
      </div>

      {/* Custom Payment Form (DOKU Sandbox) */}
      {paymentStatus === 'pending' && showPaymentForm && (
        <div className="rounded-xl shadow-sm p-6 mb-6 border" style={{ backgroundColor: '#161B22', borderColor: '#34D399' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold" style={{ color: '#F0F6FC', fontFamily: 'Playfair Display, serif' }}>
              💳 Payment Details
            </h2>
            <span className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: '#34D399', color: '#0D1117', fontWeight: 'bold' }}>
              SANDBOX MODE
            </span>
          </div>

          {/* Test Card Info */}
          <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: '#0D1117', borderLeft: '4px solid #34D399' }}>
            <p className="text-xs font-semibold mb-1" style={{ color: '#34D399' }}>🧪 Test Card (DOKU Sandbox):</p>
            <p className="text-xs font-mono" style={{ color: '#8B949E' }}>
              Card: <span style={{ color: '#F0F6FC' }}>5401 2345 6789 0123</span><br/>
              Expiry: <span style={{ color: '#F0F6FC' }}>12/25</span> | CVV: <span style={{ color: '#F0F6FC' }}>123</span>
            </p>
          </div>

          <div className="space-y-4">
            {/* Card Number */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
                Card Number
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="5401 2345 6789 0123"
                className="w-full px-4 py-3 rounded-lg border-2 font-mono"
                style={{ 
                  backgroundColor: '#0D1117', 
                  borderColor: '#7C3AED', 
                  color: '#F0F6FC',
                  outline: 'none'
                }}
                maxLength={19}
              />
            </div>

            {/* Card Name */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
                Cardholder Name
              </label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value.toUpperCase())}
                placeholder="JOHN DOE"
                className="w-full px-4 py-3 rounded-lg border-2"
                style={{ 
                  backgroundColor: '#0D1117', 
                  borderColor: '#7C3AED', 
                  color: '#F0F6FC',
                  outline: 'none'
                }}
              />
            </div>

            {/* Expiry & CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
                  Expiry Date
                </label>
                <input
                  type="text"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                  placeholder="MM/YY"
                  className="w-full px-4 py-3 rounded-lg border-2 font-mono"
                  style={{ 
                    backgroundColor: '#0D1117', 
                    borderColor: '#7C3AED', 
                    color: '#F0F6FC',
                    outline: 'none'
                  }}
                  maxLength={5}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
                  CVV
                </label>
                <input
                  type="text"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
                  placeholder="123"
                  className="w-full px-4 py-3 rounded-lg border-2 font-mono"
                  style={{ 
                    backgroundColor: '#0D1117', 
                    borderColor: '#7C3AED', 
                    color: '#F0F6FC',
                    outline: 'none'
                  }}
                  maxLength={3}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        {paymentStatus === 'pending' && (
          <>
            {!showPaymentForm ? (
              <button
                onClick={() => setShowPaymentForm(true)}
                className="flex-1 py-3 px-6 rounded-lg font-semibold transition-all transform hover:scale-105 hover:shadow-lg active:scale-95"
                style={{ 
                  backgroundColor: '#7C3AED', 
                  color: '#F0F6FC',
                  fontFamily: 'Manrope, sans-serif',
                  boxShadow: '0 4px 14px 0 rgba(124, 58, 237, 0.39)'
                }}
              >
                💳 Pay with Credit Card (DOKU)
              </button>
            ) : (
              <>
                <button
                  onClick={handlePayment}
                  disabled={isProcessing || !cardNumber || !cardExpiry || !cardCvv}
                  className="flex-1 py-3 px-6 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 hover:shadow-lg active:scale-95"
                  style={{ 
                    backgroundColor: '#7C3AED', 
                    color: '#F0F6FC',
                    fontFamily: 'Manrope, sans-serif',
                    boxShadow: '0 4px 14px 0 rgba(124, 58, 237, 0.39)'
                  }}
                >
                  {isProcessing ? '⏳ Memproses...' : '💳 Bayar Sekarang'}
                </button>
                
                <button
                  onClick={handleCancel}
                  disabled={isProcessing}
                  className="flex-1 border-2 py-3 px-6 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-opacity-10 hover:border-opacity-100"
                  style={{ 
                    borderColor: '#8B949E', 
                    color: '#8B949E',
                    backgroundColor: 'transparent',
                    fontFamily: 'Manrope, sans-serif'
                  }}
                >
                  ❌ Batalkan
                </button>
              </>
            )}
          </>
        )}
        
        {paymentStatus === 'completed' && (
          <button
            onClick={() => router.push('/')}
            className="w-full py-3 px-6 rounded-lg font-semibold transition-all transform hover:scale-105 hover:shadow-lg active:scale-95"
            style={{ 
              backgroundColor: '#34D399', 
              color: '#F0F6FC',
              fontFamily: 'Manrope, sans-serif',
              boxShadow: '0 4px 14px 0 rgba(52, 211, 153, 0.39)'
            }}
          >
            🏠 Kembali ke Beranda
          </button>
        )}
        
        {paymentStatus === 'failed' && (
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <button
              onClick={() => setPaymentStatus('pending')}
              className="flex-1 py-3 px-6 rounded-lg font-semibold transition-all transform hover:scale-105 hover:shadow-lg active:scale-95"
              style={{ 
                backgroundColor: '#7C3AED', 
                color: '#F0F6FC',
                fontFamily: 'Manrope, sans-serif',
                boxShadow: '0 4px 14px 0 rgba(124, 58, 237, 0.39)'
              }}
            >
              🔄 Coba Lagi
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="flex-1 border-2 py-3 px-6 rounded-lg font-semibold transition-all hover:bg-opacity-10"
              style={{ 
                borderColor: '#34D399', 
                color: '#34D399',
                backgroundColor: 'transparent',
                fontFamily: 'Manrope, sans-serif'
              }}
            >
              🏠 Kembali ke Beranda
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
