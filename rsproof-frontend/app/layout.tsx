import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Rock Paper Scissors',
  description: 'Provable rock paper scissors game',
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
