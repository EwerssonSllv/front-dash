export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("pt-BR").format(value)
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "PAID":
      return "bg-emerald-100 text-emerald-700"
    case "PENDING":
      return "bg-amber-100 text-amber-700"
    case "CANCELLED":
      return "bg-red-100 text-red-700"
    case "RETURNED":
      return "bg-slate-100 text-slate-700"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case "PAID":
      return "Pago"
    case "PENDING":
      return "Pendente"
    case "CANCELLED":
      return "Cancelado"
    case "RETURNED":
      return "Devolvido"
    default:
      return status
  }
}
