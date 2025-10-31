'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircleIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline'

export default function PaymentCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'checking' | 'success' | 'failed'>('checking')
  const [transactionId, setTransactionId] = useState<string | null>(null)

  useEffect(() => {
    // Get transaction ID from URL params
    const invoiceNumber = searchParams.get('invoice')
    
    if (invoiceNumber) {
      setTransactionId(invoiceNumber)
      checkPaymentStatus(invoiceNumber)
    } else {
      setStatus('failed')
    }
  }, [searchParams])

  const checkPaymentStatus = async (invoiceNumber: string) => {
    try {
      // Poll for payment status
      const maxAttempts = 10
      let attempts = 0

      const pollStatus = async () => {
        const response = await fetch(`/api/payment/${invoiceNumber}/status`)
        const result = await response.json()

        if (result.status === 'COMPLETED') {
          setStatus('success')
        } else if (result.status === 'FAILED') {
          setStatus('failed')
        } else if (attempts < maxAttempts) {
          attempts++
          setTimeout(pollStatus, 2000) // Check again after 2 seconds
        } else {
          // Timeout - still pending
          setStatus('checking')
        }
      }

      pollStatus()
    } catch (error) {
      console.error('Error checking payment status:', error)
      setStatus('failed')
    }
  }

  const getStatusInfo = () => {
    switch (status) {
      case 'success':
        return {
          icon: <CheckCircleIcon className="w-20 h-20" style={{ color: '#34D399' }} />,
          title: 'Pembayaran Berhasil! 🎉',
          message: 'Top up berhasil diproses. Item akan segera masuk ke akun game Anda dalam 1-5 menit.',
          color: '#34D399'
        }
      case 'failed':
        return {
          icon: <XCircleIcon className="w-20 h-20" style={{ color: '#F87171' }} />,
          title: 'Pembayaran Gagal 😞',
          message: 'Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.',
          color: '#F87171'
        }
      default:
        return {
          icon: <ClockIcon className="w-20 h-20 animate-spin" style={{ color: '#7C3AED' }} />,
          title: 'Memeriksa Status Pembayaran...',
          message: 'Mohon tunggu, kami sedang memverifikasi pembayaran Anda.',
          color: '#7C3AED'
        }
    }
  }

  const statusInfo = getStatusInfo()

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0D1117' }}>
      <div className="max-w-md w-full mx-4">
        <div className="rounded-xl shadow-sm p-8 text-center border" style={{ backgroundColor: '#161B22', borderColor: statusInfo.color }}>
          <div className="flex justify-center mb-6">
            {statusInfo.icon}
          </div>
          
          <h1 className="text-3xl font-bold mb-4" style={{ color: statusInfo.color, fontFamily: 'Playfair Display, serif' }}>
            {statusInfo.title}
          </h1>
          
          <p className="mb-8" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
            {statusInfo.message}
          </p>

          {transactionId && (
            <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#0D1117' }}>
              <p className="text-sm mb-1" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
                ID Transaksi:
              </p>
              <p className="font-mono text-sm" style={{ color: '#F0F6FC' }}>
                {transactionId}
              </p>
            </div>
          )}

          {status !== 'checking' && (
            <div className="flex flex-col gap-3">
              {status === 'success' && (
                <button
                  onClick={() => router.push('/profile/transactions')}
                  className="w-full py-3 px-6 rounded-xl font-bold transition-all transform hover:scale-105"
                  style={{ 
                    backgroundColor: '#7C3AED', 
                    color: '#F0F6FC',
                    fontFamily: 'Manrope, sans-serif'
                  }}
                >
                  Lihat Riwayat Transaksi
                </button>
              )}
              
              <button
                onClick={() => router.push('/')}
                className="w-full py-3 px-6 rounded-xl font-bold border-2 transition-all"
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
    </div>
  )
}
