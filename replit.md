# UnityPay 2045 - AI-Powered Multi-Chain Payment Governance Platform

## Overview
UnityPay 2045 is a revolutionary fintech platform combining AI-powered governance with multi-chain payment capabilities. The platform features a Prime Brain orchestrating 12 specialized Nano Agents through an executive Boardroom dashboard.

**Tagline:** One People. One Pay. One Future.

## Current State
- Full-stack web application with Express backend and React frontend
- PostgreSQL database with Drizzle ORM for persistent storage
- WebSocket real-time updates for live boardroom activity
- 12 Executive Nano Agents with specialized roles
- AI-powered meeting system (daily/weekly/monthly/quarterly/annually/on-call)
- Interactive chat interface for agent queries
- User Dashboard with portfolio and transaction history
- Solidity UPX Token contract (ERC-20) with 21 passing tests
- Stripe payment integration with 4 UPX token packages
- Multi-chain wallet UI (Ethereum, Polygon, Solana, Bitcoin)
- Royal purple design theme with glassmorphic UI elements

## Recent Changes
- **Nov 27, 2025**: Complete MVP with payments and multi-chain wallet
  - Stripe payment integration with webhook processing
  - 4 UPX token packages: Starter ($9.99), Growth ($39.99), Pro ($179.99), Elite ($599.99)
  - Purchase page with Stripe checkout flow
  - Multi-chain wallet page with mock connections
  - Support for Ethereum, Polygon, Solana, and Bitcoin networks
  - Wallet address display, copy, and explorer links
  - Real-time stats for connected wallets and UPX balance

- **Nov 27, 2025**: Full MVP with blockchain integration
  - PostgreSQL database setup with Drizzle ORM
  - WebSocket real-time updates on /ws path
  - User Dashboard with portfolio tracking
  - UPX Token Solidity contract deployed (ERC-20)
  - Hardhat test suite with 21 passing tests
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
- `pages/Purchase.tsx` - UPX token purchase with Stripe
- `pages/PurchaseSuccess.tsx` - Post-purchase confirmation
- `pages/Wallet.tsx` - Multi-chain wallet connections
- `pages/Dashboard.tsx` - User portfolio and transactions
- `components/AgentCard.tsx` - Individual agent display
- `components/ChatInterface.tsx` - AI chat with agents
- `components/MeetingReport.tsx` - Meeting report display
- `components/MeetingTabs.tsx` - Meeting type selector
- `components/AppSidebar.tsx` - Left navigation menu
- `components/ThemeProvider.tsx` - Light/dark mode provider

### Backend (`server/`)
- **Framework**: Express.js
- **AI Provider**: OpenAI via Replit AI Integrations (no API key required)
- **Payments**: Stripe with stripe-replit-sync

**Key Files:**
- `routes.ts` - API endpoint definitions
- `storage.ts` - In-memory data storage
- `stripeClient.ts` - Stripe client initialization
- `stripeService.ts` - Stripe business logic
- `stripeStorage.ts` - Stripe data queries
- `webhookHandlers.ts` - Stripe webhook processing
- `ai/nano_meetings.ts` - AI meeting generation logic

### Blockchain (`contracts/`)
- `UPXToken.sol` - ERC-20 token contract
- `test/UPXToken.test.cjs` - 21 passing Hardhat tests

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
| GET | `/api/stripe/products` | List UPX token packages |
| POST | `/api/stripe/checkout` | Create Stripe checkout session |
| POST | `/api/stripe/webhook/:id` | Stripe webhook endpoint |

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

## UPX Token Packages

| Package | UPX Amount | Price | Bonus |
|---------|-----------|-------|-------|
| Starter | 1,000 | $9.99 | - |
| Growth | 5,000 | $39.99 | 10% bonus |
| Pro | 25,000 | $179.99 | 20% bonus |
| Elite | 100,000 | $599.99 | 30% bonus + priority |

## Supported Blockchains

- **Ethereum** - ERC-20 UPX tokens
- **Polygon** - Low-fee transactions
- **Solana** - High-speed transfers
- **Bitcoin** - Cross-chain bridge support

## Running the Application

```bash
npm run dev
```

This starts both the Express backend and Vite frontend on port 5000.

## Running Tests

```bash
npx hardhat test --config hardhat.config.cjs
```

Runs the 21 UPX token contract tests.

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
