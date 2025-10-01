# Setup Neon.tech untuk GamePulse

## Langkah-langkah Setup Neon.tech

### 1. Buat Account Neon.tech
1. Kunjungi [neon.tech](https://neon.tech)
2. Sign up dengan GitHub account (recommended)
3. Verifikasi email jika diperlukan

### 2. Create Database Project
1. Click **"Create Project"**
2. Pilih region terdekat (Singapore/Tokyo untuk Indonesia)
3. Database name: `gamepulse` atau `gamepulse-production`
4. PostgreSQL version: 15 (default)

### 3. Get Connection String
Setelah project dibuat, Anda akan mendapat connection string seperti:
```
postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### 4. Setup Environment Variables
Di Vercel Dashboard → Settings → Environment Variables:

```env
DATABASE_URL=postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### 5. Database Migration
Setelah setup environment variables:

```bash
# Pull environment variables
vercel env pull .env.local

# Run migration
npx prisma migrate deploy

# Seed database (optional)
npx prisma db seed
```

## Keuntungan Neon.tech untuk GamePulse

### ✅ **Perfect untuk Next.js + Vercel**
- Serverless architecture cocok dengan Vercel Functions
- Auto-sleep menghemat resource saat tidak digunakan
- Cold start sangat cepat (< 100ms)

### ✅ **Development Friendly**
- Database branching untuk testing
- Built-in connection pooling
- Web-based SQL editor

### ✅ **Cost Effective**
- Free tier: 512MB storage, 1 database
- Pay-as-you-scale pricing
- No idle charges (auto-sleep)

### ✅ **Production Ready**
- High availability
- Automatic backups
- Point-in-time recovery

## Troubleshooting

### Connection Issues
```bash
# Test connection locally
npx prisma db push
npx prisma studio
```

### SSL Certificate Issues
Pastikan connection string menggunakan `?sslmode=require`

### Migration Errors
```bash
# Reset and re-run migration
npx prisma migrate reset
npx prisma migrate deploy
```

## Database Management

### Neon Console
- Access: [console.neon.tech](https://console.neon.tech)
- SQL Editor untuk query manual
- Monitoring dan metrics
- Backup management

### Prisma Studio
```bash
# Local database viewer
npx prisma studio
```

## Best Practices

### Connection Pooling
Neon sudah include connection pooling, tapi untuk optimasi:

```typescript
// lib/db.ts
import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

export const prisma = globalThis.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}
```

### Environment Variables
```env
# Production
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require&pgbouncer=true"

# Development (optional: use local SQLite)
# DATABASE_URL="file:./prisma/dev.db"
```

### Monitoring
- Setup alerts di Neon Console
- Monitor connection usage
- Track query performance

## Migration dari SQLite ke Neon

Jika sebelumnya menggunakan SQLite:

1. **Backup data SQLite**:
```bash
npx prisma db seed # backup your seed data
```

2. **Update DATABASE_URL** ke Neon connection string

3. **Run migration**:
```bash
npx prisma migrate deploy
npx prisma db seed
```

4. **Test aplikasi** untuk memastikan semua berfungsi

## Next Steps

Setelah setup Neon.tech selesai:
1. Deploy ke Vercel dengan DATABASE_URL yang baru
2. Test semua fitur aplikasi
3. Setup monitoring dan alerts
4. Consider database branching untuk development
