"use client"

import { useState } from "react"
import { Loader2, LogOut, Shield, Bell, User } from "lucide-react"
import { toast } from "sonner"
import { DashboardShell } from "../../components/layout/dashboard-shell"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Switch } from "../../components/ui/switch"
import { Separator } from "../../components/ui/separator"

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    try {
      await fetch("/api/auth/token", { method: "DELETE" })
      window.location.href = "/login"
    } catch {
      toast.error("Erro ao sair")
      setLoading(false)
    }
  }

  return (
    <DashboardShell
      title="Configuracoes"
      description="Gerencie sua conta e preferencias"
    >
      <div className="mx-auto max-w-2xl">
        {/* Profile Section */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-semibold text-foreground">
                Perfil
              </h3>
              <p className="text-sm text-muted-foreground">
                Informacoes da sua conta
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="set-name">Nome</Label>
              <Input
                id="set-name"
                placeholder="Seu nome"
                disabled
                className="bg-muted"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="set-email">Email</Label>
              <Input
                id="set-email"
                placeholder="seu@email.com"
                disabled
                className="bg-muted"
              />
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Para alterar seus dados, entre em contato com o suporte.
          </p>
        </div>

        {/* Notifications */}
        <div className="mt-6 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-semibold text-foreground">
                Notificacoes
              </h3>
              <p className="text-sm text-muted-foreground">
                Configure suas preferencias de notificacao
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Notificacoes por email
                </p>
                <p className="text-xs text-muted-foreground">
                  Receba atualizacoes sobre suas vendas por email
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Alertas de estoque
                </p>
                <p className="text-xs text-muted-foreground">
                  Aviso quando produtos estiverem com estoque baixo
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Resumo semanal
                </p>
                <p className="text-xs text-muted-foreground">
                  Relatorio semanal das suas metricas
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="mt-6 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-semibold text-foreground">
                Seguranca
              </h3>
              <p className="text-sm text-muted-foreground">
                Gerencie a seguranca da sua conta
              </p>
            </div>
          </div>

          <div className="mt-6">
            <Button
              variant="destructive"
              onClick={handleLogout}
              disabled={loading}
              className="gap-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
              Sair da conta
            </Button>
            <p className="mt-2 text-xs text-muted-foreground">
              Voce sera redirecionado para a pagina de login.
            </p>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
