import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { 
  DevicePhoneMobileIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
  ClockIcon,
  PlusIcon,
  ListBulletIcon,
  DocumentTextIcon,
  CogIcon
} from '@heroicons/react/24/outline'
import AdminStats from '@/components/admin/AdminStats'
import RecentTransactions from '@/components/admin/RecentTransactions'

export default async function AdminDashboard() {
  // Ambil statistik
  const [
    totalGames,
    totalTransactions,
    totalRevenue,
    pendingTransactions
  ] = await Promise.all([
    prisma.game.count({ where: { isActive: true } }),
    prisma.transaction.count(),
    prisma.transaction.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { totalPrice: true }
    }),
    prisma.transaction.count({ where: { status: 'PENDING' } })
  ])

  // Ambil transaksi terbaru
  const recentTransactions = await prisma.transaction.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      game: true,
      denomination: true
    }
  })

  const stats = {
    totalGames,
    totalTransactions,
    totalRevenue: totalRevenue._sum.totalPrice || 0,
    pendingTransactions
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400 mt-2">Kelola game, denominasi, dan monitor transaksi</p>
        </div>

        {/* Stats */}
        <AdminStats stats={stats} />

        {/* Quick Actions */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/admin/games/new"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-6 rounded-xl text-center transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
            >
              <div className="mb-3">
                <PlusIcon className="w-8 h-8 mx-auto" />
              </div>
              <div className="font-medium">Tambah Game Baru</div>
            </Link>
            
            <Link
              href="/admin/games"
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white p-6 rounded-xl text-center transition-all duration-200 shadow-lg hover:shadow-green-500/25"
            >
              <div className="mb-3">
                <ListBulletIcon className="w-8 h-8 mx-auto" />
              </div>
              <div className="font-medium">Kelola Game</div>
            </Link>
            
            <Link
              href="/admin/transactions"
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white p-6 rounded-xl text-center transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
            >
              <div className="mb-3">
                <DocumentTextIcon className="w-8 h-8 mx-auto" />
              </div>
              <div className="font-medium">Lihat Transaksi</div>
            </Link>
            
            <Link
              href="/admin/settings"
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white p-6 rounded-xl text-center transition-all duration-200 shadow-lg hover:shadow-gray-500/25"
            >
              <div className="mb-3">
                <CogIcon className="w-8 h-8 mx-auto" />
              </div>
              <div className="font-medium">Pengaturan</div>
            </Link>
          </div>
        </div>

        {/* Recent Transactions */}
        <RecentTransactions transactions={recentTransactions} />
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Admin Dashboard - GamePulse',
  description: 'Panel admin untuk mengelola GamePulse'
}
