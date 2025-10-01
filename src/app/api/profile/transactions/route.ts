import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Check if Firebase Admin is available
    if (!adminAuth) {
      return NextResponse.json(
        { error: 'Firebase Admin not configured' },
        { status: 500 }
      )
    }

    // Get Firebase token from Authorization header
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.split('Bearer ')[1]
    
    // Verify Firebase token
    const decodedToken = await adminAuth.verifyIdToken(token)
    const uid = decodedToken.uid

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: uid
      },
      include: {
        game: {
          select: {
            name: true,
            category: true
          }
        },
        denomination: {
          select: {
            name: true,
            amount: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      transactions
    })

  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data transaksi' },
      { status: 500 }
    )
  }
}
