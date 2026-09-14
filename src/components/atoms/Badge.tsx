import { BadgeProps, BadgeVariant } from '@/types/design'

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-success bg-opacity-20 text-success border border-success border-opacity-30',
  error: 'bg-error bg-opacity-20 text-error border border-error border-opacity-30',
  warning: 'bg-primary bg-opacity-20 text-primary border border-primary border-opacity-30',
  info: 'bg-surface-container-high text-on-surface border border-outline-variant',
}

export default function Badge({ variant, children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-block px-md py-sm text-label-caps rounded-full font-label-caps transition-all duration-300 hover:shadow-lg ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
