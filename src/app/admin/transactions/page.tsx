import { prisma } from '@/lib/prisma'
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

export default async function AdminTransactionsPage() {
  // Ambil semua transaksi
  const transactions = await prisma.transaction.findMany({
    include: {
      game: {
        select: {
          name: true,
          category: true
        }
      },
      denomination: {
        select: {
          name: true,
          amount: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />
      case 'FAILED':
        return <XCircleIcon className="w-5 h-5 text-red-500" />
      case 'PENDING':
        return <ClockIcon className="w-5 h-5 text-yellow-500" />
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'FAILED':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'PENDING':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Lihat Transaksi</h1>
          <p className="text-gray-400 mt-2">Monitor dan kelola semua transaksi top-up</p>
        </div>

        {/* Filters */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari berdasarkan ID transaksi, game, atau user..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="lg:w-48">
              <select className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200">
                <option value="all">Semua Status</option>
                <option value="SUCCESS">Berhasil</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Gagal</option>
              </select>
            </div>

            {/* Filter Button */}
            <button className="lg:w-auto w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2">
              <FunnelIcon className="w-5 h-5" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    ID Transaksi
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Game
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    User ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Harga
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="text-gray-400">
                        <ClockIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg mb-2">Belum ada transaksi</p>
                        <p className="text-sm">Transaksi akan muncul di sini setelah user melakukan top-up</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-700/30 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {transaction.id.slice(0, 8)}...
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{transaction.game.name}</div>
                        <div className="text-xs text-gray-400">{transaction.game.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{transaction.gameUserId}</div>
                        {transaction.playerName && (
                          <div className="text-xs text-gray-400">{transaction.playerName}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{transaction.denomination.name}</div>
                        <div className="text-xs text-gray-400">{transaction.denomination.amount} items</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {formatPrice(transaction.totalPrice)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(transaction.status)}
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadge(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">
                          {new Date(transaction.createdAt).toLocaleDateString('id-ID')}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(transaction.createdAt).toLocaleTimeString('id-ID')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200">
                          <EyeIcon className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Lihat Transaksi - Admin GamePulse',
  description: 'Monitor dan kelola semua transaksi top-up'
}
