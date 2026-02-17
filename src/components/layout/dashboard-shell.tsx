"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { AppSidebar } from "./app-sidebar"
import { AppHeader } from "./app-header"

interface DashboardShellProps {
  title: string
  description?: string
  actions?: React.ReactNode
  children: React.ReactNode
}

export function DashboardShell({
  title,
  description,
  actions,
  children,
}: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <AppSidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative h-full w-64">
            <AppSidebar onClose={() => setSidebarOpen(false)} />
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute right-2 top-4 rounded-md p-1 text-sidebar-foreground/70 hover:text-sidebar-foreground"
              aria-label="Fechar menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader
          title={title}
          description={description}
          onMenuClick={() => setSidebarOpen(true)}
          actions={actions}
        />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
