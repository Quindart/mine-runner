export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'outline'
export type ButtonSize = 'sm' | 'md' | 'lg'
export type BadgeVariant = 'success' | 'error' | 'warning' | 'info'
export type CardLevel = 1 | 2

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  isDisabled?: boolean
}

export interface BadgeProps {
  variant: BadgeVariant
  children: React.ReactNode
  className?: string
}

export interface CardProps {
  level?: CardLevel
  children: React.ReactNode
  className?: string
}

export interface IconProps {
  icon: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  color?: string
  className?: string
}
