import React, { useEffect, useState } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Menu from './pages/Menu.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import Orders from './pages/Orders.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Profile from './pages/Profile.jsx'
import EditProfile from './pages/EditProfile.jsx'
import { getToken, clearToken } from './lib.js'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { motion, useAnimation } from 'framer-motion'

// ================= Trail Animation =================
const Trail = ({ side = 'left', active }) => {
  const controls = useAnimation()
  useEffect(() => {
    if (active) {
      controls.start({
        x: side === 'left' ? [0, 100, 0] : [0, -100, 0],
        opacity: [0, 1, 0],
        transition: { duration: 1.2, ease: 'easeInOut' },
      })
    }
  }, [active])
  return (
    <motion.div
      animate={controls}
      style={{
        position: 'absolute',
        top: '50%',
        [side]: 0,
        width: 80,
        height: 3,
        borderRadius: 3,
        background:
          'linear-gradient(90deg, rgba(255,200,0,0.9), rgba(255,100,0,0.6), transparent)',
        boxShadow: '0 0 8px rgba(255,150,0,0.6)',
        transform: 'translateY(-50%)',
      }}
    />
  )
}

// ================= Navbar =================
const Navbar = () => {
  const navigate = useNavigate()
  const token = getToken()
  const [open, setOpen] = useState(false)
  const [trailActive, setTrailActive] = useState(false)

  const logout = () => {
    clearToken()
    navigate('/login')
  }

  useEffect(() => {
    setTrailActive(true)
    const timer = setTimeout(() => setTrailActive(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  const triggerHoverTrail = () => {
    setTrailActive(true)
    setTimeout(() => setTrailActive(false), 1500)
  }

  return (
    <div
      style={{
        width: '80%',
        background: 'rgba(0, 0, 0, 0.6)',
        color: '#fff',
        position: 'fixed',
        top: 0,
        left: '10%',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.8rem 2rem',
        backdropFilter: 'blur(6px)',
        borderRadius: 10,
      }}
    >
      <Trail side="left" active={trailActive} />
      <Trail side="right" active={trailActive} />

      <Link
        to="/"
        onMouseEnter={triggerHoverTrail}
        style={{ textDecoration: 'none' }}
      >
        <div
          style={{
            fontSize: '1.1rem',
            fontWeight: 'bold',
            color: '#fff',
            position: 'relative',
            transition: 'text-shadow 0.3s ease, transform 0.3s ease',
          }}
        >
          MERN Eats
        </div>
      </Link>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.2rem',
          position: 'relative',
        }}
      >
        <Link to="/menu" style={linkStyle}>Menu</Link>
        <Link to="/cart" style={linkStyle}>Cart</Link>
        <Link to="/orders" style={linkStyle}>Orders</Link>

        {token ? (
          <>
            <button
              onClick={() => setOpen((prev) => !prev)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              Profile ▾
            </button>
            {open && (
              <div style={dropdownMenu}>
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  style={dropdownLink}
                >
                  See Profile
                </Link>
                <Link
                  to="/edit-profile"
                  onClick={() => setOpen(false)}
                  style={dropdownLink}
                >
                  Edit Profile
                </Link>
                <hr style={{ margin: '0.4rem 0' }} />
                <button onClick={logout} style={logoutBtn}>Logout</button>
              </div>
            )}
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/signup" style={linkStyle}>Signup</Link>
          </>
        )}
      </div>
    </div>
  )
}

const linkStyle = {
  color: '#fff',
  textDecoration: 'none',
  fontWeight: 500,
  position: 'relative',
  transition: 'color 0.3s ease, transform 0.3s ease',
}

const dropdownMenu = {
  position: 'absolute',
  top: '2.8rem',
  right: 0,
  background: '#fff',
  minWidth: 180,
  borderRadius: 8,
  overflow: 'hidden',
  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
}

const dropdownLink = {
  display: 'block',
  padding: '0.6rem 1rem',
  textDecoration: 'none',
  color: '#000',
  fontWeight: 500,
  transition: 'background 0.25s ease, transform 0.2s ease',
}

const logoutBtn = {
  width: '100%',
  background: 'transparent',
  border: 'none',
  padding: '0.6rem 1rem',
  textAlign: 'left',
  cursor: 'pointer',
  color: '#d9534f',
  fontWeight: 600,
  transition: 'background 0.25s ease, transform 0.2s ease',
}

// ================= Main App =================
export default function App() {
  const [isFixedFooter, setIsFixedFooter] = useState(false)

  useEffect(() => {
    const footer = document.querySelector('.footer')
    if (!footer) return

    const updateFooter = () => {
      const docHeight = document.body.scrollHeight
      const winHeight = window.innerHeight

      if (docHeight <= winHeight) {
        setIsFixedFooter(true)
      } else {
        setIsFixedFooter(false)
      }
    }

    const resizeObserver = new ResizeObserver(updateFooter)
    resizeObserver.observe(document.body)

    window.addEventListener('resize', updateFooter)
    window.addEventListener('load', updateFooter)

    updateFooter()

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateFooter)
      window.removeEventListener('load', updateFooter)
    }
  }, [])

  return (
    <>
      <Navbar />

      <div
        className="container"
        style={{
          padding: '2.8rem 1rem 1rem', 
          minHeight: 'calc(100vh - 6rem)',
          marginTop: '0.1rem', 
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
        </Routes>
      </div>

      {/* ================= Footer ================= */}
      <div
        className="footer"
        style={{
          position: isFixedFooter ? 'fixed' : 'static',
          bottom: isFixedFooter ? 0 : 'auto',
          left: '10%',
          width: '80%',
          height: '3.2rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#fff',
          background: 'rgba(0, 0, 0, 0.6)',
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px',
          backdropFilter: 'blur(6px)',
          zIndex: 100,
          transition: 'all 0.3s ease',
          textAlign: 'center',
        }}
      >
        © {new Date().getFullYear()} MERN Eats
      </div>

      <ToastContainer position="top-center" autoClose={1500} />
    </>
  )
}
