import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

import CursorGlow from "@/components/layout/CursorGlow"

export const metadata: Metadata = {
  title: "Fitness OS",
  description: "Personal Fitness Analytics Platform",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-zinc-950 text-zinc-50 min-h-screen antialiased`}>
        <CursorGlow />
        {children}
      </body>
    </html>
  )
}
