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
    }),

    prisma.game.create({
      data: {
        name: 'Arena of Valor',
        slug: 'arena-of-valor',
        description: 'Top up Voucher AOV untuk mendapatkan hero dan skin terbaru!',
        imageUrl: '/images/games/arena-of-valor.jpg',
        category: 'MOBA',
        denominations: {
          create: [
            { name: '40 Voucher', amount: 40, price: 10000 },
            { name: '100 Voucher', amount: 100, price: 25000 },
            { name: '250 Voucher', amount: 250, price: 60000 },
            { name: '500 Voucher', amount: 500, price: 120000 },
            { name: '1000 Voucher', amount: 1000, price: 240000 },
            { name: '2500 Voucher', amount: 2500, price: 600000 },
          ]
        }
      }
    }),

    prisma.game.create({
      data: {
        name: 'Call of Duty Mobile',
        slug: 'call-of-duty-mobile',
        description: 'Top up CP (COD Points) untuk mendapatkan senjata dan karakter eksklusif!',
        imageUrl: '/images/games/call-of-duty-mobile.jpg',
        category: 'FPS',
        denominations: {
          create: [
            { name: '80 CP', amount: 80, price: 15000 },
            { name: '400 CP', amount: 400, price: 75000 },
            { name: '800 CP', amount: 800, price: 150000 },
            { name: '1600 CP', amount: 1600, price: 300000 },
            { name: '4000 CP', amount: 4000, price: 750000 },
            { name: '10400 CP', amount: 10400, price: 1950000 },
          ]
        }
      }
    }),

    prisma.game.create({
      data: {
        name: 'Clash of Clans',
        slug: 'clash-of-clans',
        description: 'Top up Gems untuk mempercepat pembangunan dan mendapatkan resources!',
        imageUrl: '/images/games/clash-of-clans.jpg',
        category: 'Strategy',
        denominations: {
          create: [
            { name: '80 Gems', amount: 80, price: 15000 },
            { name: '500 Gems', amount: 500, price: 75000 },
            { name: '1200 Gems', amount: 1200, price: 150000 },
            { name: '2500 Gems', amount: 2500, price: 300000 },
            { name: '6500 Gems', amount: 6500, price: 750000 },
            { name: '14000 Gems', amount: 14000, price: 1500000 },
          ]
        }
      }
    }),

    prisma.game.create({
      data: {
        name: 'Clash Royale',
        slug: 'clash-royale',
        description: 'Top up Gems untuk membeli chest dan mempercepat upgrade kartu!',
        imageUrl: '/images/games/clash-royale.jpg',
        category: 'Strategy',
        denominations: {
          create: [
            { name: '80 Gems', amount: 80, price: 15000 },
            { name: '500 Gems', amount: 500, price: 75000 },
            { name: '1200 Gems', amount: 1200, price: 150000 },
            { name: '2500 Gems', amount: 2500, price: 300000 },
            { name: '6500 Gems', amount: 6500, price: 750000 },
            { name: '14000 Gems', amount: 14000, price: 1500000 },
          ]
        }
      }
    }),

    prisma.game.create({
      data: {
        name: 'Roblox',
        slug: 'roblox',
        description: 'Top up Robux untuk membeli item, gamepass, dan aksesoris di Roblox!',
        imageUrl: '/images/games/roblox.jpg',
        category: 'Sandbox',
        denominations: {
          create: [
            { name: '80 Robux', amount: 80, price: 15000 },
            { name: '400 Robux', amount: 400, price: 60000 },
            { name: '800 Robux', amount: 800, price: 120000 },
            { name: '1700 Robux', amount: 1700, price: 240000 },
            { name: '4500 Robux', amount: 4500, price: 600000 },
            { name: '10000 Robux', amount: 10000, price: 1200000 },
          ]
        }
      }
    }),

    prisma.game.create({
      data: {
        name: 'Minecraft',
        slug: 'minecraft',
        description: 'Top up Minecoins untuk membeli skin, texture pack, dan map di Minecraft!',
        imageUrl: '/images/games/minecraft.jpg',
        category: 'Sandbox',
        denominations: {
          create: [
            { name: '320 Minecoins', amount: 320, price: 25000 },
            { name: '700 Minecoins', amount: 700, price: 50000 },
            { name: '1720 Minecoins', amount: 1720, price: 120000 },
            { name: '3500 Minecoins', amount: 3500, price: 240000 },
            { name: '8000 Minecoins', amount: 8000, price: 500000 },
          ]
        }
      }
    }),

    prisma.game.create({
      data: {
        name: 'League of Legends Wild Rift',
        slug: 'lol-wild-rift',
        description: 'Top up Wild Cores untuk mendapatkan champion dan skin terbaru!',
        imageUrl: '/images/games/lol-wild-rift.jpg',
        category: 'MOBA',
        denominations: {
          create: [
            { name: '420 Wild Cores', amount: 420, price: 45000 },
            { name: '700 Wild Cores', amount: 700, price: 75000 },
            { name: '1375 Wild Cores', amount: 1375, price: 150000 },
            { name: '2400 Wild Cores', amount: 2400, price: 250000 },
            { name: '4000 Wild Cores', amount: 4000, price: 400000 },
            { name: '8500 Wild Cores', amount: 8500, price: 800000 },
          ]
        }
      }
    }),

    prisma.game.create({
      data: {
        name: 'Stumble Guys',
        slug: 'stumble-guys',
        description: 'Top up Gems untuk membeli skin dan emote lucu di Stumble Guys!',
        imageUrl: '/images/games/stumble-guys.jpg',
        category: 'Party',
        denominations: {
          create: [
            { name: '60 Gems', amount: 60, price: 15000 },
            { name: '300 Gems', amount: 300, price: 60000 },
            { name: '650 Gems', amount: 650, price: 120000 },
            { name: '1300 Gems', amount: 1300, price: 240000 },
            { name: '3250 Gems', amount: 3250, price: 600000 },
          ]
        }
      }
    }),

    prisma.game.create({
      data: {
        name: 'Honkai Impact 3rd',
        slug: 'honkai-impact-3rd',
        description: 'Top up Crystal untuk mendapatkan battlesuit dan equipment terbaik!',
        imageUrl: '/images/games/honkai-impact-3rd.jpg',
        category: 'Action RPG',
        denominations: {
          create: [
            { name: '60 Crystal', amount: 60, price: 16000 },
            { name: '330 Crystal', amount: 330, price: 79000 },
            { name: '1090 Crystal', amount: 1090, price: 249000 },
            { name: '2240 Crystal', amount: 2240, price: 499000 },
            { name: '3880 Crystal', amount: 3880, price: 799000 },
            { name: '8080 Crystal', amount: 8080, price: 1599000 },
          ]
        }
      }
    }),

    prisma.game.create({
      data: {
        name: 'Ragnarok M: Eternal Love',
        slug: 'ragnarok-m-eternal-love',
        description: 'Top up Big Cat Coin untuk mendapatkan equipment dan costume premium!',
        imageUrl: '/images/games/ragnarok-m.jpg',
        category: 'MMORPG',
        denominations: {
          create: [
            { name: '60 BCC', amount: 60, price: 15000 },
            { name: '300 BCC', amount: 300, price: 75000 },
            { name: '980 BCC', amount: 980, price: 240000 },
            { name: '1980 BCC', amount: 1980, price: 480000 },
            { name: '3280 BCC', amount: 3280, price: 780000 },
            { name: '6480 BCC', amount: 6480, price: 1500000 },
          ]
        }
      }
    }),

    prisma.game.create({
      data: {
        name: 'Dragon Nest M',
        slug: 'dragon-nest-m',
        description: 'Top up Diamonds untuk upgrade equipment dan mendapatkan costume eksklusif!',
        imageUrl: '/images/games/dragon-nest-m.jpg',
        category: 'MMORPG',
        denominations: {
          create: [
            { name: '60 Diamonds', amount: 60, price: 15000 },
            { name: '300 Diamonds', amount: 300, price: 75000 },
            { name: '980 Diamonds', amount: 980, price: 240000 },
            { name: '1980 Diamonds', amount: 1980, price: 480000 },
            { name: '3280 Diamonds', amount: 3280, price: 780000 },
            { name: '6480 Diamonds', amount: 6480, price: 1500000 },
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
