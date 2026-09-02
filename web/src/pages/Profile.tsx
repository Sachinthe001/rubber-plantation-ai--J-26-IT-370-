import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { currentUser, updateProfile, logout } = useAuth()
  const isOfficer = currentUser?.role === 'field_officer'

  const [name, setName] = useState(currentUser?.name || '')
  const [phone, setPhone] = useState(currentUser?.phone || '0771234567')
  const [email, setEmail] = useState(currentUser?.email || 'worker@rubber.lk')
  const [estate, setEstate] = useState(currentUser?.estate || 'Kegalle Rubber Estate - Block A12')
  const [language, setLanguage] = useState<'ENG' | 'SIN'>('ENG')
  const [savedSuccess, setSavedSuccess] = useState(false)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    updateProfile({ name, phone, email, estate })
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans text-stone-900 pb-12">
      {/* Header Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden ${
        isOfficer
          ? 'bg-gradient-to-r from-stone-900 via-stone-900 to-cyan-950 border-2 border-cyan-500/40'
          : 'bg-gradient-to-r from-stone-900 via-stone-900 to-emerald-950 border-2 border-emerald-500/40'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black shadow-lg ${
              isOfficer ? 'bg-cyan-500 text-stone-950' : 'bg-emerald-500 text-stone-950'
            }`}>
              {isOfficer ? '👔' : '👨‍🌾'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                  isOfficer
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                }`}>
                  {isOfficer ? 'Field Officer Profile' : 'Rubber Tapper Profile'}
                </span>
                <span className="text-xs font-mono text-stone-400 font-bold">
                  {currentUser?.username || 'TAP-4102'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black mt-0.5">{currentUser?.name || 'Sunanda'}</h1>
              <p className="text-stone-300 text-xs mt-0.5">
                {estate}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold text-xs px-4 py-2 rounded-xl cursor-pointer transition shadow"
          >
            Log Out Account 🚪
          </button>
        </div>
      </div>

      {/* Role-Aware Performance Summary Cards */}
      {isOfficer ? (
        /* Field Officer Performance Dashboard */
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white border-2 border-stone-200 p-4 rounded-2xl shadow-sm">
            <p className="text-[10px] font-bold text-stone-500 uppercase">Supervised Blocks</p>
            <p className="text-2xl font-black text-stone-900 mt-1">14 Blocks</p>
            <p className="text-[10px] text-stone-400 font-semibold mt-0.5">1,420 Trees Monitored</p>
          </div>
          <div className="bg-white border-2 border-cyan-200 p-4 rounded-2xl shadow-sm">
            <p className="text-[10px] font-bold text-stone-500 uppercase">AI Override Accuracy</p>
            <p className="text-2xl font-black text-cyan-600 mt-1">96.4%</p>
            <p className="text-[10px] text-emerald-600 font-bold mt-0.5">High Model Agreement</p>
          </div>
          <div className="bg-white border-2 border-stone-200 p-4 rounded-2xl shadow-sm">
            <p className="text-[10px] font-bold text-stone-500 uppercase">Assigned Tappers</p>
            <p className="text-2xl font-black text-stone-900 mt-1">12 Tappers</p>
            <p className="text-[10px] text-stone-400 font-semibold mt-0.5">Active under supervision</p>
          </div>
          <div className="bg-white border-2 border-amber-200 p-4 rounded-2xl shadow-sm">
            <p className="text-[10px] font-bold text-stone-500 uppercase">Agronomic Level</p>
            <p className="text-2xl font-black text-amber-600 mt-1">Senior</p>
            <p className="text-[10px] text-stone-400 font-semibold mt-0.5">Certified Officer Level III</p>
          </div>
        </div>
      ) : (
        /* Rubber Tapper Performance Dashboard */
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white border-2 border-stone-200 p-4 rounded-2xl shadow-sm">
            <p className="text-[10px] font-bold text-stone-500 uppercase">Assigned Block</p>
            <p className="text-2xl font-black text-stone-900 mt-1">Block A12</p>
            <p className="text-[10px] text-stone-400 font-semibold mt-0.5">Kegalle Division 1</p>
          </div>
          <div className="bg-white border-2 border-emerald-200 p-4 rounded-2xl shadow-sm">
            <p className="text-[10px] font-bold text-stone-500 uppercase">Workmanship Rating</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">4.9 ⭐</p>
            <p className="text-[10px] text-emerald-700 font-bold mt-0.5">Grade A Acceptable Cut</p>
          </div>
          <div className="bg-white border-2 border-stone-200 p-4 rounded-2xl shadow-sm">
            <p className="text-[10px] font-bold text-stone-500 uppercase">Daily Tapping Target</p>
            <p className="text-2xl font-black text-stone-900 mt-1">140 Trees</p>
            <p className="text-[10px] text-stone-400 font-semibold mt-0.5">Avg 1.25 kg/tree</p>
          </div>
          <div className="bg-white border-2 border-amber-200 p-4 rounded-2xl shadow-sm">
            <p className="text-[10px] font-bold text-stone-500 uppercase">Tapper Status</p>
            <p className="text-2xl font-black text-amber-600 mt-1">Master</p>
            <p className="text-[10px] text-stone-400 font-semibold mt-0.5">Certified Panel Specialist</p>
          </div>
        </div>
      )}

      {/* Editable Account Profile Form */}
      <div className="bg-white border-2 border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h2 className="text-lg font-extrabold text-stone-900">Personal &amp; Field Settings</h2>
            <p className="text-xs text-stone-500">Update contact details, language preferences and notifications</p>
          </div>
          <span className="bg-stone-100 text-stone-700 font-bold text-xs px-3 py-1 rounded-full">
            Role: {isOfficer ? 'Field Officer' : 'Rubber Tapper'}
          </span>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-2.5 text-stone-900 font-bold outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Phone Number (SMS Task Alerts)</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-2.5 text-stone-900 font-bold outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-2.5 text-stone-900 font-bold outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Assigned Plantation &amp; Division</label>
              <input
                type="text"
                value={estate}
                onChange={(e) => setEstate(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-2.5 text-stone-900 font-bold outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Voice Guidance &amp; UI Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'ENG' | 'SIN')}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-2.5 text-stone-900 font-bold outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="ENG">English (ENG)</option>
                <option value="SIN">සිංහල (Sinhala Voice TTS)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Emergency Estate Hotline</label>
              <input
                type="text"
                readOnly
                value="📞 +94 (35) 222-4091 (Kegalle Manager HQ)"
                className="w-full bg-stone-100 border border-stone-300 rounded-xl px-4 py-2.5 text-stone-600 font-bold cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            {savedSuccess ? (
              <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg">
                ✅ Profile Settings Updated Successfully!
              </span>
            ) : (
              <span className="text-xs text-stone-500 font-semibold">Changes persist across app sessions</span>
            )}
            <button
              type="submit"
              className="bg-stone-900 hover:bg-stone-800 text-white font-extrabold text-xs px-6 py-3 rounded-xl cursor-pointer shadow transition"
            >
              Save Profile Changes 💾
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
