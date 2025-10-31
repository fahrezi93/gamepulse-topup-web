# DOKU Checkout Integration - Complete Guide

## 🎯 Flow Pembayaran Baru

### User Journey
1. **Form Top-Up** - User input User ID & pilih nominal
2. **Pilih Metode Pembayaran** (`/payment/[transactionId]`)
   - DANA
   - OVO  
   - GoPay (via ShopeePay)
   - QRIS
3. **Redirect ke DOKU Checkout** - User bayar di halaman DOKU
4. **Callback** (`/payment/callback`) - Verifikasi & tampilkan hasil

## 🔧 Backend Integration

### API Endpoint: POST `/api/payment/doku/create`

**Request:**
```json
{
  "transactionId": "string",
  "paymentMethod": "DANA|OVO|GOPAY|QRIS"
}
```

**Response:**
```json
{
  "success": true,
  "paymentUrl": "https://sandbox.doku.com/checkout-link-v2/...",
  "tokenId": "string",
  "expiryDate": "string",
  "invoiceNumber": "string"
}
```

### Signature Generation (Non-SNAP)
```typescript
const componentSignature = `Client-Id:${clientId}
Request-Id:${requestId}
Request-Timestamp:${requestTimestamp}
Request-Target:${requestTarget}
Digest:${digest}`

const signature = HMACSHA256(componentSignature, secretKey)
```

### DOKU API Call
```typescript
POST https://api-sandbox.doku.com/checkout/v1/payment
Headers:
  - Client-Id: BRN-0217-1707978997886
  - Request-Id: UUID
  - Request-Timestamp: ISO8601 UTC
  - Signature: HMACSHA256=...
  - Digest: SHA-256=...
  
Body:
{
  "order": {
    "invoice_number": "transactionId",
    "amount": 150000
  },
  "payment": {
    "payment_due_date": 60,
    "payment_method_types": ["EMONEY_DANA"]
  }
}
```

## 🎨 Frontend Integration

### Payment Method Selection
```typescript
// User selects payment method
const handlePayment = async () => {
  const response = await fetch('/api/payment/doku/create', {
    method: 'POST',
    body: JSON.stringify({
      transactionId,
      paymentMethod: 'DANA'
    })
  })
  
  const { paymentUrl } = await response.json()
  
  // Redirect to DOKU Checkout
  window.location.href = paymentUrl
}
```

### Payment Method Mapping
```typescript
const paymentMethodMap = {
  'DANA': ['EMONEY_DANA'],
  'OVO': ['EMONEY_OVO'],
  'GOPAY': ['EMONEY_SHOPEE_PAY'],
  'QRIS': ['QRIS']
}
```

## 🔔 Webhook Handler

### Endpoint: POST `/api/payment/doku/notification`

**DOKU akan kirim notification saat:**
- Payment SUCCESS
- Payment FAILED
- Payment EXPIRED

**Signature Verification:**
```typescript
const componentSignature = `Client-Id:${clientId}
Request-Id:${requestId}
Request-Timestamp:${requestTimestamp}
Request-Target:/api/payment/doku/notification
Digest:${digest}`

const isValid = verifySignature(receivedSignature, componentSignature)
```

**Update Transaction Status:**
```typescript
if (transactionStatus === 'SUCCESS') {
  await prisma.transaction.update({
    where: { id: invoiceNumber },
    data: { status: 'COMPLETED' }
  })
}
```

## 📱 Payment Callback Page

### URL: `/payment/callback?invoice=xxx`

**Features:**
- Auto-polling payment status
- Show success/failed message
- Redirect to transaction history

## 🧪 Testing dengan DOKU Sandbox

### 1. Simulator URL
https://sandbox.doku.com/integration/simulator/

### 2. Test Payment Methods

**DANA Sandbox:**
- Login dengan akun DANA sandbox
- Bayar langsung dari aplikasi DANA

**OVO Sandbox:**
- Login dengan akun OVO sandbox
- Bayar langsung dari aplikasi OVO

**QRIS:**
- Scan QR dengan any e-wallet sandbox

### 3. Notification Testing
- DOKU akan kirim notification ke webhook
- Check di console log untuk verify

## 🔐 Environment Variables

```env
# DOKU Checkout (Sandbox)
DOKU_CLIENT_ID=BRN-0217-1707978997886
DOKU_SECRET_KEY=SK-vMfiG8aPWfhPVZNj
DOKU_BASE_URL=https://api-sandbox.doku.com

# Webhook URL (untuk production)
DOKU_NOTIFICATION_URL=https://yourdomain.com/api/payment/doku/notification
```

## 📂 File Structure

```
src/
├── app/
│   ├── payment/
│   │   ├── [transactionId]/
│   │   │   └── page.tsx          # Payment method selection
│   │   └── callback/
│   │       └── page.tsx          # Payment callback
│   └── api/
│       └── payment/
│           ├── doku/
│           │   ├── create/
│           │   │   └── route.ts  # Create DOKU payment
│           │   └── notification/
│           │       └── route.ts  # Webhook handler
│           └── [transactionId]/
│               └── status/
│                   └── route.ts  # Check status
└── components/
    └── payment/
        └── PaymentMethodSelection.tsx
```

## ✅ Checklist Integration

### Backend
- [x] Create payment API endpoint
- [x] Signature generation (Non-SNAP)
- [x] DOKU API integration
- [x] Webhook handler
- [x] Signature verification
- [x] Transaction status update

### Frontend
- [x] Payment method selection UI
- [x] Redirect to DOKU Checkout
- [x] Callback page
- [x] Status polling

### Testing
- [ ] Test DANA payment
- [ ] Test OVO payment
- [ ] Test GoPay payment
- [ ] Test QRIS payment
- [ ] Test webhook notification
- [ ] Test callback flow

## 🚀 Production Deployment

### 1. Update Environment Variables
```env
DOKU_CLIENT_ID=<production-client-id>
DOKU_SECRET_KEY=<production-secret-key>
DOKU_BASE_URL=https://api.doku.com
```

### 2. Configure Webhook di DOKU Dashboard
- Login ke DOKU Dashboard
- Set Notification URL: `https://yourdomain.com/api/payment/doku/notification`
- Set Callback URL: `https://yourdomain.com/payment/callback`

### 3. Test Production Payment
- Use real payment methods
- Verify webhook notifications
- Check transaction status updates

## 📚 References

- [DOKU Checkout Documentation](https://developers.doku.com/accept-payments/doku-checkout)
- [Backend Integration](https://developers.doku.com/accept-payments/doku-checkout/integration-guide/backend-integration)
- [Frontend Integration](https://developers.doku.com/accept-payments/doku-checkout/integration-guide/frontend-integration)
- [Notification Handling](https://developers.doku.com/get-started-with-doku-api/notification)
- [Payment Simulator](https://sandbox.doku.com/integration/simulator/)

## 💡 Key Differences: Checkout vs Direct API

| Feature | DOKU Checkout | Direct API |
|---------|---------------|------------|
| Payment Page | DOKU hosted | Self-hosted |
| UI/UX | DOKU's design | Custom design |
| Integration | Simpler | More complex |
| Maintenance | DOKU handles | We handle |
| Payment Methods | All supported | Manual QR/VA |
| Sandbox Testing | Real apps | Simulator only |

**Recommendation:** Use DOKU Checkout for faster integration and better UX!
