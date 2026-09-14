import React from 'react'
import { ButtonProps, ButtonVariant, ButtonSize } from '@/types/design'

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-on-primary hover:bg-primary-fixed-dim hover:shadow-glow-primary-strong active:shadow-glow-primary glow-primary-active',
  secondary: 'bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed hover:shadow-glow-secondary',
  tertiary: 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest hover:border-primary border border-outline-variant',
  ghost: 'bg-transparent text-on-surface hover:bg-surface-container-high active:bg-surface-container-highest',
  outline: 'bg-transparent border-2 border-primary text-primary hover:shadow-glow-primary-strong active:shadow-glow-primary',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-md py-sm text-label-caps rounded-md',
  md: 'px-lg py-md text-body-md rounded-lg min-h-12',
  lg: 'px-xl py-lg text-body-lg rounded-lg w-full min-h-14',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-semibold transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'

  return (
    <button
      {...props}
      disabled={isDisabled || isLoading}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {isLoading ? (
        <span className="inline-block animate-spin">⟳</span>
      ) : (
        children
      )}
    </button>
  )
}
