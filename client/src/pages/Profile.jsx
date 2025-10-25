
import React, { useEffect, useState } from 'react'
import EditProfile from './EditProfile'
import { api } from '../lib.js'
import { toast } from 'react-toastify'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [view, setView] = useState('see') // 'see' or 'edit'
  useEffect(() => {
    api.get('/users/me').then(r => setUser(r.data)).catch(e => {
      console.error(e); toast.error('Failed to load profile')
    })
  }, [])

  if (!user) return <div>Loading...</div>

  return (
    <div style={{maxWidth:800, margin:'20px auto'}}>
      <h2>Profile</h2>
      <div style={{display:'flex', gap:8, marginBottom:12}}>
        <button className={'btn' + (view==='see' ? ' active' : '')} onClick={()=>setView('see')}>See Profile</button>
        <button className={'btn' + (view==='edit' ? ' active' : '')} onClick={()=>setView('edit')}>Edit Profile</button>
      </div>

      {view === 'see' && (
        <div>
          <h3>Basic info</h3>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          {user.phone && <p><strong>Phone:</strong> {user.phone}</p>}

          <h3 style={{marginTop:16}}>Addresses</h3>
          {Array.isArray(user.addresses) && user.addresses.length>0 ? (
            <div>
              {user.addresses.map((a,idx)=>(
                <div key={idx} style={{border:'1px solid #ddd', padding:8, borderRadius:6, marginBottom:8, whiteSpace:'pre-wrap'}}>
                  {typeof a === 'string' ? a : (a.full || JSON.stringify(a))}
                </div>
              ))}
            </div>
          ) : <p>No addresses saved.</p>}
        </div>
      )}

      {view === 'edit' && (
        <EditProfile user={user} onSaved={(updated)=>{ setUser(updated); setView('see'); }} />
      )}
    </div>
  )
}
