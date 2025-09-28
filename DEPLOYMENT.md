# 🚀 Deployment Guide - GamePulse

Panduan lengkap untuk deploy aplikasi GamePulse ke berbagai platform.

## 📋 Persiapan Sebelum Deploy

### 1. Environment Variables
Pastikan semua environment variables sudah diset:

```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="your-very-secure-secret-key"
NEXTAUTH_URL="https://your-domain.com"
ADMIN_DEFAULT_USERNAME="admin"
ADMIN_DEFAULT_PASSWORD="secure-password"
```

### 2. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database
npm run db:seed
```

### 3. Build Test
```bash
# Test build locally
npm run build
npm start
```

## 🌐 Deploy ke Vercel (Recommended)

### Method 1: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login ke Vercel
vercel login

# Deploy
vercel

# Set environment variables
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL
vercel env add ADMIN_DEFAULT_USERNAME
vercel env add ADMIN_DEFAULT_PASSWORD

# Deploy production
vercel --prod
```

### Method 2: GitHub Integration
1. Push code ke GitHub repository
2. Connect repository di Vercel dashboard
3. Set environment variables di Vercel dashboard
4. Deploy otomatis akan berjalan

### Environment Variables di Vercel:
- `DATABASE_URL`: `file:./prisma/dev.db`
- `NEXTAUTH_SECRET`: Generate random string
- `NEXTAUTH_URL`: URL production Anda
- `ADMIN_DEFAULT_USERNAME`: Username admin
- `ADMIN_DEFAULT_PASSWORD`: Password admin

## 🐳 Deploy dengan Docker

### 1. Buat Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### 2. Build dan Run
```bash
# Build image
docker build -t gamepulse .

# Run container
docker run -p 3000:3000 -e DATABASE_URL="file:./prisma/dev.db" gamepulse
```

## 🖥️ Deploy ke VPS/Server

### 1. Setup Server
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2
```

### 2. Deploy Application
```bash
# Clone repository
git clone <your-repo-url>
cd gamepulse

# Install dependencies
npm install

# Setup database
npm run db:setup

# Build application
npm run build

# Start with PM2
pm2 start npm --name "gamepulse" -- start
pm2 save
pm2 startup
```

### 3. Setup Nginx (Optional)
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📱 Deploy ke Netlify

### 1. Build Settings
- Build command: `npm run build`
- Publish directory: `.next`
- Node version: 18

### 2. Environment Variables
Set di Netlify dashboard:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `ADMIN_DEFAULT_USERNAME`
- `ADMIN_DEFAULT_PASSWORD`

## ☁️ Deploy ke Railway

### 1. Connect Repository
1. Login ke Railway
2. Create new project
3. Connect GitHub repository

### 2. Environment Variables
Set di Railway dashboard:
- `DATABASE_URL`: `file:./prisma/dev.db`
- `NEXTAUTH_SECRET`: Random string
- `NEXTAUTH_URL`: Railway provided URL
- `ADMIN_DEFAULT_USERNAME`: admin username
- `ADMIN_DEFAULT_PASSWORD`: admin password

### 3. Deploy Command
Railway akan otomatis detect dan run:
```bash
npm install
npm run build
npm start
```

## 🔧 Post-Deployment Checklist

### ✅ Functionality Test
- [ ] Homepage loads correctly
- [ ] Game listing displays
- [ ] Game detail pages work
- [ ] Top-up form functions
- [ ] Payment simulation works
- [ ] Transaction check works
- [ ] Admin panel accessible
- [ ] Database operations work

### ✅ Performance Test
- [ ] Page load speed < 3 seconds
- [ ] Mobile responsiveness
- [ ] Image optimization
- [ ] API response times

### ✅ Security Check
- [ ] Environment variables secured
- [ ] No sensitive data in logs
- [ ] HTTPS enabled
- [ ] Input validation working
- [ ] SQL injection protection

## 🐛 Troubleshooting

### Common Issues:

#### 1. Database Connection Error
```bash
# Regenerate Prisma client
npm run db:generate

# Check database file permissions
ls -la prisma/
```

#### 2. Build Failures
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### 3. Environment Variables Not Loading
- Check file naming (`.env.local` vs `.env`)
- Verify variable names match exactly
- Restart development server

#### 4. Prisma Issues
```bash
# Reset database (CAUTION: This deletes all data)
npm run db:reset

# Manual migration
npx prisma migrate deploy
```

## 📊 Monitoring & Maintenance

### 1. Log Monitoring
```bash
# PM2 logs
pm2 logs gamepulse

# Vercel logs
vercel logs
```

### 2. Database Backup
```bash
# Backup SQLite database
cp prisma/dev.db backup/dev-$(date +%Y%m%d).db
```

### 3. Updates
```bash
# Update dependencies
npm update

# Update database schema
npm run db:migrate
```

## 🔗 Useful Links

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)

---

**Happy Deploying! 🚀**
