'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Denomination {
  name: string
  amount: number
  price: number
}

export default function GameForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [gameData, setGameData] = useState({
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    category: ''
  })
  const [denominations, setDenominations] = useState<Denomination[]>([
    { name: '', amount: 0, price: 0 }
  ])

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleGameDataChange = (field: string, value: string) => {
    setGameData(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'name' && { slug: generateSlug(value) })
    }))
  }

  const handleDenominationChange = (index: number, field: keyof Denomination, value: string | number) => {
    const newDenominations = [...denominations]
    newDenominations[index] = {
      ...newDenominations[index],
      [field]: value
    }
    setDenominations(newDenominations)
  }

  const addDenomination = () => {
    setDenominations([...denominations, { name: '', amount: 0, price: 0 }])
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
      const response = await fetch('/api/admin/games', {
        method: 'POST',
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
        alert(error.error || 'Gagal membuat game')
      }
    } catch (error) {
      console.error('Error creating game:', error)
      alert('Terjadi kesalahan saat membuat game')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Game Information */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Informasi Game</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Game *
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={gameData.name}
              onChange={(e) => handleGameDataChange('name', e.target.value)}
              placeholder="Contoh: Mobile Legends"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug (URL) *
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={gameData.slug}
              onChange={(e) => handleGameDataChange('slug', e.target.value)}
              placeholder="mobile-legends"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori *
            </label>
            <select
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={gameData.category}
              onChange={(e) => handleGameDataChange('category', e.target.value)}
            >
              <option value="">Pilih Kategori</option>
              <option value="MOBA">MOBA</option>
              <option value="Battle Royale">Battle Royale</option>
              <option value="RPG">RPG</option>
              <option value="FPS">FPS</option>
              <option value="Strategy">Strategy</option>
              <option value="Racing">Racing</option>
              <option value="Sports">Sports</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL Gambar
            </label>
            <input
              type="url"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={gameData.imageUrl}
              onChange={(e) => handleGameDataChange('imageUrl', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deskripsi
          </label>
          <textarea
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={gameData.description}
            onChange={(e) => handleGameDataChange('description', e.target.value)}
            placeholder="Deskripsi singkat tentang game..."
          />
        </div>
      </div>

      {/* Denominations */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Denominasi Top-Up</h2>
          <button
            type="button"
            onClick={addDenomination}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            + Tambah Denominasi
          </button>
        </div>

        <div className="space-y-4">
          {denominations.map((denomination, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Paket
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={denomination.name}
                  onChange={(e) => handleDenominationChange(index, 'name', e.target.value)}
                  placeholder="100 Diamond"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jumlah
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={denomination.amount || ''}
                  onChange={(e) => handleDenominationChange(index, 'amount', parseInt(e.target.value) || 0)}
                  placeholder="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Harga (Rp)
                </label>
                <input
                  type="number"
                  min="1000"
                  step="1000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Hapus
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
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Menyimpan...' : 'Simpan Game'}
        </button>
      </div>
    </form>
  )
}
