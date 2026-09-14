import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-sm">
      {label && (
        <label className="text-label-caps text-on-surface-variant">
          {label}
        </label>
      )}
      <input
        {...props}
        className={`bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:glow-primary-active ${className}`}
      />
      {error && (
        <span className="text-sm text-error">{error}</span>
      )}
    </div>
  )
}
