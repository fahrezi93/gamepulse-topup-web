'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Game, Denomination } from '@prisma/client'
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline'

interface GameWithDetails extends Game {
  denominations: Denomination[]
  _count: {
    transactions: number
  }
}

interface GameManagementTableProps {
  games: GameWithDetails[]
}

export default function GameManagementTable({ games }: GameManagementTableProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredGames = games.filter(game =>
    game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    game.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDeleteGame = async (gameId: string, gameName: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus game "${gameName}"? Tindakan ini tidak dapat dibatalkan.`)) {
      try {
        const response = await fetch(`/api/admin/games/${gameId}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          window.location.reload()
        } else {
          alert('Gagal menghapus game')
        }
      } catch (error) {
        console.error('Error deleting game:', error)
        alert('Terjadi kesalahan saat menghapus game')
      }
    }
  }

  const toggleGameStatus = async (gameId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/games/${gameId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !currentStatus
        }),
      })

      if (response.ok) {
        window.location.reload()
      } else {
        alert('Gagal mengubah status game')
      }
    } catch (error) {
      console.error('Error updating game status:', error)
      alert('Terjadi kesalahan saat mengubah status game')
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Search */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <h2 className="text-xl font-bold text-gray-900">Daftar Game ({filteredGames.length})</h2>
          <div className="w-full sm:w-auto">
            <input
              type="text"
              placeholder="Cari game atau kategori..."
              className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Game
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kategori
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Denominasi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaksi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredGames.map((game) => (
              <tr key={game.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 mr-3">
                      <span className="text-white font-bold">
                        {game.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{game.name}</div>
                      <div className="text-sm text-gray-500">{game.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {game.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {game.denominations.length} item
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {game._count.transactions}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => toggleGameStatus(game.id, game.isActive)}
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      game.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {game.isActive ? 'Aktif' : 'Nonaktif'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Link
                      href={`/game/${game.slug}`}
                      className="text-blue-600 hover:text-blue-900 p-1"
                      title="Lihat"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/admin/games/${game.id}/edit`}
                      className="text-green-600 hover:text-green-900 p-1"
                      title="Edit"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteGame(game.id, game.name)}
                      className="text-red-600 hover:text-red-900 p-1"
                      title="Hapus"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredGames.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {searchTerm ? 'Tidak ada game yang sesuai dengan pencarian' : 'Belum ada game'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
