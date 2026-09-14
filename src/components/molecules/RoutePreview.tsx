export default function RoutePreview({ points = [] }: { points?: any[] }) {
  const valid = points.filter(p => Number.isFinite(p.lat) && Number.isFinite(p.lng))
  if (valid.length < 2) return <div className="route-preview route-empty"><span>No route recorded</span></div>
  const minLat=Math.min(...valid.map(p=>p.lat)), maxLat=Math.max(...valid.map(p=>p.lat)), minLng=Math.min(...valid.map(p=>p.lng)), maxLng=Math.max(...valid.map(p=>p.lng)); const w=maxLng-minLng||1e-5, h=maxLat-minLat||1e-5
  const xy=valid.map(p=>[20+(p.lng-minLng)/w*160,180-(p.lat-minLat)/h*160]); const first=xy[0], last=xy[xy.length-1]
  return <div className="route-preview"><svg viewBox="0 0 200 200" aria-label="Recorded running route"><polyline points={xy.map(p=>p.join(',')).join(' ')} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><circle cx={first[0]} cy={first[1]} r="4" fill="var(--surface)" stroke="currentColor" strokeWidth="2" /><circle cx={last[0]} cy={last[1]} r="5" fill="currentColor" /></svg></div>
}
