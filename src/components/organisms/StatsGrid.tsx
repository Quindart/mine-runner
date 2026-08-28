import MetricCard from '@/components/molecules/MetricCard'

interface Stat {
  label: string
  value: string | number
  unit?: string
}

interface StatsGridProps {
  stats: Stat[]
}

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-md">
      {stats.map((stat, idx) => (
        <MetricCard key={idx} {...stat} />
      ))}
    </div>
  )
}
