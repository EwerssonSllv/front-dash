"use client"

import { useState } from "react"
import useSWR from "swr"
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  RotateCcw,
  Package,
  Archive,
} from "lucide-react"
import { toast } from "sonner"
import { DashboardShell } from "../../components/layout/dashboard-shell"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { TableSkeleton } from "../../components/ui/loading-skeleton"
import { ProductForm } from "../../components/forms/product-form"
import { productsService } from "../../services/product.service"
import { formatCurrency } from "../../lib/format"
import type { Product } from "../../lib/types"


export default function ProductsPage() {
  const [search, setSearch] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)

  const {
    data: products,
    isLoading,
    mutate,
  } = useSWR<Product[]>("products", () => productsService.getAll())

  const {
    data: trashProducts,
    isLoading: loadingTrash,
    mutate: mutateTrash,
  } = useSWR<Product[]>("products-trash", () => productsService.getTrash())

  const filtered = products?.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id: number) => {
    try {
      await productsService.delete(id)
      toast.success("Produto removido!")
      mutate()
      mutateTrash()
    } catch {
      toast.error("Erro ao remover produto")
    }
  }

  const handleRestore = async (id: number) => {
    try {
      await productsService.restore(id)
      toast.success("Produto restaurado!")
      mutate()
      mutateTrash()
    } catch {
      toast.error("Erro ao restaurar produto")
    }
  }

  const handleEdit = (product: Product) => {
    setEditProduct(product)
    setFormOpen(true)
  }

  const handleFormClose = () => {
    setFormOpen(false)
    setEditProduct(null)
  }

  return (
    <DashboardShell
      title="Produtos"
      description="Gerencie seu catalogo de produtos"
      actions={
        <Button onClick={() => setFormOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Novo Produto</span>
        </Button>
      }
    >
      <Tabs defaultValue="active">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="active" className="gap-2">
              <Package className="h-4 w-4" />
              Ativos
            </TabsTrigger>
            <TabsTrigger value="trash" className="gap-2">
              <Archive className="h-4 w-4" />
              Lixeira
            </TabsTrigger>
          </TabsList>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar produtos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <TabsContent value="active" className="mt-6">
          {isLoading ? (
            <TableSkeleton rows={6} />
          ) : (
            <div className="rounded-xl border border-border bg-card">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="px-6 py-4 font-medium text-muted-foreground">
                        Produto
                      </th>
                      <th className="px-6 py-4 font-medium text-muted-foreground">
                        Categoria
                      </th>
                      <th className="px-6 py-4 font-medium text-muted-foreground">
                        Preco
                      </th>
                      <th className="px-6 py-4 font-medium text-muted-foreground">
                        Estoque
                      </th>
                      <th className="px-6 py-4 font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="px-6 py-4 font-medium text-muted-foreground">
                        Acoes
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered?.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-border last:border-0"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {product.cover ? (
                              <img
                                src={product.cover}
                                alt={product.name}
                                className="h-10 w-10 rounded-lg border border-border object-cover"
                                crossOrigin="anonymous"
                              />
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                <Package className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-foreground">
                                {product.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {product.description?.slice(0, 40)}
                                {(product.description?.length ?? 0) > 40
                                  ? "..."
                                  : ""}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {product.category}
                        </td>
                        <td className="px-6 py-4 font-medium text-foreground">
                          {formatCurrency(product.price)}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {product.quantity}
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={product.active ? "default" : "secondary"}
                          >
                            {product.active ? "Ativo" : "Inativo"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(product)}
                              aria-label="Editar"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(product.id)}
                              aria-label="Remover"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {(!filtered || filtered.length === 0) && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-12 text-center text-muted-foreground"
                        >
                          {search
                            ? "Nenhum produto encontrado"
                            : "Nenhum produto cadastrado"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="trash" className="mt-6">
          {loadingTrash ? (
            <TableSkeleton rows={4} />
          ) : (
            <div className="rounded-xl border border-border bg-card">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="px-6 py-4 font-medium text-muted-foreground">
                        Produto
                      </th>
                      <th className="px-6 py-4 font-medium text-muted-foreground">
                        Categoria
                      </th>
                      <th className="px-6 py-4 font-medium text-muted-foreground">
                        Preco
                      </th>
                      <th className="px-6 py-4 font-medium text-muted-foreground">
                        Acoes
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {trashProducts?.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-border last:border-0"
                      >
                        <td className="px-6 py-4 font-medium text-foreground">
                          {product.name}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {product.category}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {formatCurrency(product.price)}
                        </td>
                        <td className="px-6 py-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRestore(product.id)}
                            className="gap-2"
                          >
                            <RotateCcw className="h-4 w-4" />
                            Restaurar
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {(!trashProducts || trashProducts.length === 0) && (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-6 py-12 text-center text-muted-foreground"
                        >
                          Lixeira vazia
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <ProductForm
        open={formOpen}
        onClose={handleFormClose}
        onSuccess={() => {
          mutate()
          mutateTrash()
        }}
        product={editProduct}
      />
    </DashboardShell>
  )
}
