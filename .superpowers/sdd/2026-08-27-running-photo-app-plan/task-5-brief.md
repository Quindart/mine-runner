# Task 5: Tab Navigation Component

**Context:** Simple tab switcher component. Minimal dependency; used only by Task 8 (App). Dependencies: Task 1 complete.

## File to Create

- `src/components/TabNavigation.jsx` — Tab switching UI

## Component Specification

**Props:**
```javascript
TabNavigation({ 
  activeTab: string,           // "active" or "past"
  onSelectTab: (tab) => void,  // callback when tab clicked
})
```

**Renders:**
- Container div: `className="tab-navigation"`
- Two buttons:
  - Button 1: text "Active Run", onClick calls `onSelectTab('active')`, className includes "active" if `activeTab === 'active'`
  - Button 2: text "Past Runs", onClick calls `onSelectTab('past')`, className includes "active" if `activeTab === 'past'`
- Button className pattern: `tab-button` + conditional ` active` for selected tab

**Simple HTML structure:**
```jsx
<div className="tab-navigation">
  <button className={`tab-button ${activeTab === 'active' ? 'active' : ''}`} onClick={() => onSelectTab('active')}>
    Active Run
  </button>
  <button className={`tab-button ${activeTab === 'past' ? 'active' : ''}`} onClick={() => onSelectTab('past')}>
    Past Runs
  </button>
</div>
```

## Steps

1. Create `src/components/TabNavigation.jsx` with component above
2. No tests required (stateless presentation component)
3. Commit with message: "feat: add TabNavigation component"

## Notes

This component is purely presentational — no state, no hooks. Styling (colors, hover states, active indicator) is handled by CSS in Task 8 (App.css).
