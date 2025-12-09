# AFK Multi-Bot Manager

## Overview
A Node.js-based Minecraft AFK bot manager using mineflayer. Manages multiple bot instances via HTTP API and web dashboard. Features auto-reconnect, anti-AFK, human-like movement, and 24/7 persistence.

## Architecture

### Frontend (client/src)
- **App.tsx**: Main app with sidebar layout, theme provider
- **pages/dashboard.tsx**: Bot list with stats, remove actions
- **pages/add-bot.tsx**: Single bot add form
- **pages/bulk-add.tsx**: Bulk bot creation with delay
- **pages/api-guide.tsx**: API documentation and deployment guides
- **components/bot-card.tsx**: Bot status display card
- **components/stats-cards.tsx**: Dashboard metrics
- **components/app-sidebar.tsx**: Navigation sidebar

### Backend (server/)
- **bot-manager.ts**: Core bot management class
  - Mineflayer bot creation and lifecycle
  - Auto-reconnect with exponential backoff
  - Anti-AFK and human-like movement behaviors
  - Persistence to bots.json
- **routes.ts**: HTTP API endpoints
  - GET /api/list - List all bots
  - POST /api/add - Add single bot
  - POST /api/remove - Remove bot by username
  - POST /api/removeAll - Remove all bots
  - POST /api/bulk - Add multiple bots

### Shared (shared/)
- **schema.ts**: Zod schemas and TypeScript types for bot data

## Key Files
- `bots.json`: Persisted bot configurations (auto-created)
- `design_guidelines.md`: UI/UX design specifications
- `README.md`: User documentation and deployment guides

## Environment Variables
- `API_TOKEN`: Optional API authentication token
- `PORT`: Server port (default 5000)

## Recent Changes
- Initial implementation (Dec 2024)
- Full-stack bot manager with mineflayer
- Web dashboard with real-time status
- Persistence and auto-restore on restart

## User Preferences
- Indonesian language for communication
- Focus on 24/7 hosting support (Replit/VPS/Pterodactyl)
