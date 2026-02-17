import Link from "next/link"
import { ArrowRight, Play } from "lucide-react"
import { Button } from "../../components/ui/button"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(215_80%_50%/0.08),transparent_70%)]" />
      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-6 pb-20 pt-24 text-center lg:pb-32 lg:pt-36">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-sm text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-primary" />
          SaaS de Gestao Financeira
        </div>

        <h1 className="font-heading text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
          Controle suas vendas.
          <br />
          <span className="text-primary">Domine seus numeros.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
          Dashlyze e o SaaS completo para gerenciar produtos, clientes e
          metricas financeiras. Tudo em um so lugar, com inteligencia e
          simplicidade.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Button size="lg" asChild className="gap-2 px-8">
            <Link href="/register">
              Comecar Agora
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild className="gap-2 px-8">
            <a href="#analytics">
              <Play className="h-4 w-4" />
              Ver Demonstracao
            </a>
          </Button>
        </div>

        <div className="mt-20 w-full max-w-5xl">
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-primary/5">
            <div className="flex items-center gap-2 border-b border-border bg-muted px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-destructive/60" />
              <span className="h-3 w-3 rounded-full bg-warning/60" />
              <span className="h-3 w-3 rounded-full bg-success/60" />
              <span className="ml-2 text-xs text-muted-foreground">
                dashlyze.app/dashboard
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 p-6 md:grid-cols-4">
              {[
                {
                  label: "Receita Total",
                  value: "R$ 48.250",
                  change: "+12.5%",
                },
                {
                  label: "Vendas Pagas",
                  value: "342",
                  change: "+8.2%",
                },
                {
                  label: "Clientes Ativos",
                  value: "128",
                  change: "+15.3%",
                },
                {
                  label: "Ticket Medio",
                  value: "R$ 141",
                  change: "+3.1%",
                },
              ].map((stat) => (
                <div key={stat.label} className="text-left">
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="mt-1 font-heading text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-[hsl(var(--success))]">
                    {stat.change}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex h-40 items-end gap-1 px-6 pb-6">
              {[40, 55, 35, 65, 80, 60, 75, 90, 70, 85, 95, 88].map(
                (h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-primary/80 transition-all hover:bg-primary"
                    style={{ height: `${h}%` }}
                  />
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
