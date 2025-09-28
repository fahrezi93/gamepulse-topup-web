import { 
  DevicePhoneMobileIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

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
      icon: DevicePhoneMobileIcon,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Total Transaksi',
      value: stats.totalTransactions.toString(),
      icon: ChartBarIcon,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Total Revenue',
      value: formatPrice(stats.totalRevenue),
      icon: CurrencyDollarIcon,
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      title: 'Transaksi Pending',
      value: stats.pendingTransactions.toString(),
      icon: ClockIcon,
      color: 'from-red-500 to-red-600'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((card, index) => {
        const IconComponent = card.icon
        return (
          <div key={index} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">{card.title}</p>
                <p className="text-2xl font-bold text-white">{card.value}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-lg flex items-center justify-center shadow-lg`}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
