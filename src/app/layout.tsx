import type { Metadata } from "next"
import { SWRProvider } from "../lib/swr-config"
import "./globals.css"

export const metadata: Metadata = {
  title: "Dashlyze - Controle suas vendas. Domine seus números.",
  description:
    "SaaS completo para gerenciar produtos, clientes e métricas financeiras. Ideal para pequenos e médios empreendedores.",
  openGraph: {
    title: "Dashlyze",
    description:
      "SaaS completo para gerenciar produtos, clientes e métricas financeiras.",
    type: "website",
    url: "https://dashlyze.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dashlyze",
    description:
      "SaaS completo para gerenciar produtos, clientes e métricas financeiras.",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <SWRProvider>{children}</SWRProvider>
      </body>
    </html>
  )
}