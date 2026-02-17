"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "../../components/ui/dialog"
import { productsService } from "../../services/product.service"
import type { Product } from "../../lib/types"

const categories = [
  "Eletronicos",
  "Roupas",
  "Alimentos",
  "Servicos",
  "Saude",
  "Educacao",
  "Outros",
]

interface ProductFormProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  product?: Product | null
}

export function ProductForm({
  open,
  onClose,
  onSuccess,
  product,
}: ProductFormProps) {
  const isEditing = !!product

  const [name, setName] = useState(product?.name ?? "")
  const [description, setDescription] = useState(product?.description ?? "")
  const [price, setPrice] = useState(product?.price?.toString() ?? "")
  const [quantity, setQuantity] = useState(product?.quantity?.toString() ?? "")
  const [cover, setCover] = useState(product?.cover ?? "")
  const [category, setCategory] = useState(product?.category ?? "")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !price || !quantity || !category) {
      toast.error("Preencha todos os campos obrigatorios")
      return
    }

    setLoading(true)
    try {
      if (isEditing && product) {
        await productsService.update(product.id, {
          name,
          description,
          price: parseFloat(price),
          quantity: parseInt(quantity),
          cover,
        })
        toast.success("Produto atualizado!")
      } else {
        await productsService.create({
          name,
          description,
          price: parseFloat(price),
          quantity: parseInt(quantity),
          cover,
          category,
        })
        toast.success("Produto criado!")
      }
      onSuccess()
      onClose()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao salvar produto"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading">
            {isEditing ? "Editar Produto" : "Novo Produto"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize as informacoes do produto abaixo."
              : "Preencha os dados para cadastrar um novo produto."}
          </DialogDescription>

        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="prod-name">Nome *</Label>
            <Input
              id="prod-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do produto"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="prod-desc">Descricao</Label>
            <Textarea
              id="prod-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descricao do produto"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="prod-price">Preco *</Label>
              <Input
                id="prod-price"
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="prod-qty">Quantidade *</Label>
              <Input
                id="prod-qty"
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0"
                required
              />
            </div>
          </div>
          {!isEditing && (
            <div className="flex flex-col gap-2">
              <Label>Categoria *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Label htmlFor="prod-cover">Imagem (URL)</Label>
            <Input
              id="prod-cover"
              value={cover}
              onChange={(e) => setCover(e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : isEditing ? (
                "Atualizar"
              ) : (
                "Criar"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
