import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const games = await prisma.game.findMany({
      where: {
        isActive: true
      },
      include: {
        denominations: {
          where: {
            isActive: true
          },
          orderBy: {
            price: 'asc'
          },
          take: 1
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json({
      success: true,
      games
    })

  } catch (error) {
    console.error('Error fetching games:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil data games' },
      { status: 500 }
    )
  }
}
