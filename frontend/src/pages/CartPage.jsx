import React, { useState } from 'react'
import { useCart } from '../context/CartContext'
import { formatINR } from '../utils/format'
import { motion } from 'framer-motion'
import { createOrder } from '../utils/api'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 }
}

export default function CartPage() {
  const { items, updateQty, removeFromCart, total, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { user } = useAuth()

  if (!items.length) return (
    <div className="max-w-4xl mx-auto p-8">Your cart is empty.</div>
  )

  return (
    <motion.div initial="initial" animate="enter" exit="exit" variants={pageVariants} transition={{ duration: 0.32 }} className="max-w-4xl mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
      <div className="space-y-4">
        {items.map((it) => (
          <motion.div key={it.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-center bg-white p-4 rounded shadow">
            <motion.img src={it.image} alt={it.title} className="w-24 h-24 object-cover rounded mr-4" whileHover={{ scale: 1.03 }} />
            <div className="flex-1">
              <div className="font-medium">{it.title}</div>
              <div className="text-sm text-gray-600">{formatINR(it.price)}</div>
              <div className="mt-2 flex items-center gap-2">
                <button onClick={() => updateQty(it.id, Math.max(1, it.qty - 1))} className="px-2 bg-gray-200 rounded">-</button>
                <input type="number" min="1" value={it.qty} onChange={(e) => updateQty(it.id, Math.max(1, Number(e.target.value)))} className="w-20 border rounded px-2 py-1" />
                <button onClick={() => updateQty(it.id, it.qty + 1)} className="px-2 bg-gray-200 rounded">+</button>
              </div>
            </div>
            <div className="ml-4 text-right">
              <div className="font-semibold">{formatINR(it.price * it.qty)}</div>
              <button onClick={() => removeFromCart(it.id)} className="text-sm text-red-600 mt-2">Remove</button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div>
          <button onClick={clearCart} className="text-sm text-gray-600">Clear cart</button>
        </div>
        <div className="text-xl font-bold">Total: {formatINR(total)}</div>
      </div>

      <div className="mt-4">
        <button disabled={loading} onClick={async ()=>{
          // require auth for checkout; redirect to signin if not authed
          if (!user) {
            const next = encodeURIComponent('/cart')
            navigate(`/signin?next=${next}`)
            return
          }
          setLoading(true); setError(null)
          try {
            const order = await createOrder(items, total)
            clearCart()
            navigate('/')
            alert('Order placed — id: ' + order.id)
          } catch (err) {
            setError(err?.error || err?.message || 'Order failed')
          } finally { setLoading(false) }
        }} className="bg-green-600 text-white px-4 py-2 rounded">{loading ? 'Placing order…' : 'Proceed to checkout'}</button>
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </div>
    </motion.div>
  )
}
