import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PaymentConfirmPage from '@/components/payment/PaymentConfirmPage'

interface ConfirmPageProps {
  params: Promise<{
    transactionId: string
  }>
  searchParams: Promise<{
    method?: string
  }>
}

export default async function ConfirmPage({ params, searchParams }: ConfirmPageProps) {
  const { transactionId } = await params
  const { method } = await searchParams
  
  const transaction = await prisma.transaction.findUnique({
    where: {
      id: transactionId
    },
    include: {
      game: true,
      denomination: true
    }
  })

  if (!transaction) {
    notFound()
  }

  if (!method) {
    notFound()
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0D1117' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PaymentConfirmPage 
          transaction={transaction} 
          paymentMethod={method as 'DANA' | 'OVO' | 'GOPAY' | 'QRIS'} 
        />
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: ConfirmPageProps) {
  return {
    title: `Konfirmasi Pembayaran - GamePulse`,
    description: 'Selesaikan pembayaran untuk transaksi top up game Anda.',
  }
}
