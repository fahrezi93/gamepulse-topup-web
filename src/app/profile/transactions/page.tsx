'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useState, useEffect, useCallback } from 'react'
import { redirect } from 'next/navigation'
import PageTransition from '@/components/ui/PageTransition'
import FadeIn from '@/components/ui/FadeIn'
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline'

interface Transaction {
  id: string
  gameUserId: string
  playerName?: string
  status: string
  totalPrice: number
  paymentMethod?: string
  createdAt: string
  game: {
    name: string
    category: string
  }
  denomination: {
    name: string
    amount: number
  }
}

export default function TransactionsPage() {
  const { user, loading } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Define fetchTransactions with useCallback to avoid dependency issues
  const fetchTransactions = useCallback(async () => {
    try {
      if (!user) return

      // Get Firebase token
      const token = await user.getIdToken()
      
      const response = await fetch('/api/profile/transactions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()

      if (response.ok) {
        setTransactions(data.transactions)
      } else {
        console.error('Failed to fetch transactions:', data.error)
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  // All hooks must be called before any conditional returns
  useEffect(() => {
    if (user) {
      fetchTransactions()
    }
  }, [user, fetchTransactions])

  // Conditional returns after all hooks
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  if (!user) {
    redirect('/auth/signin')
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
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircleIcon className="w-5 h-5 text-green-400" />
      case 'FAILED':
        return <XCircleIcon className="w-5 h-5 text-red-400" />
      case 'PENDING':
        return <ClockIcon className="w-5 h-5 text-yellow-400" />
      case 'CANCELLED':
        return <ExclamationTriangleIcon className="w-5 h-5 text-gray-400" />
      default:
        return <ClockIcon className="w-5 h-5 text-blue-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { color: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400', text: 'Pending' },
      PROCESSING: { color: 'bg-blue-500/10 border-blue-500/20 text-blue-400', text: 'Processing' },
      COMPLETED: { color: 'bg-green-500/10 border-green-500/20 text-green-400', text: 'Berhasil' },
      FAILED: { color: 'bg-red-500/10 border-red-500/20 text-red-400', text: 'Gagal' },
      CANCELLED: { color: 'bg-gray-500/10 border-gray-500/20 text-gray-400', text: 'Dibatalkan' }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        {config.text}
      </span>
    )
  }

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.gameUserId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  return (
    <PageTransition>
      <div className="min-h-screen" style={{ backgroundColor: '#0D1117' }}>
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{ backgroundColor: 'rgba(52, 211, 153, 0.1)' }}></div>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 rounded-full blur-xl animate-pulse" style={{ backgroundColor: 'rgba(52, 211, 153, 0.3)' }}></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 rounded-full blur-xl animate-pulse delay-1000" style={{ backgroundColor: 'rgba(124, 58, 237, 0.25)' }}></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <FadeIn delay={100}>
              <div className="text-center mb-12">
                <div className="flex justify-center mb-8">
                  <div className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-2xl" style={{ backgroundColor: '#34D399' }}>
                    <CreditCardIcon className="w-12 h-12" style={{ color: '#F0F6FC' }} />
                  </div>
                </div>

                <h1 className="text-5xl md:text-6xl font-black mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                  <span style={{ color: '#34D399' }}>
                    Riwayat
                  </span>
                  <br />
                  <span style={{ color: '#F0F6FC' }}>Transaksi</span>
                </h1>
                
                <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
                  Lihat semua transaksi top up yang pernah kamu lakukan
                </p>
              </div>
            </FadeIn>

            {/* Filters */}
            <FadeIn delay={200}>
              <div 
                className="group relative backdrop-blur-sm border p-6 rounded-2xl transition-all duration-300 mb-8"
                style={{ 
                  backgroundColor: '#161B22', 
                  borderColor: '#34D399'
                }}
              >
            {/* Background Hover Effect */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" style={{ backgroundColor: '#34D399' }}></div>
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#8B949E' }} />
                    <input
                      type="text"
                      placeholder="Cari berdasarkan game atau User ID..."
                      className="w-full pl-10 pr-4 py-3 border rounded-xl placeholder-gray-400 focus:ring-2 focus:border-transparent transition-all duration-300"
                      style={{ 
                        backgroundColor: '#0D1117', 
                        borderColor: '#34D399',
                        color: '#F0F6FC',
                        fontFamily: 'Manrope, sans-serif'
                      }}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div className="lg:w-48">
                  <select
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300"
                    style={{ 
                      backgroundColor: '#0D1117', 
                      borderColor: '#7C3AED',
                      color: '#F0F6FC',
                      fontFamily: 'Manrope, sans-serif'
                    }}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">Semua Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="COMPLETED">Berhasil</option>
                    <option value="FAILED">Gagal</option>
                    <option value="CANCELLED">Dibatalkan</option>
                  </select>
                </div>
              </div>
            </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10 blur-xl" style={{ backgroundColor: '#34D399' }}></div>
              </div>
            </FadeIn>

            {/* Transactions List */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#34D399' }}></div>
              </div>
            ) : filteredTransactions.length > 0 ? (
              <div className="space-y-4">
                {filteredTransactions.map((transaction, index) => (
                  <FadeIn key={transaction.id} delay={300 + (index * 100)}>
                <div 
                  key={transaction.id} 
                  className="group relative backdrop-blur-sm border p-6 rounded-2xl transition-all duration-300 hover:scale-105 transform"
                  style={{ 
                    backgroundColor: '#161B22', 
                    borderColor: '#7C3AED'
                  }}
                >
                  {/* Background Hover Effect */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" style={{ backgroundColor: '#7C3AED' }}></div>
                  
                  <div className="relative z-10">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#34D399' }}>
                          <span className="font-bold" style={{ color: '#F0F6FC' }}>
                            {transaction.game.name.charAt(0)}
                          </span>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-lg font-bold" style={{ color: '#F0F6FC', fontFamily: 'Playfair Display, serif' }}>{transaction.game.name}</h3>
                            <span className="px-2 py-1 rounded-md text-xs" style={{ backgroundColor: '#7C3AED', color: '#F0F6FC' }}>
                              {transaction.game.category}
                            </span>
                          </div>
                          <p className="text-sm mb-2" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
                            {transaction.denomination.name} • User ID: {transaction.gameUserId}
                          </p>
                          <div className="flex items-center space-x-4 text-sm" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
                            <span>{formatDate(transaction.createdAt)}</span>
                            <span>•</span>
                            <span className="uppercase">{transaction.paymentMethod}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between lg:justify-end space-x-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold" style={{ color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}>
                            {formatPrice(transaction.totalPrice)}
                          </p>
                          <p className="text-xs" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
                            ID: {transaction.id.slice(0, 8)}...
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(transaction.status)}
                          {getStatusBadge(transaction.status)}
                        </div>
                      </div>
                    </div>
                  </div>

                    {/* Hover Effect Border */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10 blur-xl" style={{ backgroundColor: '#7C3AED' }}></div>
                  </div>
                  </FadeIn>
                ))}
              </div>
            ) : (
              <FadeIn delay={300}>
                <div className="text-center py-12">
                  <div 
                    className="group relative backdrop-blur-sm border p-12 rounded-2xl transition-all duration-300"
                    style={{ 
                      backgroundColor: '#161B22', 
                      borderColor: '#7C3AED'
                    }}
                  >
                    {/* Background Hover Effect */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" style={{ backgroundColor: '#7C3AED' }}></div>
                    
                    <div className="relative z-10">
                      <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl" style={{ backgroundColor: '#7C3AED' }}>
                        <CreditCardIcon className="w-10 h-10" style={{ color: '#F0F6FC' }} />
                      </div>
                      <h3 className="text-xl font-bold mb-2" style={{ color: '#F0F6FC', fontFamily: 'Playfair Display, serif' }}>
                        {searchTerm || statusFilter !== 'all' ? 'Tidak ada transaksi yang sesuai' : 'Belum ada transaksi'}
                      </h3>
                      <p className="mb-6" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
                        {searchTerm || statusFilter !== 'all' 
                          ? 'Coba ubah filter pencarian kamu'
                          : 'Mulai top up game favoritmu sekarang!'
                        }
                      </p>
                      {!searchTerm && statusFilter === 'all' && (
                        <a
                          href="/games"
                          className="inline-block px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                          style={{ backgroundColor: '#34D399', color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}
                        >
                          Mulai Top Up
                        </a>
                      )}
                    </div>

                    {/* Hover Effect Border */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10 blur-xl" style={{ backgroundColor: '#7C3AED' }}></div>
                  </div>
                </div>
              </FadeIn>
            )}
          </div>
        </section>
      </div>
    </PageTransition>
  )
}
