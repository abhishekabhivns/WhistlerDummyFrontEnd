

### Step 1: Update vite.config.js

Already done! The `base` path is set to match your repository name.

**Important:** Make sure the `base` value matches your GitHub repo name:
```javascript
base: '/WhistlerDummyFrontEnd/',  // Must match your repo name exactly
```

If your repo is named something different, update this value.

---

### Step 2: Install gh-pages Package

```bash
cd /Users/abhishekmukherjee/Documents/git/WhistlerDummyFrontEnd

# Install the deployment package
npm install --save-dev gh-pages
```

---

### Step 3: Push Code to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Prepare for GitHub Pages deployment"

# Create a new PUBLIC repository on GitHub
# Then push:
git remote add origin https://github.com/YOUR_USERNAME/WhistlerDummyFrontEnd.git
git branch -M main
git push -u origin main
```

**Important:** Repository must be **PUBLIC** for free GitHub Pages hosting.

---

### Step 4: Deploy to GitHub Pages

```bash
# Build and deploy in one command
npm run deploy
```

This will:
1. Build your React app for production
2. Create a `gh-pages` branch
3. Push the built files to GitHub
4. Your site goes live automatically!

---

### Step 5: Enable GitHub Pages

1. Go to your GitHub repository
2. Click **Settings** → **Pages**
3. Under "Source", select:
   - **Branch:** `gh-pages`
   - **Folder:** `/ (root)`
4. Click **Save**

GitHub will show your site URL:
```
https://YOUR_USERNAME.github.io/WhistlerDummyFrontEnd/
```

Wait 1-2 minutes for deployment to complete.

---

## 🌐 Your Site is Live!

**URL:** `https://YOUR_USERNAME.github.io/WhistlerDummyFrontEnd/`

Test it:
```bash
curl https://YOUR_USERNAME.github.io/WhistlerDummyFrontEnd/
```

---

## 🔄 Update Your Deployment

Whenever you make changes:

```bash
# Make your code changes
git add .
git commit -m "Update frontend"
git push origin main

# Redeploy to GitHub Pages
npm run deploy
```

The `gh-pages` branch updates automatically, and your site refreshes in ~1 minute.

---

## ⚙️ Update API URL for Production

Before deploying, update the API URL in `dmgo-recommendations.js`:

```javascript
// public/dmgo-recommendations.js
const API_BASE_URL = (function() {
  const hostname = window.location.hostname;

  // Local development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5000';
  }

  // GitHub Pages (production)
  // Replace with your Railway API URL
  return 'https://your-app.railway.app';
})();
```

After updating:
```bash
git add public/dmgo-recommendations.js
git commit -m "Update API URL for production"
git push origin main
npm run deploy
```

---

## 🎯 Custom Domain (Optional)

Want to use your own domain instead of `username.github.io`?

### Add Custom Domain

1. **Buy a domain** (e.g., `demo.whistler.com`)

2. **Add CNAME record** in your DNS:
   ```
   Type:  CNAME
   Name:  demo
   Value: YOUR_USERNAME.github.io
   ```

3. **Configure in GitHub:**
   - Settings → Pages → Custom domain
   - Enter: `demo.whistler.com`
   - Click Save
   - Wait for DNS check (5-60 minutes)

4. **Enable HTTPS:**
   - GitHub automatically generates SSL certificate
   - Check "Enforce HTTPS"

Your site will be available at `https://demo.whistler.com`

---

## 📊 GitHub Pages vs Railway (Frontend)

| Feature | GitHub Pages | Railway |
|---------|-------------|---------|
| **Cost** | FREE forever | $5/month (after free tier) |
| **Bandwidth** | Unlimited | Limited on free tier |
| **SSL/HTTPS** | ✅ Free | ✅ Free |
| **Custom Domain** | ✅ Free | ✅ Free |
| **Build Time** | Fast | Fast |
| **Best For** | Static sites, demos | Dynamic apps, APIs |

**For this frontend:** GitHub Pages is perfect and FREE! ✅

---

## 🐛 Troubleshooting

