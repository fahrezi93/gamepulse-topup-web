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
      gradient: 'from-yellow-400 to-orange-500',
      bgGradient: 'from-yellow-500/10 to-orange-500/10'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Aman & Terpercaya',
      description: 'Sistem keamanan berlapis dan sudah dipercaya ribuan gamers',
      gradient: 'from-green-400 to-emerald-500',
      bgGradient: 'from-green-500/10 to-emerald-500/10'
    },
    {
      icon: CreditCardIcon,
      title: 'Metode Pembayaran Lengkap',
      description: 'Dukung DANA, OVO, GoPay, QRIS, dan berbagai e-wallet lainnya',
      gradient: 'from-blue-400 to-cyan-500',
      bgGradient: 'from-blue-500/10 to-cyan-500/10'
    },
    {
      icon: ClockIcon,
      title: 'Layanan 24/7',
      description: 'Sistem otomatis yang bekerja 24 jam sehari, 7 hari seminggu',
      gradient: 'from-purple-400 to-pink-500',
      bgGradient: 'from-purple-500/10 to-pink-500/10'
    },
    {
      icon: DevicePhoneMobileIcon,
      title: 'Mobile Friendly',
      description: 'Optimized untuk semua perangkat, desktop maupun mobile',
      gradient: 'from-indigo-400 to-purple-500',
      bgGradient: 'from-indigo-500/10 to-purple-500/10'
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Customer Support',
      description: 'Tim support yang siap membantu jika ada kendala atau pertanyaan',
      gradient: 'from-pink-400 to-rose-500',
      bgGradient: 'from-pink-500/10 to-rose-500/10'
    }
  ]

  return (
    <section className="py-20 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-800/20 to-transparent"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Mengapa Pilih
            </span>
            <br />
            <span className="text-white">GamePulse?</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Kami berkomitmen memberikan pengalaman top up terbaik dengan berbagai keunggulan 
            yang tidak akan kamu temukan di platform lain
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-8 rounded-2xl hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 transform hover:border-gray-600"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-white transition-colors duration-300">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>

              {/* Hover Effect Border */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10 blur-xl`}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
