import axios, { AxiosError } from "axios"

export const http = axios.create({
  baseURL: "/api/proxy",
  withCredentials: true,
})

let isRefreshing = false
let queue: any[] = []

const processQueue = (error: any) => {
  queue.forEach(p => {
    if (error) p.reject(error)
    else p.resolve()
  })
  queue = []
}

http.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError) => {

    const original: any = error.config

    if (
      error.response?.status !== 401 ||
      original._retry ||
      original.url?.includes("/auth/login") ||
      original.url?.includes("/auth/register") ||
      original.url?.includes("/auth/refresh")
    ) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({ resolve, reject })
      }).then(() => http(original))
    }

    original._retry = true
    isRefreshing = true

    try {
      await http.post("/auth/refresh")
      processQueue(null)
      return http(original)
    } catch (err) {
      processQueue(err)
      window.location.href = "/login"
      return Promise.reject(err)
    } finally {
      isRefreshing = false
    }
  }
)