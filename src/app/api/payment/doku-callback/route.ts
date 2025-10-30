import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { dokuPayment } from '@/lib/doku'

/**
 * DOKU Webhook Handler
 * Receives payment notifications from DOKU
 * 
 * Webhook akan dipanggil ketika:
 * 1. Payment berhasil
 * 2. Payment gagal
 * 3. Payment expired
 */
export async function POST(request: NextRequest) {
  try {
    // Get webhook data
    const body = await request.text()
    const data = JSON.parse(body)

    // Get headers for signature verification
    const signature = request.headers.get('Signature') || ''
    const requestTimestamp = request.headers.get('Request-Timestamp') || ''

    // Verify signature
    const isValid = dokuPayment.verifyWebhookSignature(
      signature,
      requestTimestamp,
      body
    )

    if (!isValid) {
      console.error('Invalid DOKU webhook signature')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    console.log('DOKU Webhook received:', data)

    // Extract payment info
    const {
      order,
      transaction,
      payment_status,
    } = data

    const invoiceNumber = order?.invoice_number
    const transactionId = transaction?.id
    const status = payment_status // SUCCESS, FAILED, EXPIRED

    if (!invoiceNumber) {
      return NextResponse.json(
        { error: 'Missing invoice number' },
        { status: 400 }
      )
    }

    // Find transaction in database
    const dbTransaction = await prisma.transaction.findUnique({
      where: { id: invoiceNumber }
    })

    if (!dbTransaction) {
      console.error('Transaction not found:', invoiceNumber)
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      )
    }

    // Map DOKU status to our status
    let newStatus: 'COMPLETED' | 'FAILED' | 'CANCELLED' = 'FAILED'
    
    if (status === 'SUCCESS') {
      newStatus = 'COMPLETED'
    } else if (status === 'EXPIRED') {
      newStatus = 'CANCELLED'
    } else {
      newStatus = 'FAILED'
    }

    // Update transaction
    await prisma.transaction.update({
      where: { id: invoiceNumber },
      data: {
        status: newStatus,
        paymentToken: transactionId,
        paymentResponse: JSON.stringify(data),
        updatedAt: new Date(),
      }
    })

    console.log(`Transaction ${invoiceNumber} updated to ${newStatus}`)

    // If payment successful, trigger Digiflazz top-up (optional)
    if (newStatus === 'COMPLETED') {
      // TODO: Call Digiflazz API to process top-up
      console.log('Payment successful! Ready to process top-up via Digiflazz')
    }

    // Return success response to DOKU
    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully'
    })

  } catch (error) {
    console.error('DOKU Webhook Error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

// GET - For webhook verification (DOKU might call this)
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'ok',
    message: 'DOKU webhook endpoint is ready'
  })
}
