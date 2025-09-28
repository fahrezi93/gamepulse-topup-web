import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import GameManagementTable from '@/components/admin/GameManagementTable'

export default async function AdminGamesPage() {
  const games = await prisma.game.findMany({
    include: {
      denominations: {
        where: { isActive: true }
      },
      _count: {
        select: {
          transactions: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kelola Game</h1>
            <p className="text-gray-600 mt-2">Tambah, edit, atau hapus game dan denominasi</p>
          </div>
          <Link
            href="/admin/games/new"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            + Tambah Game Baru
          </Link>
        </div>

        {/* Games Table */}
        <GameManagementTable games={games} />
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Kelola Game - Admin GamePulse',
  description: 'Kelola game dan denominasi di GamePulse'
}
