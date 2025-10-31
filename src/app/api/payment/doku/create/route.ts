import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

// DOKU Checkout Configuration
const DOKU_CLIENT_ID = process.env.DOKU_CLIENT_ID || 'BRN-0217-1707978997886'
const DOKU_SECRET_KEY = process.env.DOKU_SECRET_KEY || 'SK-vMfiG8aPWfhPVZNj'
const DOKU_BASE_URL = process.env.DOKU_BASE_URL || 'https://api-sandbox.doku.com'

// Generate signature for DOKU Checkout API (Non-SNAP)
function generateSignature(
  clientId: string,
  requestId: string,
  requestTimestamp: string,
  requestTarget: string,
  secretKey: string,
  body?: string
): string {
  let componentSignature = `Client-Id:${clientId}\nRequest-Id:${requestId}\nRequest-Timestamp:${requestTimestamp}\nRequest-Target:${requestTarget}`
  
  if (body) {
    const digest = generateDigest(body)
    componentSignature += `\nDigest:${digest}`
  }
  
  const hmac = crypto.createHmac('sha256', secretKey)
  hmac.update(componentSignature)
  const signature = hmac.digest('base64')
  
  return `HMACSHA256=${signature}`
}

// Generate digest
function generateDigest(body: string): string {
  const hash = crypto.createHash('sha256')
  hash.update(body)
  return `SHA-256=${hash.digest('base64')}`
}

export async function POST(request: NextRequest) {
  try {
    const { transactionId, paymentMethod } = await request.json()

    // Validate transaction
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        game: true,
        denomination: true
      }
    })

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      )
    }

    if (transaction.status !== 'PENDING') {
      console.log(`Transaction ${transactionId} status: ${transaction.status}`)
      return NextResponse.json(
        { error: `Transaksi sudah diproses dengan status: ${transaction.status}` },
        { status: 400 }
      )
    }

    // Check if payment method is already set (payment already initiated)
    if (transaction.paymentMethod && transaction.paymentMethod !== paymentMethod) {
      console.log(`Transaction ${transactionId} already has payment method: ${transaction.paymentMethod}`)
      return NextResponse.json(
        { error: 'Metode pembayaran sudah dipilih sebelumnya' },
        { status: 400 }
      )
    }

    // Generate request headers
    const requestId = crypto.randomUUID()
    const requestTimestamp = new Date().toISOString()
    const requestTarget = '/checkout/v1/payment'

    // Map payment method to DOKU payment method types
    const paymentMethodMap: Record<string, string[]> = {
      'DANA': ['EMONEY_DANA'],
      'OVO': ['EMONEY_OVO'],
      'GOPAY': ['EMONEY_SHOPEE_PAY'], // GoPay via ShopeePay
      'QRIS': ['QRIS']
    }

    const paymentMethodTypes = paymentMethodMap[paymentMethod] || []

    // Prepare request body for DOKU Checkout
    const requestBody = {
      order: {
        invoice_number: transactionId,
        amount: transaction.totalPrice
      },
      payment: {
        payment_due_date: 60 // 60 minutes
      }
    }

    // Only add payment_method_types if specific method is selected
    if (paymentMethodTypes.length > 0) {
      (requestBody.payment as any).payment_method_types = paymentMethodTypes
    }

    const bodyString = JSON.stringify(requestBody)
    
    const signature = generateSignature(
      DOKU_CLIENT_ID,
      requestId,
      requestTimestamp,
      requestTarget,
      DOKU_SECRET_KEY,
      bodyString
    )

    const digest = generateDigest(bodyString)

    // Call DOKU Checkout API
    const response = await fetch(`${DOKU_BASE_URL}${requestTarget}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Id': DOKU_CLIENT_ID,
        'Request-Id': requestId,
        'Request-Timestamp': requestTimestamp,
        'Signature': signature,
        'Digest': digest
      },
      body: bodyString
    })

    const result = await response.json()

    console.log('DOKU Response:', result)

    if (response.ok && result.response?.payment?.url) {
      // Update transaction with payment method
      await prisma.transaction.update({
        where: { id: transactionId },
        data: {
          paymentMethod: paymentMethod
        }
      })

      return NextResponse.json({
        success: true,
        paymentUrl: result.response.payment.url,
        tokenId: result.response.payment.token_id,
        expiryDate: result.response.payment.expired_date,
        invoiceNumber: result.response.order.invoice_number
      })
    } else {
      console.error('DOKU API Error:', result)
      return NextResponse.json(
        { error: 'Failed to create payment', details: result },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
