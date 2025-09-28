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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <QuestionMarkCircleIcon className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Pusat Bantuan</h1>
          <p className="text-lg text-gray-600">
            Temukan jawaban untuk pertanyaan yang sering diajukan
          </p>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Frequently Asked Questions (FAQ)</h2>
          </div>
          
          <div className="divide-y divide-gray-100">
            {faqs.map((faq, index) => (
              <div key={index} className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100">
            <ChatBubbleLeftRightIcon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-gray-600 text-sm mb-4">
              Chat langsung dengan customer service kami
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              Mulai Chat
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100">
            <PhoneIcon className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">WhatsApp</h3>
            <p className="text-gray-600 text-sm mb-4">
              Hubungi kami melalui WhatsApp
            </p>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors inline-block"
            >
              Chat WhatsApp
            </a>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100">
            <EnvelopeIcon className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
            <p className="text-gray-600 text-sm mb-4">
              Kirim email untuk pertanyaan detail
            </p>
            <a
              href="mailto:support@gamepulse.com"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors inline-block"
            >
              Kirim Email
            </a>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8">
          <h3 className="font-semibold text-blue-900 mb-4">⏰ Jam Operasional Customer Service</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-blue-800"><strong>Senin - Jumat:</strong> 08:00 - 22:00 WIB</p>
              <p className="text-blue-800"><strong>Sabtu - Minggu:</strong> 09:00 - 21:00 WIB</p>
            </div>
            <div>
              <p className="text-blue-700">
                <strong>Sistem Top Up:</strong> Otomatis 24/7
              </p>
              <p className="text-blue-700">
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
