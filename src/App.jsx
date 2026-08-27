import { useState } from 'react'
import './App.css'
import { TabNavigation } from './components/TabNavigation'
import { ActiveRunTab } from './components/ActiveRunTab'
import { PastRunsTab } from './components/PastRunsTab'

export default function App() {
  const [activeTab, setActiveTab] = useState('active')

  return (
    <div className="app">
      <header className="app-header">
        <h1>🏃 Running Photo App</h1>
      </header>

      <TabNavigation activeTab={activeTab} onSelectTab={setActiveTab} />

      <main className="app-content">
        {activeTab === 'active' && <ActiveRunTab />}
        {activeTab === 'past' && <PastRunsTab />}
      </main>

      <footer className="app-footer">
        <p>Local storage only • No backend required</p>
      </footer>
    </div>
  )
}
