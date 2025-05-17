import './globals.css'
import type { Metadata } from 'next'
import { notoSerif } from '@/fonts'
import { LayoutHeader } from '@/components/Layout/LayoutHeader/LayoutHeader'

export const metadata: Metadata = {
  title: {
    template: '%s | ymda',
    default: 'ymda',
  },
  description: '',
  icons: [{ rel: 'icon', url: '/favicon.svg', type: 'image/svg+xml' }],
}

type RootLayoutProps = {
  children: React.ReactNode
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="ko">
      <body className={`${notoSerif.className} font-serif antialiased`}>
        <LayoutHeader />
        {children}
      </body>
    </html>
  )
}
