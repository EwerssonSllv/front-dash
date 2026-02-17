"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { BarChart3, Eye, EyeOff, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { authService } from "../../services/auth.service"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/dashboard"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error("Preencha todos os campos")
      return
    }

    setLoading(true)
    try {
      // CORRECAO: Chamada vai pelo proxy /api/proxy/auth/login.
      // O proxy reescreve o Set-Cookie do Spring Boot para o dominio
      // do Next.js, garantindo que o middleware consiga ler o cookie.
      await authService.login({ email, password })
      toast.success("Login realizado com sucesso!")
      router.refresh() // Re-roda middleware com o novo cookie
      router.replace(redirect)
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao fazer login"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 items-center justify-center bg-primary lg:flex">
        <div className="max-w-md px-8 text-center">
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/10">
            <BarChart3 className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="font-heading text-3xl font-bold text-primary-foreground">
            Bem-vindo de volta
          </h2>
          <p className="mt-4 leading-relaxed text-primary-foreground/70">
            Acesse seu dashboard e continue gerenciando seu negocio com
            inteligencia e praticidade.
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center px-6 lg:w-1/2">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-heading text-xl font-bold text-foreground">
              Dashlyze
            </span>
          </Link>

          <h1 className="font-heading text-2xl font-bold text-foreground">
            Entrar na sua conta
          </h1>
          <p className="mt-2 text-muted-foreground">
            {"Digite suas credenciais para acessar o dashboard"}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" size="lg" disabled={loading} className="mt-2">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {"Nao tem uma conta? "}
            <Link
              href="/register"
              className="font-medium text-primary hover:underline"
            >
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
