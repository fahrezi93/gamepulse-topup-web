import { SparklesIcon } from '@heroicons/react/24/outline'

export default function TermsPage() {
  const sections = [
    {
      title: '1. Penerimaan Syarat',
      content: [
        'Dengan menggunakan layanan GamePulse, Anda menyetujui untuk terikat oleh syarat dan ketentuan ini.',
        'Jika Anda tidak setuju dengan syarat ini, mohon untuk tidak menggunakan layanan kami.',
        'Kami berhak mengubah syarat dan ketentuan ini sewaktu-waktu tanpa pemberitahuan sebelumnya.'
      ]
    },
    {
      title: '2. Layanan yang Disediakan',
      content: [
        'GamePulse menyediakan layanan top up untuk berbagai game online.',
        'Kami berkomitmen untuk memproses transaksi dengan cepat dan aman.',
        'Layanan tersedia 24/7 dengan sistem otomatis yang handal.'
      ]
    },
    {
      title: '3. Akun Pengguna',
      content: [
        'Anda bertanggung jawab untuk menjaga kerahasiaan informasi akun Anda.',
        'Anda harus memberikan informasi yang akurat dan terkini saat mendaftar.',
        'Satu orang hanya diperbolehkan memiliki satu akun aktif.',
        'Kami berhak menangguhkan atau menghapus akun yang melanggar ketentuan.'
      ]
    },
    {
      title: '4. Transaksi dan Pembayaran',
      content: [
        'Semua transaksi bersifat final dan tidak dapat dibatalkan setelah diproses.',
        'Kami menerima berbagai metode pembayaran yang tersedia di platform.',
        'Harga dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya.',
        'Refund hanya diberikan dalam kasus kesalahan sistem atau kegagalan teknis.'
      ]
    },
    {
      title: '5. Kebijakan Refund',
      content: [
        'Refund akan diproses dalam 1x24 jam untuk kasus yang memenuhi syarat.',
        'Kesalahan input User ID atau data game menjadi tanggung jawab pengguna.',
        'Kami tidak bertanggung jawab atas kesalahan yang disebabkan oleh pengguna.',
        'Untuk klaim refund, hubungi customer service dengan bukti yang valid.'
      ]
    },
    {
      title: '6. Larangan Penggunaan',
      content: [
        'Dilarang menggunakan layanan untuk aktivitas ilegal atau penipuan.',
        'Dilarang melakukan spam atau penyalahgunaan sistem.',
        'Dilarang menggunakan bot atau script otomatis tanpa izin.',
        'Pelanggaran dapat mengakibatkan pemblokiran akun permanen.'
      ]
    },
    {
      title: '7. Batasan Tanggung Jawab',
      content: [
        'GamePulse tidak bertanggung jawab atas kerugian yang timbul dari penggunaan layanan.',
        'Kami tidak menjamin ketersediaan layanan 100% tanpa gangguan.',
        'Tanggung jawab kami terbatas pada nilai transaksi yang dilakukan.',
        'Force majeure dan gangguan teknis di luar kendali kami dikecualikan.'
      ]
    },
    {
      title: '8. Hukum yang Berlaku',
      content: [
        'Syarat dan ketentuan ini tunduk pada hukum Republik Indonesia.',
        'Setiap sengketa akan diselesaikan melalui pengadilan yang berwenang.',
        'Jika ada bagian yang tidak berlaku, bagian lainnya tetap berlaku.',
        'Versi bahasa Indonesia adalah versi yang mengikat secara hukum.'
      ]
    }
  ]

  return (
    <div className="min-h-screen py-12" style={{ backgroundColor: '#0D1117' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl" style={{ backgroundColor: '#7C3AED' }}>
              <SparklesIcon className="w-8 h-8" style={{ color: '#F0F6FC' }} />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            <span style={{ color: '#7C3AED' }}>
              Syarat & Ketentuan
            </span>
          </h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
            Mohon baca dengan seksama syarat dan ketentuan penggunaan layanan GamePulse
          </p>
          <div className="mt-4 text-sm" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
            Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </div>
        </div>

        {/* Content */}
        <div className="backdrop-blur-sm border rounded-2xl p-8" style={{ backgroundColor: '#161B22', borderColor: '#7C3AED' }}>
          <div className="prose prose-invert max-w-none">
            <div className="mb-8 p-6 border rounded-xl" style={{ backgroundColor: 'rgba(124, 58, 237, 0.1)', borderColor: 'rgba(124, 58, 237, 0.2)' }}>
              <p className="leading-relaxed" style={{ color: '#7C3AED', fontFamily: 'Manrope, sans-serif' }}>
                <strong>Penting:</strong> Dengan menggunakan layanan GamePulse, Anda dianggap telah membaca, 
                memahami, dan menyetujui seluruh syarat dan ketentuan yang tercantum di bawah ini.
              </p>
            </div>

            <div className="space-y-8">
              {sections.map((section, index) => (
                <div key={index} className="border-b pb-8 last:border-b-0" style={{ borderColor: '#7C3AED' }}>
                  <h2 className="text-2xl font-bold mb-4" style={{ color: '#F0F6FC', fontFamily: 'Playfair Display, serif' }}>{section.title}</h2>
                  <ul className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="leading-relaxed flex items-start" style={{ color: '#8B949E', fontFamily: 'Manrope, sans-serif' }}>
                        <span className="mr-3 mt-2" style={{ color: '#7C3AED' }}>•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 bg-gray-700/50 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-4">Kontak</h3>
              <p className="text-gray-300 leading-relaxed">
                Jika Anda memiliki pertanyaan tentang syarat dan ketentuan ini, 
                silakan hubungi kami melalui:
              </p>
              <div className="mt-4 space-y-2 text-gray-300">
                <p>📧 Email: legal@gamepulse.com</p>
                <p>💬 WhatsApp: +62 812-3456-7890</p>
                <p>🕒 Jam Operasional: 08:00 - 22:00 WIB</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Syarat & Ketentuan - GamePulse',
  description: 'Baca syarat dan ketentuan penggunaan layanan GamePulse untuk memahami hak dan kewajiban Anda sebagai pengguna.'
}
