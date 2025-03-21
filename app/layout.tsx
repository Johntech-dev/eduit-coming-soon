import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Eduit',
  description: 'School Management System',
  generator: 'Fordest Technologies',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
