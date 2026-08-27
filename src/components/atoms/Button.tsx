import React, { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  onClick?: () => void
  className?: string
}

export default function Button({ children, onClick, className = '', ...props }: ButtonProps) {
  return (
    <button onClick={onClick} className={className} {...props}>
      {children}
    </button>
  )
}
