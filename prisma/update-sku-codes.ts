import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Script untuk update denomination dengan Digiflazz SKU codes
 * Run dengan: npx tsx prisma/update-sku-codes.ts
 */

async function updateSkuCodes() {
  console.log('🔄 Updating SKU codes for Digiflazz integration...')

  // SKU Code mapping berdasarkan game dan denomination
  const skuMapping: Record<string, Record<string, string>> = {
    'Mobile Legends': {
      '86 Diamond': 'ml86',
      '172 Diamond': 'ml172',
      '257 Diamond': 'ml257',
      '344 Diamond': 'ml344',
      '429 Diamond': 'ml429',
      '514 Diamond': 'ml514',
      '706 Diamond': 'ml706',
      '1412 Diamond': 'ml1412',
    },
    'PUBG Mobile': {
      '60 UC': 'pubg60',
      '325 UC': 'pubg325',
      '660 UC': 'pubg660',
      '1800 UC': 'pubg1800',
      '3850 UC': 'pubg3850',
      '8100 UC': 'pubg8100',
    },
    'Free Fire': {
      '70 Diamond': 'ff70',
      '140 Diamond': 'ff140',
      '355 Diamond': 'ff355',
      '720 Diamond': 'ff720',
      '1450 Diamond': 'ff1450',
      '2180 Diamond': 'ff2180',
    },
    'Genshin Impact': {
      '60 Genesis Crystal': 'gi60',
      '330 Genesis Crystal': 'gi330',
      '1090 Genesis Crystal': 'gi1090',
      '2240 Genesis Crystal': 'gi2240',
      '3880 Genesis Crystal': 'gi3880',
      '8080 Genesis Crystal': 'gi8080',
    },
    'Valorant': {
      '420 VP': 'val420',
      '700 VP': 'val700',
      '1375 VP': 'val1375',
      '2400 VP': 'val2400',
      '4000 VP': 'val4000',
      '8150 VP': 'val8150',
    },
    'Honkai Star Rail': {
      '60 Oneiric Shard': 'hsr60',
      '330 Oneiric Shard': 'hsr330',
      '1090 Oneiric Shard': 'hsr1090',
      '2240 Oneiric Shard': 'hsr2240',
      '3880 Oneiric Shard': 'hsr3880',
      '8080 Oneiric Shard': 'hsr8080',
    },
  }

  let updated = 0
  let skipped = 0

  // Loop through all games
  for (const [gameName, denominations] of Object.entries(skuMapping)) {
    const game = await prisma.game.findFirst({
      where: { name: gameName },
      include: { denominations: true }
    })

    if (!game) {
      console.log(`⚠️  Game "${gameName}" not found, skipping...`)
      continue
    }

    console.log(`\n📦 Processing ${gameName}...`)

    // Update each denomination
    for (const [denomName, skuCode] of Object.entries(denominations)) {
      const denom = game.denominations.find(d => d.name === denomName)

      if (denom) {
        await prisma.denomination.update({
          where: { id: denom.id },
          data: { skuCode }
        })
        console.log(`  ✅ Updated "${denomName}" with SKU: ${skuCode}`)
        updated++
      } else {
        console.log(`  ⚠️  Denomination "${denomName}" not found`)
        skipped++
      }
    }
  }

  console.log(`\n✨ Update complete!`)
  console.log(`   Updated: ${updated} denominations`)
  console.log(`   Skipped: ${skipped} denominations`)
}

updateSkuCodes()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
