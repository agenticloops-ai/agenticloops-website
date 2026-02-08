# Architecture

## Overview

```
External Course Repos → sync-content.js → Astro Build → Static Site
```

Content is fetched from external GitHub repositories, converted to Astro content collections, and built into a static documentation site.

---

## Directory Structure

```
ai-agent-website/
├── .github/workflows/
│   └── build-deploy.yml      # CI/CD pipeline
├── docs/                     # Documentation
├── public/                   # Static assets (images, fonts)
├── scripts/
│   └── sync-content.js       # Fetches external repos → src/content/
├── src/
│   ├── components/           # React + Astro components
│   ├── content/
│   │   ├── config.ts         # Content schema
│   │   └── course/           # AUTO-GENERATED (gitignored)
│   ├── layouts/              # Page layouts
│   ├── pages/
│   │   ├── api/              # JSON endpoints
│   │   ├── course/           # Dynamic lesson pages
│   │   └── index.astro       # Homepage
│   ├── stores/               # State (nanostores)
│   └── styles/               # Global CSS
└── netlify.toml              # Netlify config
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
| `Search.tsx` | DocSearch-style modal (⌘K) |

### Course Pages

| Component | Description |
|-----------|-------------|
| `Sidebar.astro` | Left navigation (modules/lessons) |
| `TableOfContents.astro` | Right sidebar (page headings) |
| `CourseLayout.astro` | 3-column docs layout |

### Utilities

| Component | Description |
|-----------|-------------|
| `ScrollReveal.tsx` | Scroll animation wrapper |
| `ThemeToggle.tsx` | Dark/light mode toggle |
| `AppIsland.tsx` | React hydration wrapper |

---

## API Endpoints

| Endpoint | Purpose |
|----------|---------|
| `/api/course-index.json` | All lessons (for search) |
| `/api/course-modules.json` | Modules with lessons (for Topics) |

---

## Content Sync

### How It Works

1. `npm run dev` or `npm run build` triggers `sync-content.js`
2. Script clones external repos (shallow clone)
3. Copies content → `src/content/course/`
4. Renames `README.md` → `index.md`
5. Deletes temp clones
6. Astro builds pages from content collection

### External Repo Structure

```
your-course-repo/
├── 01-module-name/
│   ├── 01-lesson/
│   │   └── README.md
│   └── 02-lesson/
│       └── README.md
└── 02-module-name/
    └── ...
```

### Lesson Frontmatter

```yaml
---
title: "Lesson Title"           # Required
description: "Brief summary"    # Optional
icon: "brain"                   # Optional (lucide icon, kebab-case)
order: 1                        # Optional
---

# Content...
```

### Icons

Use any [Lucide](https://lucide.dev/icons/) icon name:
`brain`, `bot`, `wrench`, `database`, `layers`, `rocket`, `book-open`, etc.

### Private Repo Authentication

For private repositories, set `GITHUB_TOKEN` environment variable:

**Local development:**
```bash
export GITHUB_TOKEN="ghp_your_token_here"
npm run sync
```

**Netlify:** Add `GITHUB_TOKEN` in Site settings → Environment variables

**GitHub Actions:** Uses `secrets.COURSE_CONTENT_TOKEN`

---

## Theme System

CSS variables in `src/styles/index.css`:

```css
:root {
  --color-bg-primary: #ffffff;
  --color-text-primary: #0f172a;
  --color-accent-cyan: #38bdf8;
}

.dark {
  --color-bg-primary: #0a0a0f;
  --color-text-primary: #f1f5f9;
}
```

---

## Extending

### Adding a Component

1. Create in `src/components/` (`.tsx` for React, `.astro` for Astro)
2. Export from `src/components/index.ts` if needed

### Adding Frontmatter Fields

Edit `src/content/config.ts`:

```typescript
schema: z.object({
  title: z.string().optional(),
  // Add new fields here
})
```
