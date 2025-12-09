# AFK Multi-Bot Manager - Design Guidelines

## Design Approach: Functional Dashboard System

**Selected Approach:** Design System - Material Design adapted for admin/management interfaces
**Justification:** This is a utility-focused management tool requiring clarity, efficiency, and real-time monitoring. Users need to quickly add, remove, and monitor multiple bot instances with minimal cognitive load.

**Core Principle:** Information density balanced with scanability - prioritize data visibility and quick actions over aesthetic flourishes.

---

## Typography

**Font Family:** Inter (primary), JetBrains Mono (code/technical data)
- **Headings:** Inter Bold, sizes: text-2xl (dashboard title), text-xl (section headers), text-lg (card titles)
- **Body:** Inter Regular, text-base for descriptions, text-sm for labels
- **Technical Data:** JetBrains Mono, text-sm for usernames, hostnames, ports, status codes
- **Numbers/Stats:** Inter Semibold, text-3xl for bot count metrics

---

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8
- Component padding: p-4, p-6
- Section spacing: gap-4, gap-6
- Margins: m-2, m-4, m-8
- Grid gaps: gap-4 for card grids

**Container Structure:**
- Max width: max-w-7xl for main content
- Sidebar: w-64 (fixed width for navigation)
- Content area: Responsive grid system

---

## Component Library

### Dashboard Layout
**Sidebar Navigation:**
- Fixed left sidebar with sections: Dashboard, Active Bots, Add Bot, Bulk Operations, Settings
- Compact icon + label format
- Active state indication with border accent

**Main Content Area:**
- Header bar with page title, global actions (Add Bot, Remove All), and live bot count badge
- Stats cards row showing: Total Bots, Active Connections, Failed/Reconnecting, Average Uptime
- Main content grid below stats

### Bot Management Cards
**Bot Card Design:**
- Compact card layout (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Each card displays: Username (large, monospace), Server address, Status badge (Connected/Reconnecting/Error), Uptime counter, Action buttons (Remove, View Logs)
- Status badge: pill-shaped with icon indicator
- Quick action buttons: icon-only, positioned top-right corner

### Forms
**Add Bot Form:**
- Single-column form layout, max-w-lg
- Input groups with clear labels above inputs
- Form fields: Username (text), Host (text), Port (number), Mode toggles (Human-like movement, Auto-reconnect)
- Advanced options collapsible section: Anti-AFK Interval slider, AuthMe password
- Primary action button: full-width, prominent

**Bulk Add Interface:**
- Two-column layout: Configuration left, Preview/Status right
- Number input for bot count with range slider
- Delay interval setting
- Real-time creation progress bar

### Data Display
**Bot List Table (Alternative View):**
- Dense table layout with sortable columns: Username, Server, Status, Uptime, Actions
- Sticky header on scroll
- Row hover states for clarity
- Inline action buttons

**Logs/Console Panel:**
- Full-width expandable panel at bottom
- Monospace font for log output
- Auto-scroll toggle
- Filter by log level (Info, Warn, Error)
- Search functionality

### Navigation & Actions
**Top Bar:**
- Left: Dashboard title
- Right: Add New Bot (primary button), Remove All (secondary button), Settings icon
- Bot counter badge prominently displayed

**Action Buttons:**
- Primary: Solid fill for main actions (Add Bot, Save)
- Secondary: Outlined for less critical actions (Remove, Cancel)
- Danger: Distinct treatment for destructive actions (Remove All, Delete)
- Icon buttons: Ghost style for card actions

### Status Indicators
**Connection Status:**
- Badge components with icon + text
- Connected: Checkmark icon
- Reconnecting: Spinner animation icon
- Error: Alert icon
- Offline: Minus icon

**Real-time Updates:**
- Pulse animation on status badges during state changes
- Toast notifications for bot add/remove actions (bottom-right corner)
- Live uptime counters updating every second

### Empty States
- Large icon centered
- Clear heading: "No Bots Running"
- Descriptive text with CTA button to add first bot
- Quick start guide link

---

## Animations

**Minimal, Purposeful:**
- Status badge transitions: 200ms ease
- Card hover lift: subtle shadow increase
- Toast slide-in from bottom-right: 300ms ease-out
- Loading spinner for connection states
- NO complex page transitions or scroll animations

---

## Responsive Behavior

**Mobile (< 768px):**
- Sidebar collapses to hamburger menu
- Stats cards stack vertically
- Bot cards single column
- Table switches to card view

**Tablet (768px - 1024px):**
- Sidebar visible as overlay/drawer
- Bot cards 2 columns
- Condensed stats row

**Desktop (> 1024px):**
- Fixed sidebar navigation
- Bot cards 3 columns
- Full table layout available

---

## Critical Design Patterns

**Dashboard Homepage:**
1. Stats overview row (4 metrics)
2. Quick actions bar (Add Bot, Bulk Add)
3. Active bots grid/table with real-time status
4. Collapsible logs panel at bottom

**Form Patterns:**
- Labels above inputs (not floating)
- Validation messages inline below fields
- Submit button state reflects loading
- Success feedback via toast + redirect

**Data Density:**
- Prioritize information visibility
- Use tabs/accordions to organize advanced options
- Persistent header/navigation for context

---

## Icons
**Library:** Heroicons (outline for navigation, solid for status)
- Dashboard: ChartBarIcon
- Bots: ServerIcon
- Add: PlusCircleIcon
- Remove: TrashIcon
- Settings: CogIcon
- Status Connected: CheckCircleIcon
- Status Error: ExclamationCircleIcon