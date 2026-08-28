import { BadgeProps, BadgeVariant } from '@/types/design'

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-success text-black',
  error: 'bg-error text-on-error',
  warning: 'bg-primary-fixed text-on-primary-fixed',
  info: 'bg-surface-container-high text-on-surface',
}

export default function Badge({ variant, children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-block px-sm py-xs text-label-caps rounded-full font-label-caps ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
