import { createContext, useContext, useState } from 'react'
import { login as loginApi } from '../api/client'
import { decodeToken } from '../utils/jwt'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('vaaniglove_token'))

  async function login(email, password) {
    const response = await loginApi(email, password)
    const newToken = response.data.token
    localStorage.setItem('vaaniglove_token', newToken)
    setToken(newToken)
  }

  function logout() {
    localStorage.removeItem('vaaniglove_token')
    setToken(null)
  }

  const decoded = token ? decodeToken(token) : null
  const userId = decoded ? decoded.sub : null

  return (
    <AuthContext.Provider value={{ token, userId, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}