# 🎮 GamePulse - Platform Top Up Game Terpercaya

GamePulse adalah platform web top-up game modern yang dibangun dengan Next.js, TypeScript, Tailwind CSS, dan SQLite. Platform ini menyediakan pengalaman top-up yang cepat, aman, dan mudah digunakan untuk berbagai game populer.

## ✨ Fitur Utama

### 🏠 **Halaman Beranda**
- Hero section yang menarik dengan statistik platform
- Daftar game populer dengan kategori
- Fitur pencarian dan filter game
- Responsive design untuk semua perangkat

### 🎯 **Halaman Detail Game & Top-Up**
- Form top-up yang user-friendly
- Pilihan denominasi dengan harga yang jelas
- Multiple metode pembayaran (DANA, OVO, GoPay, QRIS)
- Validasi input dan preview pesanan

### 💳 **Sistem Pembayaran & Konfirmasi**
- Halaman konfirmasi dengan detail lengkap
- Simulasi proses pembayaran real-time
- Status tracking transaksi
- Notifikasi hasil pembayaran

### 👨‍💼 **Panel Admin**
- Dashboard dengan statistik lengkap
- CRUD management untuk game dan denominasi
- Monitor transaksi real-time
- User management system

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Heroicons
- **Database**: SQLite dengan Prisma ORM
- **Authentication**: Simple admin auth (dapat diupgrade ke NextAuth.js)
- **Deployment**: Vercel-ready

## 📦 Instalasi & Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd gamepulse
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Buat file `.env.local` di root project:
```env
# Database (SQLite - tidak perlu konfigurasi tambahan)
DATABASE_URL="file:./prisma/dev.db"

# Next.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Admin Default
ADMIN_DEFAULT_USERNAME="admin"
ADMIN_DEFAULT_PASSWORD="admin123"
```

### 4. Setup Database
```bash
# Generate Prisma client
npm run db:generate

# Run database migration
npm run db:migrate

# Seed database dengan data contoh
npm run db:seed
```

### 5. Jalankan Development Server
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) untuk melihat aplikasi.

## 📊 Database Schema

### Game
- `id`: Unique identifier
- `name`: Nama game
- `slug`: URL-friendly name
- `description`: Deskripsi game
- `imageUrl`: URL gambar game
- `category`: Kategori game (MOBA, RPG, FPS, dll)
- `isActive`: Status aktif/nonaktif

### Denomination
- `id`: Unique identifier
- `name`: Nama paket (contoh: "100 Diamond")
- `amount`: Jumlah item
- `price`: Harga dalam Rupiah
- `gameId`: Relasi ke Game
- `isActive`: Status aktif/nonaktif

### Transaction
- `id`: Unique identifier
- `gameUserId`: ID user di game
- `playerName`: Nama player (opsional)
- `status`: Status transaksi (PENDING, COMPLETED, FAILED, dll)
- `totalPrice`: Total harga
- `paymentMethod`: Metode pembayaran
- `gameId` & `denominationId`: Relasi ke Game dan Denomination

### AdminUser
- `id`: Unique identifier
- `username`: Username admin
- `email`: Email admin
- `password`: Password (hashed)
- `role`: Role admin

## 🎮 Game yang Didukung (Default Seed Data)

1. **Mobile Legends** - Diamond packages
2. **PUBG Mobile** - UC packages  
3. **Free Fire** - Diamond packages
4. **Genshin Impact** - Genesis Crystal packages
5. **Valorant** - VP packages
6. **Honkai Star Rail** - Oneiric Shard packages

## 🚀 Scripts yang Tersedia

```bash
# Development
npm run dev          # Jalankan development server
npm run build        # Build untuk production
npm run start        # Jalankan production server
npm run lint         # Linting code

# Database
npm run db:migrate   # Jalankan database migration
npm run db:generate  # Generate Prisma client
npm run db:seed      # Seed database dengan data contoh
npm run db:reset     # Reset database (hati-hati!)
```

## 📱 Fitur Responsive

- ✅ Mobile-first design
- ✅ Tablet optimization
- ✅ Desktop layout
- ✅ Touch-friendly interface
- ✅ Fast loading performance

## 🔐 Keamanan

- Input validation pada semua form
- SQL injection protection dengan Prisma
- XSS protection
- CSRF protection (built-in Next.js)
- Environment variables untuk sensitive data

## 🎨 UI/UX Features

- Modern gradient design
- Smooth animations dan transitions
- Loading states dan feedback
- Error handling yang user-friendly
- Consistent color scheme
- Accessible design patterns

## 📈 Performance

- Server-side rendering (SSR)
- Static generation untuk halaman statis
- Image optimization
- Code splitting otomatis
- Lazy loading components

## 🔧 Kustomisasi

### Menambah Game Baru
1. Gunakan panel admin di `/admin`
2. Atau tambahkan langsung via database seed
3. Upload gambar game ke folder `public/images/games/`

### Mengubah Tema
- Edit file `tailwind.config.js` untuk color scheme
- Modifikasi komponen di `src/components/`
- Update CSS global di `src/app/globals.css`

### Menambah Metode Pembayaran
- Edit array `paymentMethods` di `TopUpForm.tsx`
- Tambahkan logic pembayaran di API routes
- Update database schema jika diperlukan

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables di Vercel dashboard
```

### Manual Deployment
```bash
# Build aplikasi
npm run build

# Upload folder .next, public, dan package.json ke server
# Set environment variables
# Jalankan npm start
```

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Support

Jika ada pertanyaan atau butuh bantuan:
- Buat issue di GitHub repository
- Email: support@gamepulse.com
- Documentation: [Link ke docs]

## 🎯 Roadmap

- [ ] Integrasi payment gateway real (Midtrans, Xendit)
- [ ] Push notifications
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] API untuk third-party integration
- [ ] Loyalty program
- [ ] Referral system

---

**Dibuat dengan ❤️ menggunakan Next.js dan TypeScript**
