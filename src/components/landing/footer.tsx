import { BarChart3 } from "lucide-react"
import Link from "next/link"

const footerLinks = {
  Produto: [
    { label: "Beneficios", href: "#beneficios" },
    { label: "Analytics", href: "#analytics" },
    { label: "Seguranca", href: "#seguranca" },
    { label: "Planos", href: "#planos" },
  ],
  Empresa: [
    { label: "Sobre", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Carreiras", href: "#" },
    { label: "Contato", href: "#" },
  ],
  Legal: [
    { label: "Termos de Uso", href: "#" },
    { label: "Privacidade", href: "#" },
    { label: "Cookies", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <BarChart3 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-heading text-xl font-bold text-foreground">
                Dashlyze
              </span>
            </Link>
            <p className="mt-4 max-w-sm leading-relaxed text-muted-foreground">
              SaaS completo para gerenciar produtos, clientes e metricas
              financeiras do seu negocio.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-heading text-sm font-semibold text-foreground">
                {category}
              </h4>
              <ul className="mt-4 flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            {`\u00A9 ${new Date().getFullYear()} Dashlyze. Todos os direitos reservados.`}
          </p>
        </div>
      </div>
    </footer>
  )
}
