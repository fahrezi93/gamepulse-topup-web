import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, slug, description, imageUrl, category, denominations } = body

    // Validasi input
    if (!name || !slug || !category) {
      return NextResponse.json(
        { error: 'Nama, slug, dan kategori wajib diisi' },
        { status: 400 }
      )
    }

    // Cek apakah slug sudah ada
    const existingGame = await prisma.game.findUnique({
      where: { slug }
    })

    if (existingGame) {
      return NextResponse.json(
        { error: 'Slug sudah digunakan, gunakan slug yang lain' },
        { status: 400 }
      )
    }

    // Buat game baru dengan denominasi
    const game = await prisma.game.create({
      data: {
        name,
        slug,
        description: description || null,
        imageUrl: imageUrl || '/images/games/default.jpg',
        category,
        denominations: {
          create: denominations.map((d: any) => ({
            name: d.name,
            amount: d.amount,
            price: d.price
          }))
        }
      },
      include: {
        denominations: true
      }
    })

    return NextResponse.json({
      success: true,
      game,
      message: 'Game berhasil dibuat'
    })

  } catch (error) {
    console.error('Error creating game:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat membuat game' },
      { status: 500 }
    )
  }
}
