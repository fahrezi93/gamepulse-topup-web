import GameCard from '@/components/game/GameCard'
import HeroSection from '@/components/home/HeroSection'
import FeaturesSection from '@/components/home/FeaturesSection'
import PageTransition from '@/components/ui/PageTransition'
import FadeIn from '@/components/ui/FadeIn'
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
    <PageTransition>
      <div className="min-h-screen">
        <FadeIn delay={100}>
          <HeroSection />
        </FadeIn>

        {/* Features Section */}
        <FadeIn delay={200}>
          <FeaturesSection />
        </FadeIn>

        {/* Games Section */}
        <FadeIn delay={300}>
          <section id="games" className="py-20 relative" style={{ backgroundColor: '#0D1117' }}>
            {/* Background Elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{ backgroundColor: 'rgba(52, 211, 153, 0.1)' }}></div>
            </div>
            
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <FadeIn delay={400}>
                <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl font-black mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                    <span style={{ color: '#34D399' }}>
                      Game
                    </span>
                    <span style={{ color: '#F0F6FC' }}> Populer</span>
                  </h2>
                  <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
                    Pilih game favoritmu dan lakukan top up dengan mudah dan cepat. 
                    Semua game tersedia dengan harga terjangkau dan proses otomatis.
                  </p>
                </div>
              </FadeIn>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
                {popularGames.map((game, index) => (
                  <FadeIn key={game.id} delay={500 + (index * 100)}>
                    <GameCard 
                      game={game}
                      minPrice={game.denominations[0]?.price || 0}
                    />
                  </FadeIn>
                ))}
              </div>

              {popularGames.length === 0 && (
                <FadeIn delay={500}>
                  <div className="text-center py-12">
                    <div className="backdrop-blur-sm border rounded-2xl p-12" style={{ backgroundColor: '#161B22', borderColor: '#34D399' }}>
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
        </FadeIn>
      </div>
    </PageTransition>
  )
}
