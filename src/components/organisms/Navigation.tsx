import { useNavigate } from 'react-router-dom'
import BottomNav from '@/components/molecules/BottomNav'

interface NavigationProps {
  activeId: string
  onNavigate?: (id: string) => void
}

export default function Navigation({ activeId, onNavigate }: NavigationProps) {
  const navigate = useNavigate()

  const handleNavClick = (id: string) => {
    onNavigate?.(id)

    switch (id) {
      case 'home':
        navigate('/')
        break
      case 'start':
        navigate('/start-run')
        break
      case 'history':
        navigate('/activity-history')
        break
      case 'profile':
        navigate('/profile')
        break
    }
  }

  return <BottomNav activeId={activeId} />
}
