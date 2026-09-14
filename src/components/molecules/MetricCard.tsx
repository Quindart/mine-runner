import Card from '@/components/atoms/Card'
import Label from '@/components/atoms/Label'

interface MetricCardProps {
  label: string
  value: string | number
  unit?: string
  icon?: string
  variant?: 'default' | 'highlight'
}

export default function MetricCard({ label, value, unit = '', icon = '', variant = 'default' }: MetricCardProps) {
  return (
    <Card level={2} className="text-center min-h-24 flex flex-col justify-center">
      {icon && <div className="text-3xl mb-sm">{icon}</div>}
      <Label className="block mb-sm text-on-surface-variant font-label-caps">{label}</Label>
      <div className={variant === 'highlight' ? 'text-primary' : 'text-on-surface'}>
        <div className="text-display-metrics font-display-metrics tabular-nums leading-tight">{value}</div>
        {unit && <div className="text-label-caps text-on-surface-variant mt-xs font-label-caps">{unit}</div>}
      </div>
    </Card>
  )
}
