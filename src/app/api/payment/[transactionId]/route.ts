import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { dokuPayment } from '@/lib/doku'

// POST - Process payment with DOKU or simulation
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ transactionId: string }> }
) {
  try {
    const { transactionId } = await params
    const body = await request.json()

    // Cek apakah transaksi ada
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        user: true,
        game: true,
        denomination: true,
      }
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

    let paymentResult
    let paymentToken = null
    let paymentResponse = null

    // Process based on payment method
    if (body.paymentMethod === 'credit_card' && body.cardDetails) {
      // DOKU Credit Card Payment
      console.log('Processing DOKU Credit Card Payment...')
      
      paymentResult = await dokuPayment.createCreditCardPayment({
        cardNumber: body.cardDetails.cardNumber,
        cardExpMonth: body.cardDetails.cardExpMonth,
        cardExpYear: body.cardDetails.cardExpYear,
        cardCvv: body.cardDetails.cardCvv,
        amount: transaction.totalPrice,
        invoiceNumber: transaction.id,
        customerName: transaction.user?.name || 'Guest',
        customerEmail: transaction.user?.email || 'guest@gamepulse.com',
      })

      if (paymentResult.success) {
        paymentToken = paymentResult.data.transaction_id || null
        paymentResponse = JSON.stringify(paymentResult.data)
      }
    } else {
      // Simulasi proses pembayaran untuk metode lain (80% berhasil, 20% gagal)
      console.log('Processing simulated payment...')
      const isSuccess = Math.random() > 0.2
      paymentResult = {
        success: isSuccess,
        data: {
          status: isSuccess ? 'SUCCESS' : 'FAILED',
          message: isSuccess ? 'Pembayaran berhasil' : 'Pembayaran gagal'
        }
      }

      // Simulasi delay untuk efek realistis
      await new Promise(resolve => setTimeout(resolve, 2000))
    }

    // Determine new status
    const newStatus = paymentResult.success ? 'COMPLETED' : 'FAILED'

    // Update status transaksi
    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: { 
        status: newStatus,
        paymentToken,
        paymentResponse,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: paymentResult.success,
      status: newStatus,
      message: paymentResult.success 
        ? 'Pembayaran berhasil diproses' 
        : 'Pembayaran gagal, silakan coba lagi',
      data: paymentResult.data
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
  { params }: { params: Promise<{ transactionId: string }> }
) {
  try {
    const { transactionId } = await params

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
