export default function TopBar() {

  return (
    <header className="h-14 bg-white border-b border-stone-200 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        <div className="flex items-center gap-2 bg-stone-100 rounded-lg px-3 py-1.5 border border-stone-200">
          <span className="text-stone-500 text-sm">📍</span>
          <select className="bg-transparent text-sm font-bold text-stone-700 outline-none cursor-pointer">
            <option>Kegalle Estate (All Blocks)</option>
            <option>Block A12</option>
            <option>Block B04</option>
            <option>Block C01</option>
          </select>
        </div>

        <div className="relative max-w-md w-full">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">🔍</span>
          <input 
            type="text" 
            placeholder="Search tree ID, block, or tapper..." 
            className="w-full bg-stone-100 border border-stone-200 text-sm rounded-lg pl-9 pr-4 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm font-bold text-stone-600 bg-stone-100 px-3 py-1.5 rounded-lg">
          📅 Today, Nov 12
        </div>

        <button className="relative p-2 text-stone-500 hover:text-stone-800 transition-colors">
          🔔
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>
  )
}
