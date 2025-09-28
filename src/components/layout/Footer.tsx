import Link from 'next/link'
import { SparklesIcon, ShieldCheckIcon, BoltIcon, CreditCardIcon } from '@heroicons/react/24/outline'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    'Layanan': [
      { name: 'Top Up Game', href: '/' },
      { name: 'Cek Transaksi', href: '/transaction/check' },
      { name: 'Bantuan', href: '/help' },
    ],
    'Game Populer': [
      { name: 'Mobile Legends', href: '/game/mobile-legends' },
      { name: 'PUBG Mobile', href: '/game/pubg-mobile' },
      { name: 'Free Fire', href: '/game/free-fire' },
      { name: 'Genshin Impact', href: '/game/genshin-impact' },
    ],
    'Perusahaan': [
      { name: 'Tentang Kami', href: '/about' },
      { name: 'Kebijakan Privasi', href: '/privacy' },
      { name: 'Syarat & Ketentuan', href: '/terms' },
      { name: 'Kontak', href: '/contact' },
    ],
  }

  const features = [
    { icon: ShieldCheckIcon, text: 'Pembayaran Aman & Terpercaya' },
    { icon: BoltIcon, text: 'Proses Otomatis 24/7' },
    { icon: CreditCardIcon, text: 'Multi Payment Gateway' },
  ]

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <SparklesIcon className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  GamePulse
                </span>
                <div className="text-sm text-gray-400 -mt-1">Top Up Center</div>
              </div>
            </div>
            
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-md">
              Platform top up game terpercaya dengan harga terjangkau dan proses yang cepat. 
              Dukung semua game populer dengan sistem pembayaran yang aman dan terpercaya.
            </p>
            
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <feature.icon className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm text-gray-300">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="col-span-1">
              <h3 className="text-lg font-semibold mb-4 text-white">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-cyan-400 text-sm transition-colors duration-200 hover:translate-x-1 transform inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
              <p className="text-gray-400 text-sm">
                © {currentYear} GamePulse. Semua hak cipta dilindungi.
              </p>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span className="text-gray-400">Powered by</span>
                <span className="text-cyan-400 font-medium">Next.js</span>
                <span>•</span>
                <span className="text-purple-400 font-medium">Prisma</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
              <span className="text-gray-400 text-sm">Metode Pembayaran:</span>
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-1 rounded-full text-xs font-medium text-white">DANA</div>
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-3 py-1 rounded-full text-xs font-medium text-white">OVO</div>
                <div className="bg-gradient-to-r from-green-600 to-green-700 px-3 py-1 rounded-full text-xs font-medium text-white">GoPay</div>
                <div className="bg-gradient-to-r from-pink-600 to-pink-700 px-3 py-1 rounded-full text-xs font-medium text-white">QRIS</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
