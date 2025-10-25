import React, { useEffect, useState } from 'react'
import { api } from '../lib.js'
import { Link } from 'react-router-dom'

export default function Cart(){
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')||'[]'))
  const [priced, setPriced] = useState({ items: [], total: 0 })

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
    if (cart.length){
      api.post('/cart/price', { items: cart }).then(r => setPriced(r.data))
    } else {
      setPriced({ items:[], total:0 })
    }
  }, [cart])

  const inc = id => setCart(c => c.map(i => i.food===id ? { ...i, qty: i.qty+1 } : i))
  const dec = id => setCart(c => c.map(i => i.food===id ? { ...i, qty: Math.max(1,i.qty-1) } : i))
  const rm = id => setCart(c => c.filter(i => i.food!==id))

  return (
    <div>
      <h2>Your Cart</h2>
      {!cart.length && <p>Cart is empty. <Link to="/menu">Add items</Link>.</p>}
      <div className="grid">
        {cart.map(i => (
          <div key={i.food} className="card">
            <b>{i.name}</b>
            <div>Qty:
              <button onClick={()=>dec(i.food)} style={{marginLeft:8}}>-</button>
              <span style={{margin:'0 8px'}}>{i.qty}</span>
              <button onClick={()=>inc(i.food)}>+</button>
            </div>
            <button onClick={()=>rm(i.food)}>Remove</button>
          </div>
        ))}
      </div>
      <div style={{marginTop:16}}><b>Total: ₹{priced.total}</b></div>
      {cart.length ? <p><Link className="btn" to="/checkout">Checkout</Link></p> : null}
    </div>
  )
}
