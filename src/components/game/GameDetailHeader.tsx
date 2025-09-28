import { Game } from '@prisma/client'
import { StarIcon, ShieldCheckIcon, BoltIcon } from '@heroicons/react/24/solid'

interface GameDetailHeaderProps {
  game: Game
}

export default function GameDetailHeader({ game }: GameDetailHeaderProps) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-700">
      {/* Game Image & Basic Info */}
      <div className="flex items-start space-x-4 mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-2xl">
            {game.name.charAt(0)}
          </span>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h1 className="text-2xl font-bold text-white">{game.name}</h1>
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {game.category}
            </span>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-300 mb-3">
            <div className="flex items-center space-x-1">
              <StarIcon className="w-4 h-4 text-yellow-400" />
              <span>4.8 Rating</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>•</span>
              <span>10K+ Top Up</span>
            </div>
          </div>
          
          {game.description && (
            <p className="text-gray-300 leading-relaxed">
              {game.description}
            </p>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center space-x-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
          <BoltIcon className="w-6 h-6 text-green-400" />
          <div>
            <p className="font-medium text-green-300">Proses Otomatis</p>
            <p className="text-sm text-green-400">Langsung masuk dalam 1-5 menit</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <ShieldCheckIcon className="w-6 h-6 text-blue-400" />
          <div>
            <p className="font-medium text-blue-300">100% Aman</p>
            <p className="text-sm text-blue-400">Terjamin keamanan akun</p>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-6">
        <h3 className="font-semibold text-yellow-300 mb-4 flex items-center">
          <span className="text-2xl mr-2">📋</span>
          Cara Top Up:
        </h3>
        <ol className="text-sm text-gray-300 space-y-2">
          <li className="flex items-center">
            <span className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">1</span>
            Masukkan User ID game kamu
          </li>
          <li className="flex items-center">
            <span className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">2</span>
            Pilih nominal yang diinginkan
          </li>
          <li className="flex items-center">
            <span className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">3</span>
            Pilih metode pembayaran
          </li>
          <li className="flex items-center">
            <span className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">4</span>
            Lakukan pembayaran
          </li>
          <li className="flex items-center">
            <span className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">5</span>
            Item akan otomatis masuk ke akun game
          </li>
        </ol>
      </div>
    </div>
  )
}
