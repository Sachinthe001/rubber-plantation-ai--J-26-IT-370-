import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export type Role = 'field_officer'

export type Profile = {
  username: string
  name: string
  nic: string
  dob: string
  district: string
  area: string
  phone: string
  email: string
  estate: string
  role: Role
  profilePicture: string | null
}

type AuthState = {
  currentUser: Profile | null
  registerAs: (data: Omit<Profile, 'username' | 'profilePicture'>) => Profile
  loginAs: (role: Role, identifier: string) => void
  logout: () => void
  updateProfile: (changes: Partial<Profile>) => void
}

const AuthContext = createContext<AuthState | undefined>(undefined)
const SESSION_KEY = 'rubbersentry-session'

function generateUsername(_role: Role): string {
  const random = Math.floor(1000 + Math.random() * 9000)
  return `FO-${random}`
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem(SESSION_KEY)
    if (saved) setCurrentUser(JSON.parse(saved))
  }, [])

  function persist(profile: Profile) {
    setCurrentUser(profile)
    localStorage.setItem(SESSION_KEY, JSON.stringify(profile))
  }

  function registerAs(data: Omit<Profile, 'username' | 'profilePicture'>): Profile {
    const profile: Profile = { ...data, role: 'field_officer', username: generateUsername('field_officer'), profilePicture: null }
    persist(profile)
    return profile
  }

  function loginAs(_role: Role, identifier: string) {
    const profile: Profile = {
      username: identifier || generateUsername('field_officer'),
      name: identifier || 'Aruna Pathirana (Field Officer)',
      nic: '', dob: '', district: '', area: '', phone: '', email: '', estate: '',
      role: 'field_officer',
      profilePicture: null,
    }
    persist(profile)
  }

  function logout() {
    setCurrentUser(null)
    localStorage.removeItem(SESSION_KEY)
  }

  function updateProfile(changes: Partial<Profile>) {
    if (!currentUser) return
    persist({ ...currentUser, ...changes })
  }

  return (
    <AuthContext.Provider value={{ currentUser, registerAs, loginAs, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside an AuthProvider')
  return context
}