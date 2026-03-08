import React from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { CartProvider } from './context/CartContext'
import { SearchProvider } from './context/SearchContext'
import { AuthProvider } from './context/AuthContext'
import Header from './components/Header'
import products from './data/products'
import ProductCard from './components/ProductCard'
import ProductDetail from './pages/ProductDetail'
import CartPage from './pages/CartPage'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import Footer from './components/Footer'

export default function App() {
  function RouterRoutes(){
    const location = useLocation()
    return (
      <>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <div className="bg-white">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Welcome to Vellique</h2>
                  <p className="text-sm text-gray-600">Great deals on trending products — curated for you</p>
                </div>
                <div className="hidden md:block">
                  <div className="bg-gray-100 rounded-md px-4 py-2 text-sm">Free delivery over $50 • 24/7 Support</div>
                </div>
              </div>
            </div>
          </div>
          <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home/>} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/signin" element={<SignIn />} />
              </Routes>
            </AnimatePresence>
          </main>
          <Footer />
        </div>
      </>
    )
  }

  return (
    <BrowserRouter>
      <SearchProvider>
        <AuthProvider>
          <CartProvider>
            <RouterRoutes />
          </CartProvider>
        </AuthProvider>
      </SearchProvider>
    </BrowserRouter>
  )
}
