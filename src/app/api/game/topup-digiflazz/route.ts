import { NextRequest, NextResponse } from 'next/server'
import { digiflazz } from '@/lib/digiflazz'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { transactionId } = body

    if (!transactionId) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      )
    }

    // Get transaction from database
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        denomination: true,
        game: true,
      },
    })

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      )
    }

    // Check if already processed
    if (transaction.status === 'COMPLETED') {
      return NextResponse.json({
        success: true,
        message: 'Transaction already completed',
        alreadyProcessed: true,
      })
    }

    // Format customer_no (userId or userId|zoneId)
    const customerId = transaction.gameUserId

    // Get buyer_sku_code from denomination
    // Note: Anda perlu menambahkan field 'skuCode' ke model Denomination
    const buyerSkuCode = (transaction.denomination as any).skuCode || 'ml75'

    if (!buyerSkuCode) {
      return NextResponse.json(
        { error: 'Product SKU code not configured' },
        { status: 400 }
      )
    }

    console.log('Processing top-up:', {
      transactionId,
      buyerSkuCode,
      customerId,
    })

    // Send top-up request to Digiflazz
    const result = await digiflazz.topUp(
      buyerSkuCode,
      customerId,
      transaction.id,
      true // Force sandbox mode for testing
    )

    console.log('Digiflazz top-up result:', result)

    // Check transaction status
    if (result.data.status === 'Sukses') {
      // Update transaction to COMPLETED
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: 'COMPLETED',
          // Store Digiflazz response
          // Note: Add 'digiflazzResponse' and 'serialNumber' fields to Transaction model
          ...(transaction as any).digiflazzResponse !== undefined && {
            digiflazzResponse: JSON.stringify(result),
          },
          ...(transaction as any).serialNumber !== undefined && {
            serialNumber: result.data.sn,
          },
          updatedAt: new Date(),
        },
      })

      return NextResponse.json({
        success: true,
        message: 'Top-up berhasil diproses',
        data: {
          status: result.data.status,
          serialNumber: result.data.sn,
          message: result.data.message,
        },
      })
    } else if (result.data.status === 'Pending') {
      // Update to PROCESSING
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: 'PROCESSING',
          ...(transaction as any).digiflazzResponse !== undefined && {
            digiflazzResponse: JSON.stringify(result),
          },
          updatedAt: new Date(),
        },
      })

      return NextResponse.json({
        success: true,
        message: 'Top-up sedang diproses',
        pending: true,
        data: result.data,
      })
    } else {
      // Failed
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: 'FAILED',
          ...(transaction as any).digiflazzResponse !== undefined && {
            digiflazzResponse: JSON.stringify(result),
          },
          updatedAt: new Date(),
        },
      })

      return NextResponse.json({
        success: false,
        message: result.data.message || 'Top-up gagal diproses',
        data: result.data,
      })
    }
  } catch (error: any) {
    console.error('Top-up error:', error)
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to process top-up',
        message: error.message || 'Terjadi kesalahan saat memproses top-up'
      },
      { status: 500 }
    )
  }
}
