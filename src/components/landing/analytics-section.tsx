import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  ShoppingBag,
} from "lucide-react"

const features = [
  {
    icon: DollarSign,
    title: "Overview Financeiro",
    description:
      "Veja receita total, vendas pagas, pendentes e canceladas em cards intuitivos com dados em tempo real.",
    stats: [
      { label: "Receita", value: "R$ 48.2k" },
      { label: "Pagas", value: "342" },
    ],
  },
  {
    icon: TrendingUp,
    title: "Top Compradores",
    description:
      "Ranking dos clientes que mais compram. Identifique quem mais contribui para seu faturamento.",
    stats: [
      { label: "Top 1", value: "R$ 12.5k" },
      { label: "Clientes", value: "28" },
    ],
  },
  {
    icon: AlertTriangle,
    title: "Clientes Inadimplentes",
    description:
      "Monitore devedores e vendas pendentes. Priorize cobranças e reduza inadimplencia.",
    stats: [
      { label: "Pendente", value: "R$ 8.3k" },
      { label: "Devedores", value: "15" },
    ],
  },
  {
    icon: ShoppingBag,
    title: "Produtos Mais Vendidos",
    description:
      "Descubra seus campeoes de venda. Otimize estoque e marketing baseado em dados reais.",
    stats: [
      { label: "Top produto", value: "1.2k un." },
      { label: "Receita", value: "R$ 24k" },
    ],
  },
]

export function AnalyticsSection() {
  return (
    <section id="analytics" className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Analytics
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold text-foreground md:text-4xl">
            Dados que impulsionam decisoes
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Metricas detalhadas e visualizacoes poderosas para voce entender
            exatamente como seu negocio esta performando.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg"
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex border-t border-border bg-muted/30">
                {feature.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex-1 px-6 py-4 text-center"
                  >
                    <p className="text-xs text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="mt-1 font-heading text-xl font-bold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
