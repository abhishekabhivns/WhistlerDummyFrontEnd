# Complete Deployment - Quick Start

## 🎯 Deployment Strategy

Deploy in two parts:

1. **API (Backend)** → Railway ($10-20/month)
2. **Frontend (Demo)** → GitHub Pages (FREE)

**Total cost: $10-20/month**

---

## 🚀 Part 1: Deploy API to Railway (10 minutes)

Already prepared! All files are ready in DMGo-Whistler.

### Quick Steps:

```bash
# 1. Go to DMGo-Whistler directory
cd /Users/abhishekmukherjee/Documents/git/DMGo-Whistler

# 2. Make sure requirements.txt exists (not requirements_api.txt)
# If you still have requirements_api.txt, rename it:
mv requirements_api.txt requirements.txt

# 3. Push to GitHub
git add .
git commit -m "Ready for Railway deployment"
git push origin main

# 4. Go to railway.app
# - New Project → Deploy from GitHub
# - Select DMGo-Whistler repo
# - Wait 2-3 minutes
# - Copy your Railway URL

# 5. Set environment variables in Railway:
RAILWAY_ENVIRONMENT=production
ALLOWED_ORIGINS=https://YOUR_USERNAME.github.io,https://www.whistler.com
```

**Result:** API live at `https://your-app.railway.app`

**Test it:**
```bash
curl https://your-app.railway.app/health
```

---

## 🆓 Part 2: Deploy Frontend to GitHub Pages (5 minutes)

### Quick Steps:

```bash
# 1. Go to frontend directory
cd /Users/abhishekmukherjee/Documents/git/WhistlerDummyFrontEnd

# 2. Install gh-pages package
npm install

# 3. Update API URL in dmgo-recommendations.js
# Find this line:
#   return 'https://your-app.railway.app';
# Replace with your actual Railway URL from Part 1

# 4. Update vite.config.js base path
# Make sure it matches your GitHub repo name:
#   base: '/WhistlerDummyFrontEnd/',

# 5. Commit changes
git add .
git commit -m "Configure for GitHub Pages"
git push origin main

# 6. Deploy to GitHub Pages
npm run deploy
```

### Enable GitHub Pages:

1. Go to GitHub repo → **Settings** → **Pages**
2. Source: **gh-pages** branch
3. Click **Save**

**Result:** Site live at `https://YOUR_USERNAME.github.io/WhistlerDummyFrontEnd/`

**Wait 1-2 minutes, then visit your site!**

---

## ✅ Verification Checklist

### API (Railway)
- [ ] Deployed successfully
- [ ] Health check works: `curl https://your-app.railway.app/health`
- [ ] Environment variables set
- [ ] CORS configured

### Frontend (GitHub Pages)
- [ ] Site loads at `https://YOUR_USERNAME.github.io/WhistlerDummyFrontEnd/`
- [ ] All pages accessible
- [ ] Recommendations load from Railway API
- [ ] No console errors (F12)

---

## 🔧 Update API URL in Frontend

Before deploying frontend, update this file:

**File:** `public/dmgo-recommendations.js`

**Find this section:**
```javascript
const API_BASE_URL = (function() {
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:5000';
  }

  // Update this with your Railway URL:
  return 'https://your-app.railway.app';  // ← Change this!
})();
```

**Replace** `https://your-app.railway.app` with your actual Railway URL.

---

## 💰 Cost Breakdown

| Component | Platform | Monthly Cost |
|-----------|----------|--------------|
| API (Python/Flask) | Railway | $10-20 |
| Frontend (React) | GitHub Pages | **FREE** |
| SSL Certificates | Included | FREE |
| Custom Domains | Included | FREE |
| **TOTAL** | | **$10-20** |

---

## 🌐 Your Live URLs

After deployment:

**API:**
```
https://dmgo-whistler-production.railway.app
```

**Frontend:**
```
https://YOUR_USERNAME.github.io/WhistlerDummyFrontEnd/
```

**Test pages:**
```
https://YOUR_USERNAME.github.io/WhistlerDummyFrontEnd/activities/helicopter-tours
https://YOUR_USERNAME.github.io/WhistlerDummyFrontEnd/family
... (all 10 pages)
```

---

## 🔄 How to Update

### Update API:
```bash
cd DMGo-Whistler
# Make changes
git add .
git commit -m "Update API"
git push origin main
# Railway auto-deploys in ~2 minutes
```

### Update Frontend:
```bash
cd WhistlerDummyFrontEnd
# Make changes
git add .
git commit -m "Update frontend"
git push origin main
npm run deploy
# GitHub Pages updates in ~1 minute
```

---

## 🎯 What You Get

### API (Railway)
- ✅ HTTPS with SSL certificate
- ✅ Auto-scaling
- ✅ Environment variables
- ✅ Logs & monitoring
- ✅ Redis caching (add separately)
- ✅ Auto-deploy on git push

### Frontend (GitHub Pages)
- ✅ HTTPS with SSL certificate
- ✅ Unlimited bandwidth
- ✅ Global CDN
- ✅ Custom domains
- ✅ Auto-deploy with `npm run deploy`
- ✅ **Completely FREE**

---

## 🐛 Common Issues

### Issue 1: API not found (Railway)

**Error:** `gunicorn: command not found`

**Fix:**
```bash
# Make sure requirements.txt exists (not requirements_api.txt)
mv requirements_api.txt requirements.txt
git add requirements.txt
git commit -m "Fix requirements file"
git push origin main
```

### Issue 2: Frontend 404 (GitHub Pages)

**Error:** Site shows 404

**Fix:** Check `base` in vite.config.js matches repo name:
```javascript
base: '/WhistlerDummyFrontEnd/',  // Must match repo name exactly
```

### Issue 3: CORS errors

**Error:** API calls blocked

**Fix:** Add GitHub Pages URL to Railway environment variables:
```
ALLOWED_ORIGINS=https://YOUR_USERNAME.github.io,https://www.whistler.com
```

### Issue 4: Recommendations not loading

**Fix:** Check API URL in `dmgo-recommendations.js`:
```javascript
return 'https://your-actual-railway-url.railway.app';  // Make sure this is correct
```

---

## 📖 Detailed Guides

- **API Deployment:** [RAILWAY-QUICKSTART.md](./RAILWAY-QUICKSTART.md)
- **Frontend Deployment:** [GITHUB-PAGES-DEPLOYMENT.md](./GITHUB-PAGES-DEPLOYMENT.md)
- **Cost Comparison:** [DEPLOYMENT-COMPARISON.md](./DEPLOYMENT-COMPARISON.md)

---

## ✨ Next Steps After Deployment

1. **Test everything** - Visit all pages, check recommendations
2. **Share demo URL** - Send to stakeholders
3. **Monitor usage** - Check Railway metrics
4. **Add custom domain** (optional)
5. **Plan production integration** - When approved, integrate into Whistler.com

---

## 🎉 Summary

**Time:** 15 minutes total (10 min API + 5 min frontend)
**Cost:** $10-20/month (API only, frontend is FREE)
**Result:** Fully functional demo with live API

**Your demo will be live and ready to share!** 🚀

---

## 📞 Need Help?

Check these guides:
- **General issues:** [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- **Railway help:** [RAILWAY-DEPLOYMENT.md](./RAILWAY-DEPLOYMENT.md)
- **GitHub Pages help:** [GITHUB-PAGES-DEPLOYMENT.md](./GITHUB-PAGES-DEPLOYMENT.md)
