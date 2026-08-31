import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/yield', label: 'Yield Forecast' },
  { to: '/disease', label: 'Disease Detection' },
  { to: '/tpd', label: 'TPD Monitoring' },
  { to: '/tapping', label: 'Tapping Quality' },
]

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-emerald-700 text-white">
      <span className="text-lg font-semibold">RubberAI</span>
      <div className="flex gap-6 text-sm">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              isActive ? 'underline font-semibold' : 'hover:underline'
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}