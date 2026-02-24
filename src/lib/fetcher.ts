export const fetcher = async (url: string) => {
  const res = await fetch(`/api/proxy${url}`, {
    credentials: "include",
  })

  if (!res.ok) {
    if (res.status === 401) return null
    throw new Error("Erro na requisição")
  }

  return res.json()
}