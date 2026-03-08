import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }){
  const [user, setUser] = useState(null)
  const API = import.meta.env.VITE_API_URL || ''

  useEffect(()=>{
    // attempt to restore session
    fetch(`${API}/api/auth/me`, { credentials: 'include' })
      .then(r=>r.ok ? r.json() : Promise.reject(r))
      .then(data => { if (data.user) setUser(data.user) })
      .catch(()=>{})
  }, [])

  const login = async (email, password) => {
    const res = await fetch(`${API}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    })
    if (!res.ok) {
      const err = await res.json().catch(()=>({ error: 'login failed' }))
      throw err
    }
    const data = await res.json()
    setUser(data.user)
    return data
  }

  const register = async (email, password, name) => {
    const res = await fetch(`${API}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password, name })
    })
    if (!res.ok) {
      const err = await res.json().catch(()=>({ error: 'register failed' }))
      throw err
    }
    const data = await res.json()
    setUser(data.user)
    return data
  }

  const logout = async () => {
    await fetch(`${API}/api/auth/logout`, { method: 'POST', credentials: 'include' }).catch(()=>{})
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
