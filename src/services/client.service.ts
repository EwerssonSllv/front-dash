import { api } from "../lib/api"
import type {
  ClientInfo,
  ClientOverview,
  TopBuyer,
  Debtor,
  TopCanceller,
  FastestPayer,
} from "../lib/types"

export const clientsService = {
  getAll: () => api.get<ClientInfo[]>("/clients"),
  getById: (id: number) => api.get<ClientInfo>(`/clients/${id}`),
  getOverview: () => api.get<ClientOverview>("/clients/overview"),
  getTopBuyers: () => api.get<TopBuyer[]>("/clients/top-buyers"),
  getDebtors: () => api.get<Debtor[]>("/clients/debtors"),
  getTopCancellers: () => api.get<TopCanceller[]>("/clients/top-cancellers"),
  getFastestPayers: () => api.get<FastestPayer[]>("/clients/fastest-payers"),
}
