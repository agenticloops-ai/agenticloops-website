# Agentic Loops Website

A home for Agentic Loops - practical, production-grade patterns, repos, and explanations for software engineers building real systems.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:4321

## How It Works

```
External Course Repos → sync-content.js → Astro → Website
```

Content is fetched from external GitHub repositories at build time.

## Development

```bash
npm run dev      # Start dev server (syncs content)
npm run build    # Production build
npm run preview  # Preview production build
npm run sync     # Sync content only
```

### Using Local Content

Skip cloning external repos during development:

```bash
LOCAL_CONTENT_PATH=/path/to/course npm run dev
```

### Environment Variables

Create a `.env` file in the root directory:

```bash
# Analytics
PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# Deployment (set in CI, not needed locally)
BASE_PATH=/agenticloops-website   # Subdirectory path for GitHub Pages
SITE_URL=https://agenticloops-ai.github.io

# Content sync (for private repos)
COURSE_CONTENT_TOKEN=ghp_xxxx     # GitHub PAT with repo read access
```

### Configure Repos

Edit `scripts/repos.config.js`:

```javascript
export const COURSE_REPOS = [
  {
    name: '01-ai-agents-engineering',
    repo: 'https://github.com/agenticloops-ai/ai-agents-engineering.git',
    branch: 'main',
    // Regex matches module directories in root (e.g., 01-module, 02-module)
    contentPath: /^\d{2}-/,
  },
];
```

## Documentation

| Doc | Description |
|-----|-------------|
| [Architecture](./docs/ARCHITECTURE.md) | Components, content sync, theme system |
| [Deployment](./docs/DEPLOYMENT.md) | Netlify, Vercel, auto-rebuild setup |

## Tech Stack

[Astro](https://astro.build) • [React](https://react.dev) • [Tailwind CSS](https://tailwindcss.com) • [Fuse.js](https://fusejs.io) • [Lucide](https://lucide.dev)
