# 🔥 Digiflazz API Integration - GamePulse

Panduan lengkap integrasi Digiflazz API untuk validasi User ID game dan auto top-up.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Sandbox Setup](#-sandbox-setup)
3. [Production Setup](#-production-setup)
4. [Features](#-features)
5. [Implementation](#-implementation)
6. [Testing](#-testing)
7. [Troubleshooting](#-troubleshooting)

---

## Overview

### Apa itu Digiflazz?

Digiflazz adalah platform aggregator untuk produk digital di Indonesia:
- ✅ Validasi User ID game (cek nickname)
- ✅ Top-up otomatis ke game
- ✅ Support 100+ game populer
- ✅ Harga murah & kompetitif
- ✅ Sandbox GRATIS untuk testing

### Biaya

| Mode | Biaya |
|------|-------|
| **Sandbox** | 🆓 GRATIS (unlimited testing) |
| **Production** | Deposit min. Rp 10.000 |
| **Per Transaksi** | Rp 50 - 300 (tergantung game) |

---

## 🧪 Sandbox Setup

### Step 1: Registrasi Akun

1. Buka https://member.digiflazz.com/buyer-register
2. Isi form registrasi
3. Verifikasi email
4. Login ke dashboard

### Step 2: Dapatkan API Credentials

1. Login ke https://member.digiflazz.com
2. Buka menu **Profil** atau **API**
3. Copy credentials:
   - **Username**: username Anda
   - **API Key**: development key (untuk sandbox)

**Sandbox Credentials:**
```
Username: (username Anda)
API Key: dev (gunakan "dev" untuk sandbox testing)
```

### Step 3: Environment Variables

Tambahkan ke `.env.local`:

```env
# Digiflazz API Configuration
DIGIFLAZZ_USERNAME="your-username"
DIGIFLAZZ_API_KEY="dev"  # "dev" untuk sandbox
DIGIFLAZZ_SANDBOX="true"
```

---

## 🚀 Production Setup

### Step 1: Deposit Saldo

1. Login ke dashboard Digiflazz
2. Menu **Deposit**
3. Pilih metode pembayaran
4. Minimal deposit: **Rp 10.000**

### Step 2: Production API Key

1. Dashboard > **Profil/API**
2. Generate **Production API Key**
3. Copy API Key

### Step 3: Update Environment

```env
# Production
DIGIFLAZZ_USERNAME="your-username"
DIGIFLAZZ_API_KEY="your-production-api-key"
DIGIFLAZZ_SANDBOX="false"
```

---

## ✨ Features

### 1. Cek Harga Produk
Dapatkan list produk dan harga real-time

### 2. Validasi User ID
Cek User ID + Zone ID, dapatkan nickname pemain

### 3. Top-Up Otomatis
Kirim top-up langsung ke game setelah pembayaran

### 4. Cek Status Transaksi
Track status transaksi real-time

---

## 🛠️ Implementation

### 1. Install Dependencies

```bash
npm install md5
```

### 2. Create Digiflazz Client

File: `lib/digiflazz.ts`

```typescript
import md5 from 'md5'

const DIGIFLAZZ_BASE_URL = 'https://api.digiflazz.com/v1'

export interface DigiflazzConfig {
  username: string
  apiKey: string
  sandbox: boolean
}

export interface DigiflazzProduct {
  product_name: string
  category: string
  brand: string
  type: string
  seller_name: string
  price: number
  buyer_sku_code: string
  buyer_product_status: boolean
  seller_product_status: boolean
  unlimited_stock: boolean
  stock: number
  multi: boolean
  start_cut_off: string
  end_cut_off: string
  desc: string
}

export interface DigiflazzCheckUserResponse {
  data: {
    rc: string
    message: string
    username?: string
    sn?: string
  }
}

export interface DigiflazzTransactionResponse {
  data: {
    ref_id: string
    status: string
    customer_no: string
    buyer_sku_code: string
    message: string
    price: number
    sn?: string
  }
}

export class DigiflazzClient {
  private config: DigiflazzConfig

  constructor(config: DigiflazzConfig) {
    this.config = config
  }

  /**
   * Generate signature untuk authentication
   */
  private generateSignature(data?: any): string {
    const apiKey = this.config.apiKey
    const username = this.config.username
    const ref_id = data?.ref_id || ''
    
    return md5(username + apiKey + ref_id)
  }

  /**
   * Make API request ke Digiflazz
   */
  private async makeRequest(endpoint: string, data: any) {
    const url = `${DIGIFLAZZ_BASE_URL}${endpoint}`
    
    const signature = this.generateSignature(data)
    
    const payload = {
      username: this.config.username,
      sign: signature,
      ...data,
    }

    console.log('Digiflazz Request:', { url, payload })

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`Digiflazz API Error: ${response.statusText}`)
    }

    const result = await response.json()
    console.log('Digiflazz Response:', result)
    
    return result
  }

  /**
   * Cek harga list produk
   */
  async getPriceList(): Promise<DigiflazzProduct[]> {
    const result = await this.makeRequest('/price-list', {
      cmd: 'prepaid',
    })
    
    return result.data || []
  }

  /**
   * Cek User ID game (validasi + ambil nickname)
   */
  async checkGameUser(
    buyerSkuCode: string,
    customerId: string,
    testing?: boolean
  ): Promise<DigiflazzCheckUserResponse> {
    const result = await this.makeRequest('/cek-username', {
      buyer_sku_code: buyerSkuCode,
      customer_no: customerId,
      testing: testing || this.config.sandbox,
    })
    
    return result
  }

  /**
   * Kirim transaksi top-up
   */
  async topUp(
    buyerSkuCode: string,
    customerId: string,
    refId: string,
    testing?: boolean
  ): Promise<DigiflazzTransactionResponse> {
    const result = await this.makeRequest('/transaction', {
      buyer_sku_code: buyerSkuCode,
      customer_no: customerId,
      ref_id: refId,
      testing: testing || this.config.sandbox,
    })
    
    return result
  }

  /**
   * Cek status transaksi
   */
  async checkTransaction(refId: string): Promise<any> {
    const result = await this.makeRequest('/transaction', {
      ref_id: refId,
      cmd: 'status',
    })
    
    return result
  }
}

// Export singleton instance
export const digiflazz = new DigiflazzClient({
  username: process.env.DIGIFLAZZ_USERNAME || '',
  apiKey: process.env.DIGIFLAZZ_API_KEY || 'dev',
  sandbox: process.env.DIGIFLAZZ_SANDBOX === 'true',
})
```

### 3. API Route - Validate User ID

File: `app/api/game/validate-user/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { digiflazz } from '@/lib/digiflazz'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { buyerSkuCode, userId, zoneId } = body

    if (!buyerSkuCode || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Format customer_no (biasanya userId atau userId|zoneId)
    const customerId = zoneId ? `${userId}|${zoneId}` : userId

    // Cek user via Digiflazz
    const result = await digiflazz.checkGameUser(
      buyerSkuCode,
      customerId,
      true // sandbox mode
    )

    if (result.data.rc === '00') {
      // Success - user ditemukan
      return NextResponse.json({
        valid: true,
        username: result.data.username || 'Unknown',
        message: result.data.message,
      })
    } else {
      // User tidak ditemukan atau error
      return NextResponse.json({
        valid: false,
        message: result.data.message || 'User ID tidak ditemukan',
      })
    }
  } catch (error) {
    console.error('Validate user error:', error)
    return NextResponse.json(
      { error: 'Failed to validate user' },
      { status: 500 }
    )
  }
}
```

### 4. API Route - Top-Up Transaction

File: `app/api/game/topup-digiflazz/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { digiflazz } from '@/lib/digiflazz'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { transactionId } = body

    // Get transaction from database
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        denomination: true,
        game: true,
      },
    })

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      )
    }

    // Format customer_no
    const customerId = transaction.gameUserId

    // Get buyer_sku_code from denomination (harus disimpan di database)
    // Contoh: "ml75" untuk Mobile Legends 75 diamond
    const buyerSkuCode = transaction.denomination.skuCode || 'ml75'

    // Kirim top-up ke Digiflazz
    const result = await digiflazz.topUp(
      buyerSkuCode,
      customerId,
      transaction.id,
      true // sandbox mode
    )

    if (result.data.status === 'Sukses') {
      // Update transaction status
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: 'COMPLETED',
          digiflazzResponse: JSON.stringify(result),
          serialNumber: result.data.sn,
        },
      })

      return NextResponse.json({
        success: true,
        message: 'Top-up berhasil',
        data: result.data,
      })
    } else {
      // Failed
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: 'FAILED',
          digiflazzResponse: JSON.stringify(result),
        },
      })

      return NextResponse.json({
        success: false,
        message: result.data.message || 'Top-up gagal',
      })
    }
  } catch (error) {
    console.error('Top-up error:', error)
    return NextResponse.json(
      { error: 'Failed to process top-up' },
      { status: 500 }
    )
  }
}
```

### 5. Update Prisma Schema

Tambahkan field baru di `prisma/schema.prisma`:

```prisma
model Denomination {
  id          String        @id @default(cuid())
  name        String
  amount      Int
  price       Float
  isActive    Boolean       @default(true)
  gameId      String
  
  // Tambahan untuk Digiflazz
  skuCode     String?       // Buyer SKU Code dari Digiflazz
  
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  
  game         Game           @relation(fields: [gameId], references: [id], onDelete: Cascade)
  transactions Transaction[]
  
  @@map("denominations")
}

model Transaction {
  id                String   @id @default(cuid())
  gameUserId        String
  playerName        String?
  totalPrice        Float
  status            String
  paymentMethod     String
  denominationId    String
  gameId            String
  userId            String?
  
  // Tambahan untuk Digiflazz
  digiflazzResponse String?  @db.Text
  serialNumber      String?  // SN dari Digiflazz
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  game         Game         @relation(fields: [gameId], references: [id])
  denomination Denomination @relation(fields: [denominationId], references: [id])
  user         User?        @relation(fields: [userId], references: [id])
  
  @@map("transactions")
}
```

Run migration:
```bash
npx prisma migrate dev --name add_digiflazz_fields
```

---

## 🧪 Testing

### 1. Test Validasi User ID

**Endpoint:** `POST /api/game/validate-user`

**Request:**
```json
{
  "buyerSkuCode": "ml75",
  "userId": "123456789",
  "zoneId": "1234"
}
```

**Response (Success):**
```json
{
  "valid": true,
  "username": "PlayerNickname",
  "message": "Username ditemukan"
}
```

### 2. Test Top-Up (Sandbox)

**Endpoint:** `POST /api/game/topup-digiflazz`

**Request:**
```json
{
  "transactionId": "clxxxxxxxxxxxxx"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Top-up berhasil",
  "data": {
    "status": "Sukses",
    "sn": "1234567890"
  }
}
```

### 3. SKU Code untuk Testing

| Game | SKU Code | Customer No Format |
|------|----------|-------------------|
| Mobile Legends | ml75, ml140, ml296 | userId\|zoneId |
| Free Fire | ff50, ff70, ff100 | userId |
| PUBG Mobile | pubg60, pubg325 | userId |

**Sandbox Test IDs:**
- Mobile Legends: `123456789|1234`
- Free Fire: `123456789`
- PUBG: `5123456789`

---

## 🐛 Troubleshooting

### Error: "Invalid Signature"

**Penyebab:** Username atau API Key salah

**Solusi:**
1. Cek username di dashboard
2. Pastikan API Key = "dev" untuk sandbox
3. Generate ulang signature

### Error: "Customer Number Invalid"

**Penyebab:** Format User ID salah

**Solusi:**
- Mobile Legends: Harus `userId|zoneId`
- Free Fire: Hanya `userId`
- Cek dokumentasi format per game

### Error: "Insufficient Balance"

**Penyebab:** Saldo habis (production mode)

**Solusi:**
- Deposit saldo di dashboard
- Atau gunakan sandbox mode

### Error: "Product Not Available"

**Penyebab:** SKU code salah atau produk tidak aktif

**Solusi:**
1. Cek list produk: `GET /price-list`
2. Gunakan SKU yang valid
3. Pastikan produk status = active

---

## 📚 Resources

- **Dashboard**: https://member.digiflazz.com
- **Dokumentasi**: https://developer.digiflazz.com
- **Support**: Telegram: @digiflazz_cs
- **WhatsApp**: 0812-3456-7890 (contoh)

---

## 🎯 Next Steps

1. ✅ Test di sandbox
2. ✅ Tambahkan SKU codes ke database
3. ✅ Update UI untuk real-time validation
4. 💰 Deposit Rp 10.000 untuk production
5. 🚀 Switch ke production mode

---

**Happy Integrating! 🔥**
