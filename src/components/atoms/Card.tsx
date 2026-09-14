import { CardProps } from '@/types/design'

const levelStyles = {
  1: 'bg-surface-container border border-white border-opacity-10 backdrop-blur-sm hover:border-opacity-20 hover:bg-surface-container-high transition-all duration-300',
  2: 'bg-surface-container-high border border-white border-opacity-20 backdrop-blur-md shadow-lg hover:shadow-2xl hover:border-primary border-opacity-30 transition-all duration-300',
}

export default function Card({ level = 1, children, className = '' }: CardProps) {
  return (
    <div
      className={`${levelStyles[level]} rounded-xl p-md ${className}`}
    >
      {children}
    </div>
  )
}
