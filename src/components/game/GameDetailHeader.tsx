import { Game } from '@prisma/client'
import { StarIcon, ShieldCheckIcon, BoltIcon } from '@heroicons/react/24/solid'

interface GameDetailHeaderProps {
  game: Game
}

export default function GameDetailHeader({ game }: GameDetailHeaderProps) {
  // Determine color based on category
  const getCategoryColor = (category: string) => {
    const purpleCategories = ['MOBA', 'RPG', 'Strategy', 'Sports', 'Party', 'MMORPG']
    return purpleCategories.includes(category) ? '#7C3AED' : '#34D399'
  }

  const categoryColor = getCategoryColor(game.category)

  return (
    <div className="backdrop-blur-sm rounded-2xl shadow-lg p-8 border" style={{ backgroundColor: '#161B22', borderColor: categoryColor }}>
      {/* Game Image & Basic Info */}
      <div className="flex items-start space-x-4 mb-6">
        <div className="w-20 h-20 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: categoryColor }}>
          <span className="font-bold text-2xl" style={{ color: '#F0F6FC' }}>
            {game.name.charAt(0)}
          </span>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h1 className="text-2xl font-bold" style={{ color: '#F0F6FC', fontFamily: 'Playfair Display, serif' }}>{game.name}</h1>
            <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: categoryColor, color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}>
              {game.category}
            </span>
          </div>
          
          <div className="flex items-center space-x-4 text-sm mb-3">
            <div className="flex items-center space-x-1">
              <StarIcon className="w-4 h-4" style={{ color: '#34D399' }} />
              <span style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>4.8 Rating</span>
            </div>
            <div className="flex items-center space-x-1">
              <span style={{ color: '#8B949E' }}>•</span>
              <span style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>10K+ Top Up</span>
            </div>
          </div>
          
          {game.description && (
            <p className="leading-relaxed" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
              {game.description}
            </p>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center space-x-3 p-4 border rounded-xl" style={{ backgroundColor: 'rgba(52, 211, 153, 0.1)', borderColor: 'rgba(52, 211, 153, 0.2)' }}>
          <BoltIcon className="w-6 h-6" style={{ color: '#34D399' }} />
          <div>
            <p className="font-medium" style={{ color: '#34D399', fontFamily: 'Manrope, sans-serif' }}>Proses Otomatis</p>
            <p className="text-sm" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>Langsung masuk dalam 1-5 menit</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-4 border rounded-xl" style={{ backgroundColor: 'rgba(124, 58, 237, 0.1)', borderColor: 'rgba(124, 58, 237, 0.2)' }}>
          <ShieldCheckIcon className="w-6 h-6" style={{ color: '#7C3AED' }} />
          <div>
            <p className="font-medium" style={{ color: '#7C3AED', fontFamily: 'Manrope, sans-serif' }}>100% Aman</p>
            <p className="text-sm" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>Terjamin keamanan akun</p>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="border rounded-xl p-6" style={{ backgroundColor: 'rgba(52, 211, 153, 0.1)', borderColor: 'rgba(52, 211, 153, 0.2)' }}>
        <h3 className="font-semibold mb-4 flex items-center" style={{ color: '#34D399', fontFamily: 'Playfair Display, serif' }}>
          <span className="text-2xl mr-2">📋</span>
          Cara Top Up:
        </h3>
        <ol className="text-sm space-y-2">
          <li className="flex items-center">
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3" style={{ backgroundColor: '#7C3AED', color: '#F0F6FC' }}>1</span>
            <span style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>Masukkan User ID game kamu</span>
          </li>
          <li className="flex items-center">
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3" style={{ backgroundColor: '#7C3AED', color: '#F0F6FC' }}>2</span>
            <span style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>Pilih nominal yang diinginkan</span>
          </li>
          <li className="flex items-center">
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3" style={{ backgroundColor: '#7C3AED', color: '#F0F6FC' }}>3</span>
            <span style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>Pilih metode pembayaran</span>
          </li>
          <li className="flex items-center">
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3" style={{ backgroundColor: '#7C3AED', color: '#F0F6FC' }}>4</span>
            <span style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>Lakukan pembayaran</span>
          </li>
          <li className="flex items-center">
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3" style={{ backgroundColor: '#7C3AED', color: '#F0F6FC' }}>5</span>
            <span style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>Item akan otomatis masuk ke akun game</span>
          </li>
        </ol>
      </div>
    </div>
  )
}
