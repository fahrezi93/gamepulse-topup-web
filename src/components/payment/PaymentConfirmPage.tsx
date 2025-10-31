'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Transaction, Game, Denomination } from '@prisma/client'
import { 
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ArrowLeftIcon,
  QrCodeIcon
} from '@heroicons/react/24/outline'
import Image from 'next/image'

interface PaymentConfirmPageProps {
  transaction: Transaction & {
    game: Game
    denomination: Denomination
  }
  paymentMethod: 'DANA' | 'OVO' | 'GOPAY' | 'QRIS'
}

export default function PaymentConfirmPage({ transaction, paymentMethod }: PaymentConfirmPageProps) {
  const router = useRouter()
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'completed' | 'failed'>('pending')
  const [paymentData, setPaymentData] = useState<any>(null)
  const [countdown, setCountdown] = useState(600) // 10 minutes

  useEffect(() => {
    // Initialize payment
    initializePayment()
  }, [])

  useEffect(() => {
    // Countdown timer
    if (paymentStatus === 'pending' && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [paymentStatus, countdown])

  const initializePayment = async () => {
    setPaymentStatus('processing')
    
    try {
      const response = await fetch(`/api/payment/doku/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionId: transaction.id,
          paymentMethod: paymentMethod,
          amount: transaction.totalPrice,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setPaymentData(result)
        setPaymentStatus('pending')
        // Start polling for payment status
        startPolling()
      } else {
        setPaymentStatus('failed')
      }
    } catch (error) {
      console.error('Payment initialization error:', error)
      setPaymentStatus('failed')
    }
  }

  const startPolling = () => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/payment/${transaction.id}/status`)
        const result = await response.json()
        
        if (result.status === 'COMPLETED') {
          setPaymentStatus('completed')
          clearInterval(pollInterval)
        } else if (result.status === 'FAILED') {
          setPaymentStatus('failed')
          clearInterval(pollInterval)
        }
      } catch (error) {
        console.error('Polling error:', error)
      }
    }, 3000) // Poll every 3 seconds

    // Stop polling after 10 minutes
    setTimeout(() => clearInterval(pollInterval), 600000)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getPaymentMethodInfo = () => {
    switch (paymentMethod) {
      case 'DANA':
        return {
          name: 'DANA',
          icon: '💳',
          color: '#118EEA',
          instructions: [
            'Buka aplikasi DANA',
            'Pilih menu "Bayar"',
            'Scan QR Code di bawah ini',
            'Konfirmasi pembayaran'
          ]
        }
      case 'OVO':
        return {
          name: 'OVO',
          icon: '💜',
          color: '#4C3494',
          instructions: [
            'Buka aplikasi OVO',
            'Pilih menu "Scan"',
            'Scan QR Code di bawah ini',
            'Konfirmasi pembayaran'
          ]
        }
      case 'GOPAY':
        return {
          name: 'GoPay',
          icon: '💚',
          color: '#00AA13',
          instructions: [
            'Buka aplikasi Gojek',
            'Pilih menu "Bayar"',
            'Scan QR Code di bawah ini',
            'Konfirmasi pembayaran'
          ]
        }
      case 'QRIS':
        return {
          name: 'QRIS',
          icon: '📱',
          color: '#FF6B6B',
          instructions: [
            'Buka aplikasi e-wallet favorit Anda',
            'Pilih menu "Scan QRIS"',
            'Scan QR Code di bawah ini',
            'Konfirmasi pembayaran'
          ]
        }
    }
  }

  const methodInfo = getPaymentMethodInfo()

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'completed':
        return <CheckCircleIcon className="w-16 h-16" style={{ color: '#34D399' }} />
      case 'failed':
        return <XCircleIcon className="w-16 h-16" style={{ color: '#F87171' }} />
      case 'processing':
        return <ClockIcon className="w-16 h-16 animate-spin" style={{ color: '#7C3AED' }} />
      default:
        return <QrCodeIcon className="w-16 h-16" style={{ color: methodInfo.color }} />
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
          message: 'Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi atau pilih metode pembayaran lain.',
          color: '#F87171'
        }
      case 'processing':
        return {
          title: 'Memproses Pembayaran...',
          message: 'Mohon tunggu, kami sedang menyiapkan pembayaran Anda.',
          color: '#7C3AED'
        }
      default:
        return {
          title: `Bayar dengan ${methodInfo.name}`,
          message: 'Scan QR Code di bawah ini untuk menyelesaikan pembayaran.',
          color: methodInfo.color
        }
    }
  }

  const statusInfo = getStatusMessage()

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push(`/payment/${transaction.id}`)}
          className="flex items-center gap-2 mb-4 transition-colors"
          style={{ color: '#8B949E' }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#F0F6FC'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#8B949E'}
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span style={{ fontFamily: 'Manrope, sans-serif' }}>Kembali</span>
        </button>
      </div>

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

        {/* Countdown Timer */}
        {paymentStatus === 'pending' && (
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: '#0D1117' }}>
            <ClockIcon className="w-5 h-5" style={{ color: methodInfo.color }} />
            <span className="font-mono text-lg font-bold" style={{ color: methodInfo.color }}>
              {formatTime(countdown)}
            </span>
          </div>
        )}
      </div>

      {/* Payment Instructions */}
      {paymentStatus === 'pending' && paymentData && (
        <>
          {/* QR Code */}
          <div className="rounded-xl shadow-sm p-8 mb-6 border text-center" style={{ backgroundColor: '#161B22', borderColor: methodInfo.color }}>
            <div className="inline-block p-4 rounded-xl" style={{ backgroundColor: '#F0F6FC' }}>
              {paymentData.qrCode ? (
                <div className="w-64 h-64 relative">
                  <Image 
                    src={paymentData.qrCode} 
                    alt="QR Code" 
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="w-64 h-64 flex items-center justify-center" style={{ backgroundColor: '#E5E7EB' }}>
                  <QrCodeIcon className="w-32 h-32" style={{ color: '#9CA3AF' }} />
                </div>
              )}
            </div>
            
            <div className="mt-4 text-sm" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
              Scan QR Code dengan aplikasi {methodInfo.name}
            </div>
          </div>

          {/* Instructions */}
          <div className="rounded-xl shadow-sm p-6 mb-6 border" style={{ backgroundColor: '#161B22', borderColor: '#7C3AED' }}>
            <h2 className="text-lg font-bold mb-4" style={{ color: '#F0F6FC', fontFamily: 'Playfair Display, serif' }}>
              Cara Pembayaran
            </h2>
            
            <ol className="space-y-3">
              {methodInfo.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: methodInfo.color, color: '#F0F6FC' }}>
                    {index + 1}
                  </span>
                  <span style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
                    {instruction}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* Transaction Details */}
          <div className="rounded-xl shadow-sm p-6 border" style={{ backgroundColor: '#161B22', borderColor: '#7C3AED' }}>
            <h2 className="text-lg font-bold mb-4" style={{ color: '#F0F6FC', fontFamily: 'Playfair Display, serif' }}>
              Detail Pembayaran
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b" style={{ borderColor: '#7C3AED' }}>
                <span style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>Game:</span>
                <span className="font-medium" style={{ color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}>{transaction.game.name}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b" style={{ borderColor: '#7C3AED' }}>
                <span style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>Item:</span>
                <span className="font-medium" style={{ color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}>{transaction.denomination.name}</span>
              </div>
              
              <div className="flex justify-between py-3 px-4 rounded-lg" style={{ backgroundColor: '#0D1117' }}>
                <span className="font-semibold" style={{ color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}>Total:</span>
                <span className="font-bold text-xl" style={{ color: '#34D399', fontFamily: 'Manrope, sans-serif' }}>
                  {formatPrice(transaction.totalPrice)}
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Action Buttons */}
      {paymentStatus === 'completed' && (
        <button
          onClick={() => router.push('/')}
          className="w-full py-4 px-6 rounded-xl font-bold text-lg transition-all transform hover:scale-105 hover:shadow-lg active:scale-95"
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
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => router.push(`/payment/${transaction.id}`)}
            className="flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all transform hover:scale-105 hover:shadow-lg active:scale-95"
            style={{ 
              backgroundColor: '#7C3AED', 
              color: '#F0F6FC',
              fontFamily: 'Manrope, sans-serif',
              boxShadow: '0 4px 14px 0 rgba(124, 58, 237, 0.39)'
            }}
          >
            🔄 Pilih Metode Lain
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="flex-1 border-2 py-4 px-6 rounded-xl font-bold text-lg transition-all"
            style={{ 
              borderColor: '#8B949E', 
              color: '#8B949E',
              backgroundColor: 'transparent',
              fontFamily: 'Manrope, sans-serif'
            }}
          >
            🏠 Kembali ke Beranda
          </button>
        </div>
      )}
    </div>
  )
}
