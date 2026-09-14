import Header from '@/components/molecules/Header'
import BottomNav from '@/components/molecules/BottomNav'
import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
  title?: string
  showHeader?: boolean
  showNav?: boolean
  activeNav?: string
  onBack?: () => void
  onNavigate?: (id: string) => void
}

export default function Layout({
  children,
  title = 'Mine Runner',
  showHeader = true,
  showNav = true,
  activeNav = 'home',
  onBack,
  onNavigate,
}: LayoutProps) {
  return (
    <div className="app-shell">
      {showHeader && <Header title={title} showBack={!!onBack} onBack={onBack} />}

      <main className="app-content">
        <div className="page-content">
          {children}
        </div>
      </main>

      {showNav && <BottomNav activeId={activeNav} onNavigate={onNavigate} />}
    </div>
  )
}
