"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, BarChart3 } from "lucide-react"
import { Button } from "../../components/ui/button"
import Image from "next/image"
import logoDash from "../../images/Dash.png"

const navLinks = [
  { label: "Beneficios", href: "#beneficios" },
  { label: "Analytics", href: "#analytics" },
  { label: "Seguranca", href: "#seguranca" },
  { label: "Planos", href: "#planos" },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2">
        <Link href="/" className="flex items-center text-3xl font-medium text-zinc-900">
          <Image
            src={logoDash}
            alt="Logo Dashlyze"
            width={90}
            height={40}
            quality={100}
          />
          <span className="-ml-5 mb-2 text-gray-800">
            Dash<span className="text-[#2B3A67]">lyze</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" asChild>
            <Link href="/login">Entrar</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Comecar Agora</Link>
          </Button>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-6 w-6 text-foreground" />
          ) : (
            <Menu className="h-6 w-6 text-foreground" />
          )}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-border bg-background px-6 pb-6 md:hidden">
          <ul className="flex flex-col gap-4 pt-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-2">
            <Button variant="ghost" asChild className="w-full">
              <Link href="/login">Entrar</Link>
            </Button>
            <Button asChild className="w-full">
              <Link href="/register">Comecar Agora</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
