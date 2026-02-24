import { http } from "../lib/http"
import type {
  ClientInfo,
  ClientOverview,
  TopBuyer,
  Debtor,
  TopCanceller,
  FastestPayer,
} from "../lib/types"

export const clientsService = {
  getAll: (): Promise<ClientInfo[]> =>
    http.get("/clients"),

  getById: (id: number): Promise<ClientInfo> =>
    http.get(`/clients/${id}`),

  getOverview: (): Promise<ClientOverview> =>
    http.get("/clients/overview"),

  getTopBuyers: (): Promise<TopBuyer[]> =>
    http.get("/clients/top-buyers"),

  getDebtors: (): Promise<Debtor[]> =>
    http.get("/clients/debtors"),

  getTopCancellers: (): Promise<TopCanceller[]> =>
    http.get("/clients/top-cancellers"),

  getFastestPayers: (): Promise<FastestPayer[]> =>
    http.get("/clients/fastest-payers"),
}