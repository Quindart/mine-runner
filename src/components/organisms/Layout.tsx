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
}

export default function Layout({
  children,
  title = 'Mine Runner',
  showHeader = true,
  showNav = true,
  activeNav = 'home',
  onBack,
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {showHeader && <Header title={title} showBack={!!onBack} onBack={onBack} />}

      <main className="flex-1 overflow-y-auto pb-24 px-gutter pt-lg">
        {children}
      </main>

      {showNav && <BottomNav activeId={activeNav} />}
    </div>
  )
}
