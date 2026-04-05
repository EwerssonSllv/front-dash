import { http } from "../lib/http"
import type { Sale, CreateSalePayload, SaleStatus } from "../lib/types"

export const salesService = {
  create: (payload: CreateSalePayload): Promise<Sale> =>
    http.post("/sales", payload),

  getById: (id: number): Promise<Sale> =>
    http.get(`/sales/${id}`),

  getPending: (): Promise<Sale[]> =>
    http.get("/sales/pending"),

  getPaid: (): Promise<Sale[]> =>
    http.get("/sales/paid"),

  getCancelled: (): Promise<Sale[]> =>
    http.get("/sales/cancelled"),

  getReturned: (): Promise<Sale[]> =>
    http.get("/sales/returned"),

  pay: (id: number): Promise<void> =>
    http.put(`/sales/${id}/pay`),

  return: (id: number): Promise<void> =>
    http.put(`/sales/${id}/return`),

  cancel: (id: number): Promise<void> =>
    http.delete(`/sales/${id}`),

  getByYear: (year: number, status?: SaleStatus): Promise<Sale[]> =>
    http.get(
      `/sales/year/${year}${status ? `?status=${status}` : ""}`
    ),

  getByClient: (clientId: number): Promise<Sale[]> =>
    http.get(`/sales/client/${clientId}`),

  getByMonth: (
    year: number,
    month: number,
    status?: SaleStatus
  ): Promise<Sale[]> =>
    http.get(
      `/sales/month/${year}/${month}${status ? `?status=${status}` : ""}`
    ),

  getByDay: (
    year: number,
    month: number,
    day: number,
    status?: SaleStatus
  ): Promise<Sale[]> =>
    http.get(
      `/sales/day/${year}/${month}/${day}${status ? `?status=${status}` : ""}`
    ),

  importFile: (file: File, onProgress?: (pct: number) => void): Promise<{ message: string }> => {
    const formData = new FormData()
    formData.append("file", file)

    return http.post("/sales/import", formData, {
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const pct = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0
          onProgress(pct)
        }
      }
    })
  },
}