import React, { createContext, useContext, useState, ReactNode } from 'react'

interface User {
  name: string
}

interface GlobalContextType {
  user: User
  setUser: (user: User) => void
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined)

interface GlobalProviderProps {
  children: ReactNode
}

export function GlobalProvider({ children }: GlobalProviderProps) {
  const [user, setUser] = useState<User>({ name: 'Visitor' })

  return (
    <GlobalContext.Provider value={{ user, setUser }}>
      {children}
    </GlobalContext.Provider>
  )
}

export function useGlobal(): GlobalContextType {
  const context = useContext(GlobalContext)
  if (!context) {
    throw new Error('useGlobal must be used within a GlobalProvider')
  }
  return context
}
