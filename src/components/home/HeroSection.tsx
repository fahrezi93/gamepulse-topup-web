import Link from 'next/link'
import { SparklesIcon, BoltIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-cyan-900/20">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent animate-pulse"></div>
        </div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-cyan-400/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-cyan-400/20 rounded-full blur-xl animate-pulse delay-2000"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center">
          {/* Main Title */}
          <div className="mb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse">
                  <SparklesIcon className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-bounce"></div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Top Up Game
              </span>
              <br />
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent animate-pulse">
                Terpercaya & Cepat
              </span>
            </h1>
          </div>

          <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Platform top up game terlengkap dengan harga terjangkau, proses otomatis 24/7, 
            dan sistem pembayaran yang aman untuk semua game favoritmu.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link
              href="#games"
              className="group relative bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl hover:shadow-cyan-500/25 hover:scale-105 transform"
            >
              <span className="relative z-10 flex items-center">
                <BoltIcon className="w-6 h-6 mr-2" />
                Mulai Top Up Sekarang
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            </Link>
            
            <Link
              href="/transaction/check"
              className="group relative border-2 border-gray-600 hover:border-cyan-400 text-gray-300 hover:text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:bg-gray-800/50 backdrop-blur-sm"
            >
              <span className="flex items-center">
                <ShieldCheckIcon className="w-6 h-6 mr-2" />
                Cek Status Transaksi
              </span>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { number: '10K+', label: 'Transaksi Berhasil', color: 'from-cyan-400 to-blue-500' },
              { number: '50+', label: 'Game Tersedia', color: 'from-purple-400 to-pink-500' },
              { number: '24/7', label: 'Layanan Otomatis', color: 'from-yellow-400 to-orange-500' }
            ].map((stat, index) => (
              <div key={index} className="group">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 transform">
                  <div className={`text-4xl md:text-5xl font-black mb-3 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.number}
                  </div>
                  <div className="text-gray-300 font-medium text-lg">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
