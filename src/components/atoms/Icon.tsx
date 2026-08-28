import { IconProps } from '@/types/design'

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
}

export default function Icon({ icon, size = 'md', color = 'currentColor', className = '' }: IconProps) {
  return (
    <div className={`${sizeMap[size]} ${className}`} style={{ color }}>
      {icon}
    </div>
  )
}
