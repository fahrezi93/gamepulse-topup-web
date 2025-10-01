# Panduan Deployment ke Vercel

## Persiapan Sebelum Deploy

### 1. Setup Database PostgreSQL
Untuk production di Vercel, Anda memerlukan database PostgreSQL. Beberapa pilihan:

- **Neon.tech** (Recommended - Serverless PostgreSQL)
- **Vercel Postgres** 
- **Supabase** (Free tier available)
- **Railway** (Free tier available)

### 2. Environment Variables yang Diperlukan

Pastikan semua environment variables berikut sudah dikonfigurasi di Vercel Dashboard:

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database?schema=public"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="https://your-domain.vercel.app"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Firebase Admin SDK
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-private-key\n-----END PRIVATE KEY-----"

# Admin Default
ADMIN_DEFAULT_USERNAME="admin"
ADMIN_DEFAULT_PASSWORD="secure-password"
```

## Langkah-langkah Deployment

### 1. Persiapan Repository
```bash
# Pastikan semua perubahan sudah di-commit
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Setup di Vercel Dashboard

1. Login ke [vercel.com](https://vercel.com)
2. Import repository GitHub Anda
3. Pilih framework: **Next.js**
4. Konfigurasi Build Settings:
   - **Build Command**: `prisma generate && next build`
   - **Install Command**: `npm install && prisma generate`
   - **Output Directory**: `.next`

### 3. Konfigurasi Environment Variables

Di Vercel Dashboard → Settings → Environment Variables, tambahkan semua environment variables yang diperlukan.

**PENTING**: Untuk `FIREBASE_PRIVATE_KEY`, pastikan format newline benar:
```
-----BEGIN PRIVATE KEY-----
your-private-key-content-here
-----END PRIVATE KEY-----
```

### 4. Database Migration

Setelah deployment berhasil, jalankan migration:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Run migration
vercel env pull .env.local
npx prisma migrate deploy
npx prisma db seed
```

## Troubleshooting

### Error: "Prisma Client not generated"
- Pastikan `postinstall` script ada di package.json
- Vercel akan otomatis menjalankan `prisma generate` setelah install

### Error: "Database connection failed"
- Periksa format DATABASE_URL
- Pastikan database PostgreSQL dapat diakses dari internet
- Test koneksi database secara manual

### Error: "Build failed"
- Periksa TypeScript errors dengan `npm run build` locally
- Pastikan semua dependencies terinstall
- Periksa Next.js configuration

### Error: "Environment variables not found"
- Pastikan semua env vars sudah dikonfigurasi di Vercel
- Periksa nama environment variables (case-sensitive)
- Redeploy setelah menambah env vars

## Rekomendasi Database

### Vercel Postgres (Recommended)
```bash
# Install Vercel Postgres
vercel storage create postgres

# Get connection string
vercel env ls
```

### Neon.tech (Recommended)
1. Buat account di [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string dari Dashboard
4. Format: `postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require`

**Keuntungan Neon.tech:**
- ✅ Free tier 512MB storage
- ✅ Serverless (auto-sleep saat tidak digunakan)
- ✅ Branching database untuk development
- ✅ Built-in connection pooling
- ✅ Sangat cepat cold start

### Supabase (Alternative)
1. Buat project di [supabase.com](https://supabase.com)
2. Copy connection string dari Settings → Database
3. Format: `postgresql://postgres:[password]@[host]:5432/postgres`

## Post-Deployment Checklist

- [ ] Website dapat diakses
- [ ] Database connection berhasil
- [ ] Authentication (Google OAuth) berfungsi
- [ ] Admin panel dapat diakses
- [ ] API endpoints berfungsi
- [ ] Game data ter-load dengan benar

## Monitoring

- Gunakan Vercel Analytics untuk monitoring performance
- Setup error tracking (Sentry recommended)
- Monitor database usage dan performance
