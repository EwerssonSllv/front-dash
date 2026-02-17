"use client"

import { Menu } from "lucide-react"
import { Button } from "../../components/ui/button"

interface AppHeaderProps {
  title: string
  description?: string
  onMenuClick: () => void
  actions?: React.ReactNode
}

export function AppHeader({
  title,
  description,
  onMenuClick,
  actions,
}: AppHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden"
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="font-heading text-xl font-bold text-foreground">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  )
}
