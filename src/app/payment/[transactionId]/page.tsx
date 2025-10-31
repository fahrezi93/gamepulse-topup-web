import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PaymentMethodSelection from '@/components/payment/PaymentMethodSelection'

interface PaymentPageProps {
  params: Promise<{
    transactionId: string
  }>
}

export default async function PaymentPage({ params }: PaymentPageProps) {
  const { transactionId } = await params
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

  // Redirect if already processed
  if (transaction.status === 'COMPLETED' || transaction.status === 'FAILED') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0D1117' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4" style={{ color: '#F0F6FC' }}>
            Transaksi Sudah Diproses
          </h1>
          <p style={{ color: '#8B949E' }}>
            Transaksi ini sudah {transaction.status === 'COMPLETED' ? 'selesai' : 'gagal'}.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0D1117' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PaymentMethodSelection transaction={transaction} />
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: PaymentPageProps) {
  return {
    title: `Pilih Metode Pembayaran - GamePulse`,
    description: 'Pilih metode pembayaran untuk menyelesaikan transaksi top up game Anda.',
  }
}
