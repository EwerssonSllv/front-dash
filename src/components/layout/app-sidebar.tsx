"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  Settings,
  LogOut,
} from "lucide-react"
import { cn } from "../../lib/utils"
import { authService } from "../../services/auth.service"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/products", label: "Produtos", icon: Package },
  { href: "/sales", label: "Vendas", icon: ShoppingCart },
  { href: "/clients", label: "Clientes", icon: Users },
  { href: "/analytics", label: "Analytics", icon: TrendingUp },
  { href: "/settings", label: "Configuracoes", icon: Settings },
]

export function AppSidebar({
  onClose,
}: {
  onClose?: () => void
}) {
  const pathname = usePathname()

  // Alteracao: Agora chama o endpoint /auth/logout do Spring Boot
  // que remove o cookie HTTP-only "dashlyze_token" no backend
  const handleLogout = async () => {
    await authService.logout()
    window.location.href = "/login"
  }

  return (
    <aside className="flex h-full w-64 flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
          <BarChart3 className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        <span className="font-heading text-lg font-bold text-sidebar-primary-foreground">
          Dashlyze
        </span>
      </div>

      <nav className="mt-2 flex flex-1 flex-col gap-1 px-3">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-sidebar-border px-3 py-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
        >
          <LogOut className="h-5 w-5" />
          Sair
        </button>
      </div>
    </aside>
  )
}
