"use client"

import { useEffect, useState } from "react"
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
  DialogDescription,
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

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [quantity, setQuantity] = useState("")
  const [cover, setCover] = useState("")
  const [category, setCategory] = useState("")
  const [loading, setLoading] = useState(false)

  // 🔥 Sincroniza quando abrir ou mudar product
  useEffect(() => {
    if (product) {
      setName(product.name ?? "")
      setDescription(product.description ?? "")
      setPrice(product.price?.toString() ?? "")
      setQuantity(product.quantity?.toString() ?? "")
      setCover(product.cover ?? "")
      setCategory(product.category ?? "")
    } else {
      resetForm()
    }
  }, [product, open])

  const resetForm = () => {
    setName("")
    setDescription("")
    setPrice("")
    setQuantity("")
    setCover("")
    setCategory("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 🔥 validação apenas na criação
    if (!isEditing) {
      if (!name || !price || !quantity || !category) {
        toast.error("Preencha todos os campos obrigatórios")
        return
      }
    }

    setLoading(true)

    try {
      if (isEditing && product) {
        // 🔥 monta payload dinâmico (PATCH real)
        const payload: any = {}

        if (name !== product.name) payload.name = name
        if (description !== product.description)
          payload.description = description
        if (price !== product.price?.toString() && price !== "")
          payload.price = parseFloat(price)
        if (quantity !== product.quantity?.toString() && quantity !== "")
          payload.quantity = parseInt(quantity)
        if (cover !== product.cover) payload.cover = cover

        if (Object.keys(payload).length === 0) {
          toast.info("Nenhuma alteração realizada")
          setLoading(false)
          return
        }

        await productsService.update(product.id, payload)

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
      resetForm()
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
          <DialogTitle>
            {isEditing ? "Editar Produto" : "Novo Produto"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize as informações do produto."
              : "Preencha os dados para cadastrar um novo produto."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Nome */}
          <div className="flex flex-col gap-2">
            <Label>Nome {!isEditing && "*"}</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do produto"
              required={!isEditing}
            />
          </div>

          {/* Descrição */}
          <div className="flex flex-col gap-2">
            <Label>Descrição</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição do produto"
              rows={3}
            />
          </div>

          {/* Preço e Quantidade */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Preço {!isEditing && "*"}</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                required={!isEditing}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Quantidade {!isEditing && "*"}</Label>
              <Input
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0"
                required={!isEditing}
              />
            </div>
          </div>

          {/* Categoria apenas na criação */}
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

          {/* Imagem */}
          <div className="flex flex-col gap-2">
            <Label>Imagem (URL)</Label>
            <Input
              value={cover}
              onChange={(e) => setCover(e.target.value)}
              placeholder="https://..."
            />
          </div>

          {/* Botões */}
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
