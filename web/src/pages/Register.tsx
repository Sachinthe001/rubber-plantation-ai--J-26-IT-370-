import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth, type Role } from '../context/AuthContext'
import { districts } from '../data/districts'

type FormState = {
  name: string
  nic: string
  dob: string
  district: string
  area: string
  phone: string
  email: string
  estate: string
  password: string
  confirmPassword: string
}

const initialForm: FormState = {
  name: '', nic: '', dob: '', district: '', area: '', phone: '', email: '', estate: '', password: '', confirmPassword: '',
}

export default function Register() {
  const navigate = useNavigate()
  const { registerAs } = useAuth()
  const [role, setRole] = useState<Role>('tapper')
  const [form, setForm] = useState<FormState>(initialForm)
  const [username, setUsername] = useState<string | null>(null)
  const [language, setLanguage] = useState<'ENG' | 'SIN'>('ENG')

  function updateField(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const profile = registerAs({
      name: form.name || (role === 'tapper' ? 'New Rubber Tapper' : 'New Field Officer'),
      nic: form.nic,
      dob: form.dob,
      district: form.district || 'Kegalle',
      area: form.area || 'Division 1',
      phone: form.phone,
      email: form.email,
      estate: form.estate || 'Kegalle Rubber Estate',
      role,
    })
    setUsername(profile.username)
  }

  if (username) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-950 via-stone-900 to-stone-950 px-4 py-8 font-sans text-stone-100">
        <div className="w-full max-w-md bg-stone-900/90 border-2 border-emerald-500/40 rounded-3xl p-8 text-center space-y-6 shadow-2xl backdrop-blur-xl">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl border border-emerald-500/40">
            🎉
          </div>
          <div>
            <span className="bg-emerald-500/20 text-emerald-300 font-extrabold text-[10px] px-3 py-1 rounded-full uppercase">
              Registration Successful
            </span>
            <h1 className="text-2xl font-black text-white mt-2">Welcome to RubberSentry</h1>
            <p className="text-stone-300 text-xs mt-1">
              Your System ID has been generated:
            </p>
          </div>

          <div className="bg-stone-950 border-2 border-emerald-500/50 p-4 rounded-2xl">
            <p className="text-[10px] text-stone-400 font-bold uppercase">System Worker ID</p>
            <p className="text-3xl font-black text-emerald-400 font-mono tracking-wider mt-0.5">{username}</p>
            <p className="text-[10px] text-stone-400 mt-1">Use this ID or phone number to log in anywhere</p>
          </div>

          <button
            onClick={() => navigate('/')}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-sm py-3.5 rounded-xl cursor-pointer shadow-lg transition"
          >
            Enter RubberSentry Studio ➔
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-950 via-stone-900 to-stone-950 px-4 py-10 font-sans text-stone-100">
      <form onSubmit={handleSubmit} className="w-full max-w-xl bg-stone-900/90 border-2 border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-black px-3 py-1 rounded-full uppercase">
              Worker Onboarding
            </span>
            <button
              type="button"
              onClick={() => setLanguage(language === 'ENG' ? 'SIN' : 'ENG')}
              className="bg-stone-800 text-stone-300 text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer hover:bg-stone-700"
            >
              {language === 'ENG' ? 'සිංහල' : 'English'}
            </button>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Create RubberSentry Worker Account</h1>
          <p className="text-xs text-stone-400">
            {language === 'ENG'
              ? 'Join the Risk-Aware Rubber Plantation AI Network'
              : 'රබර් වතු ක්ෂේත්‍ර ජාලයට එකතු වන්න'}
          </p>
        </div>

        {/* Role Selection */}
        <div>
          <label className="block text-xs font-bold text-stone-400 mb-1.5 uppercase">
            Account Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('tapper')}
              className={`p-3.5 rounded-2xl border text-left cursor-pointer transition ${
                role === 'tapper'
                  ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-lg'
                  : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2 font-black text-sm text-emerald-400">
                <span>👨‍🌾</span>
                <span>Rubber Tapper</span>
              </div>
              <p className="text-[10px] text-stone-400 mt-1">Field tapping quality, bark audit &amp; TPD logging</p>
            </button>

            <button
              type="button"
              onClick={() => setRole('field_officer')}
              className={`p-3.5 rounded-2xl border text-left cursor-pointer transition ${
                role === 'field_officer'
                  ? 'bg-cyan-950/80 border-cyan-500 text-white shadow-lg'
                  : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2 font-black text-sm text-cyan-400">
                <span>👔</span>
                <span>Field Officer</span>
              </div>
              <p className="text-[10px] text-stone-400 mt-1">Plantation triage, AI override &amp; supervisory reporting</p>
            </button>
          </div>
        </div>

        {/* Form Inputs Grid */}
        <div className="grid sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-stone-300 mb-1">Full Name *</label>
            <input
              required
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="e.g. K. G. Sunanda"
              className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-300 mb-1">NIC Number</label>
            <input
              value={form.nic}
              onChange={(e) => updateField('nic', e.target.value)}
              placeholder="e.g. 198812345678"
              className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-300 mb-1">Phone Number (SMS Notifications) *</label>
            <input
              required
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              placeholder="e.g. 0771234567"
              className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-300 mb-1">Assigned Plantation / Estate *</label>
            <input
              required
              value={form.estate}
              onChange={(e) => updateField('estate', e.target.value)}
              placeholder="e.g. Kegalle Estate - Block A12"
              className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-300 mb-1">District</label>
            <select
              value={form.district}
              onChange={(e) => updateField('district', e.target.value)}
              className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="">Select District</option>
              {districts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-stone-300 mb-1">Division / Block Code</label>
            <input
              value={form.area}
              onChange={(e) => updateField('area', e.target.value)}
              placeholder="e.g. Division 1 (Block 4)"
              className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-sm py-3.5 rounded-xl cursor-pointer shadow-lg transition"
        >
          Create {role === 'tapper' ? 'Tapper' : 'Field Officer'} Account ➔
        </button>

        <p className="text-xs text-stone-400 text-center">
          Already registered?{' '}
          <Link to="/login" className="text-emerald-400 font-bold hover:underline">
            Sign In Here
          </Link>
        </p>
      </form>
    </div>
  )
}