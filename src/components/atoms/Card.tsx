import { CardProps } from '@/types/design'

const levelStyles = {
  1: 'bg-surface-container border border-white border-opacity-10',
  2: 'bg-surface-container-high border border-white border-opacity-20 backdrop-blur-md',
}

export default function Card({ level = 1, children, className = '' }: CardProps) {
  return (
    <div
      className={`${levelStyles[level]} rounded-lg p-md ${className}`}
    >
      {children}
    </div>
  )
}
