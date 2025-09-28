import GameCard from '@/components/game/GameCard'
import HeroSection from '@/components/home/HeroSection'
import FeaturesSection from '@/components/home/FeaturesSection'
import { prisma } from '@/lib/prisma'

export default async function Home() {
  // Ambil games populer untuk ditampilkan di beranda
  const popularGames = await prisma.game.findMany({
    where: {
      isActive: true,
      isPopular: true // Hanya game yang ditandai sebagai populer
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
    },
    take: 5 // Tampilkan 5 game populer (ML, FF, Genshin, Roblox, Valorant)
  })

  return (
    <div className="min-h-screen">
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Games Section */}
      <section id="games" className="py-20 relative">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-800/10 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Game
              </span>
              <span className="text-white"> Populer</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Pilih game favoritmu dan lakukan top up dengan mudah dan cepat. 
              Semua game tersedia dengan harga terjangkau dan proses otomatis.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {popularGames.map((game) => (
              <GameCard 
                key={game.id} 
                game={game}
                minPrice={game.denominations[0]?.price || 0}
              />
            ))}
          </div>

          {popularGames.length === 0 && (
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
