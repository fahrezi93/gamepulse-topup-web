import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST - Process payment (simulation)
export async function POST(
  request: NextRequest,
  { params }: { params: { transactionId: string } }
) {
  try {
    const { transactionId } = params

    // Cek apakah transaksi ada
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId }
    })

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaksi tidak ditemukan' },
        { status: 404 }
      )
    }

    if (transaction.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Transaksi sudah diproses sebelumnya' },
        { status: 400 }
      )
    }

    // Simulasi proses pembayaran (80% berhasil, 20% gagal)
    const isSuccess = Math.random() > 0.2
    const newStatus = isSuccess ? 'COMPLETED' : 'FAILED'

    // Update status transaksi
    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: { 
        status: newStatus,
        updatedAt: new Date()
      }
    })

    // Simulasi delay untuk efek realistis
    await new Promise(resolve => setTimeout(resolve, 2000))

    return NextResponse.json({
      success: isSuccess,
      status: newStatus,
      message: isSuccess 
        ? 'Pembayaran berhasil diproses' 
        : 'Pembayaran gagal, silakan coba lagi'
    })

  } catch (error) {
    console.error('Payment processing error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memproses pembayaran' },
      { status: 500 }
    )
  }
}

// DELETE - Cancel transaction
export async function DELETE(
  request: NextRequest,
  { params }: { params: { transactionId: string } }
) {
  try {
    const { transactionId } = params

    // Cek apakah transaksi ada dan masih bisa dibatalkan
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId }
    })

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaksi tidak ditemukan' },
        { status: 404 }
      )
    }

    if (transaction.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Transaksi tidak dapat dibatalkan' },
        { status: 400 }
      )
    }

    // Update status menjadi CANCELLED
    await prisma.transaction.update({
      where: { id: transactionId },
      data: { 
        status: 'CANCELLED',
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Transaksi berhasil dibatalkan'
    })

  } catch (error) {
    console.error('Transaction cancellation error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat membatalkan transaksi' },
      { status: 500 }
    )
  }
}
