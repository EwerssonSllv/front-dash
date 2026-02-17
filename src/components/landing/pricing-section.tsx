"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { Button } from "../../components/ui/button"
import { cn } from "../../lib/utils"

const plans = [
  {
    name: "Starter",
    code: "ST",
    monthlyPrice: "Gratis",
    yearlyPrice: "Gratis",
    description: "Para quem esta comecando",
    features: [
      "Ate 50 produtos",
      "100 vendas/mes",
      "1 usuario",
      "Dashboard basico",
      "Suporte por email",
    ],
    popular: false,
  },
  {
    name: "Profissional",
    code: "ME",
    monthlyPrice: "R$ 49",
    yearlyPrice: "R$ 39",
    description: "Para negocios em crescimento",
    features: [
      "Produtos ilimitados",
      "Vendas ilimitadas",
      "5 usuarios",
      "Analytics completo",
      "Ranking de clientes",
      "Relatorios avancados",
      "Suporte prioritario",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    code: "EN",
    monthlyPrice: "R$ 149",
    yearlyPrice: "R$ 119",
    description: "Para grandes operacoes",
    features: [
      "Tudo do Profissional",
      "Usuarios ilimitados",
      "API dedicada",
      "SLA garantido",
      "Gerente de conta",
      "Integracao customizada",
      "Suporte 24/7",
    ],
    popular: false,
  },
]

export function PricingSection() {
  const [annual, setAnnual] = useState(false)

  const handleCheckout = async (planCode: string) => {
    if (planCode === "ST") {
      window.location.href = "/register"
      return
    }
    try {
      const BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082"
      const res = await fetch(
        `${BASE_URL}/stripe/checkout?plan=${planCode}&annual=${annual}`
      )
      if (res.ok) {
        const data = await res.json()
        window.location.href = data.checkoutUrl
      }
    } catch {
      window.location.href = "/register"
    }
  }

  return (
    <section id="planos" className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Planos
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold text-foreground md:text-4xl">
            Escolha o plano ideal
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Comece gratis e escale conforme seu negocio cresce.
          </p>

          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-border bg-muted p-1">
            <button
              onClick={() => setAnnual(false)}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium transition-all",
                !annual
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Mensal
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium transition-all",
                annual
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Anual
              <span className="ml-1.5 text-xs opacity-80">-20%</span>
            </button>
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative rounded-xl border p-8 transition-all",
                plan.popular
                  ? "border-primary bg-card shadow-xl shadow-primary/10"
                  : "border-border bg-card hover:border-primary/30 hover:shadow-md"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                    Mais Popular
                  </span>
                </div>
              )}

              <div>
                <h3 className="font-heading text-xl font-bold text-foreground">
                  {plan.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </div>

              <div className="mt-6">
                <span className="font-heading text-4xl font-bold text-foreground">
                  {annual ? plan.yearlyPrice : plan.monthlyPrice}
                </span>
                {plan.monthlyPrice !== "Gratis" && (
                  <span className="text-sm text-muted-foreground">/mes</span>
                )}
              </div>

              <Button
                onClick={() => handleCheckout(plan.code)}
                className="mt-6 w-full"
                variant={plan.popular ? "default" : "outline"}
                size="lg"
              >
                {plan.code === "ST" ? "Comecar Gratis" : "Assinar Agora"}
              </Button>

              <ul className="mt-8 flex flex-col gap-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-sm text-muted-foreground"
                  >
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
