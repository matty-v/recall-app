<p align="center">
  <img src="public/logo.svg" alt="Recall Logo" width="128" height="128">
</p>

# Recall

A PWA for managing projects and wikis stored in Google Sheets with Claude.ai integration.

## Features

- 📊 **Google Sheets Integration** - Projects and wikis stored in Google Sheets
- 🤖 **Claude.ai Integration** - Intelligent recall with prompt generation
- 🔍 **Search & Filter** - Find projects and wikis quickly
- ✏️ **Edit Mode** - Create and delete projects/wikis
- 👁️ **View Mode** - Beautiful card grid display
- 🔗 **Quick Links** - Direct access to Google Drive folders and docs
- 🎨 **Tech Theme** - Cyberpunk-inspired dark theme with animations
- 📱 **PWA** - Install as a Progressive Web App

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom voget-io theme
- **Data**: TanStack Query for server state
- **UI Components**: Radix UI primitives
- **Backend**: sheets-db-api (Google Sheets as database)
- **PWA**: vite-plugin-pwa with service worker

## Getting Started

### Prerequisites

- Node.js 20+
- A Google Sheet with "projects" and "wikis" tabs
- Access to sheets-db-api service

### Installation

```bash
# Clone the repository
git clone https://github.com/matty-v/recall-app.git
cd recall-app

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit http://localhost:5173 to see the app.

### Google Sheets Setup

1. Create a Google Sheet with two tabs: `projects` and `wikis`
2. Share the sheet with: `sheets-db@sheets-db-438616.iam.gserviceaccount.com` (Editor access)
3. Copy the Sheet ID from the URL
4. Enter the Sheet ID in the setup wizard

**Projects Sheet Columns:**
- id, projectName, type, status, folderId, primaryTags, readmeDocId, briefDescription, dateCreated, lastUpdated

**Wikis Sheet Columns:**
- id, topic, folderId, primaryTags, readmeDocId, briefDescription, dateCreated, lastUpdated

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Type check
npm run build
```

## Deployment

The app automatically deploys to Firebase Hosting when changes are pushed to the `main` branch.

**Live URL**: https://kinetic-object-322814.web.app

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Usage

### View Mode

- Browse projects and wikis in a card grid layout
- Click any card to launch Claude.ai with context
- Use search bar to filter by name or description
- Click folder/doc icons for quick access to Google Drive

### Edit Mode

- View all data in table format
- Click "+ New Project" or "+ New Wiki" to create items
- Click trash icon to delete items
- All changes sync to Google Sheets

## Project Structure

```
recall-app/
├── src/
│   ├── components/
│   │   ├── ui/              # Shadcn/ui components
│   │   ├── sheets/          # Setup wizard
│   │   ├── filters/         # Search and filters
│   │   ├── view-mode/       # Project and Wiki cards
│   │   ├── edit-mode/       # Create dialogs
│   │   └── layout/          # Background effects
│   ├── hooks/
│   │   ├── use-projects.ts  # Projects data hook
│   │   ├── use-wikis.ts     # Wikis data hook
│   │   ├── use-settings.ts  # Settings persistence
│   │   └── use-filters.ts   # Filter state management
│   ├── lib/
│   │   ├── types.ts         # TypeScript types
│   │   ├── utils.ts         # Utility functions
│   │   ├── claude.ts        # Claude.ai integration
│   │   └── links.ts         # Google Drive links
│   ├── services/
│   │   └── sheetsdb/        # API client
│   ├── pages/
│   │   ├── ViewMode.tsx     # View mode page
│   │   └── EditMode.tsx     # Edit mode page
│   ├── config/
│   │   └── constants.ts     # App constants
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── public/
│   ├── icon-192.png         # PWA icon (192x192)
│   └── icon-512.png         # PWA icon (512x512)
└── docs/
    └── plans/               # Design documents
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

Built with subagent-driven development using Claude Code.
