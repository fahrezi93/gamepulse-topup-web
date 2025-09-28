interface AdminStatsProps {
  stats: {
    totalGames: number
    totalTransactions: number
    totalRevenue: number
    pendingTransactions: number
  }
}

export default function AdminStats({ stats }: AdminStatsProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const statCards = [
    {
      title: 'Total Game',
      value: stats.totalGames.toString(),
      icon: '🎮',
      color: 'bg-blue-500'
    },
    {
      title: 'Total Transaksi',
      value: stats.totalTransactions.toString(),
      icon: '📊',
      color: 'bg-green-500'
    },
    {
      title: 'Total Revenue',
      value: formatPrice(stats.totalRevenue),
      icon: '💰',
      color: 'bg-yellow-500'
    },
    {
      title: 'Transaksi Pending',
      value: stats.pendingTransactions.toString(),
      icon: '⏳',
      color: 'bg-red-500'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((card, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
            <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center text-white text-xl`}>
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
