import { useState } from 'react'
import Layout from '@/components/organisms/Layout'
import { ActiveRunTab } from '@/components/ActiveRunTab'
import { PastRunsTab } from '@/components/PastRunsTab'
import Dashboard from './Dashboard'
import ProfilePage from './ProfilePage'
import { useRunStore } from '@/store/runStore'

export default function HomePage() {
  const [activeNav, setActiveNav] = useState('home')
  const { isRunning, startRun } = useRunStore()
  const start = () => { if (!isRunning) startRun(); setActiveNav('start') }
  const title = { home: 'Dashboard', start: 'Live run', history: 'Activity history', profile: 'Runner profile' }[activeNav]
  return <Layout title={title} activeNav={activeNav} onNavigate={setActiveNav}>
    {activeNav === 'home' && <Dashboard onStart={start} onHistory={() => setActiveNav('history')} />}
    <div hidden={activeNav !== 'start'}><ActiveRunTab /></div>
    {activeNav === 'history' && <PastRunsTab />}
    {activeNav === 'profile' && <ProfilePage onHistory={() => setActiveNav('history')} />}
  </Layout>
}
