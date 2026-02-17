"use client"

import useSWR from "swr"
import {
    DollarSign,
    Clock,
    XCircle,
    CheckCircle,
    AlertTriangle,
    ShoppingCart,
} from "lucide-react"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts"
import { DashboardShell } from "../../components/layout/dashboard-shell"
import { StatCard } from "../../components/cards/start-card"
import {
    StatCardSkeleton,
    ChartSkeleton,
    TableSkeleton,
} from "../../components/ui/loading-skeleton"
import { clientsService } from "../../services/client.service"
import { productsService } from "../../services/product.service"
import { formatCurrency } from "../../lib/format"
import type { ClientOverview, TopBuyer, BestSellingProduct } from "../../lib/types"

const CHART_COLORS = [
    "hsl(215, 80%, 50%)",
    "hsl(160, 60%, 45%)",
    "hsl(30, 80%, 55%)",
    "hsl(280, 65%, 60%)",
    "hsl(340, 75%, 55%)",
]

export default function DashboardPage() {
    const { data: overview, isLoading: loadingOverview } =
        useSWR<ClientOverview>("overview", () => clientsService.getOverview())
    const { data: topBuyers, isLoading: loadingBuyers } = useSWR<TopBuyer[]>(
        "top-buyers",
        () => clientsService.getTopBuyers()
    )
    const { data: bestProducts, isLoading: loadingProducts } = useSWR<
        BestSellingProduct[]
    >("best-products", () => productsService.getBestSelling())

    const pieData = overview
        ? [
            { name: "Pagas", value: overview.paidSales },
            { name: "Pendentes", value: overview.pendingSales },
            { name: "Canceladas", value: overview.canceledSales },
        ]
        : []

    const barData =
        topBuyers?.slice(0, 6).map((b) => ({
            name: b.name.split(" ")[0],
            valor: b.totalValue,
        })) || []

    return (
        <DashboardShell
            title="Dashboard"
            description="Visao geral do seu negocio"
        >
            {/* Overview Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {loadingOverview ? (
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
                            title="Pendente"
                            value={formatCurrency(overview?.totalPending ?? 0)}
                            icon={Clock}
                        />
                        <StatCard
                            title="Cancelado"
                            value={formatCurrency(overview?.totalCanceled ?? 0)}
                            icon={XCircle}
                        />
                        <StatCard
                            title="Vendas Pagas"
                            value={overview?.paidSales ?? 0}
                            icon={CheckCircle}
                        />
                        <StatCard
                            title="Vendas Pendentes"
                            value={overview?.pendingSales ?? 0}
                            icon={AlertTriangle}
                        />
                        <StatCard
                            title="Vendas Canceladas"
                            value={overview?.canceledSales ?? 0}
                            icon={ShoppingCart}
                        />
                    </>
                )}
            </div>

            {/* Charts Row */}
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
                {/* Bar Chart - Top Buyers */}
                {loadingBuyers ? (
                    <ChartSkeleton />
                ) : (
                    <div className="rounded-xl border border-border bg-card p-6">
                        <h3 className="font-heading text-lg font-semibold text-foreground">
                            Top Compradores
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Ranking por valor total de compras
                        </p>
                        <div className="mt-6 h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                                    <XAxis
                                        dataKey="name"
                                        className="text-xs"
                                        tick={{ fill: "hsl(220, 10%, 46%)", fontSize: 12 }}
                                    />
                                    <YAxis
                                        className="text-xs"
                                        tick={{ fill: "hsl(220, 10%, 46%)", fontSize: 12 }}
                                        tickFormatter={(v) =>
                                            `R$${(v / 1000).toFixed(0)}k`
                                        }
                                    />
                                    <Tooltip
                                        formatter={(value) => [
                                            formatCurrency(Number(value) || 0),
                                            "Valor",
                                        ]}
                                        contentStyle={{
                                            backgroundColor: "hsl(var(--card))",
                                            border: "1px solid hsl(var(--border))",
                                            borderRadius: "8px",
                                            fontSize: "13px",
                                        }}
                                    />

                                    <Bar
                                        dataKey="valor"
                                        fill="hsl(215, 80%, 50%)"
                                        radius={[6, 6, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* Pie Chart - Sales Distribution */}
                {loadingOverview ? (
                    <ChartSkeleton />
                ) : (
                    <div className="rounded-xl border border-border bg-card p-6">
                        <h3 className="font-heading text-lg font-semibold text-foreground">
                            Distribuicao de Vendas
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Por status de pagamento
                        </p>
                        <div className="mt-6 h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={4}
                                        dataKey="value"
                                        label={({ name, value }) => `${name}: ${value}`}
                                    >
                                        {pieData.map((_, i) => (
                                            <Cell
                                                key={`cell-${i}`}
                                                fill={CHART_COLORS[i % CHART_COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "hsl(0, 0%, 100%)",
                                            border: "1px solid hsl(220, 13%, 91%)",
                                            borderRadius: "8px",
                                            fontSize: "13px",
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </div>

            {/* Best Selling Products */}
            <div className="mt-6">
                {loadingProducts ? (
                    <TableSkeleton rows={5} />
                ) : (
                    <div className="rounded-xl border border-border bg-card p-6">
                        <h3 className="font-heading text-lg font-semibold text-foreground">
                            Produtos Mais Vendidos
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Ranking de produtos por quantidade vendida
                        </p>
                        <div className="mt-6 overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border text-left">
                                        <th className="pb-3 font-medium text-muted-foreground">
                                            Produto
                                        </th>
                                        <th className="pb-3 font-medium text-muted-foreground">
                                            Qtd. Vendida
                                        </th>
                                        <th className="pb-3 font-medium text-muted-foreground">
                                            Receita
                                        </th>
                                        <th className="pb-3 font-medium text-muted-foreground">
                                            Compradores
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bestProducts?.slice(0, 8).map((product) => (
                                        <tr
                                            key={product.productId}
                                            className="border-b border-border last:border-0"
                                        >
                                            <td className="py-3 font-medium text-foreground">
                                                {product.name}
                                            </td>
                                            <td className="py-3 text-muted-foreground">
                                                {product.totalQuantity}
                                            </td>
                                            <td className="py-3 text-muted-foreground">
                                                {formatCurrency(product.totalRevenue)}
                                            </td>
                                            <td className="py-3 text-muted-foreground">
                                                {product.buyers.length}
                                            </td>
                                        </tr>
                                    ))}
                                    {(!bestProducts || bestProducts.length === 0) && (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="py-8 text-center text-muted-foreground"
                                            >
                                                Nenhum produto vendido ainda
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </DashboardShell>
    )
}
