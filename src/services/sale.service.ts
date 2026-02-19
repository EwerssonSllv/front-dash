import { api } from "../lib/api"
import type { Sale, CreateSalePayload, SaleStatus } from "../lib/types"

export const salesService = {
  create: (payload: CreateSalePayload) =>
    api.post<Sale>("/sales", payload),
  getById: (id: number) => api.get<Sale>(`/sales/${id}`),
  getPending: () => api.get<Sale[]>("/sales/pending"),
  getPaid: () => api.get<Sale[]>("/sales/paid"),
  getCancelled: () => api.get<Sale[]>("/sales/cancelled"),
  getReturned: () => api.get<Sale[]>("/sales/returned"),
  pay: (id: number) => api.put<void>(`/sales/${id}/pay`),
  return: (id: number) => api.put<void>(`/sales/${id}/return`),
  cancel: (id: number) => api.delete<void>(`/sales/${id}`),
  getByYear: (year: number, status?: SaleStatus) =>
    api.get<Sale[]>(`/sales/year/${year}${status ? `?status=${status}` : ""}`),
  getByMonth: (year: number, month: number, status?: SaleStatus) =>
    api.get<Sale[]>(
      `/sales/month/${year}/${month}${status ? `?status=${status}` : ""}`
    ),
  getByDay: (
    year: number,
    month: number,
    day: number,
    status?: SaleStatus
  ) =>
    api.get<Sale[]>(
      `/sales/day/${year}/${month}/${day}${status ? `?status=${status}` : ""}`
    ),

  /** Importa vendas em lote via arquivo CSV ou XLSX (MultipartFile) */
  importFile: (file: File, onProgress?: (pct: number) => void) => {
    const formData = new FormData()
    formData.append("file", file)
    return api.patch<{ message: string }>("/sales/import", formData, onProgress)
  },
}
