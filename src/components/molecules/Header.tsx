import { ChevronLeft } from 'lucide-react'

interface HeaderProps {
  title: string
  showBack?: boolean
  onBack?: () => void
}

export default function Header({ title, showBack = false, onBack }: HeaderProps) {
  return (
    <header className="app-header">
      {showBack && (
        <button className="icon-button" onClick={onBack} aria-label="Go back"><ChevronLeft size={20} /></button>
      )}
      <div className="header-brand"><span>MINE RUNNER<span className="brand-dot">.</span></span></div>
      <span className="header-page">{title}</span>
      <span className="header-tagline">EVERY STEP COUNTS</span>
    </header>
  )
}
