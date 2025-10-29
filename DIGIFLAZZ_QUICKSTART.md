# 🚀 Quick Start - Digiflazz Integration

Panduan cepat untuk testing integrasi Digiflazz di sandbox mode.

---

## ⚡ Quick Installation

### 1. Install Package

```bash
npm install md5
npm install --save-dev @types/md5
```

### 2. Setup Environment Variables

Copy dan edit `.env.local`:

```env
# Digiflazz Sandbox Configuration
DIGIFLAZZ_USERNAME="your-username-here"
DIGIFLAZZ_API_KEY="dev"
DIGIFLAZZ_SANDBOX="true"
```

> **Note:** Gunakan username Digiflazz Anda dan API Key "dev" untuk sandbox.

### 3. Update Prisma Schema (Optional)

Jika ingin menyimpan SKU code dan response Digiflazz, tambahkan field berikut:

```prisma
model Denomination {
  // ... existing fields
  skuCode     String?       // Digiflazz SKU Code
}

model Transaction {
  // ... existing fields
  digiflazzResponse String?  @db.Text
  serialNumber      String?
}
```

Lalu run migration:
```bash
npx prisma migrate dev --name add_digiflazz_fields
```

### 4. Test API

#### A. Test Validasi User ID

```bash
curl -X POST http://localhost:3000/api/game/validate-user \
  -H "Content-Type: application/json" \
  -d '{
    "buyerSkuCode": "ml75",
    "userId": "123456789",
    "zoneId": "1234"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "valid": true,
  "username": "TestPlayer123",
  "message": "Username ditemukan"
}
```

#### B. Test dengan Component

Gunakan komponen `TopUpFormWithValidation` di halaman game detail Anda:

```tsx
import TopUpFormWithValidation from '@/components/game/TopUpFormWithValidation'

// Di page.tsx
<TopUpFormWithValidation 
  game={game} 
  denominations={denominations} 
/>
```

---

## 🧪 Sandbox Test Data

### Mobile Legends
```
SKU Code: ml75, ml140, ml296
User ID: 123456789
Zone ID: 1234
Format: userId|zoneId
```

### Free Fire
```
SKU Code: ff50, ff70, ff100
User ID: 123456789
Format: userId only
```

### PUBG Mobile
```
SKU Code: pubg60, pubg325
User ID: 5123456789
Format: userId only
```

---

## 📂 Files Created

```
✅ DIGIFLAZZ_INTEGRATION.md      - Full documentation
✅ src/lib/digiflazz.ts           - Digiflazz client library
✅ src/app/api/game/validate-user/route.ts  - Validate API
✅ src/app/api/game/topup-digiflazz/route.ts - Top-up API
✅ src/components/game/TopUpFormWithValidation.tsx - Form with validation
✅ env.example                    - Updated with Digiflazz config
```

---

## 🎯 Next Steps

1. **Register Digiflazz Account**
   - https://member.digiflazz.com/buyer-register
   - Verifikasi email

2. **Get Credentials**
   - Login ke dashboard
   - Copy username Anda
   - Use "dev" untuk sandbox

3. **Test in Browser**
   - Run: `npm run dev`
   - Buka halaman game
   - Input User ID
   - Klik "Validasi User ID"
   - Lihat nickname muncul otomatis

4. **Production (Optional)**
   - Deposit Rp 10.000
   - Get production API key
   - Update env: `DIGIFLAZZ_SANDBOX="false"`

---

## 🐛 Troubleshooting

### Error: "Cannot find module 'md5'"
```bash
npm install md5
npm install --save-dev @types/md5
```

### Error: "Invalid Signature"
- Check username di `.env.local`
- Pastikan API Key = "dev" untuk sandbox

### Error: "Username not found"
- Gunakan test User ID yang benar
- Mobile Legends: `userId|zoneId` format
- Free Fire: hanya `userId`

---

## 📚 Full Documentation

Lihat **[DIGIFLAZZ_INTEGRATION.md](./DIGIFLAZZ_INTEGRATION.md)** untuk:
- Setup lengkap
- Production deployment
- Webhook implementation
- Error handling
- Best practices

---

**Happy Testing! 🔥**
