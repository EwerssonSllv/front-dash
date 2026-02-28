import { http } from "./http"

export const fetcher = async <T = any>(url: string): Promise<T> => {
  const response = await http.get<T>(url)
  return response.data
}