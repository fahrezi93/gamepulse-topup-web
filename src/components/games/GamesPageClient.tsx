'use client'

import { useState, useEffect } from 'react'
import GameCard from '@/components/game/GameCard'
import GameFilter from '@/components/game/GameFilter'
import PageTransition from '@/components/ui/PageTransition'
import FadeIn from '@/components/ui/FadeIn'

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
    skuCode: string | null
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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0D1117' }}>
        <div className="animate-spin rounded-full h-32 w-32 border-b-2" style={{ borderColor: '#7C3AED' }}></div>
      </div>
    )
  }

  return (
    <PageTransition>
      <div className="min-h-screen" style={{ backgroundColor: '#0D1117' }}>
        {/* Header */}
        <section className="relative py-20">
          <div className="absolute inset-0">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{ backgroundColor: 'rgba(124, 58, 237, 0.1)' }}></div>
            </div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <FadeIn delay={100}>
              <div className="mb-12">
                <h1 className="text-5xl md:text-6xl font-black mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                  <span style={{ color: '#7C3AED' }}>
                    Semua Game
                  </span>
                </h1>
                <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
                  Temukan semua game favoritmu dalam satu tempat. Dari MOBA hingga Battle Royale, 
                  semua tersedia dengan harga terjangkau dan proses yang cepat.
                </p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Games Section */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Filter */}
            <FadeIn delay={200}>
              <GameFilter 
                categories={categories}
                searchTerm={searchTerm}
                selectedCategory={selectedCategory}
                sortBy={sortBy}
                onSearchChange={setSearchTerm}
                onCategoryChange={setSelectedCategory}
                onSortChange={setSortBy}
              />
            </FadeIn>
            
            {/* Games Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-12">
              {filteredGames.map((game, index) => (
                <FadeIn key={game.id} delay={300 + (index * 50)}>
                  <GameCard 
                    game={game}
                    minPrice={game.denominations[0]?.price || 0}
                  />
                </FadeIn>
              ))}
            </div>

            {filteredGames.length === 0 && (
              <FadeIn delay={300}>
                <div className="text-center py-12">
                  <div className="backdrop-blur-sm border rounded-2xl p-12" style={{ backgroundColor: '#161B22', borderColor: '#7C3AED' }}>
                    <div className="text-6xl mb-4">🎮</div>
                    <p className="text-xl mb-4" style={{ color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}>
                      Belum ada game yang tersedia saat ini.
                    </p>
                    <p style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
                      Kami sedang menambahkan lebih banyak game untuk kamu!
                    </p>
                  </div>
                </div>
              </FadeIn>
            )}
          </div>
        </section>
      </div>
    </PageTransition>
  )
}
