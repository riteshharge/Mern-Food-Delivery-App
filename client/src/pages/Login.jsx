import React, { useState } from 'react'
import { api, setToken } from '../lib.js'
import { useNavigate, Link } from 'react-router-dom'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/auth/login', { email, password })
      setToken(res.data.token)
      nav('/')
    } catch (e) { alert(e.response?.data?.message || e.message) }
  }
  return (
    <form onSubmit={submit} style={{maxWidth:420,margin:'1rem auto'}}>
      <h2>Login</h2>
      <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input type="password" className="input" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} style={{marginTop:8}}/>
      <button className="btn" style={{marginTop:12}}>Login</button>
      <p style={{marginTop:8}}>No account? <Link to="/signup">Sign up</Link></p>
    </form>
  )
}
