# Deploying to Netlify

This repository is ready for Netlify. Netlify will run `npm run build` and publish the `dist` folder.

Two deployment options:

1) Quick: Netlify Web UI (recommended)
   - Go to https://app.netlify.com/
   - "New site from Git" → connect your GitHub repo `naveenrajk17-dev/vintage-car-gallery` (or your repo)
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Deploy site.

2) CLI: Deploy directly from your machine
   - Install Netlify CLI if not installed:
     ```bash
     npm install -g netlify-cli
     # or use npx for one-off
     ```
   - Authenticate:
     ```bash
     netlify login
     ```
   - Build the project:
     ```bash
     npm run build
     ```
   - Deploy (preview):
     ```bash
     npx netlify deploy --dir=dist
     ```
   - Deploy (production):
     ```bash
     npx netlify deploy --prod --dir=dist
     ```

Notes:
- The repo includes `netlify.toml` with build and publish settings.
- If your site requires environment variables, add them in the Netlify UI (Site settings → Build & deploy → Environment). 
- CI/CD via Netlify automatically builds on push when connected to your Git repo.

If you want, I can:
- Attempt a CLI deploy from this environment (requires you to provide Netlify auth token), or
- Create a GitHub Action to trigger Netlify deploys on push (no CLI auth required if you use Netlify's GitHub integration).
