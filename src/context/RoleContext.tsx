'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type Role = 'admin' | 'pharmacy'

const RoleContext = createContext<{ role: Role; setRole: (r: Role) => void }>({
  role: 'pharmacy',
  setRole: () => {},
})

export function useRole() {
  return useContext(RoleContext)
}

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('pharmacy') // default

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  )
}
