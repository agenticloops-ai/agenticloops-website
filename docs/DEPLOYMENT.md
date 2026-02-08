# Deployment

## Netlify

### Setup

1. [Import project](https://app.netlify.com/start) from GitHub
2. Settings auto-detected from `netlify.toml`
3. Deploy on every push to `main`

### Configuration

`netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"
```

### Environment Variables

You must add the following environment variables in your Netlify site settings:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `PUBLIC_GOOGLE_ANALYTICS_ID` | Google Analytics Measurement ID | `G-XXXXXXXXXX` |

---

## Auto-Rebuild from External Repos

When content in external course repos changes, the website can automatically rebuild.

### Option 1: Netlify Build Hook (Recommended)

1. **Create build hook** in Netlify:
   - Site settings → Build & deploy → Build hooks
   - Create hook, copy URL

2. **Add workflow to external repo** (`.github/workflows/trigger-rebuild.yml`):
   ```yaml
   name: Trigger Website Rebuild
   
   on:
     push:
       branches: [main]
   
   jobs:
     trigger:
       runs-on: ubuntu-latest
       steps:
         - run: curl -X POST -d {} ${{ secrets.NETLIFY_BUILD_HOOK }}
   ```

3. **Add secret** to external repo:
   - Settings → Secrets → Actions
   - Name: `NETLIFY_BUILD_HOOK`
   - Value: (the URL from step 1)

### Option 2: GitHub Actions (GitHub Pages)

Use the workflow in `.github/workflows/build-deploy.yml` with `repository_dispatch`:

1. Create a [Personal Access Token](https://github.com/settings/tokens) with `repo` scope
2. Add as `WEBSITE_REPO_TOKEN` secret in external repo
3. Copy `docs/external-repo-trigger.yml.example` to external repo

---

## Vercel

1. Import project from GitHub
2. Framework: Astro
3. Build command: `npm run build`
4. Output directory: `dist`

For auto-rebuild, use Vercel's [Deploy Hooks](https://vercel.com/docs/concepts/git/deploy-hooks) similar to Netlify.

---

## Testing Deployment

```bash
# Build locally
npm run build

# Preview production build
npm run preview
```

Check http://localhost:4321 before deploying.
