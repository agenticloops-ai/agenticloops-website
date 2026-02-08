# Content Authoring Guide

Guidelines for creating course content in external repositories.

## Lesson Structure

Each lesson is a `README.md` file in its own folder. Modules are located at the root of the repository:

```
repo-root/
├── 01-module-name/
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

## Frontmatter (Required)

Every `README.md` must start with YAML frontmatter:

```yaml
---
title: "Building Your First Agent"
description: "Learn to create a simple AI agent from scratch"
icon: "bot"
order: 2
---
```

| Field | Required | Description |
|-------|----------|-------------|
| `title` | ✅ | Displayed in navigation and page header |
| `description` | ❌ | Shown in search results and course cards |
| `icon` | ❌ | Lucide icon name (defaults to `book-open`) |
| `order` | ❌ | Sort order (defaults to folder name) |

### Available Icons

Use any [Lucide](https://lucide.dev/icons/) icon in kebab-case:

```
brain, bot, wrench, database, layers, rocket, code,
message-square, alert-triangle, book-open, terminal,
git-branch, zap, shield, cpu, server, cloud
```

## Content Guidelines

### Headings

```markdown
# Lesson Title (auto-generated from frontmatter, don't include)

## Main Section
Content...

### Subsection
Content...
```

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

```typescript
const agent = new Agent();
```

```bash
npm install openai
```
````

### Callouts/Alerts

Use blockquotes with emoji for emphasis:

```markdown
> ⚠️ **Warning:** This will delete all data.

> 💡 **Tip:** Use environment variables for API keys.

> 📝 **Note:** This is optional but recommended.
```

### Links

```markdown
[External Link](https://example.com)
[Link to another lesson](../02-next-lesson/README.md)
```

### Images

Place images in the lesson folder:

```
01-lesson/
├── README.md
└── images/
    └── diagram.png
```

Reference them relatively:

```markdown
![Agent Architecture](./images/diagram.png)
```

## Complete Example

```markdown
---
title: "Building Your First Agent"
description: "Create a simple AI agent with tool calling"
icon: "bot"
order: 2
---

## Overview

In this lesson, you'll build your first AI agent...

## Prerequisites

- Python 3.10+
- OpenAI API key

## Creating the Agent

First, install the dependencies:

```bash
pip install openai
```

Then create your agent:

```python
from openai import OpenAI

client = OpenAI()

def create_agent():
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": "Hello!"}]
    )
    return response.choices[0].message.content
```

> 💡 **Tip:** Store your API key in an environment variable.

## Summary

You learned how to:
- Set up the OpenAI client
- Create a basic agent
- Handle responses

## Next Steps

Continue to [Adding Tools](../03-adding-tools/README.md)
```

## Checklist

Before committing a lesson:

- [ ] Frontmatter has `title`
- [ ] Content starts with `##` not `#`
- [ ] Code blocks have language specified
- [ ] Images use relative paths
- [ ] Links to other lessons work
- [ ] No broken images or links
