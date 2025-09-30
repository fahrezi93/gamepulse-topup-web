'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { 
  SparklesIcon, 
  BoltIcon, 
  ShieldCheckIcon, 
  CurrencyDollarIcon,
  ClockIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  StarIcon
} from '@heroicons/react/24/outline'

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const gameCards = [
    { name: 'Mobile Legends', price: 'Mulai 15K', color: '#7C3AED', icon: '⚔️' },
    { name: 'Free Fire', price: 'Mulai 10K', color: '#34D399', icon: '🔥' },
    { name: 'Genshin Impact', price: 'Mulai 20K', color: '#7C3AED', icon: '⭐' },
    { name: 'PUBG Mobile', price: 'Mulai 25K', color: '#34D399', icon: '🎯' }
  ]

  return (
    <section className="relative min-h-screen overflow-hidden" style={{ backgroundColor: '#0D1117' }}>
      {/* Dynamic Background */}
      <div className="absolute inset-0">
        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-20">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(124, 58, 237, 0.15) 0%, transparent 50%)`
            }}
          />
        </div>
        
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full blur-2xl animate-float" style={{ backgroundColor: 'rgba(124, 58, 237, 0.3)' }}></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 rounded-full blur-3xl animate-float-delayed" style={{ backgroundColor: 'rgba(52, 211, 153, 0.25)' }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-40 h-40 rounded-full blur-2xl animate-float-slow" style={{ backgroundColor: 'rgba(124, 58, 237, 0.2)' }}></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center px-3 py-1.5 backdrop-blur-sm border rounded-full" style={{ backgroundColor: 'rgba(124, 58, 237, 0.2)', borderColor: 'rgba(124, 58, 237, 0.3)' }}>
              <SparklesIcon className="w-4 h-4 mr-2" style={{ color: '#7C3AED' }} />
              <span className="font-medium text-sm" style={{ color: '#7C3AED', fontFamily: 'Manrope, sans-serif' }}>Platform Top Up #1 di Indonesia</span>
            </div>

            {/* Main Title */}
            <div className="space-y-2">
              <h1 className="text-4xl lg:text-5xl font-black leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                <span className="block" style={{ color: '#F0F6FC' }}>Top Up</span>
                <span className="block" style={{ color: '#7C3AED' }}>
                  Game Favorit
                </span>
                <span className="block" style={{ color: '#F0F6FC' }}>
                  Dalam{' '}
                  <span className="animate-pulse" style={{ color: '#34D399' }}>
                    Detik
                  </span>
                </span>
              </h1>
            </div>

            <p className="text-lg leading-relaxed max-w-md" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
              Nikmati pengalaman top up tercepat dengan harga terjangkau. 
              Proses otomatis 24/7 untuk semua game favoritmu.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { icon: BoltIcon, text: 'Instan', color: '#7C3AED' },
                { icon: ShieldCheckIcon, text: 'Aman', color: '#34D399' },
                { icon: CurrencyDollarIcon, text: 'Murah', color: '#7C3AED' }
              ].map((feature, index) => (
                <div key={index} className="flex items-center px-3 py-1.5 backdrop-blur-sm border rounded-full" style={{ backgroundColor: `${feature.color}20`, borderColor: `${feature.color}30` }}>
                  <feature.icon className="w-3.5 h-3.5 mr-1.5" style={{ color: feature.color }} />
                  <span className="font-medium text-sm" style={{ color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}>{feature.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="#games"
                className="group relative px-6 py-3 rounded-xl font-bold text-base transition-all duration-300 shadow-xl hover:scale-105 transform"
                style={{ backgroundColor: '#7C3AED', color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}
              >
                <span className="relative z-10 flex items-center justify-center">
                  <BoltIcon className="w-5 h-5 mr-2" />
                  Mulai Top Up Sekarang
                </span>
              </Link>
              
              <Link
                href="/transaction/check"
                className="group relative border-2 px-6 py-3 rounded-xl font-bold text-base transition-all duration-300 backdrop-blur-sm"
                style={{ borderColor: '#34D399', color: '#34D399', backgroundColor: 'rgba(52, 211, 153, 0.1)', fontFamily: 'Manrope, sans-serif' }}
              >
                <span className="flex items-center justify-center">
                  <ShieldCheckIcon className="w-5 h-5 mr-2" />
                  Cek Status
                </span>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-4 h-4 fill-current" style={{ color: '#34D399' }} />
                  ))}
                </div>
                <span className="font-medium text-sm" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>4.9/5</span>
              </div>
              <div className="text-sm" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
                <span className="font-bold" style={{ color: '#F0F6FC' }}>50K+</span> Pengguna
              </div>
            </div>
          </div>

          {/* Right Content - Game Cards */}
          <div className="relative">
            {/* Main Game Cards Grid */}
            <div className="grid grid-cols-2 gap-4">
              {gameCards.map((game, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden p-5 rounded-2xl shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    backgroundColor: '#161B22'
                  }}
                >
                  {/* Color accent */}
                  <div className="absolute inset-0 rounded-2xl" style={{ backgroundColor: game.color, opacity: 0.1 }}></div>
                  
                  {/* Border */}
                  <div className="absolute inset-0 border rounded-2xl" style={{ borderColor: `${game.color}30` }}></div>
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-all duration-300 rounded-2xl"></div>
                  
                  <div className="relative z-10">
                    <div className="text-2xl mb-3">{game.icon}</div>
                    <h3 className="font-bold text-base mb-1" style={{ color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}>{game.name}</h3>
                    <p className="font-medium text-sm" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>{game.price}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Floating Stats Cards - Repositioned */}
            <div className="absolute -top-6 -right-6 rounded-xl p-3 animate-float z-10" style={{ backgroundColor: '#161B22', borderColor: '#34D399', border: '1px solid' }}>
              <div className="flex items-center gap-2">
                <ClockIcon className="w-5 h-5" style={{ color: '#34D399' }} />
                <div>
                  <div className="font-bold text-sm" style={{ color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}>24/7</div>
                  <div className="text-xs" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>Online</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-8 right-0 rounded-xl p-3 animate-float-slow z-10" style={{ backgroundColor: '#161B22', borderColor: '#7C3AED', border: '1px solid' }}>
              <div className="flex items-center gap-2">
                <DevicePhoneMobileIcon className="w-5 h-5" style={{ color: '#7C3AED' }} />
                <div>
                  <div className="font-bold text-sm" style={{ color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}>Instant</div>
                  <div className="text-xs" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>Delivery</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-5deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(3deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}
