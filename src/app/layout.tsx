import type { Metadata } from 'next'
import { Providers } from './providers'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'Personal Finance Tracker',
  description: 'Manage your finances with ease',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="lo" suppressHydrationWarning>
      <body className="font-lao">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
