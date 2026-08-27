
import React from 'react'
import Button from '@/components/atoms/Button'
import { useGlobal } from '@/context/GlobalContext'

export default function Header() {
  const { user, setUser } = useGlobal()

  const handleChangeUser = () => {
    setUser({ name: `Visitor ${Math.floor(Math.random() * 100)}` })
  }

  return (
    <header className="flex justify-between items-center px-4 py-4 bg-white shadow-sm border-b">
      <h1 className="text-2xl font-bold text-gray-900">Hue View</h1>
      <div className="flex items-center gap-4">
        <span className="text-gray-700">{user?.name}</span>
        <Button
          onClick={handleChangeUser}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Change
        </Button>
      </div>
    </header>
  )
}