### Issue: 404 on GitHub Pages

**Problem:** Site shows 404 or blank page

**Solution:** Check the `base` path in `vite.config.js`:
```javascript
// Must match your repo name exactly
base: '/WhistlerDummyFrontEnd/',  // Include slashes!
```

### Issue: Routes don't work (404 on refresh)

**Problem:** React Router routes 404 when you refresh

**Solution:** GitHub Pages doesn't support SPA routing out of the box. Add a 404.html:

Create `public/404.html`:
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Redirecting...</title>
    <script>
      sessionStorage.redirect = location.href;
    </script>
    <meta http-equiv="refresh" content="0;URL='/'">
  </head>
  <body></body>
</html>
```

Update `index.html` (add before closing `</head>`):
```html
<script>
  (function(){
    var redirect = sessionStorage.redirect;
    delete sessionStorage.redirect;
    if (redirect && redirect != location.href) {
      history.replaceState(null, null, redirect);
    }
  })();
</script>
```

Then redeploy:
```bash
npm run deploy
```

### Issue: API calls failing (CORS)

**Problem:** API calls blocked by CORS

**Solution:** Make sure your Railway API has the GitHub Pages URL in ALLOWED_ORIGINS:
```
ALLOWED_ORIGINS=https://YOUR_USERNAME.github.io,https://www.whistler.com
```

### Issue: Assets not loading

**Problem:** CSS/JS files 404

**Solution:** Verify `base` in vite.config.js matches your repo name exactly.

---

## 📋 Deployment Checklist

Before deploying:

- [ ] Repository is PUBLIC on GitHub
- [ ] `base` in vite.config.js matches repo name
- [ ] API URL updated in dmgo-recommendations.js
- [ ] Railway API URL is correct
- [ ] Railway CORS allows GitHub Pages domain
- [ ] All files committed to git
- [ ] `npm install` completed
- [ ] `npm run build` works locally

Deploy:

- [ ] `git push origin main`
- [ ] `npm run deploy`
- [ ] Enable GitHub Pages in repo settings
- [ ] Wait 1-2 minutes
- [ ] Visit site URL
- [ ] Test all pages
- [ ] Test API integration

---

## 🔧 Advanced: Automate Deployment with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Install dependencies
      run: npm install

    - name: Build
      run: npm run build

    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

Now deployment is automatic on every push to `main`!

---

## 💡 Alternative: Environment-Based API URL

Create `.env.production`:
```
VITE_API_URL=https://your-app.railway.app
```

Update `dmgo-recommendations.js`:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

This way you can have different API URLs for development and production.

---

## 📝 Quick Commands Reference

```bash
# Install dependencies
npm install

# Test locally
npm run dev
# Visit http://localhost:3000

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy

# Update after changes
git add .
git commit -m "Update"
git push origin main
npm run deploy
```

---

## ✅ Success Checklist

Your site is successfully deployed when:

- [ ] URL loads: `https://YOUR_USERNAME.github.io/WhistlerDummyFrontEnd/`
- [ ] All 10 test pages are accessible
- [ ] Navigation works
- [ ] Recommendations load from Railway API
- [ ] No console errors (F12)
- [ ] All assets (CSS, JS, images) load correctly

---

## 🆘 Still Having Issues?

**Check these:**
1. Is repo PUBLIC?
2. Is gh-pages branch created?
3. Is GitHub Pages enabled in settings?
4. Does `base` in vite.config.js match repo name?
5. Is Railway API URL correct?
6. Are CORS settings correct on Railway?

**Common fix for most issues:**
```bash
# Redeploy everything
npm run build
npm run deploy
```

---

## 📞 Support

- **GitHub Pages Docs:** https://docs.github.com/pages
- **Vite Deployment:** https://vitejs.dev/guide/static-deploy.html
- **gh-pages Package:** https://www.npmjs.com/package/gh-pages

---

**Your demo site will be live at:**
`https://YOUR_USERNAME.github.io/WhistlerDummyFrontEnd/` 🚀

**FREE forever, no credit card needed!** 🎉
