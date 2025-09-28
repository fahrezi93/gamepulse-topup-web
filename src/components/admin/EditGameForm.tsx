'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Game, Denomination } from '@prisma/client'

interface GameWithDenominations extends Game {
  denominations: Denomination[]
}

interface EditGameFormProps {
  game: GameWithDenominations
}

interface DenominationData {
  id?: string
  name: string
  amount: number
  price: number
  isNew?: boolean
}

export default function EditGameForm({ game }: EditGameFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [gameData, setGameData] = useState({
    name: game.name,
    slug: game.slug,
    description: game.description || '',
    imageUrl: game.imageUrl || '',
    category: game.category,
    isPopular: game.isPopular
  })
  
  const [denominations, setDenominations] = useState<DenominationData[]>(
    game.denominations.map(d => ({
      id: d.id,
      name: d.name,
      amount: d.amount,
      price: d.price
    }))
  )

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleGameDataChange = (field: string, value: string | boolean) => {
    setGameData(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'name' && typeof value === 'string' && { slug: generateSlug(value) })
    }))
  }

  const handleDenominationChange = (index: number, field: keyof DenominationData, value: string | number) => {
    const newDenominations = [...denominations]
    newDenominations[index] = {
      ...newDenominations[index],
      [field]: value
    }
    setDenominations(newDenominations)
  }

  const addDenomination = () => {
    setDenominations([...denominations, { name: '', amount: 0, price: 0, isNew: true }])
  }

  const removeDenomination = (index: number) => {
    if (denominations.length > 1) {
      setDenominations(denominations.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/admin/games/${game.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...gameData,
          denominations: denominations.filter(d => d.name && d.amount > 0 && d.price > 0)
        }),
      })

      if (response.ok) {
        router.push('/admin/games')
      } else {
        const error = await response.json()
        alert(error.error || 'Gagal mengupdate game')
      }
    } catch (error) {
      console.error('Error updating game:', error)
      alert('Terjadi kesalahan saat mengupdate game')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Game Information */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Informasi Game</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nama Game *
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200"
              value={gameData.name}
              onChange={(e) => handleGameDataChange('name', e.target.value)}
              placeholder="Contoh: Mobile Legends"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Slug (URL) *
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200"
              value={gameData.slug}
              onChange={(e) => handleGameDataChange('slug', e.target.value)}
              placeholder="mobile-legends"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Kategori *
            </label>
            <select
              required
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200"
              value={gameData.category}
              onChange={(e) => handleGameDataChange('category', e.target.value)}
            >
              <option value="">Pilih Kategori</option>
              <option value="MOBA">MOBA</option>
              <option value="Battle Royale">Battle Royale</option>
              <option value="RPG">RPG</option>
              <option value="FPS">FPS</option>
              <option value="Strategy">Strategy</option>
              <option value="Sandbox">Sandbox</option>
              <option value="Party">Party</option>
              <option value="Action RPG">Action RPG</option>
              <option value="MMORPG">MMORPG</option>
              <option value="Racing">Racing</option>
              <option value="Sports">Sports</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              URL Gambar
            </label>
            <input
              type="url"
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200"
              value={gameData.imageUrl}
              onChange={(e) => handleGameDataChange('imageUrl', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Deskripsi
          </label>
          <textarea
            rows={3}
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200"
            value={gameData.description}
            onChange={(e) => handleGameDataChange('description', e.target.value)}
            placeholder="Deskripsi singkat tentang game..."
          />
        </div>

        <div className="mt-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPopular"
              checked={gameData.isPopular}
              onChange={(e) => handleGameDataChange('isPopular', e.target.checked)}
              className="w-4 h-4 text-cyan-600 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500 focus:ring-2"
            />
            <label htmlFor="isPopular" className="ml-2 text-sm font-medium text-gray-300">
              Game Populer (Tampilkan di beranda)
            </label>
          </div>
        </div>
      </div>

      {/* Denominations */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Denominasi Top-Up</h2>
          <button
            type="button"
            onClick={addDenomination}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-blue-500/25 flex items-center space-x-2"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Tambah Denominasi</span>
          </button>
        </div>

        <div className="space-y-4">
          {denominations.map((denomination, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-600 rounded-xl bg-gray-700/30">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Nama Paket
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-gray-600/50 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200"
                  value={denomination.name}
                  onChange={(e) => handleDenominationChange(index, 'name', e.target.value)}
                  placeholder="100 Diamond"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Jumlah
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full px-3 py-2 bg-gray-600/50 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200"
                  value={denomination.amount || ''}
                  onChange={(e) => handleDenominationChange(index, 'amount', parseInt(e.target.value) || 0)}
                  placeholder="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Harga (Rp)
                </label>
                <input
                  type="number"
                  min="1000"
                  step="1000"
                  className="w-full px-3 py-2 bg-gray-600/50 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200"
                  value={denomination.price || ''}
                  onChange={(e) => handleDenominationChange(index, 'price', parseInt(e.target.value) || 0)}
                  placeholder="20000"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => removeDenomination(index)}
                  disabled={denominations.length === 1}
                  className="w-full bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-500/30 disabled:bg-gray-600/20 disabled:text-gray-500 disabled:border-gray-600/30 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-1"
                >
                  <TrashIcon className="w-4 h-4" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border border-gray-600 text-gray-300 rounded-xl font-medium hover:bg-gray-700/50 transition-all duration-200"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-cyan-500/25"
        >
          {isLoading ? 'Menyimpan...' : 'Update Game'}
        </button>
      </div>
    </form>
  )
}
