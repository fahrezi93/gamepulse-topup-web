import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { gameId, gameUserId, playerName, denominationId, paymentMethod } = body

    // Validasi input
    if (!gameId || !gameUserId || !denominationId || !paymentMethod) {
      return NextResponse.json(
        { error: 'Data tidak lengkap' },
        { status: 400 }
      )
    }

    // Cek apakah game dan denomination valid
    const game = await prisma.game.findUnique({
      where: { id: gameId, isActive: true }
    })

    if (!game) {
      return NextResponse.json(
        { error: 'Game tidak ditemukan' },
        { status: 404 }
      )
    }

    const denomination = await prisma.denomination.findUnique({
      where: { 
        id: denominationId,
        gameId: gameId,
        isActive: true 
      }
    })

    if (!denomination) {
      return NextResponse.json(
        { error: 'Denominasi tidak ditemukan' },
        { status: 404 }
      )
    }

    // Buat transaksi baru
    const transaction = await prisma.transaction.create({
      data: {
        gameUserId,
        playerName: playerName || null,
        totalPrice: denomination.price,
        paymentMethod,
        status: 'PENDING',
        gameId,
        denominationId
      }
    })

    return NextResponse.json({
      success: true,
      transactionId: transaction.id,
      message: 'Transaksi berhasil dibuat'
    })

  } catch (error) {
    console.error('Error creating transaction:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
