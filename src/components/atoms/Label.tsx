interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode
  required?: boolean
}

export default function Label({ children, required = false, ...props }: LabelProps) {
  return (
    <label {...props} className="text-label-caps text-on-surface-variant uppercase">
      {children}
      {required && <span className="text-error ml-xs">*</span>}
    </label>
  )
}
