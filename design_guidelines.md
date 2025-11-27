# UnityPay 2045 Design Guidelines

## Design Approach
**Hybrid System**: Material Design foundations enhanced with futuristic, executive-grade visual identity. Think Bloomberg Terminal sophistication meets Stripe's polish with sci-fi undertones. This is a high-stakes financial governance platform requiring both clarity and commanding presence.

## Core Design Principles
1. **Executive Authority**: Every element conveys intelligence, power, and precision
2. **Information Clarity**: Complex data must be instantly scannable
3. **Futuristic Sophistication**: 2045 vision through subtle tech-forward details
4. **Royal Brand Identity**: Purple-dominant palette establishes unique positioning

## Typography System
- **Primary Font**: Inter (weights: 400, 500, 600, 700, 800)
- **Monospace Font**: JetBrains Mono (for data, timestamps, transaction IDs)
- **Display Headlines**: 32px - 48px, weight 700-800, tight letter-spacing (-0.02em)
- **Section Headers**: 24px - 28px, weight 600-700
- **Body Text**: 15px - 16px, weight 400-500, line-height 1.6
- **Data Labels**: 13px - 14px, weight 500, uppercase tracking (0.05em)
- **Micro Copy**: 12px - 13px, weight 400, muted opacity

## Layout System
**Spacing Primitives**: Use Tailwind units 2, 4, 6, 8, 12, 16, 20, 24
- Component padding: p-6 to p-8
- Section spacing: py-12 to py-16
- Card gaps: gap-6 to gap-8
- Element margins: m-2 to m-4 for tight groupings

**Grid Structure**:
- Dashboard: 3-column layout (sidebar 280px | main content flex-1 | activity feed 320px)
- Agent Cards: 3-4 column grid on desktop, 2 on tablet, 1 on mobile
- Meeting Reports: Single column max-w-4xl for readability

## Component Library

### Navigation
- **Top Bar**: Fixed header with logo, global search, user profile, notification bell
- **Sidebar**: Persistent left nav with Boardroom, Agents, Analytics, Settings sections
- **Breadcrumbs**: Show current location depth in hierarchy

### Boardroom Dashboard
- **Meeting Selector**: Horizontal tab bar for Daily/Weekly/Monthly/Quarterly/Annual/On-Call
- **Live Feed**: Infinite scroll card layout showing agent discussions chronologically
- **Agent Activity Grid**: 12-card grid (3×4) showing each nano agent's current status
- **Metrics Panel**: Row of 4-5 KPI cards with large numbers, trend indicators

### Agent Cards
- **Visual Identity**: Each agent gets unique icon (use Heroicons) and subtle color accent
- **Card Structure**: 
  - Header: Agent name + role in bold
  - Status indicator: Active/Idle/Processing with animated dot
  - Last action timestamp
  - Quick action button
- **Hover State**: Subtle lift (translate-y-1) + glow effect

### Chat Interface
- **Message Input**: Fixed bottom bar, 56px height, rounded-2xl container
- **Message Bubbles**: User (right-aligned, purple) vs Agent (left-aligned, glass effect)
- **Typing Indicator**: Three animated dots for AI responses
- **Timestamp**: Small text below each message

### Data Visualization
- **Report Cards**: Large glassmorphic containers with inner padding p-8
- **Stat Blocks**: Grid of metric cards showing numbers prominently (32px-40px)
- **Timeline View**: Vertical line with connected event nodes for meeting history
- **Progress Indicators**: Linear bars with gradient fills for tasks/goals

### Forms & Inputs
- **Search Bar**: Full-width in top nav, icon-left placement, placeholder with subtle italic
- **Text Inputs**: Border focus state with purple glow (shadow-lg shadow-purple-500/20)
- **Buttons**: 
  - Primary: Solid purple gradient background
  - Secondary: Outline with transparent background
  - Ghost: Text-only for tertiary actions
  - All buttons: h-11 to h-12, rounded-xl, font-semibold

### Overlays
- **Modal Windows**: Centered, max-w-2xl, backdrop blur, escape to close
- **Toast Notifications**: Top-right corner, slide-in animation, auto-dismiss
- **Confirmation Dialogs**: Smaller modals (max-w-md) for critical actions

## Visual Treatment

### Glassmorphism
- Background: `rgba(255,255,255,0.03)` to `rgba(255,255,255,0.06)`
- Backdrop filter: `blur(12px)` to `blur(16px)`
- Border: `1px solid rgba(255,255,255,0.1)`

### Gradients
- **Primary Background**: `linear-gradient(135deg, #4A00D9 0%, #7A1DFF 50%, #00C8FF 100%)`
- **Card Accents**: Subtle top border with gradient from purple to blue
- **Button Hover**: Shift gradient 10% lighter

### Shadows & Depth
- **Cards**: `0 8px 32px rgba(0,0,0,0.4)`
- **Active Elements**: `0 0 40px rgba(122,29,255,0.25)` (purple glow)
- **Elevated Modals**: `0 20px 60px rgba(0,0,0,0.6)`

### Animations
**Use sparingly**:
- Fade-in for content loads (200ms ease-out)
- Slide-in for notifications (300ms ease)
- Pulse for active status indicators (2s infinite)
- NO scroll-triggered animations

## Images

### Dashboard Header
**Large Accent Image**: Abstract tech visualization showing interconnected nodes/blockchain network
- **Placement**: Full-width background behind top section, height 280px
- **Treatment**: Heavy blur + dark overlay (opacity 0.3) so text remains readable
- **Purpose**: Establishes futuristic, interconnected theme without dominating interface

### Agent Profile Icons
**12 Unique Abstract Symbols**: Geometric/minimal representations for each nano agent
- **Style**: Line art or simplified glyphs, monochrome
- **Placement**: Top-left of each agent card
- **Size**: 40px × 40px within circular container

### Empty States
**Illustration**: Simple line drawings for "no meetings yet", "no data available"
- **Style**: Minimalist, matches purple color scheme
- **Placement**: Centered in empty content areas with helper text below

## Accessibility
- All interactive elements: min-height 44px (touch-friendly)
- Focus states: 2px purple outline with offset
- Text contrast: Ensure 4.5:1 ratio on all text over backgrounds
- Skip links for keyboard navigation
- ARIA labels on all icon-only buttons

## Responsive Behavior
- **Desktop (>1280px)**: Full 3-column layout
- **Tablet (768-1280px)**: Hide right sidebar, show toggle button
- **Mobile (<768px)**: Hamburger menu, stack all content single column