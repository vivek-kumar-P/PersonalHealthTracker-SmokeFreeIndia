const API_URL = (import.meta as any).env?.VITE_API_URL || "http://localhost:5000/api"

// Auth helpers
export const getToken = () => localStorage.getItem("token")
export const setToken = (token: string) => localStorage.setItem("token", token)
export const removeToken = () => localStorage.removeItem("token")
export const getUser = () => {
  const user = localStorage.getItem("user")
  return user ? JSON.parse(user) : null
}
export const setUser = (user: any) => localStorage.setItem("user", JSON.stringify(user))
export const removeUser = () => localStorage.removeItem("user")

// API client
async function apiClient(endpoint: string, options: RequestInit = {}) {
  const token = getToken()
  const headersObj: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  }

  if (token) {
    headersObj["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: headersObj as HeadersInit,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Something went wrong")
  }

  return response.json()
}

// Auth API
export const auth = {
  register: (email: string, password: string, name?: string) =>
    apiClient("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    }),

  login: (email: string, password: string) =>
    apiClient("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
}

// States API
export const states = {
  getAll: () => apiClient("/states"),
  getOne: (stateName: string) => apiClient(`/states/${stateName}`),
}

// Logs API
export const logs = {
  getAll: () => apiClient("/logs"),
  create: (data: { date: string; cigarettes: number; smokeless: number; notes?: string }) =>
    apiClient("/logs", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  upload: async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)

    const token = getToken()
    const response = await fetch(`${API_URL}/logs/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Upload failed")
    }

    return response.json()
  },
  delete: (id: string) =>
    apiClient(`/logs/${id}`, {
      method: "DELETE",
    }),
}
