import { http } from "../lib/http"
import type { CheckoutResponse } from "../lib/types"

export const stripeService = {
  getCheckoutUrl: (plan: string, annual: boolean = false) =>
    http.get<CheckoutResponse>(
      `/stripe/checkout?plan=${plan}&annual=${annual}`
    ),
}