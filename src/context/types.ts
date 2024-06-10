export type Login = {
    email: string
    password: string
  }

export type AuthProvider = {
    login: (params: Login, error: (err: string) => void) => void
    logout: () => void
    confirmAuth: () => void
}