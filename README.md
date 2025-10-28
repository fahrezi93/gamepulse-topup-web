# 🎮 GamePulse - Platform Top Up Game Modern

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.16-2D3748)](https://www.prisma.io/)

GamePulse adalah platform web top-up game modern yang dibangun dengan Next.js 15, TypeScript, Tailwind CSS, dan PostgreSQL/SQLite. Platform ini menyediakan pengalaman top-up yang cepat, aman, dan mudah digunakan untuk berbagai game populer.

---

## 📋 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#️-tech-stack)
- [Quick Start](#-quick-start)
- [Dokumentasi Lengkap](#-dokumentasi-lengkap)
- [Database Schema](#-database-schema)
- [Kustomisasi](#-kustomisasi)
- [Roadmap](#️-roadmap)
- [Support](#-support)
- [License](#-license)

---

## ✨ Fitur Utama

### � **User Features**
- ✅ Pencarian & filter game berdasarkan kategori
- ✅ Detail game lengkap dengan berbagai denominasi
- ✅ Multiple payment methods (DANA, OVO, GoPay, QRIS, Bank Transfer)
- ✅ Real-time transaction tracking
- ✅ Transaction history & profile management
- ✅ Responsive design untuk mobile, tablet, dan desktop
- ✅ Firebase Authentication (Google OAuth & Email/Password)

### 👨‍💼 **Admin Panel**
- ✅ Dashboard dengan statistik real-time
- ✅ CRUD management untuk games & denominations
- ✅ Transaction monitoring & management
- ✅ User role management
- ✅ Analytics & reporting

### 🔒 **Security Features**
- ✅ NextAuth.js authentication
- ✅ Firebase Admin SDK integration
- ✅ Input validation & sanitization
- ✅ SQL injection protection (Prisma ORM)
- ✅ XSS & CSRF protection
- ✅ Secure environment variables handling

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | Next.js 15, React 19, TypeScript |
| **Styling** | Tailwind CSS 4, Heroicons |
| **Database** | PostgreSQL (Production), SQLite (Development) |
| **ORM** | Prisma 6.16 |
| **Authentication** | NextAuth.js 4, Firebase Auth |
| **Deployment** | Vercel, Neon (PostgreSQL) |
| **Package Manager** | npm |

---

## � Quick Start

### Prerequisites
- Node.js 18+ dan npm
- PostgreSQL (untuk production) atau SQLite (untuk development)
- Firebase Project (untuk authentication)
- Git

### Installation

```bash
# 1. Clone repository
git clone https://github.com/yourusername/gamepulse.git
cd gamepulse

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp env.example .env.local
# Edit .env.local dengan kredensial Anda

# 4. Setup database
npm run db:generate
npm run db:migrate
npm run db:seed

# 5. Run development server
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

> **💡 Untuk dokumentasi instalasi lengkap, lihat [INSTALLATION.md](./INSTALLATION.md)**

---

## 📚 Dokumentasi Lengkap

| Dokumentasi | Deskripsi |
|-------------|-----------|
| [📖 Installation Guide](./INSTALLATION.md) | Panduan instalasi step-by-step |
| [💳 Payment Gateway Setup](./PAYMENT_GATEWAY.md) | Integrasi Midtrans, Xendit, dll |
| [🔒 Security Best Practices](./SECURITY.md) | Keamanan & deployment best practices |
| [🚀 Deployment Guide](./VERCEL_DEPLOYMENT.md) | Deploy ke Vercel dengan Neon DB |
| [📝 Changelog](./CHANGELOG.md) | Version history & updates |

---

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

## 🎮 Game yang Didukung (Seed Data)

1. **Mobile Legends** - Diamond packages (75 - 12,000 diamonds)
2. **PUBG Mobile** - UC packages (60 - 8,100 UC)
3. **Free Fire** - Diamond packages (50 - 5,600 diamonds)
4. **Genshin Impact** - Genesis Crystal packages (60 - 6,480 crystals)
5. **Valorant** - VP packages (125 - 11,000 VP)
6. **Honkai Star Rail** - Oneiric Shard packages (60 - 6,480 shards)

---

## 🚀 Scripts yang Tersedia

```bash
# Development
npm run dev          # Run development server dengan Turbopack
npm run build        # Build untuk production
npm run start        # Run production server
npm run lint         # Linting code

# Database
npm run db:migrate   # Run database migration
npm run db:generate  # Generate Prisma client
npm run db:seed      # Seed database dengan data contoh
npm run db:reset     # Reset database (hati-hati!)
npm run db:setup     # Full setup: generate + migrate + seed
```

---

## 🔧 Kustomisasi

### Menambah Game Baru
1. Login ke admin panel (`/admin`)
2. Navigasi ke "Games Management"
3. Klik "Add New Game"
4. Upload gambar game ke `/public/images/games/`

### Mengubah Tema
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#your-color',
        secondary: '#your-color',
      }
    }
  }
}
```

### Menambah Payment Gateway
Lihat [PAYMENT_GATEWAY.md](./PAYMENT_GATEWAY.md) untuk integrasi:
- Midtrans
- Xendit
- Doku
- iPaymu
- Dan lainnya

---

## �️ Roadmap

### Version 1.1 (Q1 2026)
- [ ] Integrasi payment gateway real (Midtrans)
- [ ] Email notifications
- [ ] Webhooks untuk status transaksi
- [ ] Improved admin analytics

### Version 1.2 (Q2 2026)
- [ ] Mobile app (React Native)
- [ ] Multi-language support (ID, EN)
- [ ] Loyalty program & rewards
- [ ] Referral system

### Version 2.0 (Q3 2026)
- [ ] API untuk third-party integration
- [ ] Advanced reporting & analytics
- [ ] Marketplace untuk seller
- [ ] Live chat support

---

## 🤝 Contributing

Kontribusi selalu diterima! Jika Anda ingin berkontribusi:

1. Fork repository ini
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes Anda (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

---

## 📞 Support

Jika Anda membutuhkan bantuan atau menemukan bug:

- 🐛 **Bug Reports**: [Create an issue](https://github.com/yourusername/gamepulse/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/gamepulse/discussions)
- 📧 **Email**: Buat issue di GitHub untuk pertanyaan umum
- 📖 **Documentation**: Lihat folder dokumentasi atau wiki

---

## 📝 License

Distributed under the MIT License. See [LICENSE](./LICENSE) for more information.

```
MIT License - Anda bebas untuk:
✅ Menggunakan untuk proyek komersial
✅ Memodifikasi source code
✅ Distribusi dan publikasi
✅ Penggunaan pribadi

Dengan syarat:
⚠️ Menyertakan copyright notice
⚠️ Menyertakan license notice
```

---

## 🙏 Credits

Built with modern technologies:
- [Next.js](https://nextjs.org/) - React Framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Firebase](https://firebase.google.com/) - Authentication
- [Heroicons](https://heroicons.com/) - Beautiful icons

---

## ⭐ Show Your Support

Jika project ini membantu Anda, berikan ⭐️ di GitHub!

---

**Dibuat dengan ❤️ menggunakan Next.js dan TypeScript**

© 2025 GamePulse. All rights reserved.
