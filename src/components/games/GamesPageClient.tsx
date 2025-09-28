'use client'

import { useState, useEffect } from 'react'
import GameCard from '@/components/game/GameCard'
import GameFilter from '@/components/game/GameFilter'

interface Game {
  id: string
  name: string
  slug: string
  description: string | null
  imageUrl: string | null
  category: string
  isActive: boolean
  isPopular: boolean
  createdAt: Date
  updatedAt: Date
  denominations: {
    id: string
    name: string
    amount: number
    price: number
    isActive: boolean
    gameId: string
    createdAt: Date
    updatedAt: Date
  }[]
}

export default function GamesPageClient() {
  const [games, setGames] = useState<Game[]>([])
  const [filteredGames, setFilteredGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('name')

  useEffect(() => {
    fetchGames()
  }, [])

  useEffect(() => {
    filterAndSortGames()
  }, [games, searchTerm, selectedCategory, sortBy])

  const fetchGames = async () => {
    try {
      const response = await fetch('/api/games')
      const data = await response.json()
      if (data.success) {
        setGames(data.games)
      }
    } catch (error) {
      console.error('Error fetching games:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortGames = () => {
    let filtered = [...games]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(game =>
        game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(game => game.category === selectedCategory)
    }

    // Sort games
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'name-desc':
          return b.name.localeCompare(a.name)
        case 'price-low':
          const priceA = a.denominations[0]?.price || 0
          const priceB = b.denominations[0]?.price || 0
          return priceA - priceB
        case 'price-high':
          const priceA2 = a.denominations[0]?.price || 0
          const priceB2 = b.denominations[0]?.price || 0
          return priceB2 - priceA2
        case 'popular':
          return b.isPopular === a.isPopular ? 0 : b.isPopular ? 1 : -1
        default:
          return 0
      }
    })

    setFilteredGames(filtered)
  }

  const categories = [...new Set(games.map(game => game.category))]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-cyan-900/20">
          <div className="absolute inset-0 opacity-40">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent animate-pulse"></div>
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Semua Game
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Temukan semua game favoritmu dalam satu tempat. Dari MOBA hingga Battle Royale, 
              semua tersedia dengan harga terjangkau dan proses yang cepat.
            </p>
          </div>
        </div>
      </section>

      {/* Games Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter */}
          <GameFilter 
            categories={categories}
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            sortBy={sortBy}
            onSearchChange={setSearchTerm}
            onCategoryChange={setSelectedCategory}
            onSortChange={setSortBy}
          />
          
          {/* Games Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-12">
            {filteredGames.map((game) => (
              <GameCard 
                key={game.id} 
                game={game}
                minPrice={game.denominations[0]?.price || 0}
              />
            ))}
          </div>

          {filteredGames.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-12">
                <div className="text-6xl mb-4">🎮</div>
                <p className="text-gray-300 text-xl mb-4">
                  Belum ada game yang tersedia saat ini.
                </p>
                <p className="text-gray-400">
                  Kami sedang menambahkan lebih banyak game untuk kamu!
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
