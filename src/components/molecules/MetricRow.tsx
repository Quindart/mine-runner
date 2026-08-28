import MetricCard from './MetricCard'

interface Metric {
  label: string
  value: string | number
  unit?: string
}

interface MetricRowProps {
  left: Metric
  right: Metric
}

export default function MetricRow({ left, right }: MetricRowProps) {
  return (
    <div className="grid grid-cols-2 gap-md">
      <MetricCard {...left} />
      <MetricCard {...right} />
    </div>
  )
}
