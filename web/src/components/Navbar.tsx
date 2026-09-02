import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const adminLinks = [
  { to: '/', label: 'Officer Studio' },
  { to: '/yield', label: 'Yield Forecast' },
  { to: '/disease', label: 'Disease Referral' },
  { to: '/tpd', label: 'TPD Monitoring' },
  { to: '/tapping', label: 'Tapping Quality' },
  { to: '/profile', label: 'Officer Profile' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { currentUser, logout } = useAuth()
  const links = adminLinks
  const roleLabel = 'Field Officer'

  return (
    <nav className="bg-emerald-900 text-white border-b-2 border-emerald-500/30 sticky top-0 z-40 shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3.5">
        <NavLink to="/" className="flex items-center gap-2 font-black text-xl text-white tracking-tight">
          <span className="bg-emerald-500 text-stone-950 p-1 rounded-lg text-sm">🌿</span>
          <span>RubberSentry</span>
        </NavLink>

        <div className="hidden md:flex items-center gap-5 text-xs font-extrabold">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                isActive
                  ? 'text-emerald-400 font-black border-b-2 border-emerald-400 pb-1'
                  : 'text-stone-300 hover:text-white transition'
              }
            >
              {link.label}
            </NavLink>
          ))}

          <span className="w-px h-4 bg-stone-700" />

          {/* Profile User Badge */}
          <NavLink
            to="/profile"
            className="flex items-center gap-2 bg-stone-800 hover:bg-stone-750 px-3 py-1.5 rounded-full border border-stone-700 transition"
          >
            <span className="text-sm">{isAdminSide ? '👔' : '👨‍🌾'}</span>
            <span className="text-stone-200 font-bold">
              {currentUser?.name || 'User'} <span className="text-[10px] text-emerald-400 font-black">({roleLabel})</span>
            </span>
          </NavLink>

          <button
            onClick={logout}
            className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 px-3 py-1.5 rounded-full cursor-pointer transition"
          >
            Log out 🚪
          </button>
        </div>

        <button
          className="md:hidden text-xs font-bold border border-stone-700 bg-stone-800 rounded-xl px-3.5 py-2 cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          {open ? '✕ Close' : '☰ Menu'}
        </button>
      </div>

      {open && (
        <div className="md:hidden flex flex-col gap-2 px-6 pb-4 pt-2 text-xs font-bold bg-emerald-900 border-t border-emerald-800">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                isActive ? 'text-emerald-400 font-black py-1.5' : 'text-stone-300 py-1.5'
              }
            >
              {link.label}
            </NavLink>
          ))}
          <button onClick={logout} className="text-left text-rose-400 py-1.5 font-black">
            Log out 🚪
          </button>
        </div>
      )}
    </nav>
  )
}