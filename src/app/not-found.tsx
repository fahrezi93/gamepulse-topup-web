import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        <div className="mb-8">
          <div className="text-6xl mb-4">🎮</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Halaman Tidak Ditemukan</h2>
          <p className="text-gray-600">
            Maaf, halaman yang Anda cari tidak dapat ditemukan. 
            Mungkin halaman telah dipindahkan atau URL salah.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Kembali ke Beranda
          </Link>
          
          <Link
            href="/transaction/check"
            className="block bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Cek Status Transaksi
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Butuh bantuan? <Link href="/help" className="text-blue-600 hover:underline">Hubungi Support</Link></p>
        </div>
      </div>
    </div>
  )
}
