import { createContext, useContext, useState } from 'react'
import { getToken, getStoredUser, clearAuth } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => (getToken() ? getStoredUser() : null))

  const refreshAuth = () => {
    setUser(getToken() ? getStoredUser() : null)
  }

  const logout = () => {
    clearAuth()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, refreshAuth, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
