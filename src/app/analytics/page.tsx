"use client"

import useSWR from "swr"
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Clock,
  Users,
  XCircle,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { DashboardShell } from "../../components/layout/dashboard-shell"
import { StatCard } from "../../components/cards/start-card"
import {
  StatCardSkeleton,
  ChartSkeleton,
  TableSkeleton,
} from "../../components/ui/loading-skeleton"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs"
import { clientsService } from "../../services/client.service"
import { productsService } from "../../services/product.service"
import { formatCurrency } from "../../lib/format"
import type {
  ClientOverview,
  TopBuyer,
  Debtor,
  TopCanceller,
  FastestPayer,
  BestSellingProduct,
} from "../../lib/types"

export default function AnalyticsPage() {
  const { data: overview, isLoading: lo } = useSWR<ClientOverview>(
    "analytics-overview",
    () => clientsService.getOverview()
  )

  const { data: topBuyers, isLoading: ltb } = useSWR<TopBuyer[]>(
    "analytics-top-buyers",
    () => clientsService.getTopBuyers()
  )

  const { data: debtors, isLoading: ld } = useSWR<Debtor[]>(
    "analytics-debtors",
    () => clientsService.getDebtors()
  )

  const { data: cancellers, isLoading: ltc } = useSWR<TopCanceller[]>(
    "analytics-cancellers",
    () => clientsService.getTopCancellers()
  )

  const { data: fastPayers, isLoading: lfp } = useSWR<FastestPayer[]>(
    "analytics-fast-payers",
    () => clientsService.getFastestPayers()
  )

  const { data: bestProducts, isLoading: lbp } = useSWR<BestSellingProduct[]>(
    "analytics-best-products",
    () => productsService.getBestSelling()
  )

  const buyersChart =
    topBuyers?.slice(0, 8).map((b) => ({
      name: b.name.split(" ")[0],
      valor: b.totalValue,
      vendas: b.totalSales,
    })) || []

  const productsChart =
    bestProducts?.slice(0, 8).map((p) => ({
      name: p.name.length > 12 ? p.name.slice(0, 12) + "..." : p.name,
      quantidade: p.totalQuantity,
      receita: p.totalRevenue,
    })) || []

  return (
    <DashboardShell
      title="Analytics"
      description="Analise detalhada do seu negocio"
    >
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {lo ? (
          Array.from({ length: 6 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))
        ) : (
          <>
            <StatCard
              title="Receita Total"
              value={formatCurrency(overview?.totalRevenue ?? 0)}
              icon={DollarSign}
            />
            <StatCard
              title="Total Pendente"
              value={formatCurrency(overview?.totalPending ?? 0)}
              icon={Clock}
            />
            <StatCard
              title="Total Cancelado"
              value={formatCurrency(overview?.totalCanceled ?? 0)}
              icon={XCircle}
            />
            <StatCard
              title="Vendas Pagas"
              value={overview?.paidSales ?? 0}
              icon={TrendingUp}
            />
            <StatCard
              title="Vendas Pendentes"
              value={overview?.pendingSales ?? 0}
              icon={AlertTriangle}
            />
            <StatCard
              title="Vendas Canceladas"
              value={overview?.canceledSales ?? 0}
              icon={Users}
            />
          </>
        )}
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {ltb ? (
          <ChartSkeleton />
        ) : (
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground">
              Top Compradores
            </h3>

            <div className="mt-6 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={buyersChart}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border"
                  />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => {
                      const numeric = Number(value) || 0
                      return [
                        name === "valor"
                          ? formatCurrency(numeric)
                          : numeric,
                        name === "valor" ? "Valor" : "Vendas",
                      ]
                    }}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "13px",
                    }}
                  />
                  <Bar
                    dataKey="valor"
                    fill="hsl(var(--primary))"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {lbp ? (
          <ChartSkeleton />
        ) : (
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground">
              Produtos Mais Vendidos
            </h3>

            <div className="mt-6 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productsChart}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border"
                  />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => {
                      const numeric = Number(value) || 0
                      return [
                        name === "receita"
                          ? formatCurrency(numeric)
                          : numeric,
                        name === "receita"
                          ? "Receita"
                          : "Quantidade",
                      ]
                    }}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "13px",
                    }}
                  />
                  <Bar
                    dataKey="quantidade"
                    fill="hsl(var(--success))"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Tabs Section */}
      <div className="mt-6">
        <Tabs defaultValue="debtors">
          <TabsList>
            <TabsTrigger value="debtors">Inadimplentes</TabsTrigger>
            <TabsTrigger value="cancellers">
              Top Canceladores
            </TabsTrigger>
            <TabsTrigger value="fast-payers">
              Pagadores Rapidos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="debtors" className="mt-6">
            {ld ? (
              <TableSkeleton rows={5} />
            ) : (
              <div className="rounded-xl border border-border bg-card p-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="py-3 text-muted-foreground">
                        Cliente
                      </th>
                      <th className="py-3 text-muted-foreground">
                        Vendas Pendentes
                      </th>
                      <th className="py-3 text-muted-foreground">
                        Valor Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {debtors?.map((d) => (
                      <tr
                        key={d.clientId}
                        className="border-b border-border last:border-0"
                      >
                        <td className="py-3 font-medium text-foreground">
                          {d.name}
                        </td>
                        <td className="py-3 text-muted-foreground">
                          {d.totalSales}
                        </td>
                        <td className="py-3 font-medium text-amber-600">
                          {formatCurrency(d.totalValue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  )
}
