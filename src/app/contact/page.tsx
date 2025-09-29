'use client'

import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

export default function ContactPage() {
  const contactMethods = [
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Live Chat',
      description: 'Chat langsung dengan customer service kami',
      info: 'Tersedia 24/7',
      action: 'Mulai Chat',
      color: '#7C3AED',
      link: '#'
    },
    {
      icon: PhoneIcon,
      title: 'WhatsApp',
      description: 'Hubungi kami melalui WhatsApp',
      info: '+62 812-3456-7890',
      action: 'Chat WhatsApp',
      color: '#34D399',
      link: 'https://wa.me/6281234567890'
    },
    {
      icon: EnvelopeIcon,
      title: 'Email',
      description: 'Kirim email untuk pertanyaan detail',
      info: 'support@gamepulse.com',
      action: 'Kirim Email',
      color: '#7C3AED',
      link: 'mailto:support@gamepulse.com'
    }
  ]

  const officeHours = [
    { day: 'Senin - Jumat', hours: '08:00 - 22:00 WIB' },
    { day: 'Sabtu - Minggu', hours: '09:00 - 21:00 WIB' },
    { day: 'Sistem Top Up', hours: 'Otomatis 24/7' },
    { day: 'Response Time', hours: 'Maksimal 15 menit' }
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0D1117' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl" style={{ backgroundColor: '#7C3AED' }}>
              <ChatBubbleLeftRightIcon className="w-10 h-10" style={{ color: '#F0F6FC' }} />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            <span style={{ color: '#7C3AED' }}>Hubungi</span>
            <span style={{ color: '#F0F6FC' }}> Kami</span>
          </h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
            Tim customer service kami siap membantu Anda 24/7. 
            Pilih metode komunikasi yang paling nyaman untuk Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Methods */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#F0F6FC', fontFamily: 'Playfair Display, serif' }}>
              Cara Menghubungi Kami
            </h2>
            
            <div className="space-y-6">
              {contactMethods.map((method, index) => (
                <div key={index} className="backdrop-blur-sm border rounded-2xl p-6 transition-all duration-300 hover:scale-105" 
                     style={{ backgroundColor: '#161B22', borderColor: method.color }}>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" 
                         style={{ backgroundColor: method.color }}>
                      <method.icon className="w-6 h-6" style={{ color: '#F0F6FC' }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-2" style={{ color: '#F0F6FC', fontFamily: 'Playfair Display, serif' }}>
                        {method.title}
                      </h3>
                      <p className="mb-2" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
                        {method.description}
                      </p>
                      <p className="text-sm mb-4" style={{ color: method.color, fontFamily: 'Manrope, sans-serif' }}>
                        {method.info}
                      </p>
                      <a
                        href={method.link}
                        target={method.link.startsWith('http') ? '_blank' : '_self'}
                        rel={method.link.startsWith('http') ? 'noopener noreferrer' : ''}
                        className="inline-block px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        style={{ backgroundColor: method.color, color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}
                      >
                        {method.action}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Office Info & Hours */}
          <div className="space-y-8">
            {/* Office Location */}
            <div className="backdrop-blur-sm border rounded-2xl p-6" style={{ backgroundColor: '#161B22', borderColor: '#34D399' }}>
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#34D399' }}>
                  <MapPinIcon className="w-6 h-6" style={{ color: '#F0F6FC' }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: '#F0F6FC', fontFamily: 'Playfair Display, serif' }}>
                    Alamat Kantor
                  </h3>
                  <p style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
                    Jl. Teknologi Digital No. 123<br />
                    Kebayoran Baru, Jakarta Selatan<br />
                    DKI Jakarta 12180
                  </p>
                </div>
              </div>
            </div>

            {/* Office Hours */}
            <div className="backdrop-blur-sm border rounded-2xl p-6" style={{ backgroundColor: '#161B22', borderColor: '#7C3AED' }}>
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#7C3AED' }}>
                  <ClockIcon className="w-6 h-6" style={{ color: '#F0F6FC' }} />
                </div>
                <h3 className="text-lg font-bold" style={{ color: '#F0F6FC', fontFamily: 'Playfair Display, serif' }}>
                  Jam Operasional
                </h3>
              </div>
              
              <div className="space-y-3">
                {officeHours.map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0" style={{ borderColor: 'rgba(124, 58, 237, 0.2)' }}>
                    <span style={{ color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}>{schedule.day}</span>
                    <span style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>{schedule.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Link */}
            <div className="backdrop-blur-sm border rounded-2xl p-6 text-center" style={{ backgroundColor: 'rgba(52, 211, 153, 0.1)', borderColor: '#34D399' }}>
              <h3 className="text-lg font-bold mb-2" style={{ color: '#34D399', fontFamily: 'Playfair Display, serif' }}>
                Pertanyaan Umum
              </h3>
              <p className="mb-4" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
                Cek halaman FAQ untuk jawaban cepat atas pertanyaan yang sering diajukan
              </p>
              <a
                href="/help"
                className="inline-block px-6 py-2 rounded-lg font-medium transition-colors"
                style={{ backgroundColor: '#34D399', color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}
              >
                Lihat FAQ
              </a>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="backdrop-blur-sm border rounded-2xl p-8" style={{ backgroundColor: '#161B22', borderColor: '#7C3AED' }}>
            <h3 className="text-2xl font-bold mb-4" style={{ color: '#F0F6FC', fontFamily: 'Playfair Display, serif' }}>
              Butuh Bantuan Segera?
            </h3>
            <p className="mb-6" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
              Tim customer service kami siap membantu Anda menyelesaikan masalah dengan cepat dan profesional
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:scale-105"
                style={{ backgroundColor: '#34D399', color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}
              >
                <PhoneIcon className="w-5 h-5 mr-2" />
                WhatsApp Sekarang
              </a>
              <a
                href="mailto:support@gamepulse.com"
                className="inline-flex items-center justify-center border-2 px-6 py-3 rounded-xl font-medium transition-all duration-300"
                style={{ borderColor: '#7C3AED', color: '#7C3AED', backgroundColor: 'rgba(124, 58, 237, 0.1)', fontFamily: 'Manrope, sans-serif' }}
              >
                <EnvelopeIcon className="w-5 h-5 mr-2" />
                Kirim Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Metadata akan ditambahkan di layout atau parent component
