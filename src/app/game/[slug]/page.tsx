import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import GameDetailHeader from '@/components/game/GameDetailHeader'
import TopUpForm from '@/components/game/TopUpForm'

interface GameDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function GameDetailPage({ params }: GameDetailPageProps) {
  const { slug } = await params
  const game = await prisma.game.findUnique({
    where: {
      slug: slug,
      isActive: true
    },
    include: {
      denominations: {
        where: {
          isActive: true
        },
        orderBy: {
          price: 'asc'
        }
      }
    }
  })

  if (!game) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Game Info */}
          <div>
            <GameDetailHeader game={game} />
          </div>

          {/* Top Up Form */}
          <div>
            <TopUpForm game={game} denominations={game.denominations} />
          </div>
        </div>
      </div>
    </div>
  )
}

// Generate metadata untuk SEO
export async function generateMetadata({ params }: GameDetailPageProps) {
  const { slug } = await params
  const game = await prisma.game.findUnique({
    where: {
      slug: slug
    }
  })

  if (!game) {
    return {
      title: 'Game Tidak Ditemukan - GamePulse'
    }
  }

  return {
    title: `Top Up ${game.name} - GamePulse`,
    description: game.description || `Top up ${game.name} dengan mudah dan cepat di GamePulse. Harga terjangkau dan proses otomatis.`,
  }
}
