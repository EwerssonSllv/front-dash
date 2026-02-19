import { api } from "../lib/api"
import type {
  Product,
  CreateProductPayload,
  UpdateProductPayload,
  BestSellingProduct,
} from "../lib/types"

export const productsService = {
  getAll: () => api.get<Product[]>("/products"),

  getById: (id: number) => api.get<Product>(`/products/${id}`),

  create: (payload: CreateProductPayload) =>
    api.post<Product>("/products", payload),

  update: (id: number, payload: UpdateProductPayload, method: "PATCH" | "PUT" = "PATCH") =>
    method === "PATCH"
      ? api.patch<Product>(`/products/${id}`, payload)
      : api.put<Product>(`/products/${id}`, payload),

  delete: (id: number) => api.delete<void>(`/products/${id}`),

  restore: (id: number) => api.patch<void>(`/products/${id}/restore`),

  getTrash: () => api.get<Product[]>("/products/trash"),

  getBestSelling: () => api.get<BestSellingProduct[]>("/products/best-selling-products"),
};

