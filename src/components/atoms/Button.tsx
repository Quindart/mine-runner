import React from 'react'
import { ButtonProps, ButtonVariant, ButtonSize } from '@/types/design'

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-on-primary hover:bg-primary-fixed-dim glow-primary-active',
  secondary: 'bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed',
  tertiary: 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest',
  ghost: 'bg-transparent text-on-surface hover:bg-surface-container',
  outline: 'bg-transparent border-2 border-primary text-primary hover:glow-primary-active',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-md py-sm text-label-caps rounded',
  md: 'px-lg py-md text-body-md rounded-lg touch-target',
  lg: 'px-xl py-lg text-body-lg rounded-lg w-full touch-target',
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
  const baseStyles = 'font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'

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
