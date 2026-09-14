interface ProgressBarProps {
  progress: number
  label?: string
  showLabel?: boolean
}

export default function ProgressBar({ progress, label, showLabel = false }: ProgressBarProps) {
  return (
    <div className="w-full">
      {showLabel && label && (
        <div className="flex justify-between items-center mb-sm">
          <span className="text-label-caps text-on-surface-variant">{label}</span>
          <span className="text-body-md text-primary">{Math.round(progress)}%</span>
        </div>
      )}
      <div className="w-full bg-surface-container-low rounded-full h-2 overflow-hidden">
        <div
          className="bg-primary rounded-full h-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
