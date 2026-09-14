
interface ITabNavigation {
  activeTab: 'active' | 'past';
  onSelectTab: (tab: 'active' | 'past') => void;
}

export function TabNavigation({ activeTab, onSelectTab }: ITabNavigation) {
  return (
    <div className="flex gap-md border-b border-outline-variant bg-surface-container sticky top-0 z-10">
      <button
        onClick={() => onSelectTab('active')}
        className={`flex-1 px-md py-lg text-label-caps font-label-caps transition-all duration-300 border-b-2 ${
          activeTab === 'active'
            ? 'text-primary border-b-primary glow-primary'
            : 'text-on-surface-variant border-b-transparent hover:text-on-surface'
        }`}
      >
        Active Run
      </button>
      <button
        onClick={() => onSelectTab('past')}
        className={`flex-1 px-md py-lg text-label-caps font-label-caps transition-all duration-300 border-b-2 ${
          activeTab === 'past'
            ? 'text-primary border-b-primary glow-primary'
            : 'text-on-surface-variant border-b-transparent hover:text-on-surface'
        }`}
      >
        Past Runs
      </button>
    </div>
  );
}
