export function TabNavigation({ activeTab, onSelectTab }) {
  return (
    <div className="tab-navigation">
      <button className={`tab-button ${activeTab === 'active' ? 'active' : ''}`} onClick={() => onSelectTab('active')}>
        Active Run
      </button>
      <button className={`tab-button ${activeTab === 'past' ? 'active' : ''}`} onClick={() => onSelectTab('past')}>
        Past Runs
      </button>
    </div>
  );
}
