import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Get Firebase token from Authorization header
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided', isAdmin: false },
        { status: 401 }
      )
    }

    const token = authHeader.split('Bearer ')[1]
    
    // Verify Firebase token
    const decodedToken = await adminAuth.verifyIdToken(token)
    const uid = decodedToken.uid

    // Check Firebase custom claims first
    const firebaseIsAdmin = decodedToken.role === 'admin' || decodedToken.isAdmin === true

    // Check if user exists in database and has admin role
    const user = await prisma.user.findUnique({
      where: { id: uid },
      select: { role: true }
    })

    // Check if user exists in adminUser table (for extra security)
    const adminUser = await prisma.adminUser.findFirst({
      where: { 
        OR: [
          { email: decodedToken.email },
          { username: decodedToken.email?.split('@')[0] }
        ]
      }
    })

    const isAdmin = firebaseIsAdmin || (user?.role === 'admin') || (adminUser !== null)

    return NextResponse.json({
      success: true,
      isAdmin,
      role: user?.role || 'user'
    })

  } catch (error) {
    console.error('Error checking admin role:', error)
    return NextResponse.json(
      { error: 'Failed to check admin role', isAdmin: false },
      { status: 500 }
    )
  }
}
