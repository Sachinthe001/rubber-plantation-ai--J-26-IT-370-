import React, { createContext, useContext, useState, ReactNode } from 'react'

export type Role = 'tapper' | 'field_officer'

export type UserProfile = {
  username: string
  name: string
  nic: string
  phone: string
  estate: string
  role: Role
  language: 'ENG' | 'SIN'
}

type AuthContextType = {
  currentUser: UserProfile | null
  loginAs: (role: Role, name: string) => void
  registerAs: (role: Role, name: string, phone: string, estate: string) => UserProfile
  logout: () => void
  updateProfile: (changes: Partial<UserProfile>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>({
    username: 'TAP-4102',
    name: 'K. G. Sunanda',
    nic: '198812345678',
    phone: '0771234567',
    estate: 'Kegalle Estate - Block A12',
    role: 'tapper',
    language: 'ENG',
  })

  function loginAs(role: Role, name: string) {
    const prefix = role === 'tapper' ? 'TAP' : 'OFF'
    const randomId = `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`
    setCurrentUser({
      username: randomId,
      name: name || (role === 'tapper' ? 'Sunanda (Tapper)' : 'Aruna Pathirana (Officer)'),
      nic: '198812345678',
      phone: '0771234567',
      estate: role === 'tapper' ? 'Kegalle Estate - Block A12' : 'Kegalle & Kalutara Estates',
      role,
      language: 'ENG',
    })
  }

  function registerAs(role: Role, name: string, phone: string, estate: string): UserProfile {
    const prefix = role === 'tapper' ? 'TAP' : 'OFF'
    const randomId = `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`
    const profile: UserProfile = {
      username: randomId,
      name: name || 'New Worker',
      nic: '',
      phone: phone || '0770000000',
      estate: estate || 'Kegalle Estate',
      role,
      language: 'ENG',
    }
    setCurrentUser(profile)
    return profile
  }

  function logout() {
    setCurrentUser(null)
  }

  function updateProfile(changes: Partial<UserProfile>) {
    if (!currentUser) return
    setCurrentUser({ ...currentUser, ...changes })
  }

  return (
    <AuthContext.Provider value={{ currentUser, loginAs, registerAs, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
