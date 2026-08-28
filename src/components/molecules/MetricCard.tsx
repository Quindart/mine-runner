import Card from '@/components/atoms/Card'
import Label from '@/components/atoms/Label'

interface MetricCardProps {
  label: string
  value: string | number
  unit?: string
  variant?: 'default' | 'highlight'
}

export default function MetricCard({ label, value, unit = '', variant = 'default' }: MetricCardProps) {
  return (
    <Card level={1} className="text-center">
      <Label className="block mb-sm">{label}</Label>
      <div className={variant === 'highlight' ? 'text-primary' : 'text-on-surface'}>
        <div className="text-display-metrics font-display-metrics tabular-nums">{value}</div>
        {unit && <div className="text-body-md text-on-surface-variant">{unit}</div>}
      </div>
    </Card>
  )
}
