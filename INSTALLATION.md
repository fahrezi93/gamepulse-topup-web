# 📖 Installation Guide - GamePulse

Panduan lengkap untuk instalasi dan setup GamePulse di local development atau production.

---

## 📋 System Requirements

### Minimum Requirements
- **Node.js**: v18.17.0 atau lebih tinggi
- **npm**: v9.0.0 atau lebih tinggi
- **RAM**: 2GB minimum
- **Storage**: 500MB free space

### Recommended Requirements
- **Node.js**: v20.x LTS
- **npm**: v10.x
- **RAM**: 4GB atau lebih
- **Storage**: 1GB free space

---

## 🚀 Installation Steps

### Step 1: Clone Repository

```bash
# Clone dari GitHub
git clone https://github.com/yourusername/gamepulse.git

# Masuk ke directory project
cd gamepulse
```

### Step 2: Install Dependencies

```bash
# Install semua dependencies
npm install

# Atau menggunakan npm ci untuk clean install
npm ci
```

> **💡 Tips**: Gunakan `npm ci` untuk production atau CI/CD pipeline karena lebih konsisten.

### Step 3: Setup Environment Variables

1. **Copy file example**
```bash
# Windows
copy env.example .env.local

# Linux/Mac
cp env.example .env.local
```

2. **Edit file `.env.local`** dengan kredensial Anda:

```env
# ===================================
# DATABASE CONFIGURATION
# ===================================

# Development (SQLite) - Uncomment untuk development
# DATABASE_URL="file:./prisma/dev.db"

# Production (PostgreSQL) - Required untuk Vercel
DATABASE_URL="postgresql://username:password@host:port/database?schema=public"

# ===================================
# NEXTAUTH CONFIGURATION
# ===================================

# Generate secret dengan: openssl rand -base64 32
NEXTAUTH_SECRET="your-generated-secret-key-here"

# URL aplikasi Anda
NEXTAUTH_URL="http://localhost:3000"

# ===================================
# FIREBASE CONFIGURATION
# ===================================

# Firebase Project ID
FIREBASE_PROJECT_ID="your-project-id"

# Firebase Client Email (dari Service Account)
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com"

# Firebase Private Key (dari Service Account JSON)
# Note: Copy paste seluruh private key, termasuk header/footer
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYourPrivateKeyHere\n-----END PRIVATE KEY-----"

# ===================================
# GOOGLE OAUTH (Optional)
# ===================================

# Dari Firebase Console > Authentication > Sign-in method > Google
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"

# ===================================
# ADMIN DEFAULT CREDENTIALS
# ===================================

ADMIN_DEFAULT_USERNAME="admin"
ADMIN_DEFAULT_PASSWORD="admin123"
```

### Step 4: Setup Firebase (Required)

#### 4.1. Buat Firebase Project

