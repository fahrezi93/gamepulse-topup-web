'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Game, Denomination } from '@prisma/client'
import { PencilIcon, TrashIcon, EyeIcon, MagnifyingGlassIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

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
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl">
      {/* Search */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <h2 className="text-xl font-bold text-white">Daftar Game ({filteredGames.length})</h2>
          <div className="w-full sm:w-auto">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari game atau kategori..."
                className="w-full sm:w-64 pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Game
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Kategori
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Denominasi
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Transaksi
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredGames.map((game) => (
              <tr key={game.id} className="hover:bg-gray-700/30 transition-colors duration-200">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 mr-3">
                      <span className="text-white font-bold">
                        {game.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{game.name}</div>
                      <div className="text-sm text-gray-400">{game.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-medium rounded-full">
                    {game.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {game.denominations.length} item
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {game._count.transactions}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => toggleGameStatus(game.id, game.isActive)}
                    className={`px-3 py-1 text-xs font-medium rounded-full border transition-all duration-200 ${
                      game.isActive
                        ? 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30'
                        : 'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30'
                    }`}
                  >
                    {game.isActive ? 'Aktif' : 'Nonaktif'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleGameStatus(game.id, game.isActive)}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        game.isActive 
                          ? 'text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10' 
                          : 'text-green-400 hover:text-green-300 hover:bg-green-500/10'
                      }`}
                      title={game.isActive ? 'Sembunyikan' : 'Tampilkan'}
                    >
                      {game.isActive ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                    <Link
                      href={`/admin/games/${game.id}/edit`}
                      className="p-2 rounded-lg text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all duration-200"
                      title="Edit"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => handleDeleteGame(game.id, game.name)}
                      className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
                      title="Hapus"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredGames.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400">
              <EyeIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">
                {searchTerm ? 'Tidak ada game yang sesuai dengan pencarian' : 'Belum ada game'}
              </p>
              <p className="text-sm">
                {searchTerm ? 'Coba kata kunci yang berbeda' : 'Tambahkan game pertama untuk memulai'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
