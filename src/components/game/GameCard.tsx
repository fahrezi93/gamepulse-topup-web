import Link from 'next/link'
import { Game, Denomination } from '@prisma/client'
import { PlayIcon, FireIcon } from '@heroicons/react/24/solid'

interface GameCardProps {
  game: Game & {
    denominations: Denomination[]
  }
  minPrice: number
}

export default function GameCard({ game, minPrice }: GameCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getCategoryColor = (category: string) => {
    // Alternating between purple and green based on category
    const purpleCategories = ['MOBA', 'RPG', 'Strategy', 'Sports', 'Party', 'MMORPG']
    return purpleCategories.includes(category) ? '#7C3AED' : '#34D399'
  }

  return (
    <Link href={`/game/${game.slug}`} className="group">
      <div className="relative backdrop-blur-sm border rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 transform shadow-xl h-full flex flex-col" style={{ backgroundColor: '#161B22', borderColor: getCategoryColor(game.category) }}>
        {/* Game Image/Icon */}
        <div className="relative h-48 overflow-hidden" style={{ backgroundColor: '#0D1117' }}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{ backgroundColor: getCategoryColor(game.category) }}></div>
          </div>
          
          {/* Game Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: getCategoryColor(game.category) }}>
              <span className="font-black text-2xl" style={{ color: '#F0F6FC' }}>
                {game.name.charAt(0)}
              </span>
            </div>
          </div>
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <div className="px-3 py-1 rounded-full text-xs font-bold shadow-lg" style={{ backgroundColor: getCategoryColor(game.category), color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}>
              {game.category}
            </div>
          </div>

          {/* Popular Badge - Only for popular games */}
          {game.isPopular && (
            <div className="absolute top-4 right-4">
              <div className="px-2 py-1 rounded-full flex items-center space-x-1 shadow-lg" style={{ backgroundColor: '#34D399' }}>
                <FireIcon className="w-3 h-3" style={{ color: '#F0F6FC' }} />
                <span className="text-xs font-bold" style={{ color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}>HOT</span>
              </div>
            </div>
          )}

          {/* Hover Play Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
            <div className="w-16 h-16 backdrop-blur-sm rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
              <PlayIcon className="w-8 h-8 ml-1" style={{ color: '#F0F6FC' }} />
            </div>
          </div>
        </div>

        {/* Game Info */}
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex-1">
            <h3 className="font-bold text-xl mb-2 transition-colors duration-300" style={{ color: '#F0F6FC', fontFamily: 'Playfair Display, serif' }}>
              {game.name}
            </h3>
            
            {game.description && (
              <p className="text-sm line-clamp-2 leading-relaxed mb-4" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
                {game.description}
              </p>
            )}
          </div>

          <div className="space-y-4 mt-auto">
            {/* Price Section */}
            <div className="text-center">
              <p className="text-xs mb-1" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>Mulai dari</p>
              <p className="font-bold text-xl" style={{ color: getCategoryColor(game.category), fontFamily: 'Manrope, sans-serif' }}>
                {minPrice > 0 ? formatPrice(minPrice) : 'Hubungi CS'}
              </p>
            </div>
            
            {/* Action Button */}
            <div className="w-full">
              <div className="w-full text-center px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105" style={{ backgroundColor: getCategoryColor(game.category), color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}>
                Top Up Sekarang
              </div>
            </div>
          </div>
        </div>

        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-10 blur-xl" style={{ backgroundColor: getCategoryColor(game.category) }}></div>
      </div>
    </Link>
  )
}
