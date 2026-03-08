const API = import.meta.env.VITE_API_URL || ''

async function getProducts(){
  const res = await fetch(`${API}/api/products`)
  if (!res.ok) throw new Error('failed to fetch products')
  const data = await res.json()
  // map backend product shape to frontend shape
  return data.products.map(p => ({
    id: p.id,
    title: p.name,
    description: p.description || '',
    price: (p.priceCents || 0) / 100,
    image: p.imageUrl || '',
    sku: p.sku || ''
  }))
}

async function getProduct(id){
  const res = await fetch(`${API}/api/products/${id}`)
  if (!res.ok) throw new Error('failed to fetch product')
  const data = await res.json()
  const p = data.product
  return {
    id: p.id,
    title: p.name,
    description: p.description || '',
    price: (p.priceCents || 0) / 100,
    image: p.imageUrl || '',
    sku: p.sku || ''
  }
}

async function createOrder(items, total){
  const API_ITEMS = items.map(i => ({ productId: i.id, quantity: i.qty, unitCents: Math.round(i.price * 100) }))
  const res = await fetch(`${API}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ items: API_ITEMS, totalCents: Math.round(total * 100) })
  })
  const data = await res.json()
  if (!res.ok) throw data
  return data.order
}

export { getProducts, getProduct, createOrder }
