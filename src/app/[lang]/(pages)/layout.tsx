import DashboardLayout from '@/components/layout/DashboardLayout'

export default function PagesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <DashboardLayout>{children}</DashboardLayout>
}