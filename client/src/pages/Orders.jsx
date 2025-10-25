import React, { useEffect, useState } from 'react'
import { api } from '../lib.js'

export default function Orders(){
  const [orders, setOrders] = useState([])
  useEffect(() => {
    api.get('/orders').then(r => setOrders(r.data))
  }, [])

  return (
    <div>
      <h2>My Orders</h2>
      {!orders.length && <p>No orders yet.</p>}
      <div className="grid">
        {orders.map(o => (
          <div key={o._id} className="card">
            <div><b>Status:</b> <span className="badge">{o.status}</span></div>
            <div><b>Items:</b> {o.items.map(i => i.food?.name || i.food).join(', ')}</div>
            <div><b>Total:</b> ₹{o.total}</div>
            <div><b>Placed:</b> {new Date(o.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
