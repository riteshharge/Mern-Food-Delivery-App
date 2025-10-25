import React, { useEffect, useState } from 'react'
import searchIcon from '/images/search-icon.svg'
import { useLocation } from 'react-router-dom'
import { api } from '../lib.js'
import { toast } from 'react-toastify'

export default function Menu(){
  const [items, setItems] = useState([])
  const [filtered, setFiltered] = useState([])
  const loc = useLocation()
  const params = new URLSearchParams(loc.search)
  const qParam = params.get('q') || ''
  const [searchText, setSearchText] = useState(qParam)
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')||'[]'))

  useEffect(() => {
    api.get('/foods').then(r => setItems(r.data))
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const add = (food) => {
    setCart(prev => {
      const found = prev.find(i => i.food === food._id)
      if (found) return prev.map(i => i.food === food._id ? { ...i, qty: i.qty+1 } : i)
      return [...prev, { food: food._id, qty: 1, name: food.name, price: food.price }]
    })
    toast.success('✅ Added to Cart!')
  }

  useEffect(()=>{
    const s = (searchText||'').toLowerCase()
    if(!s) { setFiltered(items); return }
    setFiltered(items.filter(it=> (it.name||'').toLowerCase().includes(s) ))
  }, [items, searchText])

  return (
    <div>
      <h2>Menu</h2>
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:16}}>
        <img src={searchIcon} alt='search' style={{width:18,height:18,opacity:0.8}} />
        <input type='text' placeholder='Search food by name...' value={searchText} onChange={e=>setSearchText(e.target.value)} className='input' style={{width:200,padding:6,borderRadius:6}} />
      </div>
      <div className="grid">
        {filtered.map(f => (
          <div key={f._id} className="card">
            <img src={f.image||'https://placehold.co/400x240'} alt={f.name} style={{width:'100%',borderRadius:8}}/>
            <b>{f.name}</b>
            <small>{f.description}</small>
            <b>₹{f.price}</b>
            <button className="btn" onClick={()=>add(f)}>Add</button>
          </div>
        ))}
      </div>
    </div>
  )
}
