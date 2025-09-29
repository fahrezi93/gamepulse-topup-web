import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PaymentConfirmation from '@/components/payment/PaymentConfirmation'

interface ConfirmPageProps {
  params: {
    transactionId: string
  }
}

export default async function ConfirmPage({ params }: ConfirmPageProps) {
  const transaction = await prisma.transaction.findUnique({
    where: {
      id: params.transactionId
    },
    include: {
      game: true,
      denomination: true
    }
  })

  if (!transaction) {
    notFound()
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0D1117' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PaymentConfirmation transaction={transaction} />
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: ConfirmPageProps) {
  return {
    title: `Konfirmasi Pembayaran - GamePulse`,
    description: 'Konfirmasi dan lakukan pembayaran untuk transaksi top up game Anda.',
  }
}
