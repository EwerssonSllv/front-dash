import { Shield, Lock, CreditCard, Server } from "lucide-react"

const securityFeatures = [
  {
    icon: Lock,
    title: "Autenticacao JWT",
    description:
      "Tokens seguros com expiração automatica. Seus dados protegidos em todas as requisicoes.",
  },
  {
    icon: Shield,
    title: "Dados Protegidos",
    description:
      "Todas as comunicacoes sao criptografadas. Nenhuma regra financeira roda no frontend.",
  },
  {
    icon: CreditCard,
    title: "Integracao Stripe",
    description:
      "Pagamentos processados com seguranca pela Stripe, lider global em pagamentos online.",
  },
  {
    icon: Server,
    title: "Backend Seguro",
    description:
      "API centralizada com validacao em todas as camadas. Protecao contra ataques comuns.",
  },
]

export function SecuritySection() {
  return (
    <section id="seguranca" className="bg-muted/50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Seguranca
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold text-foreground md:text-4xl">
            Seus dados em boas maos
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Infraestrutura robusta com as melhores praticas de seguranca do
            mercado.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {securityFeatures.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-border bg-card p-6 text-center transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-heading text-base font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
