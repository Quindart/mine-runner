import { Home, Play, History, User } from 'lucide-react'

interface NavItem {
  id: string
  icon: React.ReactNode
  label: string
  onClick: () => void
}

interface BottomNavProps {
  activeId: string
  onNavigate?: (id: string) => void
}

export default function BottomNav({ activeId, onNavigate }: BottomNavProps) {
  const items: NavItem[] = [
    { id: 'home', icon: <Home />, label: 'Home', onClick: () => onNavigate?.('home') },
    { id: 'start', icon: <Play />, label: 'Start', onClick: () => onNavigate?.('start') },
    { id: 'history', icon: <History />, label: 'History', onClick: () => onNavigate?.('history') },
    { id: 'profile', icon: <User />, label: 'Profile', onClick: () => onNavigate?.('profile') },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface-container-low bg-opacity-95 backdrop-blur border-t border-outline-variant">
      <div className="flex justify-around">
        {items.map(item => (
          <button
            key={item.id}
            onClick={item.onClick}
            className={`flex flex-col items-center gap-xs py-md px-lg touch-target transition-colors ${
              activeId === item.id ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {item.icon}
            <span className="text-label-caps">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
