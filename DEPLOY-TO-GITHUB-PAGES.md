# Deploy Vanilla Version to GitHub Pages

## Quick Deployment (3 Steps)

### Step 1: Commit and Push Changes

First, commit the React removal and push to GitHub:

```bash
cd /Users/abhishekmukherjee/Documents/git/WhistlerDummyFrontEnd

# Check what changed
git status

# Add all changes
git add -A

# Commit
git commit -m "Remove React, simplify to vanilla JavaScript only

- Remove React source code and dependencies (~250 MB)
- Update package.json to minimal (gh-pages only)
- Update README.md for vanilla-only project
- All functionality preserved in vanilla/ directory
- Project is now 99.8% smaller and simpler

BREAKING CHANGE: React version no longer available"

# Push to GitHub
git push origin main
```

### Step 2: Install gh-pages and Deploy

```bash
# Install gh-pages package (one time only)
npm install

# Deploy the vanilla/ folder to GitHub Pages
npm run deploy
```

**That's it!** The `npm run deploy` command will:
1. Take everything from the `vanilla/` folder
2. Push it to a `gh-pages` branch
3. GitHub will automatically serve it

### Step 3: Configure GitHub Pages (First Time Only)

1. Go to your GitHub repository
2. Click **Settings** tab
3. Click **Pages** in the left sidebar
4. Under "Source", select **Deploy from a branch**
5. Under "Branch", select **gh-pages** and **/ (root)**
6. Click **Save**

Wait 1-2 minutes for GitHub to deploy.

## Your Site URL

Your site will be available at:
```
https://YOUR-GITHUB-USERNAME.github.io/WhistlerDummyFrontEnd/
```

Replace `YOUR-GITHUB-USERNAME` with your actual GitHub username.

## Detailed Walkthrough

### Understanding the Deployment

The `package.json` has this script:
```json
{
  "scripts": {
    "deploy": "gh-pages -d vanilla"
  }
}
```

This means:
- `gh-pages` - Uses the gh-pages npm package
- `-d vanilla` - Deploys the `vanilla/` directory

