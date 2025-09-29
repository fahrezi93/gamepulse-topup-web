import { 
  ShieldCheckIcon, 
  BoltIcon, 
  CreditCardIcon, 
  ClockIcon,
  DevicePhoneMobileIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'

export default function FeaturesSection() {
  const features = [
    {
      icon: BoltIcon,
      title: 'Proses Super Cepat',
      description: 'Top up otomatis dalam hitungan detik setelah pembayaran berhasil',
      color: '#7C3AED'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Aman & Terpercaya',
      description: 'Sistem keamanan berlapis dan sudah dipercaya ribuan gamers',
      color: '#34D399'
    },
    {
      icon: CreditCardIcon,
      title: 'Metode Pembayaran Lengkap',
      description: 'Dukung DANA, OVO, GoPay, QRIS, dan berbagai e-wallet lainnya',
      color: '#7C3AED'
    },
    {
      icon: ClockIcon,
      title: 'Layanan 24/7',
      description: 'Sistem otomatis yang bekerja 24 jam sehari, 7 hari seminggu',
      color: '#34D399'
    },
    {
      icon: DevicePhoneMobileIcon,
      title: 'Mobile Friendly',
      description: 'Optimized untuk semua perangkat, desktop maupun mobile',
      color: '#7C3AED'
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Customer Support',
      description: 'Tim support yang siap membantu jika ada kendala atau pertanyaan',
      color: '#34D399'
    }
  ]

  return (
    <section className="py-20 relative" style={{ backgroundColor: '#0D1117' }}>
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(124, 58, 237, 0.1)' }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            <span style={{ color: '#7C3AED' }}>
              Mengapa Pilih
            </span>
            <br />
            <span style={{ color: '#F0F6FC' }}>GamePulse?</span>
          </h2>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
            Kami berkomitmen memberikan pengalaman top up terbaik dengan berbagai keunggulan 
            yang tidak akan kamu temukan di platform lain
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative backdrop-blur-sm border p-8 rounded-2xl transition-all duration-300 hover:scale-105 transform"
              style={{ 
                backgroundColor: '#161B22', 
                borderColor: feature.color
              }}
            >
              {/* Background Hover Effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" style={{ backgroundColor: feature.color }}></div>
              
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: feature.color }}>
                    <feature.icon className="w-7 h-7" style={{ color: '#F0F6FC' }} />
                  </div>
                  <h3 className="text-xl font-bold transition-colors duration-300" style={{ color: '#F0F6FC', fontFamily: 'Playfair Display, serif' }}>
                    {feature.title}
                  </h3>
                </div>
                <p className="leading-relaxed transition-colors duration-300" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
                  {feature.description}
                </p>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10 blur-xl" style={{ backgroundColor: feature.color }}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
