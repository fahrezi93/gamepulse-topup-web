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
        return <CheckCircleIcon className="w-16 h-16 text-green-500" />
      case 'failed':
        return <XCircleIcon className="w-16 h-16 text-red-500" />
      case 'processing':
        return <ClockIcon className="w-16 h-16 text-blue-500 animate-spin" />
      default:
        return <CreditCardIcon className="w-16 h-16 text-gray-400" />
    }
  }

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'completed':
        return {
          title: 'Pembayaran Berhasil! 🎉',
          message: 'Top up berhasil diproses. Item akan segera masuk ke akun game Anda dalam 1-5 menit.',
          color: 'text-green-600'
        }
      case 'failed':
        return {
          title: 'Pembayaran Gagal 😞',
          message: 'Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi atau hubungi customer service.',
          color: 'text-red-600'
        }
      case 'processing':
        return {
          title: 'Memproses Pembayaran...',
          message: 'Mohon tunggu, kami sedang memproses pembayaran Anda.',
          color: 'text-blue-600'
        }
      default:
        return {
          title: 'Konfirmasi Pembayaran',
          message: 'Periksa kembali detail pesanan Anda sebelum melakukan pembayaran.',
          color: 'text-gray-600'
        }
    }
  }

  const statusInfo = getStatusMessage()

  return (
    <div className="max-w-2xl mx-auto">
      {/* Status Section */}
      <div className="bg-white rounded-xl shadow-sm p-8 text-center mb-6 border border-gray-100">
        <div className="flex justify-center mb-4">
          {getStatusIcon()}
        </div>
        <h1 className={`text-2xl font-bold mb-2 ${statusInfo.color}`}>
          {statusInfo.title}
        </h1>
        <p className="text-gray-600">
          {statusInfo.message}
        </p>
      </div>

      {/* Transaction Details */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Detail Transaksi</h2>
        
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">ID Transaksi:</span>
            <span className="font-mono text-sm">{transaction.id}</span>
          </div>
          
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Game:</span>
            <span className="font-medium">{transaction.game.name}</span>
          </div>
          
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">User ID:</span>
            <span className="font-medium">{transaction.gameUserId}</span>
          </div>
          
          {transaction.playerName && (
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Nama Player:</span>
              <span className="font-medium">{transaction.playerName}</span>
            </div>
          )}
          
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Item:</span>
            <span className="font-medium">{transaction.denomination.name}</span>
          </div>
          
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Metode Pembayaran:</span>
            <span className="font-medium uppercase">{transaction.paymentMethod}</span>
          </div>
          
          <div className="flex justify-between py-3 bg-gray-50 px-4 rounded-lg">
            <span className="font-semibold">Total Pembayaran:</span>
            <span className="font-bold text-xl text-blue-600">
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
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? 'Memproses...' : 'Bayar Sekarang'}
            </button>
            
            <button
              onClick={handleCancel}
              disabled={isProcessing}
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
            >
              Batalkan
            </button>
          </>
        )}
        
        {paymentStatus === 'completed' && (
          <button
            onClick={() => router.push('/')}
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Kembali ke Beranda
          </button>
        )}
        
        {paymentStatus === 'failed' && (
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setPaymentStatus('pending')}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Coba Lagi
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Kembali ke Beranda
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
