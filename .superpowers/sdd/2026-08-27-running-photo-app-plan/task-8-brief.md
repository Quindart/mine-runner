# Task 8: Main App Component & Styling

**Context:** Top-level app component and all CSS styling. Dependencies: Tasks 1-7 complete.

## Files to Create/Modify

- `src/App.jsx` — Main app component (update from Task 1 scaffold)
- `src/App.css` — Component-scoped styling
- `src/index.css` — Global styles (update from Task 1 scaffold)

## App.jsx Specification

**Component:**
```javascript
function App() {
  const [activeTab, setActiveTab] = useState('active');
  
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
  );
}
```

**Imports:**
- useState from react
- TabNavigation, ActiveRunTab, PastRunsTab components
- Import './App.css'

**Behavior:**
- Manage activeTab state
- Switch between tabs via TabNavigation
- Render appropriate content based on activeTab
- No other logic (components handle it)

## Styling Requirements (Global Constraints)

**Responsive Design:**
- Mobile-first approach
- Buttons min 44px touch target (from constraint)
- Tab layout full-width on mobile
- Map scales to container width
- Photo strip horizontal scroll on mobile

**Color Scheme:**
- Primary: #667eea (purple)
- Accent: #764ba2 (darker purple)
- Success/Danger: #ff6b6b (red)
- Background: #f5f5f5 (light gray)
- Text: #333 (dark gray)

**Typography:**
- Font family: System stack (-apple-system, BlinkMacSystemFont, 'Segoe UI', etc.)
- Button font: inherit from body
- Timer font: monospace ('Courier New')

## CSS Sections (src/App.css)

1. **App Layout (.app)**
   - Flexbox column layout
   - Height 100vh (full viewport)
   - Max-width 800px (optional, for narrower displays)
   - Margin auto (center)
   - Background white

2. **Header (.app-header)**
   - Gradient background (#667eea → #764ba2)
   - White text
   - Padding 20px
   - Text center

3. **Tab Navigation (.tab-navigation, .tab-button)**
   - Flex row, full width
   - Button styling: border, hover, active states
   - Active tab has bottom border color (#667eea)
   - Hover: background #f5f5f5

4. **Main Content (.app-content)**
   - Flex: 1 (grows to fill space)
   - Overflow-y: auto
   - Padding: 20px

5. **Footer (.app-footer)**
   - Small text, centered
   - Border top, background #f9f9f9
   - Padding 12px 20px

6. **Button Styles (.btn, .btn-primary, .btn-danger, .btn-secondary)**
   - Min 44px height (touch target)
   - Padding: 12px 16px
   - Border-radius: 8px
   - Transition: 0.2s
   - Disabled: opacity 0.5, cursor not-allowed

7. **Timer Display (.timer-display, .timer)**
   - Padding: 20px, background #f5f5f5
   - Timer text: 48px, bold, #667eea, monospace

8. **Stats Grid (.stats-display, .stat)**
   - Grid: 3 columns on desktop, 1 on mobile
   - Each stat: label + value
   - Small gray label, larger bold value

9. **Photo Strip (.photo-strip, .photo-thumbnails)**
   - Horizontal scroll on mobile
   - Thumbnails: 60px squares, gap 8px
   - Hover: scale effect

10. **Run Cards (.run-cards, .run-card)**
    - Flex column, gap 12px
    - Each card: padding, border, hover effect
    - Clickable with cursor pointer

11. **Map (.map-container)**
    - Border-radius 8px, overflow hidden
    - Height 400px
    - Border: 1px solid #e0e0e0

12. **Photo Gallery (.photo-gallery, .photo-grid)**
    - Grid: auto-fill, minmax(100px, 1fr)
    - Photo thumbnails: aspect-ratio 1/1, object-fit cover
    - Hover: scale 1.05

13. **Modals (.run-detail-modal, .modal-content)**
    - Fixed overlay, z-index 1000
    - Content: white, rounded, max-width 600px, max-height 90vh
    - Close button: position absolute top right

14. **Error Messages (.error-message)**
    - Background #ffe0e0 (light red)
    - Color #cc0000 (dark red)
    - Padding 12px, border-radius 8px

## Global Styles (src/index.css)

- Reset: margin 0, padding 0, box-sizing border-box
- Body: font-family system stack, line-height 1.5, color #333
- HTML/body/root: 100% width/height
- Input[type=file]: display none
- Button: inherit font, border none, cursor pointer, transition

## Responsive Breakpoints

```css
@media (max-width: 600px) {
  .stats-display {
    grid-template-columns: 1fr;  /* single column */
  }
  .action-buttons {
    flex-direction: column;
  }
  .timer {
    font-size: 36px;  /* smaller on mobile */
  }
  .photo-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));  /* smaller thumbnails */
  }
}
```

## Steps

1. Update `src/App.jsx` with component above
2. Update `src/index.css` with global styles
3. Create `src/App.css` with all component styles
4. Test responsive design: open DevTools → toggle device toolbar → verify layout
5. Verify no CSS syntax errors (browser console)
6. Commit with message: "feat: add App component and complete styling"

## Testing

No unit tests for CSS. Manual verification:
1. Open http://localhost:5173
2. Verify layout looks clean (header, tabs, content, footer)
3. Toggle active/past tabs → content changes
4. Desktop view (1200px+) → tabs side-by-side, full layout
5. Mobile view (375px) → responsive, buttons readable
6. Button sizes: verify min 44px (DevTools measure)
7. No CSS console errors

## Notes

- All colors and sizing follow spec constraints
- Mobile-first means design for small screens first, then enhance for larger
- Flexbox and CSS Grid used (no external CSS framework)
- All styling is self-contained (no Tailwind, Bootstrap, etc.)
