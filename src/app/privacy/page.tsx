import { ShieldCheckIcon } from '@heroicons/react/24/outline'

export default function PrivacyPage() {
  const sections = [
    {
      title: '1. Informasi yang Kami Kumpulkan',
      content: [
        'Informasi pribadi seperti nama, email, dan nomor telepon saat Anda mendaftar.',
        'Data transaksi termasuk riwayat pembelian dan metode pembayaran yang digunakan.',
        'Informasi teknis seperti alamat IP, browser, dan perangkat yang digunakan.',
        'Data penggunaan layanan untuk meningkatkan kualitas platform kami.'
      ]
    },
    {
      title: '2. Bagaimana Kami Menggunakan Informasi',
      content: [
        'Memproses transaksi dan memberikan layanan yang Anda minta.',
        'Mengirim notifikasi penting terkait akun dan transaksi Anda.',
        'Meningkatkan keamanan dan mencegah aktivitas penipuan.',
        'Menganalisis penggunaan untuk pengembangan fitur dan layanan baru.',
        'Mengirim informasi promosi dengan persetujuan Anda.'
      ]
    },
    {
      title: '3. Berbagi Informasi dengan Pihak Ketiga',
      content: [
        'Kami tidak menjual atau menyewakan informasi pribadi Anda kepada pihak ketiga.',
        'Informasi dapat dibagikan dengan penyedia layanan pembayaran untuk memproses transaksi.',
        'Data dapat dibagikan dengan otoritas hukum jika diwajibkan oleh peraturan.',
        'Informasi anonim dapat digunakan untuk analisis dan riset pasar.'
      ]
    },
    {
      title: '4. Keamanan Data',
      content: [
        'Kami menggunakan enkripsi SSL untuk melindungi data yang ditransmisikan.',
        'Server kami dilindungi dengan firewall dan sistem keamanan berlapis.',
        'Akses ke data pribadi dibatasi hanya untuk karyawan yang berwenang.',
        'Kami melakukan audit keamanan secara berkala untuk memastikan perlindungan data.'
      ]
    },
    {
      title: '5. Cookies dan Teknologi Pelacakan',
      content: [
        'Kami menggunakan cookies untuk meningkatkan pengalaman pengguna.',
        'Cookies membantu kami mengingat preferensi dan pengaturan Anda.',
        'Anda dapat mengatur browser untuk menolak cookies, namun beberapa fitur mungkin tidak berfungsi.',
        'Kami menggunakan Google Analytics untuk memahami pola penggunaan website.'
      ]
    },
    {
      title: '6. Hak Pengguna',
      content: [
        'Anda berhak mengakses dan memperbarui informasi pribadi Anda.',
        'Anda dapat meminta penghapusan akun dan data pribadi Anda.',
        'Anda berhak menolak menerima komunikasi pemasaran dari kami.',
        'Anda dapat mengajukan keluhan terkait penggunaan data pribadi Anda.'
      ]
    },
    {
      title: '7. Penyimpanan Data',
      content: [
        'Data pribadi disimpan selama akun Anda aktif atau sesuai kebutuhan layanan.',
        'Data transaksi disimpan untuk keperluan audit dan kepatuhan hukum.',
        'Kami akan menghapus data yang tidak lagi diperlukan sesuai kebijakan retensi.',
        'Backup data dilakukan secara berkala untuk mencegah kehilangan informasi.'
      ]
    },
    {
      title: '8. Perubahan Kebijakan',
      content: [
        'Kami dapat memperbarui kebijakan privasi ini sewaktu-waktu.',
        'Perubahan signifikan akan diberitahukan melalui email atau notifikasi di platform.',
        'Penggunaan layanan setelah perubahan dianggap sebagai persetujuan terhadap kebijakan baru.',
        'Versi terbaru kebijakan privasi selalu tersedia di halaman ini.'
      ]
    }
  ]

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <ShieldCheckIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black mb-6">
            <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Kebijakan Privasi
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Kami berkomitmen melindungi privasi dan keamanan data pribadi Anda
          </p>
          <div className="mt-4 text-sm text-gray-400">
            Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </div>
        </div>

        {/* Content */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
          <div className="prose prose-invert max-w-none">
            <div className="mb-8 p-6 bg-green-500/10 border border-green-500/20 rounded-xl">
              <p className="text-green-300 leading-relaxed">
                <strong>Komitmen Kami:</strong> GamePulse menghormati privasi Anda dan berkomitmen untuk 
                melindungi informasi pribadi yang Anda berikan kepada kami. Kebijakan ini menjelaskan 
                bagaimana kami mengumpulkan, menggunakan, dan melindungi data Anda.
              </p>
            </div>

            <div className="space-y-8">
              {sections.map((section, index) => (
                <div key={index} className="border-b border-gray-700 pb-8 last:border-b-0">
                  <h2 className="text-2xl font-bold text-white mb-4">{section.title}</h2>
                  <ul className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-gray-300 leading-relaxed flex items-start">
                        <span className="text-green-400 mr-3 mt-2">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 bg-gray-700/50 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-4">Hubungi Kami</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Jika Anda memiliki pertanyaan tentang kebijakan privasi ini atau ingin menggunakan 
                hak-hak Anda terkait data pribadi, silakan hubungi kami:
              </p>
              <div className="space-y-2 text-gray-300">
                <p>📧 Email: privacy@gamepulse.com</p>
                <p>💬 WhatsApp: +62 812-3456-7890</p>
                <p>📍 Alamat: Jl. Teknologi No. 123, Jakarta Selatan</p>
                <p>🕒 Jam Operasional: 08:00 - 22:00 WIB</p>
              </div>
            </div>

            <div className="mt-8 p-6 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <h3 className="text-xl font-bold text-blue-300 mb-4">Sertifikasi Keamanan</h3>
              <p className="text-gray-300 leading-relaxed">
                GamePulse telah menerapkan standar keamanan internasional dan mematuhi 
                regulasi perlindungan data yang berlaku di Indonesia. Kami secara berkala 
                melakukan audit keamanan untuk memastikan data Anda selalu terlindungi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Kebijakan Privasi - GamePulse',
  description: 'Pelajari bagaimana GamePulse mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda sesuai dengan standar keamanan terbaik.'
}
