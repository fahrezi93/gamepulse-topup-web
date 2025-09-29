'use client'

import Link from 'next/link'
import { HomeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0D1117' }}>
      <div className="text-center px-4 sm:px-6 lg:px-8">
        {/* 404 Animation */}
        <div className="relative mb-8">
          <div className="text-8xl md:text-9xl font-black animate-pulse" style={{ color: '#7C3AED', fontFamily: 'Playfair Display, serif' }}>
            404
          </div>
          <div className="absolute inset-0 text-8xl md:text-9xl font-black blur-sm" style={{ color: 'rgba(124, 58, 237, 0.2)' }}>
            404
          </div>
        </div>

        {/* Content */}
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#F0F6FC', fontFamily: 'Playfair Display, serif' }}>
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-xl mb-8 leading-relaxed" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
            Maaf, halaman yang Anda cari tidak dapat ditemukan. 
            Mungkin halaman telah dipindahkan atau URL salah.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:scale-105 transform"
              style={{ backgroundColor: '#7C3AED', color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}
            >
              <HomeIcon className="w-5 h-5 mr-2" />
              Kembali ke Beranda
            </Link>
            
            <Link
              href="/games"
              className="inline-flex items-center justify-center border-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 backdrop-blur-sm"
              style={{ borderColor: '#34D399', color: '#34D399', backgroundColor: 'rgba(52, 211, 153, 0.1)', fontFamily: 'Manrope, sans-serif' }}
            >
              <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
              Lihat Semua Game
            </Link>
          </div>

          {/* Popular Links */}
          <div className="mt-12">
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#F0F6FC', fontFamily: 'Playfair Display, serif' }}>Halaman Populer</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <Link href="/games" className="transition-colors" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#7C3AED'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#8B949E'}
              >
                Semua Game
              </Link>
              <Link href="/transaction/check" className="transition-colors" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#7C3AED'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#8B949E'}
              >
                Cek Transaksi
              </Link>
              <Link href="/help" className="transition-colors" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#7C3AED'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#8B949E'}
              >
                Bantuan
              </Link>
              <Link href="/about" className="transition-colors" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#7C3AED'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#8B949E'}
              >
                Tentang Kami
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 rounded-full blur-xl animate-pulse" style={{ backgroundColor: 'rgba(124, 58, 237, 0.3)' }}></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 rounded-full blur-xl animate-pulse delay-1000" style={{ backgroundColor: 'rgba(52, 211, 153, 0.25)' }}></div>
      </div>
    </div>
  )
}
