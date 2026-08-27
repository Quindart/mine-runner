import React, { ReactNode } from 'react'
import Header from '@/components/molecules/Header'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="p-4">{children}</main>
    </div>
  )
}
