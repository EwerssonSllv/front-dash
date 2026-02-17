import { api } from "../lib/api"
import type { CheckoutResponse } from "../lib/types"

export const stripeService = {
  getCheckoutUrl: (plan: string, annual: boolean = false) =>
    api.get<CheckoutResponse>(
      `/stripe/checkout?plan=${plan}&annual=${annual}`
    ),
}
