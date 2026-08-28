interface PulseIndicatorProps {
  bpm: number
  isActive?: boolean
}

export default function PulseIndicator({ bpm, isActive = true }: PulseIndicatorProps) {
  return (
    <div className="bg-surface-container rounded-lg p-lg">
      <div className="text-label-caps text-on-surface-variant mb-md">Heart Rate</div>
      <div className="flex items-center gap-md">
        <div className={`text-display-metrics text-primary ${isActive ? 'animate-pulse' : ''}`}>
          {bpm}
        </div>
        <div className="text-body-md text-on-surface-variant">BPM</div>
      </div>
      {isActive && (
        <div className="mt-md h-8 bg-surface-container-low rounded flex items-center justify-center overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 100 32">
            <polyline
              points="2,16 8,16 10,12 12,16 18,16 20,8 22,16 28,16"
              fill="none"
              stroke="#deed00"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      )}
    </div>
  )
}
