import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useLocation } from 'react-router-dom'

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 }
}

export default function SignIn(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { login, register } = useAuth()
  const { items } = useCart()
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const nextParam = params.get('next')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await login(email, password)
      // respect explicit next param first, then cart, then home
      if (nextParam) navigate(nextParam)
      else if (items && items.length) navigate('/cart')
      else navigate('/')
    } catch (err) {
      setError(err?.error || 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <motion.div initial="initial" animate="enter" exit="exit" variants={pageVariants} transition={{ duration: 0.32 }} className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Sign in</h2>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-700">Email</label>
          <input required value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full border px-3 py-2 rounded" type="email" />
        </div>
        <div>
          <label className="block text-sm text-gray-700">Password</label>
          <input required value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full border px-3 py-2 rounded" type="password" />
        </div>
        <div className="flex items-center justify-between">
          <button disabled={loading} type="submit" className="bg-yellow-500 px-4 py-2 rounded font-semibold">{loading ? 'Signing in...' : 'Sign in'}</button>
        </div>
        {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
      </form>
    </motion.div>
  )
}
