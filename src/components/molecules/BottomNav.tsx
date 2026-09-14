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
    { id: 'home', icon: <Home />, label: 'Dashboard', onClick: () => onNavigate?.('home') },
    { id: 'start', icon: <Play />, label: 'Live run', onClick: () => onNavigate?.('start') },
    { id: 'history', icon: <History />, label: 'History', onClick: () => onNavigate?.('history') },
    { id: 'profile', icon: <User />, label: 'Profile', onClick: () => onNavigate?.('profile') },
  ]

  return (
    <nav className="app-navigation">
      <div className="nav-brand">MINE<br />RUNNER<span className="brand-dot">.</span></div>
      <span className="nav-caption">YOUR RUNNING SPACE</span>
      <div className="nav-items">
      <div className="flex justify-around">
        {items.map(item => (
          <button
            key={item.id}
            onClick={item.onClick}
            className={`nav-item ${activeId === item.id ? 'is-active' : ''} ${
              activeId === item.id ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {item.icon}
            <span className="text-label-caps">{item.label}</span>
            {activeId === item.id && <span className="nav-active-dot" />}</button>
        ))}
      </div><div className="nav-footer"><p>Your pace.<br />Your path.</p><span>MAKE IT YOURS.</span></div>
    </nav>
  )
}
