import AdminProtection from '@/components/admin/AdminProtection'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminProtection>
      {children}
    </AdminProtection>
  )
}
