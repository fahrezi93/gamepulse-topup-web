import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password, username } = await request.json()

    if (!email || !password || !username) {
      return NextResponse.json(
        { error: 'Email, password, dan username diperlukan' },
        { status: 400 }
      )
    }

    // Create user in Firebase Auth
    const firebaseUser = await adminAuth.createUser({
      email,
      password,
      displayName: username,
      emailVerified: true
    })

    // Set custom claims for admin role
    await adminAuth.setCustomUserClaims(firebaseUser.uid, {
      role: 'admin',
      isAdmin: true
    })

    // Create user in local database
    const hashedPassword = await bcrypt.hash(password, 10)
    
    await prisma.user.create({
      data: {
        id: firebaseUser.uid,
        email,
        name: username,
        role: 'admin'
      }
    })

    // Also create in adminUser table
    await prisma.adminUser.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: 'admin'
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Admin user berhasil dibuat',
      uid: firebaseUser.uid
    })

  } catch (error: any) {
    console.error('Error creating admin user:', error)
    return NextResponse.json(
      { error: error.message || 'Gagal membuat admin user' },
      { status: 500 }
    )
  }
}
