# 🔥 Firebase Authentication Setup untuk GamePulse

## 📋 Langkah Setup Firebase Auth

### **1. Konfigurasi Firebase Console**

1. **Buka Firebase Console**: https://console.firebase.google.com/
2. **Pilih project**: `game-pulse-web`
3. **Enable Authentication**:
   - Pergi ke **Authentication** > **Sign-in method**
   - Enable **Google** provider
   - Enable **Email/Password** provider

### **2. Setup Google OAuth di Firebase**

1. **Di Firebase Console** > **Authentication** > **Sign-in method**
2. **Klik Google** dan enable
3. **Project support email**: Pilih email Anda
4. **Copy Web SDK configuration** (sudah ada di `firebase.ts`)

### **3. Dapatkan Google OAuth Credentials**

Dari Firebase Console, Anda perlu mendapatkan:

#### **Web Client ID & Secret:**
1. Pergi ke **Project Settings** > **General**
2. Scroll ke **Your apps** > **Web app**
3. Atau pergi ke Google Cloud Console untuk project yang sama
4. **APIs & Services** > **Credentials**
5. Cari **Web client** yang dibuat otomatis oleh Firebase

### **4. Setup Environment Variables**

Buat file `.env.local` dengan:

```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (dari Firebase/Google Cloud Console)
GOOGLE_CLIENT_ID="478163117073-xxxxxxxxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxxxxxxxxxxxxxxxx"

# Firebase Admin SDK Private Key (dari service account JSON)
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC6gVkFYX7uV9yQ...
-----END PRIVATE KEY-----"

# Admin Default
ADMIN_DEFAULT_USERNAME="admin"
ADMIN_DEFAULT_PASSWORD="admin123"
```

### **5. Authorized Domains untuk Firebase**

Di Firebase Console > **Authentication** > **Settings** > **Authorized domains**

Tambahkan:
- `localhost` (untuk development)
- `yourdomain.com` (untuk production)

### **6. Google Cloud Console Setup**

1. **Buka Google Cloud Console**: https://console.cloud.google.com/
2. **Pilih project**: `game-pulse-web` 
3. **APIs & Services** > **Credentials**
4. **Edit OAuth 2.0 Client**:

**Authorized JavaScript origins:**
```
http://localhost:3000
https://yourdomain.com
```

**Authorized redirect URIs:**
```
http://localhost:3000/api/auth/callback/google
https://yourdomain.com/api/auth/callback/google
```

### **7. Test Firebase Auth**

1. **Restart development server**:
   ```bash
   npm run dev
   ```

2. **Test Google Sign-in**: http://localhost:3000/auth/signin

3. **Cek Firebase Console**: 
   - **Authentication** > **Users** 
   - User baru akan muncul setelah login

### **8. Firebase Security Rules**

Jika menggunakan Firestore, setup security rules:

```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Transactions - users can read their own
    match /transactions/{transactionId} {
      allow read: if request.auth != null && 
                     request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
  }
}
```

## 🔧 Troubleshooting

### **Error: "client_id is required"**
- Pastikan `GOOGLE_CLIENT_ID` sudah diset di `.env.local`
- Restart development server setelah menambah env vars

### **Error: "redirect_uri_mismatch"**
- Cek Authorized redirect URIs di Google Cloud Console
- Format: `http://localhost:3000/api/auth/callback/google`

### **Error: "Firebase Admin SDK"**
- Pastikan `FIREBASE_PRIVATE_KEY` sudah diset dengan benar
- Pastikan newlines (`\n`) di private key tidak rusak

### **Error: "Unauthorized domain"**
- Tambahkan domain ke Firebase Console > Authentication > Settings > Authorized domains

## 📱 Production Deployment

Untuk production:

1. **Update Authorized domains** di Firebase Console
2. **Update OAuth redirect URIs** di Google Cloud Console
3. **Set environment variables** di hosting platform:
   ```env
   NEXTAUTH_URL="https://yourdomain.com"
   GOOGLE_CLIENT_ID="your-production-client-id"
   GOOGLE_CLIENT_SECRET="your-production-client-secret"
   FIREBASE_PRIVATE_KEY="your-firebase-private-key"
   ```

## 🎯 Keunggulan Firebase Auth

- ✅ **Easy setup** - UI sudah siap pakai
- ✅ **Multiple providers** - Google, Facebook, Twitter, dll
- ✅ **Security** - Built-in security features
- ✅ **Analytics** - User analytics terintegrasi
- ✅ **Free tier** - Generous free usage limits
- ✅ **Real-time** - Real-time user status
- ✅ **Admin SDK** - Server-side user management

---

**Firebase Auth setup selesai! User sekarang bisa login dengan Google melalui Firebase.** 🔥
