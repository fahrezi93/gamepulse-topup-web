import { NextRequest, NextResponse } from 'next/server'
import { digiflazz } from '@/lib/digiflazz'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { buyerSkuCode, userId, zoneId } = body

    // Validation
    if (!buyerSkuCode || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: buyerSkuCode and userId are required' },
        { status: 400 }
      )
    }

    // Format customer_no based on game requirements
    // Some games need userId|zoneId, others just userId
    const customerId = zoneId ? `${userId}|${zoneId}` : userId

    console.log('Validating game user:', { buyerSkuCode, customerId })

    // Check user via Digiflazz API
    const result = await digiflazz.checkGameUser(
      buyerSkuCode,
      customerId,
      true // Force sandbox mode for testing
    )

    console.log('Digiflazz validation result:', result)

    // Check response code
    if (result.data.rc === '00') {
      // Success - user found
      return NextResponse.json({
        success: true,
        valid: true,
        username: result.data.username || 'Player',
        message: result.data.message || 'User ID valid',
      })
    } else {
      // User not found or error
      return NextResponse.json({
        success: false,
        valid: false,
        message: result.data.message || 'User ID tidak ditemukan atau tidak valid',
      })
    }
  } catch (error: any) {
    console.error('Validate user error:', error)
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to validate user',
        message: error.message || 'Terjadi kesalahan saat memvalidasi User ID'
      },
      { status: 500 }
    )
  }
}
