import { prisma } from '@/lib/prisma'
import GameCard from '@/components/game/GameCard'
import GameFilter from '@/components/game/GameFilter'

export default async function GamesPage() {
  const games = await prisma.game.findMany({
    where: {
      isActive: true
    },
    include: {
      denominations: {
        where: {
          isActive: true
        },
        orderBy: {
          price: 'asc'
        },
        take: 1
      }
    },
    orderBy: {
      name: 'asc'
    }
  })

  const categories = [...new Set(games.map(game => game.category))]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-cyan-900/20">
          <div className="absolute inset-0 opacity-40">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent animate-pulse"></div>
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
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
          <GameFilter categories={categories} />
          
          {/* Games Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-12">
            {games.map((game) => (
              <GameCard 
                key={game.id} 
                game={game}
                minPrice={game.denominations[0]?.price || 0}
              />
            ))}
          </div>

          {games.length === 0 && (
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

export const metadata = {
  title: 'Semua Game - GamePulse',
  description: 'Temukan semua game favoritmu untuk top up dengan harga terjangkau dan proses cepat di GamePulse.'
}
