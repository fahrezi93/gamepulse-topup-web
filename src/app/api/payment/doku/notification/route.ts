import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

const DOKU_SECRET_KEY = process.env.DOKU_SECRET_KEY || 'SK-vMfiG8aPWfhPVZNj'

// Verify DOKU signature
function verifySignature(
  clientId: string,
  requestId: string,
  requestTimestamp: string,
  requestTarget: string,
  body: string,
  receivedSignature: string
): boolean {
  const digest = crypto.createHash('sha256').update(body).digest('base64')
  const digestHeader = `SHA-256=${digest}`
  
  const componentSignature = `Client-Id:${clientId}\nRequest-Id:${requestId}\nRequest-Timestamp:${requestTimestamp}\nRequest-Target:${requestTarget}\nDigest:${digestHeader}`
  
  const hmac = crypto.createHmac('sha256', DOKU_SECRET_KEY)
  hmac.update(componentSignature)
  const calculatedSignature = `HMACSHA256=${hmac.digest('base64')}`
  
  return calculatedSignature === receivedSignature
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const notification = JSON.parse(body)

    // Get headers for signature verification
    const clientId = request.headers.get('Client-Id') || ''
    const requestId = request.headers.get('Request-Id') || ''
    const requestTimestamp = request.headers.get('Request-Timestamp') || ''
    const signature = request.headers.get('Signature') || ''
    const requestTarget = '/api/payment/doku/notification'

    // Verify signature
    const isValid = verifySignature(
      clientId,
      requestId,
      requestTimestamp,
      requestTarget,
      body,
      signature
    )

    if (!isValid) {
      console.error('Invalid signature from DOKU notification')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    console.log('DOKU Notification received:', notification)

    // Extract transaction data
    const invoiceNumber = notification.order?.invoice_number
    const transactionStatus = notification.transaction?.status

    if (!invoiceNumber) {
      return NextResponse.json(
        { error: 'Missing invoice number' },
        { status: 400 }
      )
    }

    // Find transaction
    const transaction = await prisma.transaction.findUnique({
      where: { id: invoiceNumber }
    })

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      )
    }

    // Update transaction status based on DOKU notification
    let newStatus: 'PENDING' | 'COMPLETED' | 'FAILED' = 'PENDING'

    if (transactionStatus === 'SUCCESS') {
      newStatus = 'COMPLETED'
    } else if (transactionStatus === 'FAILED' || transactionStatus === 'EXPIRED') {
      newStatus = 'FAILED'
    }

    // Update transaction
    await prisma.transaction.update({
      where: { id: invoiceNumber },
      data: {
        status: newStatus,
        updatedAt: new Date()
      }
    })

    console.log(`Transaction ${invoiceNumber} updated to ${newStatus}`)

    // Return success response to DOKU
    return NextResponse.json({
      message: 'Notification received successfully'
    })

  } catch (error) {
    console.error('Error processing DOKU notification:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
