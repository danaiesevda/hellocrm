import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { WelcomeModal } from "@/components/welcome-modal"

export const metadata: Metadata = {
  title: "HelloCRM",
  description: "Self-hosted CRM for managing contacts, companies, deals, and tickets",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <WelcomeModal />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