The `gh-pages` package will:
1. Create a `gh-pages` branch (if it doesn't exist)
2. Copy all files from `vanilla/` to that branch
3. Push the branch to GitHub
4. GitHub Pages automatically serves from this branch

### What Gets Deployed

Everything in the `vanilla/` folder:
```
vanilla/
├── index.html                    → https://your-site.github.io/WhistlerDummyFrontEnd/
├── chat.html                     → https://your-site.github.io/WhistlerDummyFrontEnd/chat.html
├── activities/
│   ├── helicopter-tours.html     → https://your-site.github.io/WhistlerDummyFrontEnd/activities/helicopter-tours.html
│   └── vallea-lumina.html        → https://your-site.github.io/WhistlerDummyFrontEnd/activities/vallea-lumina.html
└── assets/
    ├── css/styles.css            → https://your-site.github.io/WhistlerDummyFrontEnd/assets/css/styles.css
    └── js/
        ├── dmgo-recommendations.js
        └── navigation.js
```

## Verifying the Deployment

### Check Deployment Status

1. Go to your GitHub repository
2. Click **Actions** tab
3. You should see "pages build and deployment" workflow
4. Wait for the green checkmark ✅

### Test Your Site

1. Open your site URL: `https://YOUR-GITHUB-USERNAME.github.io/WhistlerDummyFrontEnd/`
2. Verify:
   - ✅ Home page loads
   - ✅ Navigation works
   - ✅ All 11 pages accessible
   - ✅ Styling looks correct
   - ✅ Recommendations load from Railway API
   - ✅ No console errors

### Check Browser Console

Open DevTools (F12) and check:
- ✅ No 404 errors
- ✅ CSS loaded
- ✅ JavaScript loaded
- ✅ API calls successful
- ✅ Recommendations displayed

## Troubleshooting

### Issue: "npm: command not found"

You need Node.js and npm installed.

**Solution:**
```bash
# Check if you have Node.js
node --version

# If not, install from https://nodejs.org/
# Or use Homebrew on Mac:
brew install node
```

### Issue: "gh-pages not found"

You need to install dependencies first.

**Solution:**
```bash
npm install
```

### Issue: "remote: Permission denied"

You need to authenticate with GitHub.

**Solution:**
```bash
# Check if you're authenticated
git remote -v

# If using HTTPS, you may need a personal access token
# Or switch to SSH:
git remote set-url origin git@github.com:YOUR-USERNAME/WhistlerDummyFrontEnd.git
```

### Issue: "404 - File not found"

The site is deployed but files aren't loading.

**Possible Causes:**
1. GitHub Pages is still building (wait 1-2 minutes)
2. Wrong branch selected in settings
3. Case-sensitive filenames

**Solution:**
1. Wait 2 minutes and refresh
2. Check Settings → Pages → Branch is set to `gh-pages`
3. Check file paths are correct in links

### Issue: Recommendations Not Loading

API calls are failing on deployed site.

**Solution:**
The `dmgo-recommendations.js` automatically detects production and uses:
```
https://web-production-9b63e.up.railway.app
```

Verify:
1. Railway API is running: `curl https://web-production-9b63e.up.railway.app/health`
2. CORS is configured to allow your GitHub Pages domain
3. Check browser console for specific error

### Issue: Styling Broken

CSS not loading on deployed site.

**Check:**
1. View page source - is CSS linked correctly?
2. Open Network tab - is CSS loading (200 status)?
3. Check relative paths in `<link>` tags

All paths in the vanilla/ folder are already correct (relative paths).

## Updating Your Site

After making changes to the vanilla/ folder:

```bash
# 1. Test locally first
cd vanilla
python3 -m http.server 8080
# Verify changes work

# 2. Commit changes
git add vanilla/
git commit -m "Update: [describe changes]"
git push origin main

# 3. Redeploy to GitHub Pages
npm run deploy
```

Wait 1-2 minutes, then refresh your GitHub Pages site.

## Alternative: Deploy Without npm

If you don't want to use npm, you can deploy manually:

### Option 1: Using git directly

```bash
# Create gh-pages branch
git checkout --orphan gh-pages

# Remove everything
git rm -rf .

# Copy vanilla/ contents to root
cp -r vanilla/* .

# Commit and push
git add .
git commit -m "Deploy vanilla version"
git push origin gh-pages

# Switch back to main
git checkout main
```

**Downside**: You have to do this manually every time.

### Option 2: GitHub Actions (Automated)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./vanilla
```

Now every push to main automatically deploys!

## Custom Domain (Optional)

To use a custom domain like `whistler-test.your-domain.com`:

1. Go to Settings → Pages
2. Enter your custom domain
3. Add DNS records at your domain provider:
   - Type: CNAME
   - Name: whistler-test
   - Value: YOUR-USERNAME.github.io
4. Enable "Enforce HTTPS" in GitHub Pages settings

## Environment Variables

The vanilla version automatically detects the environment:

```javascript
// In dmgo-recommendations.js
const API_BASE_URL = (function() {
  const hostname = window.location.hostname;

  // Local development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5000';
  }

  // Production (GitHub Pages or deployed site)
  return 'https://web-production-9b63e.up.railway.app';
})();
```

No configuration needed!

## GitHub Pages Limits

Be aware of these limits:
- **Repository size**: Max 1 GB (you're using ~1 MB ✅)
- **Published site size**: Max 1 GB
- **Bandwidth**: 100 GB/month (soft limit)
- **Builds**: 10 per hour

You're well within all limits!

## Complete Deployment Checklist

### Before First Deployment
- ✅ React code removed
- ✅ Vanilla version tested locally
- ✅ API is running on Railway
- ✅ Changes committed to git
- ✅ Changes pushed to GitHub

### First Deployment
- ✅ `npm install` (installs gh-pages)
- ✅ `npm run deploy` (deploys vanilla/ folder)
- ✅ Configure GitHub Pages settings (one time)
- ✅ Wait 1-2 minutes for build
- ✅ Visit site URL
- ✅ Test all pages work

### Subsequent Deployments
- ✅ Make changes in vanilla/
- ✅ Test locally
- ✅ Commit and push to main
- ✅ `npm run deploy`
- ✅ Wait 1-2 minutes
- ✅ Verify changes on live site

## Summary

### Quick Commands

```bash
# First time setup
npm install

# Deploy
npm run deploy

# That's it!
```

### Your Site Will Be At

```
https://YOUR-GITHUB-USERNAME.github.io/WhistlerDummyFrontEnd/
```

### What Happens

1. `npm run deploy` copies `vanilla/` to `gh-pages` branch
2. GitHub automatically serves from `gh-pages` branch
3. Your site goes live in 1-2 minutes
4. API automatically uses Railway production URL

### Need Help?

- Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- Check [GITHUB-PAGES-DEPLOYMENT.md](./GITHUB-PAGES-DEPLOYMENT.md) (detailed guide)
- View GitHub Actions logs for deployment status

---

**Ready to Deploy?** Run these commands:

```bash
# Commit changes
git add -A
git commit -m "Remove React, use vanilla JavaScript only"
git push origin main

# Deploy to GitHub Pages
npm install
npm run deploy
```

Your site will be live in 2 minutes! 🚀