1. Pergi ke [Firebase Console](https://console.firebase.google.com/)
2. Klik **Add Project**
3. Masukkan nama project (contoh: "gamepulse-production")
4. Ikuti wizard setup

#### 4.2. Enable Firebase Authentication

1. Di Firebase Console, buka **Authentication**
2. Klik tab **Sign-in method**
3. Enable provider yang diinginkan:
   - **Email/Password** ✅ (Recommended)
   - **Google** ✅ (Optional)

#### 4.3. Dapatkan Firebase Config

1. Buka **Project Settings** (⚙️ icon)
2. Scroll ke **Your apps**
3. Klik **Web app** icon (</>)
4. Copy **Firebase configuration**

#### 4.4. Setup Firebase Admin SDK

1. Di Firebase Console, buka **Project Settings** > **Service Accounts**
2. Klik **Generate new private key**
3. Download file JSON
4. Buka file JSON, copy values:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY`

> ⚠️ **IMPORTANT**: Jangan commit file JSON ke git! File sudah di-gitignore.

#### 4.5. Setup Google OAuth (Optional)

1. Di Firebase Console > **Authentication** > **Sign-in method**
2. Klik **Google** > **Enable**
3. Copy **Web SDK configuration**:
   - Web client ID → `GOOGLE_CLIENT_ID`
   - Web client secret → `GOOGLE_CLIENT_SECRET`

### Step 5: Setup Database

#### Option A: Development (SQLite)

```bash
# 1. Generate Prisma Client
npm run db:generate

# 2. Run migrations
npm run db:migrate

# 3. Seed database dengan data contoh
npm run db:seed
```

#### Option B: Production (PostgreSQL with Neon)

1. **Buat Neon Database**
   - Pergi ke [Neon.tech](https://neon.tech)
   - Sign up / Login
   - Klik **Create Project**
   - Copy **Connection String**

2. **Update `.env.local`**
   ```env
   DATABASE_URL="postgresql://user:pass@ep-xxx.aws.neon.tech/neondb?sslmode=require"
   ```

3. **Run migrations**
   ```bash
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```

> 💡 **Lihat [NEON_SETUP.md](./NEON_SETUP.md) untuk panduan lengkap Neon Database**

### Step 6: Generate NextAuth Secret

```bash
# Generate random secret
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Atau menggunakan openssl (Linux/Mac/Git Bash)
openssl rand -base64 32
```

Copy output dan paste ke `NEXTAUTH_SECRET` di `.env.local`

### Step 7: Run Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di: **http://localhost:3000**

---

## 🧪 Verify Installation

### 1. Check Homepage
- Buka http://localhost:3000
- Pastikan homepage ter-load dengan baik
- Check game cards ter-display

### 2. Check Database
```bash
# Check Prisma Studio
npx prisma studio
```

Prisma Studio akan terbuka di http://localhost:5555

### 3. Test Authentication
- Buka http://localhost:3000/auth/signin
- Login dengan:
  - Email: `admin@example.com`
  - Password: `admin123`

### 4. Test Admin Panel
- Login sebagai admin
- Buka http://localhost:3000/admin
- Pastikan dashboard ter-load

---

## 🛠️ Troubleshooting

### Error: "Cannot find module '@prisma/client'"

**Solution:**
```bash
npm run db:generate
```

### Error: "Invalid DATABASE_URL"

**Solution:**
- Check format connection string
- Untuk PostgreSQL: `postgresql://user:pass@host:port/db?schema=public`
- Untuk SQLite: `file:./prisma/dev.db`

### Error: "Firebase Admin initialization failed"

**Solution:**
1. Check environment variables:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY`
2. Pastikan private key menggunakan format yang benar dengan `\n`

### Error: "NEXTAUTH_SECRET is not set"

**Solution:**
```bash
# Generate secret baru
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Tambahkan ke .env.local
NEXTAUTH_SECRET="generated-secret-here"
```

### Database Migration Errors

**Solution:**
```bash
# Reset database (hati-hati: akan hapus semua data!)
npm run db:reset

# Atau manual
npx prisma migrate reset --force
npm run db:seed
```

### Port 3000 Already in Use

**Solution:**
```bash
# Run di port lain
npm run dev -- -p 3001

# Atau kill process yang menggunakan port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

---

## 🚀 Next Steps

Setelah instalasi berhasil:

1. **[Setup Payment Gateway](./PAYMENT_GATEWAY.md)** - Integrasi Midtrans, Xendit
2. **[Security Best Practices](./SECURITY.md)** - Keamanan production
3. **[Deployment Guide](./VERCEL_DEPLOYMENT.md)** - Deploy ke Vercel
4. **Customize** - Ubah branding, theme, games

---

## 📞 Need Help?

Jika masih mengalami masalah:

- 🐛 **Bug Report**: [Create an issue](https://github.com/yourusername/gamepulse/issues)
- 💬 **Discussion**: [GitHub Discussions](https://github.com/yourusername/gamepulse/discussions)
- 📖 **Documentation**: Baca file dokumentasi lainnya

---

**Happy Coding! 🎮**
