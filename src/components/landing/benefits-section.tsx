import {
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
  CalendarDays,
  BarChart3,
} from "lucide-react"

const benefits = [
  {
    icon: Package,
    title: "Gestao de Produtos",
    description:
      "Cadastre, edite e organize todos os seus produtos com categorias, precos e estoque em tempo real.",
  },
  {
    icon: ShoppingCart,
    title: "Controle de Vendas",
    description:
      "Registre vendas, acompanhe status de pagamento e gerencie o ciclo completo de cada transacao.",
  },
  {
    icon: TrendingUp,
    title: "Analise Financeira",
    description:
      "Overview completo com receita, pendencias e cancelamentos. Tenha clareza sobre suas financas.",
  },
  {
    icon: Users,
    title: "Ranking de Clientes",
    description:
      "Identifique seus melhores compradores, devedores e clientes mais rapidos nos pagamentos.",
  },
  {
    icon: CalendarDays,
    title: "Relatorios por Data",
    description:
      "Filtre vendas por ano, mes ou dia. Entenda padroes sazonais e tome decisoes baseadas em dados.",
  },
  {
    icon: BarChart3,
    title: "Dashboard Inteligente",
    description:
      "Graficos interativos e metricas em tempo real para voce ter o controle total do seu negocio.",
  },
]

export function BenefitsSection() {
  return (
    <section id="beneficios" className="bg-muted/50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Beneficios
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold text-foreground md:text-4xl">
            Tudo que voce precisa para crescer
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Ferramentas completas para gerenciar cada aspecto do seu negocio
            com eficiencia.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <benefit.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
                {benefit.title}
              </h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
