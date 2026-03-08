import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useSearch } from '../context/SearchContext'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/FullLogo.jpg'
import { motion } from 'framer-motion'

export default function Header() {
  const { items } = useCart()
  const { search, setSearch } = useSearch()
  const count = items.reduce((s, i) => s + i.qty, 0)
  const { user, logout } = useAuth()
  return (
    <motion.header initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="bg-gradient-to-r from-yellow-400 to-yellow-500 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="Vellique Logo" className="h-9 w-auto rounded-sm bg-white/80" />
              <span className="text-xl font-extrabold italic text-white tracking-tight">Vellique</span>
            </Link>

            <div className="hidden md:block">
              <div className="bg-white rounded-md flex items-center overflow-hidden shadow-sm">
                <input aria-label="search" className="px-4 py-2 w-96 focus:outline-none" placeholder="Search for products, brands and more" value={search} onChange={(e)=>setSearch(e.target.value)} />
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => {}} className="px-4 bg-blue-600 text-white">Search</motion.button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative inline-flex items-center px-3 py-2 bg-white/90 text-gray-800 rounded-md shadow-sm hover:shadow-md transition-shadow">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M3 3h2l.4 2M7 13h6l3-8H6.4"/></svg>
              <span className="ml-2 font-medium">Cart</span>
              <span className="ml-2 bg-red-600 text-white px-2 py-0.5 rounded text-sm">{count}</span>
            </Link>
            {!user ? (
              <Link to="/signin" className="text-white/90">Sign in</Link>
            ) : (
              <div className="flex items-center gap-3 text-white/95">
                <span className="text-sm">Hello, {user.name || user.email.split('@')[0]}</span>
                <button onClick={async ()=>{ await logout() }} className="bg-white/90 text-gray-800 px-3 py-1 rounded">Sign out</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  )
}
