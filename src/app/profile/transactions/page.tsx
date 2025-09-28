'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { redirect } from 'next/navigation'
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon
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
  const { data: session, status } = useSession()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    redirect('/auth/signin')
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/profile/transactions')
      const data = await response.json()
      
      if (response.ok) {
        setTransactions(data.transactions)
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setIsLoading(false)
    }
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
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Riwayat Transaksi
            </span>
          </h1>
          <p className="text-gray-400">
            Lihat semua transaksi top up yang pernah kamu lakukan
          </p>
        </div>

        {/* Filters */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari berdasarkan game atau User ID..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="lg:w-48">
              <select
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
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

        {/* Transactions List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
          </div>
        ) : filteredTransactions.length > 0 ? (
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:bg-gray-800/70 transition-all duration-300">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">
                        {transaction.game.name.charAt(0)}
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-bold text-white">{transaction.game.name}</h3>
                        <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded-md text-xs">
                          {transaction.game.category}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">
                        {transaction.denomination.name} • User ID: {transaction.gameUserId}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{formatDate(transaction.createdAt)}</span>
                        <span>•</span>
                        <span className="uppercase">{transaction.paymentMethod}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between lg:justify-end space-x-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">
                        {formatPrice(transaction.totalPrice)}
                      </p>
                      <p className="text-xs text-gray-500">
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
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-12">
              <div className="text-6xl mb-4">💳</div>
              <h3 className="text-xl font-bold text-white mb-2">
                {searchTerm || statusFilter !== 'all' ? 'Tidak ada transaksi yang sesuai' : 'Belum ada transaksi'}
              </h3>
              <p className="text-gray-400 mb-6">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Coba ubah filter pencarian kamu'
                  : 'Mulai top up game favoritmu sekarang!'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <a
                  href="/games"
                  className="inline-block bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300"
                >
                  Mulai Top Up
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
