import { http } from "../lib/http"
import type { Product, CreateProductPayload, UpdateProductPayload, BestSellingProduct } from "../lib/types"

export const productsService = {
  getAll: async (): Promise<Product[]> => {
    return http.get("/products") // já retorna data direto pelo interceptor
  },

  getTrash: async (): Promise<Product[]> => {
    return http.get("/products/trash")
  },

  getById: async (id: number): Promise<Product> => {
    return http.get(`/products/${id}`)
  },

  create: async (payload: CreateProductPayload): Promise<Product> => {
    return http.post("/products", payload)
  },

  update: async (id: number, payload: UpdateProductPayload, method: "PATCH" | "PUT" = "PATCH"): Promise<Product> => {
    return method === "PATCH"
      ? http.patch(`/products/${id}`, payload)
      : http.put(`/products/${id}`, payload)
  },

  delete: async (id: number): Promise<void> => {
    return http.delete(`/products/${id}`)
  },

  restore: async (id: number): Promise<void> => {
    return http.patch(`/products/${id}/restore`)
  },

  getBestSelling: async (): Promise<BestSellingProduct[]> => {
    return http.get("/products/best-selling-products")
  },
}