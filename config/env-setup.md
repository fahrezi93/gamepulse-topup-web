# Environment Setup

Buat file `.env.local` di root project dengan isi berikut:

```
# Database (SQLite - tidak perlu konfigurasi tambahan)
DATABASE_URL="file:./prisma/dev.db"

# Next.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Admin Default
ADMIN_DEFAULT_USERNAME="admin"
ADMIN_DEFAULT_PASSWORD="admin123"
```

File ini sudah dikonfigurasi untuk menggunakan SQLite sebagai database lokal.
