# Recall App Design

**Date:** 2026-01-18
**Status:** Approved

## Overview

Recall is a PWA for managing projects and wikis stored in Google Sheets, with Claude.ai integration for intelligent recall and summarization.

## Architecture

### Tech Stack
- **Frontend:** React + TypeScript + Vite
- **Styling:** Tailwind CSS (voget-io theme)
- **Data Fetching:** TanStack Query
- **Backend:** sheets-db-api (existing service)
- **PWA:** vite-plugin-pwa
- **Routing:** React Router

### Data Flow
1. Setup wizard for Google Sheet connection
2. Validates "projects" and "wikis" sheets exist
3. Fetches data via SheetsDbClient
4. TanStack Query handles caching and updates
5. Mutations sync back to Google Sheets

## Data Model

### Projects Sheet
```typescript
interface Project {
  id: string                    // UUID
  projectName: string
  type: string
  status: string
  folderId: string              // Google Drive folder ID
  primaryTags: string           // Comma-separated
  readmeDocId: string           // Google Doc ID
  briefDescription: string
  dateCreated: string           // ISO date
  lastUpdated: string           // ISO date
}
```

### Wikis Sheet
```typescript
interface Wiki {
  id: string
  topic: string
  folderId: string
  primaryTags: string
  readmeDocId: string
  briefDescription: string
  dateCreated: string
  lastUpdated: string
}
```

### Sheet Validation
- Sheets already exist in Google Sheets
- App validates both "projects" and "wikis" are present
- Schema validation warns about missing columns but allows connection
- Extra columns ignored

## UI/UX Design

### View Mode
- **Layout:** Tab navigation (View/Edit)
- **Sections:** Projects above, Wikis below
- **Display:** Card grid (responsive: 1/2/3 columns)
- **Filtering:** Search, tags, type, status
- **Interaction:** Click card → launch Claude.ai

**Card Components:**
- Title with glow effect
- Brief description
- Tags as tech-badge pills
- Type/status indicators
- Folder/doc link icons
- Hover effects with lift and glow

### Edit Mode
- **Layout:** Same tab navigation
- **Sections:** Projects and Wikis tables
- **Display:** Editable tables with all columns
- **Features:**
  - Inline cell editing
  - Create new items (+ buttons)
  - Delete rows with confirmation
  - Auto-save on blur
  - Optimistic updates

**Create Flow:**
- Dialog/modal with form
- Auto-generate: id, dateCreated, lastUpdated
- User fills: name/topic, description, tags, etc.

### Filtering
- **Search:** By name/topic/description
- **Tags:** Multi-select from all unique tags
- **Type:** Single-select (projects only)
- **Status:** Single-select (projects only)
- Clear filters button

## Claude.ai Integration

### Prompt Generation
```typescript
function generateClaudePrompt(item: Project | Wiki): string {
  const isProject = 'projectName' in item
  const name = isProject ? item.projectName : item.topic
  const tags = parseTags(item.primaryTags)

  return `Please read the README document with ID: ${item.readmeDocId}

Then recall any notes associated with these tags: ${tags.join(', ')}

Context:
- ${isProject ? 'Project' : 'Wiki'}: ${name}
- Description: ${item.briefDescription}
${isProject ? `- Type: ${(item as Project).type}\n- Status: ${(item as Project).status}` : ''}

Please provide a summary of what you found.`
}
```

### Launch Mechanism
- Opens `https://claude.ai/new?q=${encodedPrompt}`
- New tab with noopener/noreferrer
- Toast notification feedback
- Handle popup blockers

### Google Drive Links
- Folder: `https://drive.google.com/drive/folders/${folderId}`
- Doc: `https://docs.google.com/document/d/${docId}`

## Theme & Styling

### Visual Identity
- **Name:** Recall
- **Theme:** voget-io tech/cyberpunk dark theme
- **Colors:** Cyan (#00d4ff), Purple (#a78bfa), Pink (#ec4899)
- **Font:** JetBrains Mono (monospace)

### Visual Effects
- Animated gradient backdrop
- Grid overlay animation
- Particle system
- Scanline effect
- Corner accents with pulse
- Card hover effects with glow

### Component Styling
- Cards: tech-card with blur backdrop
- Tables: Alternating rows, sticky headers
- Buttons: Cyan primary, purple secondary
- Tags: tech-badge with cyan accent
- Inputs: Dark with cyan focus ring

### Responsive
- Mobile-first approach
- Card grid: 1 (mobile), 2 (tablet), 3 (desktop)
- Tables: Horizontal scroll on mobile
- Filters: Stack on mobile

## PWA Configuration

### Service Worker
- Auto-update strategy
- Network-only for API calls (enforces online)
- Cache-first for static assets

### Manifest
```json
{
  "name": "Recall",
  "short_name": "Recall",
  "description": "Project and Wiki management with Claude.ai integration",
  "theme_color": "#00d4ff",
  "background_color": "#0a0e14",
  "display": "standalone"
}
```

### Online Requirement
- App enforces online mode
- Connection status indicator
- Error message when offline
- Prevent actions when disconnected

## Component Architecture

```
src/
├── components/
│   ├── ui/              # Shared UI (from voget-io)
│   ├── sheets/          # Setup wizard (from notes-app)
│   ├── filters/         # Search, tag, type, status filters
│   ├── view-mode/       # Cards for projects/wikis
│   ├── edit-mode/       # Editable tables
│   └── layout/          # Header, tabs, background
├── hooks/
│   ├── use-projects.ts
│   ├── use-wikis.ts
│   ├── use-settings.ts
│   └── use-filters.ts
├── lib/
│   ├── types.ts
│   ├── utils.ts
│   └── claude.ts
├── services/
│   └── sheetsdb/        # API client (from notes-app)
└── pages/
    ├── ViewMode.tsx
    └── EditMode.tsx
```

### State Management
- TanStack Query for server state
- React Context for filter state
- localStorage for settings

## Implementation Notes

### Borrowed Components
- **From voget-io:** UI components, theme, background effects
- **From notes-app:** SheetsSetupWizard, SheetsDbClient, settings hooks

### Key Features
- Optimistic updates for better UX
- Graceful error handling
- Loading states throughout
- Empty states for no results
- Confirmation dialogs for destructive actions

### Data Validation
- Required fields enforced on create
- IDs auto-generated (UUID)
- Dates auto-populated
- Tags parsed/formatted correctly
