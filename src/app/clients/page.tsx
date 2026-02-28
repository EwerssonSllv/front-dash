"use client"

import { useState } from "react"
import useSWR from "swr"
import { Search, Users, Mail, Phone, FileText } from "lucide-react"
import { DashboardShell } from "../../components/layout/dashboard-shell"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog"
import { TableSkeleton } from "../../components/ui/loading-skeleton"
import { clientsService } from "../../services/client.service"
import { salesService } from "../../services/sale.service"
import { formatCurrency, getStatusColor, getStatusLabel } from "../../lib/format"
import type { ClientInfo, Sale } from "../../lib/types"

export default function ClientsPage() {
  const [search, setSearch] = useState("")
  const [selectedClient, setSelectedClient] = useState<ClientInfo | null>(null)
  const [clientSales, setClientSales] = useState<Sale[]>([])
  const [loadingSales, setLoadingSales] = useState(false)

  const { data: clients, isLoading } = useSWR<ClientInfo[]>(
    "clients",
    () => clientsService.getAll()
  )

  const filtered = clients?.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  )

  const viewClient = async (client: ClientInfo) => {
    setSelectedClient(client)
    setLoadingSales(true)

    try {
      const sales = await salesService.getByClient(client.id)
      setClientSales(sales)
    } catch (error) {
      console.error("Erro ao buscar vendas do cliente:", error)
      setClientSales([])
    } finally {
      setLoadingSales(false)
    }
  }

  return (
    <DashboardShell
      title="Clientes"
      description="Gerencie sua base de clientes"
    >
      {/* Busca */}
      <div className="mb-6">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Tabela */}
      {isLoading ? (
        <TableSkeleton rows={8} />
      ) : (
        <div className="rounded-xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-6 py-4 font-medium text-muted-foreground">
                    Cliente
                  </th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">
                    Email
                  </th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">
                    Telefone
                  </th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">
                    Documento
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered?.map((client) => (
                  <tr
                    key={client.id}
                    className="cursor-pointer border-b border-border transition-colors last:border-0 hover:bg-muted/50"
                    onClick={() => viewClient(client)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Users className="h-4 w-4" />
                        </div>
                        <p className="font-medium text-foreground">
                          {client.name}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {client.email}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {client.phone || "-"}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {client.document || "-"}
                    </td>
                  </tr>
                ))}

                {(!filtered || filtered.length === 0) && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-muted-foreground"
                    >
                      {search
                        ? "Nenhum cliente encontrado"
                        : "Nenhum cliente cadastrado"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Dialog de detalhes */}
      <Dialog
        open={!!selectedClient}
        onOpenChange={() => setSelectedClient(null)}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading">
              {selectedClient?.name}
            </DialogTitle>
          </DialogHeader>

          {selectedClient && (
            <div className="flex flex-col gap-4">
              {/* Dados do cliente */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {selectedClient.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {selectedClient.phone || "Não informado"}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  {selectedClient.document || "Não informado"}
                </div>
              </div>

              {/* Histórico */}
              <div className="mt-2">
                <p className="mb-3 text-sm font-semibold text-foreground">
                  Histórico de Compras
                </p>

                {loadingSales ? (
                  <div className="flex flex-col gap-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-12 animate-pulse rounded-lg bg-muted"
                      />
                    ))}
                  </div>
                ) : clientSales.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {clientSales
                      .sort(
                        (a, b) =>
                          new Date(b.date).getTime() -
                          new Date(a.date).getTime()
                      )
                      .map((sale) => {
                        const totalItems =
                          sale.items?.reduce(
                            (acc, item) => acc + item.quantity,
                            0
                          ) || 0

                        return (
                          <div
                            key={sale.id}
                            className="group relative flex items-center justify-between rounded-lg border border-border p-3 transition hover:bg-muted/40"
                          >
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {formatCurrency(sale.totalPrice)}
                              </p>

                              <p className="text-xs text-muted-foreground">
                                {sale.date}
                              </p>

                              <p className="mt-1 cursor-pointer text-xs font-medium text-primary">
                                {totalItems}{" "}
                                {totalItems === 1 ? "item" : "itens"}
                              </p>
                            </div>

                            <Badge
                              variant="secondary"
                              className={getStatusColor(sale.status)}
                            >
                              {getStatusLabel(sale.status)}
                            </Badge>

                            {/* Tooltip */}
                            {sale.items && sale.items.length > 0 && (
                              <div className="pointer-events-none absolute right-0 top-full z-20 mt-2 hidden w-64 rounded-lg border border-border bg-popover p-3 text-xs shadow-lg group-hover:block">
                                <p className="mb-2 font-semibold text-foreground">
                                  Itens comprados:
                                </p>

                                <div className="flex flex-col gap-1">
                                  {sale.items.map((item, index) => (
                                    <div
                                      key={`${sale.id}-${item.productName}-${index}`}
                                      className="flex justify-between text-muted-foreground"
                                    >
                                      <span>
                                        {item.productName} x{item.quantity}
                                      </span>
                                      <span>
                                        {formatCurrency(item.totalPrice)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Nenhuma compra encontrada
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardShell>
  )
}