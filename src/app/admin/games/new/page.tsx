import GameForm from '@/components/admin/GameForm'

export default function NewGamePage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Tambah Game Baru</h1>
          <p className="text-gray-400 mt-2">Buat game baru dengan denominasi top-up</p>
        </div>

        <GameForm />
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Tambah Game Baru - Admin GamePulse',
  description: 'Tambah game baru ke platform GamePulse'
}
