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

  const getCategoryGradient = (category: string) => {
    const gradients = {
      'MOBA': 'from-blue-500 to-purple-600',
      'Battle Royale': 'from-orange-500 to-red-600',
      'RPG': 'from-green-500 to-emerald-600',
      'FPS': 'from-red-500 to-pink-600',
      'Strategy': 'from-indigo-500 to-purple-600',
      'Racing': 'from-yellow-500 to-orange-600',
      'Sports': 'from-cyan-500 to-blue-600'
    }
    return gradients[category as keyof typeof gradients] || 'from-gray-500 to-gray-600'
  }

  return (
    <Link href={`/game/${game.slug}`} className="group">
      <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 transform hover:border-gray-600 hover:shadow-2xl hover:shadow-purple-500/10">
        {/* Game Image/Icon */}
        <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-purple-500/20 to-pink-500/20"></div>
          </div>
          
          {/* Game Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-20 h-20 bg-gradient-to-br ${getCategoryGradient(game.category)} rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
              <span className="text-white font-black text-2xl">
                {game.name.charAt(0)}
              </span>
            </div>
          </div>
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <div className={`bg-gradient-to-r ${getCategoryGradient(game.category)} px-3 py-1 rounded-full text-white text-xs font-bold shadow-lg`}>
              {game.category}
            </div>
          </div>

          {/* Popular Badge */}
          <div className="absolute top-4 right-4">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-2 py-1 rounded-full flex items-center space-x-1 shadow-lg">
              <FireIcon className="w-3 h-3 text-white" />
              <span className="text-white text-xs font-bold">HOT</span>
            </div>
          </div>

          {/* Hover Play Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <PlayIcon className="w-8 h-8 text-white ml-1" />
            </div>
          </div>
        </div>

        {/* Game Info */}
        <div className="p-6">
          <h3 className="font-bold text-xl text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">
            {game.name}
          </h3>
          
          {game.description && (
            <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
              {game.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Mulai dari</p>
              <p className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {minPrice > 0 ? formatPrice(minPrice) : 'Hubungi CS'}
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-cyan-500/25">
              Top Up
            </div>
          </div>
        </div>

        {/* Glow Effect */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${getCategoryGradient(game.category)} opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-10 blur-xl`}></div>
      </div>
    </Link>
  )
}
