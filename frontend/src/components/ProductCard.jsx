import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatINR } from '../utils/format'
import { motion } from 'framer-motion'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-4 flex flex-col">
      <Link to={`/product/${product.id}`} className="h-48 bg-gray-50 rounded-md flex items-center justify-center mb-3 overflow-hidden">
        <motion.img
          src={product.image}
          alt={product.title}
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null
            e.target.src = 'https://placehold.co/600x400?text=Image+Unavailable'
          }}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
        />
      </Link>
      <div className="flex-1">
        <h3 className="text-md font-medium line-clamp-2">{product.title}</h3>
        <p className="text-sm text-gray-500 mt-2 line-clamp-2">{product.description}</p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">{formatINR(product.price)}</div>
          <div className="text-xs text-gray-400">Free delivery</div>
        </div>
        <motion.button
          onClick={() => addToCart(product, 1)}
          whileTap={{ scale: 0.95 }}
          className="ml-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-4 py-1 rounded shadow-md font-semibold hover:from-yellow-500 hover:to-yellow-600"
        >
          Add
        </motion.button>
      </div>
    </motion.div>
  )
}
