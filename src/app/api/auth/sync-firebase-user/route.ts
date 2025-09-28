import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { uid, email, name, photoURL } = await request.json()

    if (!uid || !email) {
      return NextResponse.json(
        { error: 'UID and email are required' },
        { status: 400 }
      )
    }

    // Check if user is admin from adminUser table
    const adminUser = await prisma.adminUser.findFirst({
      where: { email }
    })

    const userRole = adminUser ? 'admin' : 'USER'

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          id: uid, // Use Firebase UID as user ID
          email,
          name: name || email.split('@')[0],
          role: userRole,
          // No password for Firebase users
        }
      })
    } else {
      // Update existing user if needed
      user = await prisma.user.update({
        where: { email },
        data: {
          name: name || user.name,
          role: userRole, // Update role based on adminUser table
        }
      })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })

  } catch (error) {
    console.error('Error syncing Firebase user:', error)
    return NextResponse.json(
      { error: 'Failed to sync user' },
      { status: 500 }
    )
  }
}
