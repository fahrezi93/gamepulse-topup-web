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
    <div className="min-h-screen" style={{ backgroundColor: '#0D1117' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: '#F0F6FC', fontFamily: 'Playfair Display, serif' }}>Admin Dashboard</h1>
          <p className="mt-2" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>Kelola game, denominasi, dan monitor transaksi</p>
        </div>

        {/* Stats */}
        <AdminStats stats={stats} />

        {/* Quick Actions */}
        <div className="backdrop-blur-sm border rounded-xl p-6 mb-8" style={{ backgroundColor: '#161B22', borderColor: '#7C3AED' }}>
          <h2 className="text-xl font-bold mb-4" style={{ color: '#F0F6FC', fontFamily: 'Playfair Display, serif' }}>Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/admin/games/new"
              className="p-6 rounded-xl text-center transition-all duration-200 shadow-lg hover:scale-105"
              style={{ backgroundColor: '#7C3AED', color: '#F0F6FC' }}
            >
              <div className="mb-3">
                <PlusIcon className="w-8 h-8 mx-auto" />
              </div>
              <div className="font-medium" style={{ fontFamily: 'Manrope, sans-serif' }}>Tambah Game Baru</div>
            </Link>
            
            <Link
              href="/admin/games"
              className="p-6 rounded-xl text-center transition-all duration-200 shadow-lg hover:scale-105"
              style={{ backgroundColor: '#34D399', color: '#F0F6FC' }}
            >
              <div className="mb-3">
                <ListBulletIcon className="w-8 h-8 mx-auto" />
              </div>
              <div className="font-medium" style={{ fontFamily: 'Manrope, sans-serif' }}>Kelola Game</div>
            </Link>
            
            <Link
              href="/admin/transactions"
              className="p-6 rounded-xl text-center transition-all duration-200 shadow-lg hover:scale-105"
              style={{ backgroundColor: '#7C3AED', color: '#F0F6FC' }}
            >
              <div className="mb-3">
                <DocumentTextIcon className="w-8 h-8 mx-auto" />
              </div>
              <div className="font-medium" style={{ fontFamily: 'Manrope, sans-serif' }}>Lihat Transaksi</div>
            </Link>
            
            <Link
              href="/admin/settings"
              className="p-6 rounded-xl text-center transition-all duration-200 shadow-lg hover:scale-105"
              style={{ backgroundColor: '#34D399', color: '#F0F6FC' }}
            >
              <div className="mb-3">
                <CogIcon className="w-8 h-8 mx-auto" />
              </div>
              <div className="font-medium" style={{ fontFamily: 'Manrope, sans-serif' }}>Pengaturan</div>
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
