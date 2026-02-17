// =========================================================
// Dashlyze - Type Definitions
// =========================================================

export interface SaleItem {
  productId: number
  productName: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface ClientInfo {
  id: number
  name: string
  email: string
  phone: string
  document: string
}

export type SaleStatus = "PENDING" | "PAID" | "CANCELLED" | "RETURNED"

export interface Sale {
  id: number
  items: SaleItem[]
  totalPrice: number
  date: string
  status: SaleStatus
  client: ClientInfo
  paidAt: string | null
}

export interface Product {
  id: number
  name: string
  description: string
  price: number
  quantity: number
  cover: string
  active: boolean
  category: string
  customCategory: string | null
}

export interface ClientOverview {
  totalRevenue: number
  totalPending: number
  totalCanceled: number
  paidSales: number
  pendingSales: number
  canceledSales: number
}

export interface TopBuyer {
  clientId: number
  name: string
  totalSales: number
  totalValue: number
  sales: Sale[]
}

export interface Debtor {
  clientId: number
  name: string
  totalSales: number
  totalValue: number
  sales: Sale[]
}

export interface TopCanceller {
  clientId: number
  name: string
  canceledSales: number
  canceledValue: number
  canceledSalesDetails: Sale[]
}

export interface FastestPayer {
  clientId: number
  name: string
  averagePaymentTime: string
  sales: Sale[]
}

export interface BestSellingProduct {
  productId: number
  name: string
  totalQuantity: number
  totalRevenue: number
  buyers: {
    clientId: number
    name: string
    quantity: number
    totalPaid: number
  }[]
}

export interface CreateSalePayload {
  client: {
    name: string
    email: string
    phone: string
    document: string
  }
  items: {
    productId: number
    quantity: number
  }[]
}

export interface CreateProductPayload {
  name: string
  description: string
  price: number
  quantity: number
  cover: string
  category: string
}

export interface UpdateProductPayload {
  name: string
  description: string
  price: number
  quantity: number
  cover: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  token: string
}

export interface CheckoutResponse {
  checkoutUrl: string
}
