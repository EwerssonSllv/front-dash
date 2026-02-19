"use client"

import { useState } from "react"
import useSWR from "swr"
import {
  Plus,
  CheckCircle,
  Clock,
  XCircle,
  RotateCcw,
  CreditCard,
  Undo2,
  Trash2,
  UserX,
} from "lucide-react"
import { toast } from "sonner"
import { DashboardShell } from "../../components/layout/dashboard-shell"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { TableSkeleton } from "../../components/ui/loading-skeleton"
import { SaleForm } from "../../components/forms/sale-form"
import { salesService } from "../../services/sale.service"
import { formatCurrency, getStatusColor, getStatusLabel } from "../../lib/format"
import type { Sale } from "../../lib/types"

function SaleTable({
  sales,
  loading,
  onPay,
  onReturn,
  onCancel,
}: {
  sales?: Sale[]
  loading: boolean
  onPay?: (id: number) => void
  onReturn?: (id: number) => void
  onCancel?: (id: number) => void
}) {
  if (loading) return <TableSkeleton rows={5} />

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-6 py-4 font-medium text-muted-foreground">
                Cliente
              </th>
              <th className="px-6 py-4 font-medium text-muted-foreground">
                Itens
              </th>
              <th className="px-6 py-4 font-medium text-muted-foreground">
                Total
              </th>
              <th className="px-6 py-4 font-medium text-muted-foreground">
                Status
              </th>
              <th className="px-6 py-4 font-medium text-muted-foreground">
                Data
              </th>
              <th className="px-6 py-4 font-medium text-muted-foreground">
                Acoes
              </th>
            </tr>
          </thead>
          <tbody>
            {sales?.map((sale) => (
              <tr
                key={sale.id}
                className="border-b border-border last:border-0"
              >

                <td className="px-6 py-4">
                  {sale.client ? (
                    <>
                      <p className="font-medium text-foreground">
                        {sale.client.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {sale.client.email}
                      </p>
                    </>
                  ) : (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <UserX className="h-4 w-4" />
                      <span>Não informado</span>
                    </div>
                  )}
                </td>

                <td className="px-6 py-4 text-muted-foreground">
                  {sale.items.length}{" "}
                  {sale.items.length === 1 ? "item" : "itens"}
                </td>
                <td className="px-6 py-4 font-medium text-foreground">
                  {formatCurrency(sale.totalPrice)}
                </td>
                <td className="px-6 py-4">
                  <Badge
                    variant="secondary"
                    className={getStatusColor(sale.status)}
                  >
                    {getStatusLabel(sale.status)}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-xs text-muted-foreground">
                  {sale.date}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    {sale.status === "PENDING" && onPay && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onPay(sale.id)}
                        title="Marcar como pago"
                        className="text-emerald-600 hover:text-emerald-700"
                      >
                        <CreditCard className="h-4 w-4" />
                      </Button>
                    )}
                    {sale.status === "PAID" && onReturn && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onReturn(sale.id)}
                        title="Devolver"
                      >
                        <Undo2 className="h-4 w-4" />
                      </Button>
                    )}
                    {sale.status === "PENDING" && onCancel && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onCancel(sale.id)}
                        title="Cancelar"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {(!sales || sales.length === 0) && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-muted-foreground"
                >
                  Nenhuma venda encontrada
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function SalesPage() {
  const [formOpen, setFormOpen] = useState(false)

  const {
    data: pending,
    isLoading: lp,
    mutate: mp,
  } = useSWR<Sale[]>("sales-pending", () => salesService.getPending())
  const {
    data: paid,
    isLoading: lpaid,
    mutate: mpaid,
  } = useSWR<Sale[]>("sales-paid", () => salesService.getPaid())
  const {
    data: cancelled,
    isLoading: lc,
    mutate: mc,
  } = useSWR<Sale[]>("sales-cancelled", () => salesService.getCancelled())
  const {
    data: returned,
    isLoading: lr,
    mutate: mr,
  } = useSWR<Sale[]>("sales-returned", () => salesService.getReturned())

  const mutateAll = () => {
    mp()
    mpaid()
    mc()
    mr()
  }

  const handlePay = async (id: number) => {
    try {
      await salesService.pay(id)
      toast.success("Venda marcada como paga!")
      mutateAll()
    } catch {
      toast.error("Erro ao processar pagamento")
    }
  }

  const handleReturn = async (id: number) => {
    try {
      await salesService.return(id)
      toast.success("Devolucao registrada!")
      mutateAll()
    } catch {
      toast.error("Erro ao registrar devolucao")
    }
  }

  const handleCancel = async (id: number) => {
    try {
      await salesService.cancel(id)
      toast.success("Venda cancelada!")
      mutateAll()
    } catch {
      toast.error("Erro ao cancelar venda")
    }
  }

  return (
    <DashboardShell
      title="Vendas"
      description="Gerencie suas vendas e transacoes"
      actions={
        <Button onClick={() => setFormOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nova Venda</span>
        </Button>
      }
    >
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending" className="gap-2">
            <Clock className="h-4 w-4" />
            Pendentes
            {pending && pending.length > 0 && (
              <span className="ml-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                {pending.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="paid" className="gap-2">
            <CheckCircle className="h-4 w-4" />
            Pagas
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="gap-2">
            <XCircle className="h-4 w-4" />
            Canceladas
          </TabsTrigger>
          <TabsTrigger value="returned" className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Devolvidas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          <SaleTable
            sales={pending}
            loading={lp}
            onPay={handlePay}
            onCancel={handleCancel}
          />
        </TabsContent>
        <TabsContent value="paid" className="mt-6">
          <SaleTable
            sales={paid}
            loading={lpaid}
            onReturn={handleReturn}
          />
        </TabsContent>
        <TabsContent value="cancelled" className="mt-6">
          <SaleTable sales={cancelled} loading={lc} />
        </TabsContent>
        <TabsContent value="returned" className="mt-6">
          <SaleTable sales={returned} loading={lr} />
        </TabsContent>
      </Tabs>

      <SaleForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSuccess={mutateAll}
      />
    </DashboardShell>
  )
}