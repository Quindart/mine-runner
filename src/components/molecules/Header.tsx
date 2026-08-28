import { ChevronLeft } from 'lucide-react'
import Button from '@/components/atoms/Button'

interface HeaderProps {
  title: string
  showBack?: boolean
  onBack?: () => void
}

export default function Header({ title, showBack = false, onBack }: HeaderProps) {
  return (
    <header className="bg-surface-container border-b border-outline-variant py-md px-gutter flex items-center gap-md">
      {showBack && (
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ChevronLeft className="w-6 h-6" />
        </Button>
      )}
      <h1 className="text-headline-lg text-on-surface">{title}</h1>
    </header>
  )
}
