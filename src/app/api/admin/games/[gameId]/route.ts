import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PATCH - Update game
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  try {
    const { gameId } = await params
    const body = await request.json()

    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: body
    })

    return NextResponse.json({
      success: true,
      game: updatedGame
    })

  } catch (error) {
    console.error('Error updating game:', error)
    return NextResponse.json(
      { error: 'Gagal mengupdate game' },
      { status: 500 }
    )
  }
}

// DELETE - Delete game
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  try {
    const { gameId } = await params

    // Cek apakah ada transaksi yang terkait
    const transactionCount = await prisma.transaction.count({
      where: { gameId }
    })

    if (transactionCount > 0) {
      return NextResponse.json(
        { error: 'Tidak dapat menghapus game yang memiliki transaksi' },
        { status: 400 }
      )
    }

    // Hapus denominasi terlebih dahulu
    await prisma.denomination.deleteMany({
      where: { gameId }
    })

    // Hapus game
    await prisma.game.delete({
      where: { id: gameId }
    })

    return NextResponse.json({
      success: true,
      message: 'Game berhasil dihapus'
    })

  } catch (error) {
    console.error('Error deleting game:', error)
    return NextResponse.json(
      { error: 'Gagal menghapus game' },
      { status: 500 }
    )
  }
}
