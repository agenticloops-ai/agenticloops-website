# Deployment

Website: https://agenticloops.ai

## Production (GitHub Pages)

Production deploys automatically when a PR is merged to `main`. The workflow (`.github/workflows/build-deploy.yml`) runs on:

- **Push to `main`** — automatic deploy on every merge
- **`repository_dispatch`** — triggered by external content repos (e.g., course content updates)
- **`workflow_dispatch`** — manual trigger from the Actions tab

The workflow builds the Astro site, runs validation tests, and deploys to the `gh-pages` branch using [JamesIves/github-pages-deploy-action](https://github.com/JamesIves/github-pages-deploy-action). PR preview subdirectories are preserved during deployment.

### Required secrets/variables

| Name | Type | Description |
|------|------|-------------|
| `COURSE_CONTENT_TOKEN` | Secret | GitHub PAT for cloning private course repos |
| `PUBLIC_GOOGLE_ANALYTICS_ID` | Variable | Google Analytics measurement ID |

## PR Previews

Every pull request gets a live preview via `.github/workflows/pr-preview.yml`. The workflow triggers on PR `opened`, `synchronize`, `reopened`, and `closed` events.

- Preview URL: `https://agenticloops.ai/pr-preview/pr-<number>/`
- A comment with the preview link is automatically posted on the PR
- Preview is cleaned up when the PR is closed or merged

Uses [rossjrw/pr-preview-action](https://github.com/rossjrw/pr-preview-action) to deploy to a subdirectory on the `gh-pages` branch.

## Testing Locally

```bash
# Build locally
npm run build

# Preview production build
npm run preview
```

Check http://localhost:4321 before deploying.
