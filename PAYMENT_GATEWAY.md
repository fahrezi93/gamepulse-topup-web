# 💳 Payment Gateway Integration Guide

Panduan lengkap untuk mengintegrasikan payment gateway ke GamePulse.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Midtrans Integration](#-midtrans-integration)
3. [Xendit Integration](#-xendit-integration)
4. [DOKU Integration](#-doku-integration)
5. [Testing Payment](#-testing-payment)
6. [Webhook Implementation](#-webhook-implementation)
7. [Error Handling](#-error-handling)
8. [Best Practices](#-best-practices)

---

## Overview

GamePulse mendukung berbagai payment gateway populer di Indonesia:

| Provider | Methods | Transaction Fee | Settlement |
|----------|---------|-----------------|------------|
| **Midtrans** | E-Wallet, QRIS, Bank Transfer, Credit Card | 2-3% | T+1 |
| **Xendit** | E-Wallet, QRIS, VA, Retail Outlets | 1.5-3% | T+1 |
| **DOKU** | E-Wallet, VA, Credit Card | 2-4% | T+2 |
| **iPaymu** | E-Wallet, VA, QRIS | 2-3.5% | T+1 |

---

## 🟢 Midtrans Integration

### 1. Setup Midtrans Account

1. Daftar di [Midtrans](https://dashboard.midtrans.com/register)
2. Verifikasi business account
3. Dapatkan API keys dari **Settings > Access Keys**

### 2. Install Dependencies

```bash
npm install midtrans-client
```

### 3. Environment Variables

```env
# .env.local
MIDTRANS_SERVER_KEY="SB-Mid-server-xxxxxxxxxx"
MIDTRANS_CLIENT_KEY="SB-Mid-client-xxxxxxxxxx"
MIDTRANS_IS_PRODUCTION="false"
```

### 4. Create Midtrans Client

```typescript
// lib/midtrans.ts
import midtransClient from 'midtrans-client'

export const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
})

export const coreApi = new midtransClient.CoreApi({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
})
```

### 5. Create Payment API

```typescript
// app/api/payment/create/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { snap } from '@/lib/midtrans'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { transactionId } = body

    // Get transaction details
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        game: true,
        denomination: true,
      },
    })

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      )
    }

    // Create Midtrans transaction
    const parameter = {
      transaction_details: {
        order_id: transaction.id,
        gross_amount: transaction.totalPrice,
      },
      customer_details: {
        first_name: transaction.playerName || 'Customer',
        email: transaction.userId ? 'user@example.com' : 'guest@example.com',
      },
      item_details: [
        {
          id: transaction.denominationId,
          price: transaction.totalPrice,
          quantity: 1,
          name: `${transaction.game.name} - ${transaction.denomination.name}`,
        },
      ],
      callbacks: {
        finish: `${process.env.NEXTAUTH_URL}/payment/finish?order_id=${transaction.id}`,
        error: `${process.env.NEXTAUTH_URL}/payment/error?order_id=${transaction.id}`,
        pending: `${process.env.NEXTAUTH_URL}/payment/pending?order_id=${transaction.id}`,
      },
      enabled_payments: [
        'gopay',
        'shopeepay',
        'dana',
        'qris',
        'bca_va',
        'bni_va',
        'bri_va',
        'permata_va',
        'other_va',
      ],
    }

    const snapTransaction = await snap.createTransaction(parameter)

    // Update transaction with payment token
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        paymentToken: snapTransaction.token,
        status: 'PENDING_PAYMENT',
      },
    })

    return NextResponse.json({
      token: snapTransaction.token,
      redirectUrl: snapTransaction.redirect_url,
    })
  } catch (error) {
    console.error('Midtrans payment error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    )
  }
}
```

### 6. Frontend Integration

```typescript
// components/payment/MidtransButton.tsx
'use client'

import { useState } from 'react'

declare global {
  interface Window {
    snap: any
  }
}

export default function MidtransButton({ 
  transactionId 
}: { 
  transactionId: string 
}) {
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    try {
      setLoading(true)

      // Create payment
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId }),
      })

      const { token } = await response.json()

      // Load Midtrans Snap
      const script = document.createElement('script')
      script.src = 'https://app.sandbox.midtrans.com/snap/snap.js'
      script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!)
      document.body.appendChild(script)

      script.onload = () => {
        window.snap.pay(token, {
          onSuccess: (result: any) => {
            window.location.href = `/payment/success?order_id=${transactionId}`
          },
          onPending: (result: any) => {
            window.location.href = `/payment/pending?order_id=${transactionId}`
          },
          onError: (result: any) => {
            window.location.href = `/payment/error?order_id=${transactionId}`
          },
          onClose: () => {
            setLoading(false)
          },
        })
      }
    } catch (error) {
      console.error('Payment error:', error)
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full bg-blue-600 text-white py-3 rounded-lg"
    >
      {loading ? 'Processing...' : 'Pay Now'}
    </button>
  )
}
```

### 7. Webhook Handler

```typescript
// app/api/webhooks/midtrans/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { coreApi } from '@/lib/midtrans'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Verify signature
    const hash = crypto
      .createHash('sha512')
      .update(
        `${body.order_id}${body.status_code}${body.gross_amount}${process.env.MIDTRANS_SERVER_KEY}`
      )
      .digest('hex')
    
    if (hash !== body.signature_key) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    // Get transaction status
    const statusResponse = await coreApi.transaction.status(body.order_id)
    
    let transactionStatus = 'PENDING'
    if (statusResponse.transaction_status === 'settlement' || 
        statusResponse.transaction_status === 'capture') {
      transactionStatus = 'COMPLETED'
    } else if (statusResponse.transaction_status === 'pending') {
      transactionStatus = 'PENDING_PAYMENT'
    } else if (statusResponse.transaction_status === 'deny' || 
               statusResponse.transaction_status === 'expire' || 
               statusResponse.transaction_status === 'cancel') {
      transactionStatus = 'FAILED'
    }

    // Update transaction
    await prisma.transaction.update({
      where: { id: body.order_id },
      data: {
        status: transactionStatus,
        paymentResponse: JSON.stringify(statusResponse),
      },
    })

    // TODO: Send notification to user
    // TODO: Process top-up (send to game API)

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
```

---

## 🔵 Xendit Integration

### 1. Setup Xendit Account

1. Daftar di [Xendit](https://dashboard.xendit.co/register)
2. Verifikasi business account
3. Dapatkan API key dari **Settings > API Keys**

### 2. Install Dependencies

```bash
npm install xendit-node
```

### 3. Environment Variables

```env
# .env.local
XENDIT_API_KEY="xnd_development_xxxxxxxxxxxxx"
XENDIT_WEBHOOK_TOKEN="your-webhook-verification-token"
```

### 4. Create Xendit Client

```typescript
// lib/xendit.ts
import { Xendit } from 'xendit-node'

export const xenditClient = new Xendit({
  secretKey: process.env.XENDIT_API_KEY!,
})
```

### 5. Create E-Wallet Payment

```typescript
// app/api/payment/xendit/ewallet/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { xenditClient } from '@/lib/xendit'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { transactionId, ewalletType } = body // 'OVO', 'DANA', 'SHOPEEPAY', 'LINKAJA'

    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { game: true, denomination: true },
    })

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }

    // Create e-wallet charge
    const ewalletCharge = await xenditClient.EWallet.createEWalletCharge({
      referenceID: transaction.id,
      currency: 'IDR',
      amount: transaction.totalPrice,
      checkoutMethod: 'ONE_TIME_PAYMENT',
      channelCode: ewalletType,
      channelProperties: {
        successRedirectURL: `${process.env.NEXTAUTH_URL}/payment/success?order_id=${transaction.id}`,
        failureRedirectURL: `${process.env.NEXTAUTH_URL}/payment/error?order_id=${transaction.id}`,
      },
    })

    // Update transaction
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        paymentToken: ewalletCharge.id,
        status: 'PENDING_PAYMENT',
      },
    })

    return NextResponse.json({
      chargeId: ewalletCharge.id,
      redirectUrl: ewalletCharge.actions?.mobile_web_checkout_url,
    })
  } catch (error) {
    console.error('Xendit payment error:', error)
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 })
  }
}
```

### 6. Xendit Webhook

```typescript
// app/api/webhooks/xendit/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Verify webhook token
    const webhookToken = request.headers.get('x-callback-token')
    if (webhookToken !== process.env.XENDIT_WEBHOOK_TOKEN) {
      return NextResponse.json({ error: 'Invalid webhook token' }, { status: 401 })
    }

    const { event, data } = body

    if (event === 'ewallet.capture') {
      const transactionStatus = data.status === 'SUCCEEDED' ? 'COMPLETED' : 'FAILED'

      await prisma.transaction.update({
        where: { id: data.reference_id },
        data: {
          status: transactionStatus,
          paymentResponse: JSON.stringify(data),
        },
      })
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('Xendit webhook error:', error)
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 })
  }
}
```

---

## 🟣 DOKU Integration

### 1. Setup DOKU Account

1. Daftar di [DOKU](https://dashboard.doku.com/register)
2. Lengkapi business information
3. Dapatkan Client ID & Secret Key

### 2. Install Dependencies

```bash
npm install jokul-nodejs-library
```

### 3. Environment Variables

```env
DOKU_CLIENT_ID="your-client-id"
DOKU_SECRET_KEY="your-secret-key"
DOKU_IS_PRODUCTION="false"
```

### 4. Implementation

```typescript
// lib/doku.ts
import { Jokul } from 'jokul-nodejs-library'

export const dokuClient = new Jokul({
  clientId: process.env.DOKU_CLIENT_ID!,
  secretKey: process.env.DOKU_SECRET_KEY!,
  isProduction: process.env.DOKU_IS_PRODUCTION === 'true',
})
```

---

## 🧪 Testing Payment

### Test Cards (Midtrans Sandbox)

| Card Number | Type | Status |
|-------------|------|--------|
| 4811 1111 1111 1114 | Visa | Success |
| 5211 1111 1111 1117 | Mastercard | Success |
| 4911 1111 1111 1113 | Visa | Denied |

### Test E-Wallets

**GoPay**: Use phone `081234567890`  
**OVO**: Use phone `081234567890`  
**DANA**: Use phone `081234567890`  
**ShopeePay**: Use phone `081234567890`

**OTP Code**: `112233`

---

## 🔔 Webhook Implementation

### Webhook Best Practices

1. **Verify Signature**: Always verify webhook signatures
2. **Idempotency**: Handle duplicate webhooks
3. **Async Processing**: Use queue for heavy processing
4. **Retry Mechanism**: Implement retry logic
5. **Logging**: Log all webhook events

### Example Webhook Handler

```typescript
// app/api/webhooks/payment/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    // 1. Verify signature
    // 2. Parse webhook data
    // 3. Check idempotency
    // 4. Update transaction
    // 5. Process top-up
    // 6. Send notification
    
    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
```

---

## ⚠️ Error Handling

```typescript
// lib/payment-errors.ts
export class PaymentError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message)
    this.name = 'PaymentError'
  }
}

export const handlePaymentError = (error: any) => {
  if (error.response) {
    // API error
    const status = error.response.status
    const data = error.response.data
    
    if (status === 401) {
      throw new PaymentError('Invalid API credentials', 'AUTH_ERROR', 401)
    } else if (status === 400) {
      throw new PaymentError(data.message || 'Invalid request', 'INVALID_REQUEST', 400)
    }
  }
  
  throw new PaymentError('Payment processing failed', 'UNKNOWN_ERROR', 500)
}
```

---

## ✅ Best Practices

### 1. Security
- ✅ Always verify webhook signatures
- ✅ Use HTTPS for all payment endpoints
- ✅ Store API keys securely in environment variables
- ✅ Implement rate limiting
- ✅ Log all transactions

### 2. User Experience
- ✅ Show clear payment instructions
- ✅ Display loading states
- ✅ Handle payment timeouts
- ✅ Provide payment status updates
- ✅ Send email notifications

### 3. Error Handling
- ✅ Graceful error messages
- ✅ Retry failed transactions
- ✅ Refund mechanism
- ✅ Customer support integration

### 4. Testing
- ✅ Test all payment methods
- ✅ Test webhook handlers
- ✅ Test error scenarios
- ✅ Test with real amounts (small)

---

## 📞 Support

### Payment Gateway Support

- **Midtrans**: support@midtrans.com | [Docs](https://docs.midtrans.com)
- **Xendit**: support@xendit.co | [Docs](https://developers.xendit.co)
- **DOKU**: care@doku.com | [Docs](https://developers.doku.com)

### Common Issues

**Q: Payment tidak masuk database?**  
A: Check webhook implementation dan logging

**Q: Signature verification gagal?**  
A: Pastikan server key/secret key benar

**Q: Timeout saat create payment?**  
A: Check API credentials dan internet connection

---

**Good luck with your payment integration! 💰**
