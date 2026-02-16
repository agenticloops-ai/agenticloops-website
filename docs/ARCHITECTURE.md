# Architecture

## Overview

```
External Course Repos → sync-content.js → Astro Build → Static Site (GitHub Pages)
```

Content is fetched from external GitHub repositories, converted to Astro content collections, and built into a static site deployed to GitHub Pages.

---

## Directory Structure

```
agenticloops-website/
├── .github/workflows/
│   ├── build-deploy.yml          # Deploy to GitHub Pages on merge to main
│   └── pr-preview.yml            # PR preview deployments
├── docs/                         # Project documentation
├── public/                       # Static assets (images, fonts)
├── scripts/
│   ├── sync-content.js           # Fetches external repos → src/content/courses/
│   └── repos.config.js           # Course repository configuration
├── src/
│   ├── components/               # React (.tsx) + Astro (.astro) components
│   ├── content/
│   │   └── courses/              # AUTO-GENERATED (gitignored)
│   ├── content.config.ts         # Content collection schema
│   ├── layouts/
│   │   └── Layout.astro          # Base page layout
│   ├── pages/
│   │   ├── api/                  # JSON endpoints
│   │   └── index.astro           # Homepage
│   ├── stores/
│   │   └── themeStore.ts         # Theme state (nanostores)
│   └── styles/
│       └── global.css            # Global CSS + theme variables
├── astro.config.mjs
├── tailwind.config.js
└── postcss.config.js
```

---

## Components

### Landing Page

| Component | Description |
|-----------|-------------|
| `Hero.tsx` | Hero section with CTA buttons |
| `Topics.tsx` | "What We Cover" section (dynamic from API) |
| `RepoSection.tsx` | Featured GitHub repositories |
| `Team.tsx` | Team members grid |
| `About.tsx` | About section |
| `Subscribe.tsx` | Newsletter signup |
| `Header.tsx` | Navigation + search + theme toggle |
| `Footer.tsx` | Footer links |
| `Search.tsx` | DocSearch-style modal |

### Course Pages

| Component | Description |
|-----------|-------------|
| `Sidebar.astro` | Left navigation (modules/lessons) |
| `TableOfContents.astro` | Right sidebar (page headings) |

### Utilities

| Component | Description |
|-----------|-------------|
| `ScrollReveal.tsx` | Scroll animation wrapper |
| `Islands.tsx` | React hydration wrapper |
| `ThemeScript.astro` | Dark/light mode script |
| `AgentLoopDiagram.tsx` | Agent loop visualization |

---

## API Endpoints

| Endpoint | Purpose |
|----------|---------|
| `/api/course-index.json` | All lessons (for search) |
| `/api/course-modules.json` | Modules with lessons (for Topics) |

---

## Content Sync

### How It Works

1. `npm run dev` or `npm run build` triggers `scripts/sync-content.js`
2. Script clones external repos (shallow clone) — or uses `LOCAL_CONTENT_PATH` for local dev
3. Copies markdown content → `src/content/courses/<course-name>/`
4. Renames `README.md` → `index.md`
5. Converts commented frontmatter (`<!-- --- ... --- -->`) to standard frontmatter
6. Transforms relative links to absolute website paths or GitHub URLs
7. Astro builds pages from the content collection

### Adding a Course Repository

Edit `scripts/repos.config.js`:

```javascript
export const COURSE_REPOS = [
    {
        name: 'ai-agents-engineering',
        repo: 'https://github.com/agenticloops-ai/ai-agents-engineering.git',
        branch: 'main',
        contentPath: /^\d{2}-/,  // Regex: match module dirs like 01-foundations/
    }
];
```

### Local Development

Point to a local clone instead of fetching from GitHub:

```bash
LOCAL_CONTENT_PATH=/path/to/course-repo npm run dev
```

### Content Collection Schema

Defined in `src/content.config.ts`:

```typescript
schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    icon: z.string().optional(),       // Lucide icon name
    order: z.number().optional(),
    status: z.string().optional(),
})
```

### Private Repo Authentication

Set `COURSE_CONTENT_TOKEN` environment variable (GitHub PAT with repo access). In CI, this is configured as a repository secret.
