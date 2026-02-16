# Content Authoring Guide

Guidelines for creating course content in external repositories.

## Lesson Structure

Each lesson is a `README.md` file in its own folder. Modules are located at the root of the repository:

```
repo-root/
├── 01-module-name/
│   ├── README.md                 # Module overview page
│   ├── 01-lesson-name/
│   │   └── README.md
│   └── 02-lesson-name/
│       └── README.md
├── 02-module-name/
│   └── ...
└── ...
```

## Naming Convention

- Use numeric prefixes for ordering: `01-`, `02-`, etc.
- Use lowercase kebab-case: `building-agents`, not `BuildingAgents`
- Keep names short but descriptive

## Frontmatter

Every `README.md` should have YAML frontmatter. Two formats are supported:

**Standard frontmatter:**

```yaml
---
title: "Building Your First Agent"
description: "Learn to create a simple AI agent from scratch"
icon: "bot"
---
```

**Commented frontmatter** (useful when you want the README to render cleanly on GitHub):

```html
<!-- ---
title: "Building Your First Agent"
description: "Learn to create a simple AI agent from scratch"
icon: "bot"
--- -->
```

The sync script automatically converts commented frontmatter to standard frontmatter during build.

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Displayed in navigation and page header |
| `description` | No | Shown in search results and course cards |
| `icon` | No | Lucide icon name (defaults to `book-open`) |
| `order` | No | Sort order (defaults to folder name) |
| `status` | No | Lesson status |

### Available Icons

Use any [Lucide](https://lucide.dev/icons/) icon in kebab-case:

```
brain, bot, wrench, database, layers, rocket, code,
message-square, alert-triangle, book-open, terminal,
git-branch, zap, shield, cpu, server, cloud
```

## Content Guidelines

### Headings

- Start content with `##` (H2), not `#` (H1)
- H1 is auto-generated from the `title` frontmatter
- Use H2 for main sections, H3 for subsections

### Code Blocks

Always specify the language:

````markdown
```python
def my_function():
    return "Hello"
```
````

### Callouts

Use blockquotes with emoji for emphasis:

```markdown
> **Warning:** This will delete all data.

> **Tip:** Use environment variables for API keys.
```

### Links

The sync script automatically transforms relative links:

- **Lesson-to-lesson links** (`../02-next-lesson/README.md`) → absolute website paths
- **Code file links** (`.py`, `.js`, etc.) → GitHub blob URLs
- **Links escaping the content folder** → GitHub tree/blob URLs

```markdown
[Next lesson](../02-next-lesson/README.md)
[Source code](./main.py)
```

## Checklist

Before committing a lesson:

- [ ] Frontmatter has `title` (standard or commented format)
- [ ] Content starts with `##` not `#`
- [ ] Code blocks have language specified
- [ ] Relative links to other lessons work
