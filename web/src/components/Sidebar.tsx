import { NavLink, useLocation } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Home Queue', icon: '📥', count: 14 },
  { to: '/yield', label: 'Yield Decisions', icon: '⏱️', count: 3 },
  { to: '/disease', label: 'Disease Cases', icon: '🦠', count: 5 },
  { to: '/tpd', label: 'Panel & TPD', icon: '🌳', count: 2 },
  { to: '/tapping', label: 'Tapping Quality', icon: '🔪', count: 4 },
  { type: 'divider' },
  { to: '/registry', label: 'Trees & Blocks', icon: '📋' },
  { to: '/map', label: 'Map', icon: '🗺️' },
  { to: '/analytics', label: 'Analytics', icon: '📈' },
  { to: '/model-health', label: 'Model Health', icon: '🤖' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="w-64 h-screen bg-stone-900 border-r border-stone-800 flex flex-col fixed left-0 top-0">
      <div className="h-14 flex items-center px-4 border-b border-stone-800">
        <div className="flex items-center gap-2 text-white font-black text-lg tracking-tight">
          <span className="bg-emerald-500 text-stone-950 p-1 rounded text-sm leading-none">🌿</span>
          <span>RubberSentry</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-1 px-3">
        {navItems.map((item, index) => {
          if (item.type === 'divider') {
            return <div key={`div-${index}`} className="my-2 h-px bg-stone-800 mx-2" />
          }

          const isActive = item.to ? (location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to))) : false

          return (
            <NavLink
              key={item.to}
              to={item.to || '#'}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive 
                  ? 'bg-emerald-500/10 text-emerald-400 font-bold' 
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.count !== undefined && item.count > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-stone-800 text-stone-400'
                }`}>
                  {item.count}
                </span>
              )}
            </NavLink>
          )
        })}
      </div>

      <div className="p-4 border-t border-stone-800">
        <div className="flex items-center gap-3 bg-stone-800/50 p-3 rounded-lg border border-stone-700/50">
          <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-sm font-bold text-white">
            FO
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white leading-tight">Sunanda K.G.</span>
            <span className="text-xs text-stone-400 leading-tight">Field Officer</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
