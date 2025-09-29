'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Transaction, Game, Denomination } from '@prisma/client'
import { 
  CheckCircleIcon, 
  ClockIcon, 
  XCircleIcon,
  CreditCardIcon 
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
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'completed' | 'failed'>('pending')

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const handlePayment = async () => {
    setIsProcessing(true)
    setPaymentStatus('processing')

    try {
      const response = await fetch(`/api/payment/${transaction.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()

      if (response.ok) {
        setPaymentStatus(result.status === 'COMPLETED' ? 'completed' : 'failed')
      } else {
        setPaymentStatus('failed')
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
          <div className="flex justify-between py-2 border-b" style={{ borderColor: '#7C3AED' }}>
            <span style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>ID Transaksi:</span>
            <span className="font-mono text-sm" style={{ color: '#F0F6FC' }}>{transaction.id}</span>
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

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        {paymentStatus === 'pending' && (
          <>
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="flex-1 py-3 px-6 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{ 
                backgroundColor: '#7C3AED', 
                color: '#F0F6FC',
                fontFamily: 'Manrope, sans-serif'
              }}
            >
              {isProcessing ? 'Memproses...' : 'Bayar Sekarang'}
            </button>
            
            <button
              onClick={handleCancel}
              disabled={isProcessing}
              className="flex-1 border py-3 px-6 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{ 
                borderColor: '#8B949E', 
                color: '#8B949E',
                backgroundColor: 'transparent',
                fontFamily: 'Manrope, sans-serif'
              }}
            >
              Batalkan
            </button>
          </>
        )}
        
        {paymentStatus === 'completed' && (
          <button
            onClick={() => router.push('/')}
            className="w-full py-3 px-6 rounded-lg font-medium transition-colors"
            style={{ 
              backgroundColor: '#34D399', 
              color: '#F0F6FC',
              fontFamily: 'Manrope, sans-serif'
            }}
          >
            Kembali ke Beranda
          </button>
        )}
        
        {paymentStatus === 'failed' && (
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setPaymentStatus('pending')}
              className="flex-1 py-3 px-6 rounded-lg font-medium transition-colors"
              style={{ 
                backgroundColor: '#7C3AED', 
                color: '#F0F6FC',
                fontFamily: 'Manrope, sans-serif'
              }}
            >
              Coba Lagi
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="flex-1 border py-3 px-6 rounded-lg font-medium transition-colors"
              style={{ 
                borderColor: '#8B949E', 
                color: '#8B949E',
                backgroundColor: 'transparent',
                fontFamily: 'Manrope, sans-serif'
              }}
            >
              Kembali ke Beranda
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
