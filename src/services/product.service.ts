import { http } from "../lib/http"
import type {
  Product,
  CreateProductPayload,
  UpdateProductPayload,
  BestSellingProduct,
} from "../lib/types"

export const productsService = {
  getAll: () => http.get<Product[]>("/products"),

  getById: (id: number) =>
    http.get<Product>(`/products/${id}`),

  create: (payload: CreateProductPayload) =>
    http.post<Product>("/products", payload),

  update: (
    id: number,
    payload: UpdateProductPayload,
    method: "PATCH" | "PUT" = "PATCH"
  ) =>
    method === "PATCH"
      ? http.patch<Product>(`/products/${id}`, payload)
      : http.put<Product>(`/products/${id}`, payload),

  delete: (id: number) =>
    http.delete<void>(`/products/${id}`),

  restore: (id: number) =>
    http.patch<void>(`/products/${id}/restore`),

  getTrash: () =>
    http.get<Product[]>("/products/trash"),

  getBestSelling: () =>
    http.get<BestSellingProduct[]>("/products/best-selling-products"),
}