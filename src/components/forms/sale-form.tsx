"use client"

import { useState } from "react"
import useSWR from "swr"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"
import { salesService } from "../../services/sale.service"
import { productsService } from "../../services/product.service"
import type { Product } from "../../lib/types"

interface SaleItem {
  productId: number
  quantity: number
}

interface SaleFormProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function SaleForm({ open, onClose, onSuccess }: SaleFormProps) {
  const { data: products } = useSWR<Product[]>("products-for-sale", () =>
    productsService.getAll()
  )

  const [clientName, setClientName] = useState("")
  const [clientEmail, setClientEmail] = useState("")
  const [clientPhone, setClientPhone] = useState("")
  const [clientDocument, setClientDocument] = useState("")
  const [items, setItems] = useState<SaleItem[]>([
    { productId: 0, quantity: 1 },
  ])
  const [loading, setLoading] = useState(false)

  const addItem = () => {
    setItems([...items, { productId: 0, quantity: 1 }])
  }

  const removeItem = (index: number) => {
    if (items.length <= 1) return
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: keyof SaleItem, value: number) => {
    const updated = [...items]
    updated[index] = { ...updated[index], [field]: value }
    setItems(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!clientName || !clientEmail) {
      toast.error("Preencha os dados do cliente")
      return
    }
    const validItems = items.filter((item) => item.productId > 0 && item.quantity > 0)
    if (validItems.length === 0) {
      toast.error("Adicione pelo menos um produto")
      return
    }

    setLoading(true)
    try {
      await salesService.create({
        client: {
          name: clientName,
          email: clientEmail,
          phone: clientPhone,
          document: clientDocument,
        },
        items: validItems,
      })
      toast.success("Venda registrada com sucesso!")
      onSuccess()
      onClose()
      // Reset form
      setClientName("")
      setClientEmail("")
      setClientPhone("")
      setClientDocument("")
      setItems([{ productId: 0, quantity: 1 }])
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao registrar venda"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-heading">Nova Venda</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Client info */}
          <div>
            <p className="mb-3 text-sm font-semibold text-foreground">
              Dados do Cliente
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="sale-name">Nome *</Label>
                <Input
                  id="sale-name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Nome do cliente"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="sale-email">Email *</Label>
                <Input
                  id="sale-email"
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="email@exemplo.com"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="sale-phone">Telefone</Label>
                <Input
                  id="sale-phone"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="sale-doc">Documento</Label>
                <Input
                  id="sale-doc"
                  value={clientDocument}
                  onChange={(e) => setClientDocument(e.target.value)}
                  placeholder="CPF / CNPJ"
                />
              </div>
            </div>
          </div>

          {/* Items */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Itens</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addItem}
                className="gap-1"
              >
                <Plus className="h-3 w-3" />
                Adicionar
              </Button>
            </div>
            <div className="flex flex-col gap-3">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-end gap-3">
                  <div className="flex-1">
                    <Label className="text-xs">Produto</Label>
                    <Select
                      value={item.productId > 0 ? String(item.productId) : ""}
                      onValueChange={(v) =>
                        updateItem(idx, "productId", parseInt(v))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {products
                          ?.filter((p) => p.active)
                          .map((p) => (
                            <SelectItem key={p.id} value={String(p.id)}>
                              {p.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-24">
                    <Label className="text-xs">Qtd</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(idx, "quantity", parseInt(e.target.value) || 1)
                      }
                    />
                  </div>
                  {items.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(idx)}
                      className="text-destructive"
                      aria-label="Remover item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registrando...
                </>
              ) : (
                "Registrar Venda"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
