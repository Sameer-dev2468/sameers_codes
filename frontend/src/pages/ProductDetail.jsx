import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatINR } from '../utils/format'
import { motion } from 'framer-motion'
import { getProduct } from '../utils/api'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { user } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(()=>{
    let mounted = true
    getProduct(id).then(p=>{ if (mounted) setProduct(p) }).catch(err=>{ if (mounted) setError(err?.error || err?.message || 'Failed to load') }).finally(()=>{ if (mounted) setLoading(false) })
    return ()=>{ mounted = false }
  }, [id])

  if (loading) return <div className="p-8">Loading…</div>
  if (error) return <div className="p-8 text-red-600">{error}</div>
  if (!product) return <div className="p-8">Product not found</div>

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gray-100 rounded-md flex items-center justify-center p-4">
          <motion.img src={product.image} alt={product.title} className="max-w-full" whileHover={{ scale: 1.02 }} />
        </motion.div>
        <div>
          <h1 className="text-2xl font-semibold">{product.title}</h1>
          {/* rating/reviews not provided by backend; show if present */}
          {product.rating && (
            <div className="mt-2 flex items-center gap-3 text-sm text-yellow-600">
              <div className="font-semibold">{product.rating} ★</div>
              <div className="text-gray-500">({product.reviews || 0} reviews)</div>
            </div>
          )}
          <p className="mt-4 text-gray-700">{product.description}</p>
          <div className="mt-6 text-2xl font-bold">{formatINR(product.price)}</div>
          <div className="mt-6 flex gap-3">
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => { addToCart(product, 1) }} className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-4 py-2 rounded font-semibold shadow-md">Add to cart</motion.button>
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => { addToCart(product, 1); if (!user) { const next = encodeURIComponent('/cart'); navigate(`/signin?next=${next}`); } else { navigate('/cart') } }} className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded shadow-md">Buy now</motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}
