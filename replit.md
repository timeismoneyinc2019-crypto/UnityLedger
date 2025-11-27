# UnityPay 2045 - AI-Powered Multi-Chain Payment Governance Platform

## Overview
UnityPay 2045 is a revolutionary fintech platform combining AI-powered governance with multi-chain payment capabilities. The platform features a Prime Brain orchestrating 12 specialized Nano Agents through an executive Boardroom dashboard.

**Tagline:** One People. One Pay. One Future.

## Current State
- Full-stack web application with Express backend and React frontend
- 12 Executive Nano Agents with specialized roles
- AI-powered meeting system (daily/weekly/monthly/quarterly/annually/on-call)
- Interactive chat interface for agent queries
- Royal purple design theme with glassmorphic UI elements

## Recent Changes
- **Nov 27, 2025**: Initial MVP implementation
  - Created UnityPay2045_Master.js as central orchestration point
  - Implemented all 12 Nano Agent definitions
  - Built Boardroom dashboard with meeting reports
  - Added AI chat interface using OpenAI via Replit AI Integrations
  - Designed royal purple theme with light/dark mode support

## Project Architecture

### Frontend (`client/src/`)
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: TanStack Query v5

**Key Components:**
- `pages/Boardroom.tsx` - Main dashboard with meeting reports and chat
- `pages/Agents.tsx` - Nano agents grid view
- `pages/Analytics.tsx` - Performance metrics dashboard
- `components/AgentCard.tsx` - Individual agent display
- `components/ChatInterface.tsx` - AI chat with agents
- `components/MeetingReport.tsx` - Meeting report display
- `components/MeetingTabs.tsx` - Meeting type selector
- `components/Header.tsx` - Top navigation with theme toggle
- `components/Sidebar.tsx` - Left navigation menu
- `components/ThemeProvider.tsx` - Light/dark mode provider

### Backend (`server/`)
- **Framework**: Express.js
- **AI Provider**: OpenAI via Replit AI Integrations (no API key required)

**Key Files:**
- `routes.ts` - API endpoint definitions
- `storage.ts` - In-memory data storage
- `ai/nano_meetings.ts` - AI meeting generation logic

### Shared (`shared/`)
- `schema.ts` - TypeScript types and interfaces

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/meetings/:type` | Get cached meeting report |
| POST | `/api/meetings/:type/run` | Generate new meeting report |
| POST | `/api/meetings/ask` | Chat with Nano Agents |
| GET | `/api/chat/history` | Get chat history |
| DELETE | `/api/chat/history` | Clear chat history |
| POST | `/api/audit/run` | Run security audit |
| GET | `/api/agents` | List all agents |

## The 12 Nano Agents

1. **Athena** - Strategy & Vision
2. **Helios** - Quantum-Security
3. **Solara** - Crypto Analysis
4. **Nexus** - Multi-Chain Orchestration
5. **Artemis** - UX & Design
6. **Morpheus** - Behavior & Risk
7. **Gaia** - Ecosystem Growth
8. **Orion** - Compliance
9. **Chronos** - Time-Based Operations
10. **Phoenix** - Recovery & Resilience
11. **Aurora** - Innovation & R&D
12. **Sentinel** - Monitoring & Alerts

## Running the Application

```bash
npm run dev
```

This starts both the Express backend and Vite frontend on port 5000.

## Design System

### Colors (Royal Purple Theme)
- Primary Purple: `#7A1DFF`
- Royal Purple: `#4A00D9`
- Unity Blue: `#00C8FF`
- Unity Gold: `#FFD700`

### Typography
- Primary: Inter
- Monospace: JetBrains Mono

## User Preferences
- Default theme: Dark mode
- Sidebar: Collapsible on mobile
- Chat: Persists during session
