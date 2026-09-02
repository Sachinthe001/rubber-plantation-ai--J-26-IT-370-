import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth, type Role } from '../context/AuthContext'

export default function Login() {
  const { loginAs } = useAuth()
  const navigate = useNavigate()
  const [role, setRole] = useState<Role>('tapper')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [language, setLanguage] = useState<'ENG' | 'SIN'>('ENG')
  const [pinMode, setPinMode] = useState(false)
  const [pin, setPin] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    loginAs(role, identifier || (role === 'tapper' ? 'Sunanda (Master Tapper)' : 'Aruna Pathirana (Field Officer)'))
    navigate('/')
  }

  function handleQuickDemoLogin(demoRole: Role, demoName: string, demoUsername: string) {
    loginAs(demoRole, `${demoName} (${demoUsername})`)
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-950 via-stone-900 to-stone-950 px-4 py-8 font-sans text-stone-100">
      <div className="w-full max-w-md bg-stone-900/90 border-2 border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
        
        {/* Branding Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-black px-4 py-1 rounded-full uppercase tracking-wider">
            RubberSentry · Decision Support System
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center justify-center gap-2">
            <span>🌿</span>
            <span>RubberSentry Portal</span>
          </h1>
          <p className="text-stone-400 text-xs font-medium">
            {language === 'ENG'
              ? 'Risk-Aware AI Decision Support for Rubber Plantations'
              : 'තැටි මට්ටමේ රබර් වගා කළමනාකරණ පද්ධතිය'}
          </p>

          {/* Language Toggle Switch */}
          <div className="flex justify-center gap-1 pt-1">
            <button
              type="button"
              onClick={() => setLanguage('ENG')}
              className={`px-3 py-1 rounded-full text-[10px] font-black cursor-pointer ${
                language === 'ENG' ? 'bg-emerald-500 text-stone-950' : 'bg-stone-800 text-stone-400'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLanguage('SIN')}
              className={`px-3 py-1 rounded-full text-[10px] font-black cursor-pointer ${
                language === 'SIN' ? 'bg-emerald-500 text-stone-950' : 'bg-stone-800 text-stone-400'
              }`}
            >
              සිංහල
            </button>
          </div>
        </div>

        {/* 1-Tap Quick Demo Login Section */}
        <div className="bg-stone-950/80 border border-stone-800 p-4 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1">
              ⚡ {language === 'ENG' ? '1-Tap Quick Demo Login' : 'ක්ෂණික ප්‍රවේශය'}
            </span>
            <span className="text-[10px] text-stone-400">Select Role</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('tapper', 'Sunanda', 'TAP-4102')}
              className="bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 p-3 rounded-xl text-left cursor-pointer transition shadow hover:scale-[1.02]"
            >
              <p className="text-xs font-black text-emerald-300">👨‍🌾 Sunanda</p>
              <p className="text-[10px] font-bold text-stone-400">Master Tapper (TAP-4102)</p>
              <span className="inline-block bg-emerald-500/20 text-emerald-300 text-[9px] font-extrabold px-1.5 py-0.5 rounded mt-1">
                Block A12 · Kegalle
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('field_officer', 'Aruna Pathirana', 'OFF-108')}
              className="bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 p-3 rounded-xl text-left cursor-pointer transition shadow hover:scale-[1.02]"
            >
              <p className="text-xs font-black text-cyan-300">👔 Aruna Pathirana</p>
              <p className="text-[10px] font-bold text-stone-400">Field Officer (OFF-108)</p>
              <span className="inline-block bg-cyan-500/20 text-cyan-300 text-[9px] font-extrabold px-1.5 py-0.5 rounded mt-1">
                All 14 Blocks Supervised
              </span>
            </button>
          </div>
        </div>

        {/* Traditional Form Login */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Role Selector Pills */}
          <div>
            <label className="block text-xs font-bold text-stone-400 mb-1.5 uppercase">
              {language === 'ENG' ? 'Select Your Account Type' : 'ගිණුම් වර්ගය තෝරන්න'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('tapper')}
                className={`py-3 rounded-xl text-xs font-black border transition cursor-pointer flex items-center justify-center gap-2 ${
                  role === 'tapper'
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg shadow-emerald-900/40'
                    : 'bg-stone-800 text-stone-400 border-stone-700 hover:text-white'
                }`}
              >
                <span>👨‍🌾</span>
                <span>{language === 'ENG' ? 'Rubber Tapper' : 'රබර් කපන්නා'}</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('field_officer')}
                className={`py-3 rounded-xl text-xs font-black border transition cursor-pointer flex items-center justify-center gap-2 ${
                  role === 'field_officer'
                    ? 'bg-cyan-600 text-white border-cyan-400 shadow-lg shadow-cyan-900/40'
                    : 'bg-stone-800 text-stone-400 border-stone-700 hover:text-white'
                }`}
              >
                <span>👔</span>
                <span>{language === 'ENG' ? 'Field Officer' : 'ක්ෂේත්‍ර නිලධාරී'}</span>
              </button>
            </div>
          </div>

          {/* Login Input Fields */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">
                {role === 'tapper'
                  ? language === 'ENG' ? 'Tapper ID / Phone Number' : 'තට්ටු අංකය / දුරකථන'
                  : language === 'ENG' ? 'Officer ID / Email' : 'නිලධාරී අංකය / විද්‍යුත් තැපෑල'}
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={role === 'tapper' ? 'e.g. TAP-4102 or 0771234567' : 'e.g. OFF-108 or officer@rubber.lk'}
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-4 py-3 text-sm text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-stone-300">
                  {pinMode
                    ? language === 'ENG' ? '4-Digit Field PIN' : 'අංක 4 රහස් පින් අංකය'
                    : language === 'ENG' ? 'Password' : 'මුරපදය'}
                </label>
                <button
                  type="button"
                  onClick={() => setPinMode(!pinMode)}
                  className="text-[10px] font-bold text-emerald-400 hover:underline cursor-pointer"
                >
                  {pinMode ? 'Use Password' : 'Use Field 4-Digit PIN'}
                </button>
              </div>

              {pinMode ? (
                <input
                  type="password"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="••••"
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-4 py-3 text-center text-xl tracking-widest font-black text-emerald-400 placeholder-stone-600 focus:outline-none focus:border-emerald-500"
                />
              ) : (
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-4 py-3 text-sm text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500"
                />
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-sm py-3.5 rounded-xl cursor-pointer shadow-lg shadow-emerald-950/60 transition active:scale-[0.99]"
          >
            {language === 'ENG' ? 'Sign In to RubberSentry' : 'ප්‍රවේශ වන්න'} ➔
          </button>
        </form>

        <div className="pt-2 border-t border-stone-800 text-center text-xs text-stone-400">
          {language === 'ENG' ? "Don't have a field worker account?" : 'නව ගිණුමක් අවශ්‍යද?'}{' '}
          <Link to="/register" className="text-emerald-400 font-extrabold hover:underline">
            {language === 'ENG' ? 'Register New Profile' : 'ලියාපදිංචි වන්න'}
          </Link>
        </div>
      </div>
    </div>
  )
}