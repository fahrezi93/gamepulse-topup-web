import { 
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline'

export default function HelpPage() {
  const faqs = [
    {
      question: 'Bagaimana cara melakukan top up?',
      answer: 'Pilih game yang ingin di-top up, masukkan User ID, pilih nominal, pilih metode pembayaran, lalu lakukan pembayaran. Item akan otomatis masuk ke akun game Anda dalam 1-5 menit.'
    },
    {
      question: 'Berapa lama proses top up?',
      answer: 'Proses top up biasanya berlangsung 1-5 menit setelah pembayaran berhasil. Jika lebih dari 15 menit belum masuk, silakan hubungi customer service.'
    },
    {
      question: 'Metode pembayaran apa saja yang tersedia?',
      answer: 'Kami menerima pembayaran melalui DANA, OVO, GoPay, QRIS, dan berbagai e-wallet lainnya.'
    },
    {
      question: 'Bagaimana jika top up gagal?',
      answer: 'Jika top up gagal, dana akan dikembalikan otomatis dalam 1x24 jam. Anda juga bisa menghubungi customer service untuk bantuan lebih lanjut.'
    },
    {
      question: 'Apakah data saya aman?',
      answer: 'Ya, kami menggunakan sistem keamanan berlapis dan tidak menyimpan informasi pembayaran sensitif. Data Anda dijamin aman.'
    },
    {
      question: 'Bagaimana cara cek status transaksi?',
      answer: 'Anda bisa cek status transaksi di halaman "Cek Transaksi" dengan memasukkan ID transaksi yang diberikan setelah pemesanan.'
    }
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0D1117' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <QuestionMarkCircleIcon className="w-16 h-16 mx-auto mb-4" style={{ color: '#7C3AED' }} />
          <h1 className="text-3xl font-bold mb-4" style={{ color: '#F0F6FC', fontFamily: 'Playfair Display, serif' }}>Pusat Bantuan</h1>
          <p className="text-lg" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
            Temukan jawaban untuk pertanyaan yang sering diajukan
          </p>
        </div>

        {/* FAQ Section */}
        <div className="rounded-xl shadow-sm border mb-8" style={{ backgroundColor: '#161B22', borderColor: '#7C3AED' }}>
          <div className="p-6 border-b" style={{ borderColor: '#7C3AED' }}>
            <h2 className="text-xl font-bold" style={{ color: '#F0F6FC', fontFamily: 'Playfair Display, serif' }}>Frequently Asked Questions (FAQ)</h2>
          </div>
          
          <div className="divide-y" style={{ borderColor: '#7C3AED' }}>
            {faqs.map((faq, index) => (
              <div key={index} className="p-6" style={{ borderColor: '#7C3AED' }}>
                <h3 className="font-semibold mb-2" style={{ color: '#F0F6FC', fontFamily: 'Playfair Display, serif' }}>{faq.question}</h3>
                <p className="leading-relaxed" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl shadow-sm p-6 text-center border" style={{ backgroundColor: '#161B22', borderColor: '#7C3AED' }}>
            <ChatBubbleLeftRightIcon className="w-12 h-12 mx-auto mb-4" style={{ color: '#7C3AED' }} />
            <h3 className="font-semibold mb-2" style={{ color: '#F0F6FC', fontFamily: 'Playfair Display, serif' }}>Live Chat</h3>
            <p className="text-sm mb-4" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
              Chat langsung dengan customer service kami
            </p>
            <button className="px-4 py-2 rounded-lg text-sm font-medium transition-colors" style={{ backgroundColor: '#7C3AED', color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}>
              Mulai Chat
            </button>
          </div>

          <div className="rounded-xl shadow-sm p-6 text-center border" style={{ backgroundColor: '#161B22', borderColor: '#34D399' }}>
            <PhoneIcon className="w-12 h-12 mx-auto mb-4" style={{ color: '#34D399' }} />
            <h3 className="font-semibold mb-2" style={{ color: '#F0F6FC', fontFamily: 'Playfair Display, serif' }}>WhatsApp</h3>
            <p className="text-sm mb-4" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
              Hubungi kami melalui WhatsApp
            </p>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-block"
              style={{ backgroundColor: '#34D399', color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}
            >
              Chat WhatsApp
            </a>
          </div>

          <div className="rounded-xl shadow-sm p-6 text-center border" style={{ backgroundColor: '#161B22', borderColor: '#7C3AED' }}>
            <EnvelopeIcon className="w-12 h-12 mx-auto mb-4" style={{ color: '#7C3AED' }} />
            <h3 className="font-semibold mb-2" style={{ color: '#F0F6FC', fontFamily: 'Playfair Display, serif' }}>Email</h3>
            <p className="text-sm mb-4" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
              Kirim email untuk pertanyaan detail
            </p>
            <a
              href="mailto:support@gamepulse.com"
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-block"
              style={{ backgroundColor: '#7C3AED', color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}
            >
              Kirim Email
            </a>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="border rounded-xl p-6 mt-8" style={{ backgroundColor: 'rgba(52, 211, 153, 0.1)', borderColor: '#34D399' }}>
          <h3 className="font-semibold mb-4" style={{ color: '#34D399', fontFamily: 'Playfair Display, serif' }}>⏰ Jam Operasional Customer Service</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p style={{ color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}><strong>Senin - Jumat:</strong> 08:00 - 22:00 WIB</p>
              <p style={{ color: '#F0F6FC', fontFamily: 'Manrope, sans-serif' }}><strong>Sabtu - Minggu:</strong> 09:00 - 21:00 WIB</p>
            </div>
            <div>
              <p style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
                <strong>Sistem Top Up:</strong> Otomatis 24/7
              </p>
              <p style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
                <strong>Response Time:</strong> Maksimal 15 menit
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Pusat Bantuan - GamePulse',
  description: 'Temukan jawaban untuk pertanyaan seputar top up game di GamePulse'
}
