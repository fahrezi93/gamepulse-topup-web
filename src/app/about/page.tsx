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
    <div className="min-h-screen" style={{ backgroundColor: '#0D1117' }}>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(124, 58, 237, 0.1)' }}></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 rounded-full blur-xl animate-pulse" style={{ backgroundColor: 'rgba(124, 58, 237, 0.3)' }}></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 rounded-full blur-xl animate-pulse delay-1000" style={{ backgroundColor: 'rgba(52, 211, 153, 0.25)' }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-2xl" style={{ backgroundColor: '#161B22' }}>
                <span className="text-4xl">🎮</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-black mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              <span style={{ color: '#7C3AED' }}>
                Tentang
              </span>
              <br />
              <span style={{ color: '#F0F6FC' }}>GamePulse</span>
            </h1>
            
            <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
              Platform top up game terpercaya yang telah melayani ribuan gamers Indonesia 
              dengan komitmen memberikan pengalaman terbaik sejak 2020.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative" style={{ backgroundColor: '#0D1117' }}>
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(52, 211, 153, 0.1)' }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div 
                  className="group relative backdrop-blur-sm border p-8 rounded-2xl transition-all duration-300 hover:scale-105 transform"
                  style={{ 
                    backgroundColor: '#161B22', 
                    borderColor: index % 2 === 0 ? '#7C3AED' : '#34D399'
                  }}
                >
                  {/* Background Hover Effect */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" style={{ backgroundColor: index % 2 === 0 ? '#7C3AED' : '#34D399' }}></div>
                  
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: index % 2 === 0 ? '#7C3AED' : '#34D399' }}>
                      <stat.icon className="w-7 h-7" style={{ color: '#F0F6FC' }} />
                    </div>
                    <div className="text-4xl font-black mb-2" style={{ color: '#F0F6FC', fontFamily: 'Playfair Display, serif' }}>
                      {stat.number}
                    </div>
                    <div className="font-medium" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>{stat.label}</div>
                  </div>

                  {/* Hover Effect Border */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10 blur-xl" style={{ backgroundColor: index % 2 === 0 ? '#7C3AED' : '#34D399' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 relative" style={{ backgroundColor: '#0D1117' }}>
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(124, 58, 237, 0.1)' }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                <span style={{ color: '#7C3AED' }}>
                  Cerita
                </span>
                <br />
                <span style={{ color: '#F0F6FC' }}>Kami</span>
              </h2>
              <div className="space-y-6 leading-relaxed" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
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
              <div 
                className="group relative backdrop-blur-sm border p-8 rounded-2xl transition-all duration-300 hover:scale-105 transform"
                style={{ 
                  backgroundColor: '#161B22', 
                  borderColor: '#34D399'
                }}
              >
                {/* Background Hover Effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" style={{ backgroundColor: '#34D399' }}></div>
                
                <div className="relative z-10 text-center">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: '#34D399' }}>
                    <span className="text-4xl">🎮</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4" style={{ color: '#F0F6FC', fontFamily: 'Playfair Display, serif' }}>Misi Kami</h3>
                  <p className="leading-relaxed" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
                    "Membuat top up game menjadi pengalaman yang menyenangkan, 
                    aman, dan terjangkau untuk semua gamers Indonesia."
                  </p>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10 blur-xl" style={{ backgroundColor: '#34D399' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 relative" style={{ backgroundColor: '#0D1117' }}>
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(52, 211, 153, 0.1)' }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              <span style={{ color: '#34D399' }}>
                Nilai-Nilai
              </span>
              <br />
              <span style={{ color: '#F0F6FC' }}>Kami</span>
            </h2>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
              Prinsip yang memandu setiap keputusan dan tindakan kami
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="group">
                <div 
                  className="group relative backdrop-blur-sm border p-8 rounded-2xl transition-all duration-300 hover:scale-105 transform text-center"
                  style={{ 
                    backgroundColor: '#161B22', 
                    borderColor: index === 0 ? '#34D399' : index === 1 ? '#F59E0B' : '#EC4899'
                  }}
                >
                  {/* Background Hover Effect */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" style={{ backgroundColor: index === 0 ? '#34D399' : index === 1 ? '#F59E0B' : '#EC4899' }}></div>
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: index === 0 ? '#34D399' : index === 1 ? '#F59E0B' : '#EC4899' }}>
                      <value.icon className="w-8 h-8" style={{ color: '#F0F6FC' }} />
                    </div>
                    <h3 className="text-2xl font-bold mb-4" style={{ color: '#F0F6FC', fontFamily: 'Playfair Display, serif' }}>{value.title}</h3>
                    <p className="leading-relaxed" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>{value.description}</p>
                  </div>

                  {/* Hover Effect Border */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10 blur-xl" style={{ backgroundColor: index === 0 ? '#34D399' : index === 1 ? '#F59E0B' : '#EC4899' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 relative" style={{ backgroundColor: '#0D1117' }}>
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(124, 58, 237, 0.1)' }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              <span style={{ color: '#7C3AED' }}>
                Tim
              </span>
              <br />
              <span style={{ color: '#F0F6FC' }}>Kami</span>
            </h2>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
              Orang-orang hebat di balik GamePulse
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="group">
                <div 
                  className="group relative backdrop-blur-sm border p-8 rounded-2xl transition-all duration-300 hover:scale-105 transform text-center"
                  style={{ 
                    backgroundColor: '#161B22', 
                    borderColor: index === 0 ? '#06B6D4' : index === 1 ? '#A855F7' : '#34D399'
                  }}
                >
                  {/* Background Hover Effect */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" style={{ backgroundColor: index === 0 ? '#06B6D4' : index === 1 ? '#A855F7' : '#34D399' }}></div>
                  
                  <div className="relative z-10">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: index === 0 ? '#06B6D4' : index === 1 ? '#A855F7' : '#34D399' }}>
                      <span className="font-black text-2xl" style={{ color: '#F0F6FC' }}>
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2" style={{ color: '#F0F6FC', fontFamily: 'Playfair Display, serif' }}>{member.name}</h3>
                    <p className="text-sm font-medium mb-4" style={{ color: index === 0 ? '#06B6D4' : index === 1 ? '#A855F7' : '#34D399', fontFamily: 'Manrope, sans-serif' }}>
                      {member.role}
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>{member.description}</p>
                  </div>

                  {/* Hover Effect Border */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10 blur-xl" style={{ backgroundColor: index === 0 ? '#06B6D4' : index === 1 ? '#A855F7' : '#34D399' }}></div>
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
