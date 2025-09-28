import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Mulai seeding database...')

  // Hapus data yang ada (untuk development)
  await prisma.transaction.deleteMany()
  await prisma.denomination.deleteMany()
  await prisma.game.deleteMany()
  await prisma.adminUser.deleteMany()

  // Buat data games
  const games = await Promise.all([
    prisma.game.create({
      data: {
        name: 'Mobile Legends',
        slug: 'mobile-legends',
        description: 'Top up Diamond Mobile Legends dengan mudah dan cepat!',
        imageUrl: '/images/games/mobile-legends.jpg',
        category: 'MOBA',
        denominations: {
          create: [
            { name: '86 Diamond', amount: 86, price: 20000 },
            { name: '172 Diamond', amount: 172, price: 39000 },
            { name: '257 Diamond', amount: 257, price: 58000 },
            { name: '344 Diamond', amount: 344, price: 77000 },
            { name: '429 Diamond', amount: 429, price: 96000 },
            { name: '514 Diamond', amount: 514, price: 115000 },
            { name: '706 Diamond', amount: 706, price: 154000 },
            { name: '1412 Diamond', amount: 1412, price: 308000 },
          ]
        }
      }
    }),
    
    prisma.game.create({
      data: {
        name: 'PUBG Mobile',
        slug: 'pubg-mobile',
        description: 'Top up UC PUBG Mobile untuk mendapatkan skin dan item eksklusif!',
        imageUrl: '/images/games/pubg-mobile.jpg',
        category: 'Battle Royale',
        denominations: {
          create: [
            { name: '60 UC', amount: 60, price: 15000 },
            { name: '325 UC', amount: 325, price: 75000 },
            { name: '660 UC', amount: 660, price: 150000 },
            { name: '1800 UC', amount: 1800, price: 375000 },
            { name: '3850 UC', amount: 3850, price: 750000 },
            { name: '8100 UC', amount: 8100, price: 1500000 },
          ]
        }
      }
    }),

    prisma.game.create({
      data: {
        name: 'Free Fire',
        slug: 'free-fire',
        description: 'Top up Diamond Free Fire untuk mendapatkan karakter dan senjata terbaik!',
        imageUrl: '/images/games/free-fire.jpg',
        category: 'Battle Royale',
        denominations: {
          create: [
            { name: '70 Diamond', amount: 70, price: 10000 },
            { name: '140 Diamond', amount: 140, price: 20000 },
            { name: '355 Diamond', amount: 355, price: 50000 },
            { name: '720 Diamond', amount: 720, price: 100000 },
            { name: '1450 Diamond', amount: 1450, price: 200000 },
            { name: '2180 Diamond', amount: 2180, price: 300000 },
          ]
        }
      }
    }),

    prisma.game.create({
      data: {
        name: 'Genshin Impact',
        slug: 'genshin-impact',
        description: 'Top up Genesis Crystal untuk mendapatkan karakter dan senjata 5 bintang!',
        imageUrl: '/images/games/genshin-impact.jpg',
        category: 'RPG',
        denominations: {
          create: [
            { name: '60 Genesis Crystal', amount: 60, price: 16000 },
            { name: '330 Genesis Crystal', amount: 330, price: 79000 },
            { name: '1090 Genesis Crystal', amount: 1090, price: 249000 },
            { name: '2240 Genesis Crystal', amount: 2240, price: 499000 },
            { name: '3880 Genesis Crystal', amount: 3880, price: 799000 },
            { name: '8080 Genesis Crystal', amount: 8080, price: 1599000 },
          ]
        }
      }
    }),

    prisma.game.create({
      data: {
        name: 'Valorant',
        slug: 'valorant',
        description: 'Top up VP (Valorant Points) untuk mendapatkan skin senjata eksklusif!',
        imageUrl: '/images/games/valorant.jpg',
        category: 'FPS',
        denominations: {
          create: [
            { name: '420 VP', amount: 420, price: 45000 },
            { name: '700 VP', amount: 700, price: 75000 },
            { name: '1375 VP', amount: 1375, price: 150000 },
            { name: '2400 VP', amount: 2400, price: 250000 },
            { name: '4000 VP', amount: 4000, price: 400000 },
            { name: '8150 VP', amount: 8150, price: 800000 },
          ]
        }
      }
    }),

    prisma.game.create({
      data: {
        name: 'Honkai Star Rail',
        slug: 'honkai-star-rail',
        description: 'Top up Oneiric Shard untuk mendapatkan karakter dan light cone terbaik!',
        imageUrl: '/images/games/honkai-star-rail.jpg',
        category: 'RPG',
        denominations: {
          create: [
            { name: '60 Oneiric Shard', amount: 60, price: 16000 },
            { name: '330 Oneiric Shard', amount: 330, price: 79000 },
            { name: '1090 Oneiric Shard', amount: 1090, price: 249000 },
            { name: '2240 Oneiric Shard', amount: 2240, price: 499000 },
            { name: '3880 Oneiric Shard', amount: 3880, price: 799000 },
            { name: '8080 Oneiric Shard', amount: 8080, price: 1599000 },
          ]
        }
      }
    })
  ])

  // Buat admin user default
  await prisma.adminUser.create({
    data: {
      username: 'admin',
      email: 'admin@gamepulse.com',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: "password"
      role: 'admin'
    }
  })

  console.log('✅ Seeding selesai!')
  console.log(`📊 Berhasil membuat ${games.length} games dengan denominasi masing-masing`)
  console.log('👤 Admin user berhasil dibuat (username: admin, password: password)')
}

main()
  .catch((e) => {
    console.error('❌ Error saat seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
