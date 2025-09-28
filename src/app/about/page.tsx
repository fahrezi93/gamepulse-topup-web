import { 
  SparklesIcon, 
  ShieldCheckIcon, 
  BoltIcon, 
  UsersIcon,
  TrophyIcon,
  HeartIcon
} from '@heroicons/react/24/outline'

export default function AboutPage() {
  const stats = [
    { number: '100K+', label: 'Pengguna Aktif', icon: UsersIcon },
    { number: '50+', label: 'Game Tersedia', icon: SparklesIcon },
    { number: '99.9%', label: 'Uptime Server', icon: BoltIcon },
    { number: '4.9/5', label: 'Rating Pengguna', icon: TrophyIcon }
  ]

  const team = [
    {
      name: 'Alex Chen',
      role: 'CEO & Founder',
      description: 'Passionate gamer dengan 10+ tahun pengalaman di industri gaming',
      gradient: 'from-cyan-400 to-blue-500'
    },
    {
      name: 'Sarah Kim',
      role: 'CTO',
      description: 'Expert dalam sistem pembayaran dan keamanan digital',
      gradient: 'from-purple-400 to-pink-500'
    },
    {
      name: 'David Wong',
      role: 'Head of Operations',
      description: 'Memastikan semua transaksi berjalan lancar 24/7',
      gradient: 'from-green-400 to-emerald-500'
    }
  ]

  const values = [
    {
      icon: ShieldCheckIcon,
      title: 'Kepercayaan',
      description: 'Kami mengutamakan keamanan dan kepercayaan pengguna dalam setiap transaksi',
      gradient: 'from-green-400 to-emerald-500'
    },
    {
      icon: BoltIcon,
      title: 'Kecepatan',
      description: 'Proses otomatis yang memastikan top up masuk dalam hitungan detik',
      gradient: 'from-yellow-400 to-orange-500'
    },
    {
      icon: HeartIcon,
      title: 'Kepuasan',
      description: 'Customer service 24/7 yang siap membantu kapan saja kamu butuhkan',
      gradient: 'from-pink-400 to-rose-500'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-cyan-900/20">
          <div className="absolute inset-0 opacity-40">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent animate-pulse"></div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-cyan-400/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-full blur-xl animate-pulse delay-1000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse">
                  <SparklesIcon className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full animate-bounce"></div>
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Tentang
              </span>
              <br />
              <span className="text-white">GamePulse</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Platform top up game terpercaya yang telah melayani ribuan gamers Indonesia 
              dengan komitmen memberikan pengalaman terbaik sejak 2020.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 transform">
                  <stat.icon className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                  <div className="text-4xl font-black mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-gray-300 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-black mb-6">
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Cerita Kami
                </span>
              </h2>
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <p>
                  GamePulse lahir dari passion para gamers yang frustasi dengan proses top up yang rumit, 
                  mahal, dan tidak terpercaya. Kami percaya bahwa setiap gamer berhak mendapatkan 
                  pengalaman top up yang mudah, cepat, dan aman.
                </p>
                <p>
                  Sejak 2020, kami telah melayani lebih dari 100,000 gamers di seluruh Indonesia 
                  dengan komitmen memberikan harga terbaik, proses tercepat, dan layanan terpercaya.
                </p>
                <p>
                  Hari ini, GamePulse telah menjadi platform top up game terpercaya dengan 
                  rating 4.9/5 dari pengguna dan uptime server 99.9%.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">🎮</div>
                  <h3 className="text-2xl font-bold text-white mb-2">Misi Kami</h3>
                </div>
                <p className="text-gray-300 text-center leading-relaxed">
                  "Membuat top up game menjadi pengalaman yang menyenangkan, 
                  aman, dan terjangkau untuk semua gamers Indonesia."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Nilai-Nilai Kami
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Prinsip yang memandu setiap keputusan dan tindakan kami
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="group">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 transform text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${value.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{value.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Tim Kami
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Orang-orang hebat di balik GamePulse
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="group">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 transform text-center">
                  <div className={`w-20 h-20 bg-gradient-to-br ${member.gradient} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-white font-black text-2xl">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                  <p className={`text-sm font-medium mb-4 bg-gradient-to-r ${member.gradient} bg-clip-text text-transparent`}>
                    {member.role}
                  </p>
                  <p className="text-gray-300 text-sm leading-relaxed">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export const metadata = {
  title: 'Tentang Kami - GamePulse',
  description: 'Pelajari lebih lanjut tentang GamePulse, platform top up game terpercaya yang telah melayani ribuan gamers Indonesia sejak 2020.'
}
