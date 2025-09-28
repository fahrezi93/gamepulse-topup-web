const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdminUser() {
  try {
    console.log('🔧 Membuat admin user...')

    const adminEmail = 'admin@gamepulse.com'
    const adminPassword = 'admin123'
    const adminUsername = 'admin'

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10)

    // Check if admin already exists
    const existingAdmin = await prisma.adminUser.findFirst({
      where: { email: adminEmail }
    })

    if (existingAdmin) {
      console.log('⚠️ Admin user sudah ada!')
      return
    }

    // Create admin user
    const adminUser = await prisma.adminUser.create({
      data: {
        username: adminUsername,
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      }
    })

    console.log('✅ Admin user berhasil dibuat!')
    console.log(`📧 Email: ${adminEmail}`)
    console.log(`🔑 Password: ${adminPassword}`)
    console.log(`👤 Username: ${adminUsername}`)
    console.log('')
    console.log('🔥 Sekarang buat Firebase user dengan API:')
    console.log(`POST http://localhost:3000/api/admin/create-admin`)
    console.log(`Body: {
  "email": "${adminEmail}",
  "password": "${adminPassword}",
  "username": "${adminUsername}"
}`)

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdminUser()
