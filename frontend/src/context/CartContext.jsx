import React, { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function useCart() {
  return useContext(CartContext)
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem('sam_cart')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('sam_cart', JSON.stringify(items))
  }, [items])

  function addToCart(product, qty = 1) {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === product.id)
      if (existing) {
        return prev.map((p) => (p.id === product.id ? { ...p, qty: p.qty + qty } : p))
      }
      return [...prev, { ...product, qty }]
    })
  }

  function removeFromCart(productId) {
    setItems((prev) => prev.filter((p) => p.id !== productId))
  }

  function updateQty(productId, qty) {
    setItems((prev) => prev.map((p) => (p.id === productId ? { ...p, qty } : p)))
  }

  function clearCart() {
    setItems([])
  }

  const total = items.reduce((s, it) => s + it.price * it.qty, 0)

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty, clearCart, total }}>
      {children}
    </CartContext.Provider>
  )
}

export default CartContext
