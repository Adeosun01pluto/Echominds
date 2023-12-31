import { ClerkProvider } from "@clerk/nextjs"
import "../globals.css"
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { dark } from "@clerk/themes"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Echominds',
  description: 'Echominds is where scholars share ideas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark
      }}
    >
      <html lang="en">
      <body className={`inter.className bg-dark-1`}>{children}</body>
      </html>
    </ClerkProvider>
  )
}
