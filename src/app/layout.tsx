
import type { Metadata } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import { Toaster } from "sonner"
import { SWRProvider } from "../lib/swr-config"

import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

export const metadata: Metadata = {
  title: "Dashlyze - Controle suas vendas. Domine seus numeros.",
  description:
    "SaaS completo para gerenciar produtos, clientes e metricas financeiras. Ideal para pequenos e medios empreendedores.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}
      >
        <SWRProvider>
          {children}
          <Toaster richColors position="top-right" />
        </SWRProvider>
      </body>
    </html>
  )
}
