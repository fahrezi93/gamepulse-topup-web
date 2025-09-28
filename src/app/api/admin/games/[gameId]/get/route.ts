import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { gameId: string } }
) {
  try {
    const { gameId } = params

    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: {
        denominations: {
          where: { isActive: true },
          orderBy: { price: 'asc' }
        }
      }
    })

    if (!game) {
      return NextResponse.json(
        { error: 'Game tidak ditemukan' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      game
    })

  } catch (error) {
    console.error('Error fetching game:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil data game' },
      { status: 500 }
    )
  }
}
