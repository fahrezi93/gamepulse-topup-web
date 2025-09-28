import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import GameManagementTable from '@/components/admin/GameManagementTable'
import { PlusIcon } from '@heroicons/react/24/outline'

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
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Kelola Game</h1>
            <p className="text-gray-400 mt-2">Tambah, edit, atau hapus game dan denominasi</p>
          </div>
          <Link
            href="/admin/games/new"
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-blue-500/25 flex items-center space-x-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Tambah Game Baru</span>
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
