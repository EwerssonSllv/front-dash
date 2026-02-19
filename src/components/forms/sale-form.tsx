"use client"

import { useCallback, useRef, useState } from "react"
import useSWR from "swr"
import { AlertCircle, CheckCircle2, FileSpreadsheet, Loader2, Plus, Trash2, Upload, X } from "lucide-react"
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
import { Progress } from "../ui/progress"


// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface SaleItemEntry {
  productId: number
  quantity: number
}

interface SaleFormProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

type FormMode = "manual" | "import"
type ImportStatus = "idle" | "uploading" | "success" | "error"

const ALLOWED_EXTENSIONS = [".csv", ".xlsx"]
const ALLOWED_MIMES = [
  "text/csv",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
]

// ---------------------------------------------------------------------------
// File validation helper
// ---------------------------------------------------------------------------
function validateFile(file: File): string | null {
  const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase()
  if (!ALLOWED_EXTENSIONS.includes(ext) && !ALLOWED_MIMES.includes(file.type)) {
    return "Formato invalido. Envie apenas arquivos CSV ou XLSX."
  }
  if (file.size > 10 * 1024 * 1024) {
    return "Arquivo muito grande. Tamanho maximo: 10 MB."
  }
  return null
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function SaleForm({ open, onClose, onSuccess }: SaleFormProps) {
  const { data: products } = useSWR<Product[]>("products-for-sale", () =>
    productsService.getAll()
  )

  // Form mode toggle
  const [mode, setMode] = useState<FormMode>("manual")

  // ---- Manual form state ----
  const [clientName, setClientName] = useState("")
  const [clientEmail, setClientEmail] = useState("")
  const [clientPhone, setClientPhone] = useState("")
  const [clientDocument, setClientDocument] = useState("")
  const [items, setItems] = useState<SaleItemEntry[]>([
    { productId: 0, quantity: 1 },
  ])
  const [submitting, setSubmitting] = useState(false)

  // ---- Import state ----
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [importStatus, setImportStatus] = useState<ImportStatus>("idle")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [importError, setImportError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)

  // ---- Reset helpers ----
  const resetManualForm = () => {
    setClientName("")
    setClientEmail("")
    setClientPhone("")
    setClientDocument("")
    setItems([{ productId: 0, quantity: 1 }])
  }

  const resetImport = () => {
    setSelectedFile(null)
    setImportStatus("idle")
    setUploadProgress(0)
    setImportError("")
  }

  const handleClose = () => {
    resetManualForm()
    resetImport()
    setMode("manual")
    onClose()
  }

  // ---- Manual item helpers ----
  const addItem = () => setItems([...items, { productId: 0, quantity: 1 }])

  const removeItem = (index: number) => {
    if (items.length <= 1) return
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (
    index: number,
    field: keyof SaleItemEntry,
    value: number
  ) => {
    const updated = [...items]
    updated[index] = { ...updated[index], [field]: value }
    setItems(updated)
  }

  // ---- Manual submit ----
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!clientName || !clientEmail) {
      toast.error("Preencha os dados do cliente")
      return
    }
    const validItems = items.filter(
      (item) => item.productId > 0 && item.quantity > 0
    )
    if (validItems.length === 0) {
      toast.error("Adicione pelo menos um produto")
      return
    }

    setSubmitting(true)
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
      handleClose()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao registrar venda"
      )
    } finally {
      setSubmitting(false)
    }
  }

  // ---- File select / drag & drop ----
  const handleFileSelect = useCallback((file: File) => {
    const error = validateFile(file)
    if (error) {
      toast.error(error)
      return
    }
    setSelectedFile(file)
    setImportStatus("idle")
    setImportError("")
    setUploadProgress(0)
  }, [])

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
    // Reset so the same file can be re-selected
    e.target.value = ""
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFileSelect(file)
  }

  // ---- Import submit ----
  const handleImportSubmit = async () => {
    if (!selectedFile) {
      toast.error("Selecione um arquivo CSV ou XLSX")
      return
    }

    setImportStatus("uploading")
    setUploadProgress(0)
    setImportError("")

    try {
      await salesService.importFile(selectedFile, (pct) =>
        setUploadProgress(pct)
      )
      setUploadProgress(100)
      setImportStatus("success")
      toast.success("Importacao iniciada. Os dados serao processados em background.")
      onSuccess()
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Erro ao importar arquivo"
      setImportError(msg)
      setImportStatus("error")
      toast.error(msg)
    }
  }

  // ---- File size formatter ----
  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-heading">Nova Venda</DialogTitle>
        </DialogHeader>

        {/* Mode toggle */}
        <div className="flex rounded-lg border border-border bg-muted p-1">
          <button
            type="button"
            onClick={() => setMode("manual")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              mode === "manual"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Plus className="h-4 w-4" />
            Venda Individual
          </button>
          <button
            type="button"
            onClick={() => setMode("import")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              mode === "import"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Upload className="h-4 w-4" />
            Importar Arquivo
          </button>
        </div>

        {/* ============================================================= */}
        {/* MANUAL MODE */}
        {/* ============================================================= */}
        {mode === "manual" && (
          <form onSubmit={handleManualSubmit} className="flex flex-col gap-5">
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
                        value={
                          item.productId > 0 ? String(item.productId) : ""
                        }
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
                          updateItem(
                            idx,
                            "quantity",
                            parseInt(e.target.value) || 1
                          )
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
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
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
        )}

        {/* ============================================================= */}
        {/* IMPORT MODE */}
        {/* ============================================================= */}
        {mode === "import" && (
          <div className="flex flex-col gap-5">
            <p className="text-sm text-muted-foreground">
              Envie um arquivo <strong>CSV</strong> ou <strong>XLSX</strong> com
              multiplas vendas. Os dados serao processados em background pelo
              servidor.
            </p>

            {/* Drop zone */}
            <div
              role="button"
              tabIndex={0}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  fileInputRef.current?.click()
                }
              }}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
                dragActive
                  ? "border-primary bg-accent"
                  : "border-border hover:border-primary/50 hover:bg-accent/50"
              } ${importStatus === "uploading" ? "pointer-events-none opacity-60" : ""}`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
                onChange={handleFileInputChange}
                className="sr-only"
                aria-label="Selecionar arquivo para importar"
              />
              <FileSpreadsheet className="mb-3 h-10 w-10 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">
                Arraste o arquivo aqui ou clique para selecionar
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                CSV ou XLSX - Maximo 10 MB
              </p>
            </div>

            {/* Selected file preview */}
            {selectedFile && importStatus !== "success" && (
              <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 px-4 py-3">
                <FileSpreadsheet className="h-8 w-8 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatSize(selectedFile.size)}
                  </p>
                </div>
                {importStatus === "idle" && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedFile(null)
                    }}
                    aria-label="Remover arquivo selecionado"
                    className="shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}

            {/* Upload progress */}
            {importStatus === "uploading" && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">
                    Enviando arquivo...
                  </span>
                  <span className="tabular-nums text-muted-foreground">
                    {uploadProgress}%
                  </span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Nao feche esta janela enquanto o upload esta em andamento.
                </p>
              </div>
            )}

            {/* Success state */}
            {importStatus === "success" && (
              <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <div>
                  <p className="text-sm font-medium text-emerald-900">
                    Importacao iniciada com sucesso!
                  </p>
                  <p className="mt-0.5 text-xs text-emerald-700">
                    Os dados serao processados em background. Voce pode
                    acompanhar o progresso na listagem de vendas.
                  </p>
                </div>
              </div>
            )}

            {/* Error state */}
            {importStatus === "error" && (
              <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-red-900">
                    Erro ao importar arquivo
                  </p>
                  <p className="mt-0.5 text-xs text-red-700">{importError}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                {importStatus === "success" ? "Fechar" : "Cancelar"}
              </Button>
              {importStatus !== "success" && (
                <Button
                  type="button"
                  disabled={!selectedFile || importStatus === "uploading"}
                  onClick={handleImportSubmit}
                >
                  {importStatus === "uploading" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Importar Vendas
                    </>
                  )}
                </Button>
              )}
              {importStatus === "error" && (
                <Button type="button" variant="outline" onClick={resetImport}>
                  Tentar novamente
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

