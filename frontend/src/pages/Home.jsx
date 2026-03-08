import React, { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { useSearch } from '../context/SearchContext'
import { getProducts } from '../utils/api'
import { motion } from 'framer-motion'

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 }
}

export default function Home(){
  const { search } = useSearch()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(()=>{
    let mounted = true
    getProducts().then(list => { if (mounted) setProducts(list) }).catch(()=>{}).finally(()=>{ if (mounted) setLoading(false) })
    return ()=>{ mounted = false }
  }, [])

  const q = (search || '').trim().toLowerCase()
  const list = q ? products.filter(p => (p.title + ' ' + p.description).toLowerCase().includes(q)) : products

  return (
    <motion.section initial="initial" animate="enter" exit="exit" variants={pageVariants} transition={{ duration: 0.32 }}>
      <h2 className="text-xl font-semibold mb-4">Products</h2>
      {loading ? (
        <div className="py-12 text-center text-gray-500">Loading products…</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </motion.section>
  )
}
