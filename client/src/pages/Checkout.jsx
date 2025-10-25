import React, { useEffect, useState } from 'react'
import { api } from '../lib.js'
import { toast } from 'react-toastify'

export default function Checkout() {
  const [cart, setCart] = useState([])
  const [user, setUser] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [newAddress, setNewAddress] = useState('')
  const [total, setTotal] = useState(0)

  // 🧠 Fetch user profile and price cart items
  useEffect(() => {
    async function loadData() {
      try {
        const userRes = await api.get('/users/me')
        setUser(userRes.data)

        // Example cart items (replace with your stored cart if available)
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]')

        if (localCart.length > 0) {
          const res = await api.post('/cart/price', { items: localCart })
          setCart(res.data.items)
          setTotal(res.data.total)
        } else {
          setCart([])
          setTotal(0)
        }
      } catch (e) {
        console.error('Cart or user fetch error:', e)
      }
    }
    loadData()
  }, [])

  // 🧠 Place order
  async function place() {
    try {
      const address =
        selectedIndex !== null && user && Array.isArray(user.addresses)
          ? user.addresses[selectedIndex]
          : newAddress && newAddress.trim()
          ? newAddress.trim()
          : null

      if (!address) {
        toast.error('Please select or enter an address')
        return
      }

      if (!cart.length) {
        toast.error('Your cart is empty')
        return
      }

      await api.post('/orders', { items: cart, address })
      toast.success('Order placed successfully')

      // clear cart after placing order
      localStorage.removeItem('cart')
      setCart([])
      setTotal(0)
    } catch (e) {
      console.error('Order error:', e.response?.data || e.message)
      toast.error('Failed to place order')
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: '20px auto' }}>
      <h2>Checkout</h2>

      {/* 🛒 Cart Summary */}
      <div style={{ marginBottom: 20 }}>
        <h3>Your Cart</h3>
        {cart.length > 0 ? (
          <ul>
            {cart.map((item, idx) => (
              <li key={idx}>
                Food Name: {item.foodName} — Qty: {item.qty} — ₹{item.subtotal}
              </li>
            ))}
          </ul>
        ) : (
          <p>No items in cart.</p>
        )}
        <p><b>Total:</b> ₹{total}</p>
      </div>

      {/* 📍 Address Section */}
      <div>
        <h3>Choose saved address</h3>
        {user && Array.isArray(user.addresses) && user.addresses.length > 0 ? (
          <div>
            {user.addresses.map((a, idx) => (
              <label
                key={idx}
                style={{
                  display: 'block',
                  padding: 8,
                  border: '1px solid #ddd',
                  borderRadius: 6,
                  marginBottom: 8,
                  cursor: 'pointer',
                  whiteSpace: 'pre-wrap'
                }}
              >
                <input
                  type="radio"
                  name="addr"
                  checked={selectedIndex === idx}
                  onChange={() => {
                    setSelectedIndex(idx)
                    setNewAddress('')
                  }}
                />{' '}
                <span style={{ marginLeft: 8 }}>
                  {typeof a === 'string' ? a : a.full || JSON.stringify(a)}
                </span>
              </label>
            ))}
          </div>
        ) : (
          <p>No saved addresses.</p>
        )}

        <div style={{ marginTop: 12 }}>
          <h3>Or enter a new address</h3>
          <textarea
            className="input"
            rows="4"
            placeholder="Enter full multi-line address"
            value={newAddress}
            onChange={e => {
              setNewAddress(e.target.value)
              setSelectedIndex(null)
            }}
          />
        </div>

        <button className="btn" onClick={place} style={{ marginTop: 12 }}>
          Place Order
        </button>
      </div>
    </div>
  )
}
