'use client'

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
    <footer className="border-t" style={{ backgroundColor: '#161B22', borderColor: '#7C3AED' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl shadow-lg" style={{ backgroundColor: '#161B22' }}>
                <span className="text-2xl">🎮</span>
              </div>
              <div>
                <span className="text-2xl font-bold" style={{ color: '#F0F6FC', fontFamily: 'Playfair Display, serif' }}>
                  GamePulse
                </span>
                <div className="text-sm -mt-1" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>Top Up Center</div>
              </div>
            </div>
            
            <p className="text-sm leading-relaxed mb-6 max-w-md" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
              Platform top up game terpercaya dengan harga terjangkau dan proses yang cepat. 
              Dukung semua game populer dengan sistem pembayaran yang aman dan terpercaya.
            </p>
            
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <feature.icon className="w-5 h-5" style={{ color: index % 2 === 0 ? '#7C3AED' : '#34D399' }} />
                  <span className="text-sm" style={{ color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}>{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="col-span-1">
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#F0F6FC', fontFamily: 'Playfair Display, serif' }}>{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors duration-200 hover:translate-x-1 transform inline-block"
                      style={{ 
                        color: '#8B949E',
                        fontFamily: 'Manrope, sans-serif'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#7C3AED'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#8B949E'}
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
        <div className="border-t mt-12 pt-8" style={{ borderColor: '#7C3AED' }}>
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
              <p className="text-sm" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
                © {currentYear} GamePulse. Semua hak cipta dilindungi.
              </p>
              <div className="flex items-center space-x-2 text-xs">
                <span style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>Powered by</span>
                <span className="font-medium" style={{ color: '#7C3AED', fontFamily: 'Manrope, sans-serif' }}>Next.js</span>
                <span style={{ color: '#8B949E' }}>•</span>
                <span className="font-medium" style={{ color: '#34D399', fontFamily: 'Manrope, sans-serif' }}>Prisma</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
              <span className="text-sm" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>Metode Pembayaran:</span>
              <div className="flex items-center space-x-3">
                <div className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#7C3AED', color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}>DANA</div>
                <div className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#34D399', color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}>OVO</div>
                <div className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#7C3AED', color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}>GoPay</div>
                <div className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#34D399', color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}>QRIS</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
