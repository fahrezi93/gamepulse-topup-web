import Link from 'next/link'
import { prisma } from '@/lib/prisma'
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Kelola game, denominasi, dan monitor transaksi</p>
        </div>

        {/* Stats */}
        <AdminStats stats={stats} />

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/admin/games/new"
              className="bg-blue-600 text-white p-4 rounded-lg text-center hover:bg-blue-700 transition-colors"
            >
              <div className="text-2xl mb-2">🎮</div>
              <div className="font-medium">Tambah Game Baru</div>
            </Link>
            
            <Link
              href="/admin/games"
              className="bg-green-600 text-white p-4 rounded-lg text-center hover:bg-green-700 transition-colors"
            >
              <div className="text-2xl mb-2">📝</div>
              <div className="font-medium">Kelola Game</div>
            </Link>
            
            <Link
              href="/admin/transactions"
              className="bg-purple-600 text-white p-4 rounded-lg text-center hover:bg-purple-700 transition-colors"
            >
              <div className="text-2xl mb-2">💳</div>
              <div className="font-medium">Lihat Transaksi</div>
            </Link>
            
            <Link
              href="/admin/settings"
              className="bg-gray-600 text-white p-4 rounded-lg text-center hover:bg-gray-700 transition-colors"
            >
              <div className="text-2xl mb-2">⚙️</div>
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
