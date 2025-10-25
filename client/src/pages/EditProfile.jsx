import React, { useEffect, useState } from 'react'
import { api } from '../lib.js'
import { toast } from 'react-toastify'

export default function EditProfile({ user: initialUser, onSaved }) {
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'', addresses:[] })

  useEffect(() => {
    if (initialUser) {
      setForm({
        name: initialUser.name || '',
        email: initialUser.email || '',
        password: '',
        phone: initialUser.phone || '',
        addresses: Array.isArray(initialUser.addresses)
          ? initialUser.addresses.slice()
          : []
      })
    }
  }, [initialUser])

  function updateField(k, v) {
    setForm(prev => ({ ...prev, [k]: v }))
  }

  // Addresses handlers
  function addAddress(addr) {
    if (!addr || !addr.trim()) return
    setForm(prev => ({ ...prev, addresses: [...prev.addresses, addr.trim()] }))
  }

  function removeAddress(i) {
    setForm(prev => ({
      ...prev,
      addresses: prev.addresses.filter((_, idx) => idx !== i)
    }))
  }

  function editAddress(i, v) {
    setForm(prev => {
      const arr = prev.addresses.slice()
      arr[i] = v
      return { ...prev, addresses: arr }
    })
  }

  async function save() {
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        addresses: form.addresses,
      }
      if (form.password) payload.password = form.password

      const res = await api.put('/users/me', payload)
      toast.success('Profile updated')
      if (onSaved) onSaved(res.data)
    } catch (e) {
      console.error(e)

      // ✅ Check if it's a duplicate email error
      if (e.response?.status === 400 && e.response?.data?.message?.toLowerCase().includes('email')) {
        toast.error('Email already exists')
      } else {
        toast.error('Failed to save profile')
      }
    }
  }

  return (
    <div style={{ border: '1px solid #eee', padding: 12, borderRadius: 6 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div>
          <label>Name</label>
          <input
            className="input"
            value={form.name}
            onChange={e => updateField('name', e.target.value)}
          />
        </div>
        <div>
          <label>Email</label>
          <input
            className="input"
            value={form.email}
            onChange={e => updateField('email', e.target.value)}
          />
        </div>
        <div>
          <label>Password (leave blank to keep)</label>
          <input
            type="password"
            className="input"
            value={form.password}
            onChange={e => updateField('password', e.target.value)}
          />
        </div>
        <div>
          <label>Phone</label>
          <input
            className="input"
            value={form.phone}
            onChange={e => updateField('phone', e.target.value)}
          />
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <h4>Addresses</h4>
        <p>
          Use the textarea below to add a single multi-line address. You can add
          as many addresses as you want; they will be saved as an array and
          available at checkout.
        </p>
        <AddressEditor
          addresses={form.addresses}
          onAdd={addAddress}
          onRemove={removeAddress}
          onEdit={editAddress}
        />
      </div>

      <div style={{ marginTop: 12 }}>
        <button className="btn" onClick={save}>
          Save Profile
        </button>
      </div>
    </div>
  )
}

function AddressEditor({ addresses, onAdd, onRemove, onEdit }) {
  const [draft, setDraft] = React.useState('')

  return (
    <div>
      {addresses && addresses.length > 0 && (
        <div style={{ marginBottom: 8 }}>
          {addresses.map((a, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                gap: 8,
                alignItems: 'flex-start',
                marginBottom: 8,
              }}
            >
              <textarea
                className="input"
                rows={3}
                value={a}
                onChange={e => onEdit(idx, e.target.value)}
              />
              <div>
                <button
                  className="btn"
                  onClick={() => onRemove(idx)}
                  style={{ marginTop: 4 }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        <textarea
          className="input"
          rows={3}
          placeholder="Enter full address (multi-line)"
          value={draft}
          onChange={e => setDraft(e.target.value)}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            className="btn"
            onClick={() => {
              onAdd(draft)
              setDraft('')
            }}
          >
            Add Address
          </button>
        </div>
      </div>
    </div>
  )
}
