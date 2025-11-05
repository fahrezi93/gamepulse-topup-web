import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, newPassword } = await request.json()

    if (!email || !newPassword) {
      return NextResponse.json(
        { error: 'Email dan password baru diperlukan' },
        { status: 400 }
      )
    }

    // Check if admin user exists in database
    const adminUser = await prisma.adminUser.findUnique({
      where: { email }
    })

    if (!adminUser) {
      return NextResponse.json(
        { error: 'Admin user tidak ditemukan' },
        { status: 404 }
      )
    }

    // Get Firebase user by email
    let firebaseUser
    try {
      firebaseUser = await adminAuth.getUserByEmail(email)
    } catch (error) {
      return NextResponse.json(
        { error: 'User tidak ditemukan di Firebase' },
        { status: 404 }
      )
    }

    // Update password in Firebase
    await adminAuth.updateUser(firebaseUser.uid, {
      password: newPassword
    })

    // Update password in database
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await prisma.adminUser.update({
      where: { email },
      data: { password: hashedPassword }
    })

    return NextResponse.json({
      success: true,
      message: 'Password berhasil direset'
    })

  } catch (error: any) {
    console.error('Error resetting password:', error)
    return NextResponse.json(
      { error: error.message || 'Gagal reset password' },
      { status: 500 }
    )
  }
}
