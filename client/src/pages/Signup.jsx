import React, { useState } from 'react'
import { api, setToken } from '../lib.js'
import { useNavigate } from 'react-router-dom'

export default function Signup(){
  const [name,setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/auth/signup', { name, email, password })
      setToken(res.data.token)
      nav('/')
    } catch (e) { alert(e.response?.data?.message || e.message) }
  }
  return (
    <form onSubmit={submit} style={{maxWidth:420,margin:'1rem auto'}}>
      <h2>Signup</h2>
      <input className="input" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
      <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{marginTop:8}}/>
      <input type="password" className="input" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} style={{marginTop:8}}/>
      <button className="btn" style={{marginTop:12}}>Create Account</button>
    </form>
  )
}
