# 🔐 Setup Google OAuth untuk GamePulse

Panduan lengkap untuk mengaktifkan login dengan Google di GamePulse.

## 📋 Langkah-langkah Setup

### 1. Buat Project di Google Cloud Console

1. Kunjungi [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru atau pilih project yang sudah ada
3. Aktifkan Google+ API atau Google Identity API

### 2. Konfigurasi OAuth Consent Screen

1. Di Google Cloud Console, pergi ke **APIs & Services** > **OAuth consent screen**
2. Pilih **External** untuk user type
3. Isi informasi aplikasi:
   - **App name**: GamePulse
   - **User support email**: email Anda
   - **Developer contact information**: email Anda
4. Tambahkan scopes yang diperlukan:
   - `email`
   - `profile`
   - `openid`

### 3. Buat OAuth 2.0 Credentials

1. Pergi ke **APIs & Services** > **Credentials**
2. Klik **Create Credentials** > **OAuth 2.0 Client IDs**
3. Pilih **Web application**
4. Isi informasi:
   - **Name**: GamePulse Web Client
   - **Authorized JavaScript origins**: 
     - `http://localhost:3000` (untuk development)
     - `https://yourdomain.com` (untuk production)
   - **Authorized redirect URIs**:
     - `http://localhost:3000/api/auth/callback/google` (untuk development)
     - `https://yourdomain.com/api/auth/callback/google` (untuk production)

### 4. Dapatkan Client ID dan Client Secret

1. Setelah membuat credentials, Anda akan mendapatkan:
   - **Client ID**: Dimulai dengan angka dan diakhiri dengan `.apps.googleusercontent.com`
   - **Client Secret**: String acak untuk autentikasi server

### 5. Konfigurasi Environment Variables

1. Buat file `.env.local` di root project
2. Tambahkan credentials Google:

```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id-here"
GOOGLE_CLIENT_SECRET="your-google-client-secret-here"

# Admin Default
ADMIN_DEFAULT_USERNAME="admin"
ADMIN_DEFAULT_PASSWORD="admin123"
```

### 6. Generate NextAuth Secret

Jalankan command berikut untuk generate secret key:

```bash
openssl rand -base64 32
```

Atau gunakan online generator: https://generate-secret.vercel.app/32

### 7. Test Google OAuth

1. Restart development server:
   ```bash
   npm run dev
   ```

2. Kunjungi halaman login: http://localhost:3000/auth/signin

3. Klik tombol "Masuk dengan Google"

4. Anda akan diarahkan ke Google untuk authorize aplikasi

5. Setelah berhasil, Anda akan diarahkan kembali ke aplikasi

## 🔧 Troubleshooting

### Error: "redirect_uri_mismatch"
- Pastikan redirect URI di Google Console sama persis dengan yang digunakan aplikasi
- Format: `http://localhost:3000/api/auth/callback/google`

### Error: "invalid_client"
- Periksa kembali GOOGLE_CLIENT_ID dan GOOGLE_CLIENT_SECRET
- Pastikan tidak ada spasi atau karakter tambahan

### Error: "access_denied"
- User membatalkan proses login
- Atau aplikasi belum disetujui di OAuth consent screen

### Error: "unauthorized_client"
- Pastikan domain sudah ditambahkan di Authorized JavaScript origins
- Untuk production, gunakan HTTPS

## 📱 Production Deployment

Untuk deployment production:

1. Update **Authorized JavaScript origins**:
   ```
   https://yourdomain.com
   ```

2. Update **Authorized redirect URIs**:
   ```
   https://yourdomain.com/api/auth/callback/google
   ```

3. Update environment variables di platform hosting:
   ```env
   NEXTAUTH_URL="https://yourdomain.com"
   GOOGLE_CLIENT_ID="your-production-client-id"
   GOOGLE_CLIENT_SECRET="your-production-client-secret"
   ```

## 🔒 Keamanan

- **Jangan** commit file `.env.local` ke repository
- **Jangan** share Client Secret di public
- Gunakan environment variables yang berbeda untuk development dan production
- Regularly rotate Client Secret untuk keamanan

## 📚 Referensi

- [NextAuth.js Google Provider](https://next-auth.js.org/providers/google)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)

---

**Setup selesai! Sekarang user bisa login dengan akun Google mereka.** 🎉
