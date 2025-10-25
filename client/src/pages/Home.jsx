import React from 'react'
import { Link } from 'react-router-dom'

export default function Home(){
  return (
    <div>
      <h1>Crave it. Tap it. Get it.</h1>
      <p>Fresh meals delivered fast. Explore our curated menu.</p>
      <p><Link className="btn" to="/menu">Browse Menu</Link></p>
      <div className="grid" style={{marginTop:'1rem'}}>
        <div className="card"><b>Fast Delivery</b><span className="badge">~30 min</span></div>
        <div className="card"><b>Great Offers</b><span className="badge">Save on combos</span></div>
        <div className="card"><b>Fresh & Hygienic</b><span className="badge">Verified kitchens</span></div>
      </div>
    </div>
  )
}
