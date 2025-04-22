import type { Metadata } from 'next'
import './global.scss'
import { InterFont } from '@/assets'

export const metadata: Metadata = {
  title: 'Millionare App',
  description: 'Created by Danylo Ispaniuk',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${InterFont.className}`}>{children}</body>
    </html>
  )
}
