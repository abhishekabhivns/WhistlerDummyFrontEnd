# Railway Deployment - Quick Start Guide

## 🚀 Deploy in 10 Minutes

### Prerequisites
- Railway account: https://railway.app (free)
- GitHub account
- Your code in GitHub repository

---

## Step 1: Prepare Your Code (2 minutes)

The required files have already been created in the DMGo-Whistler directory:

```
DMGo-Whistler/
├── railway.json        ✅ Already created
├── Procfile           ✅ Already created
├── runtime.txt        ✅ Already created
├── requirements_api.txt ✅ Updated with gunicorn
├── api_server.py      ✅ Updated for production
└── DMGo.xlsx          ⚠️ Make sure this exists!
```

Verify DMGo.xlsx exists:
```bash
cd /Users/abhishekmukherjee/Documents/git/DMGo-Whistler
ls -la DMGo.xlsx
```

---

## Step 2: Push to GitHub (2 minutes)

```bash
cd /Users/abhishekmukherjee/Documents/git/DMGo-Whistler

# Initialize git (if not already done)
git init
git add .
git commit -m "Prepare for Railway deployment"

# Push to GitHub
# (Create a new repo on GitHub first, then:)
git remote add origin https://github.com/YOUR_USERNAME/DMGo-Whistler.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy on Railway (3 minutes)

1. **Go to Railway**: https://railway.app/new

2. **Connect GitHub**:
   - Click "Deploy from GitHub repo"
   - Authorize Railway
   - Select `DMGo-Whistler` repository

3. **Railway auto-deploys**:
   - Detects Python app ✅
   - Installs dependencies ✅
   - Starts with Gunicorn ✅
   - Assigns public URL ✅

4. **Wait for deployment** (~2 minutes)
   - Watch build logs in Railway dashboard
   - Look for: "✓ Recommendation engine initialized"

---

## Step 4: Get Your API URL (1 minute)

In Railway dashboard:
1. Click on your deployed service
2. Go to "Settings" tab
3. Copy the public URL (e.g., `https://your-app.railway.app`)

Test it:
```bash
curl https://your-app.railway.app/health
```

Should return:
```json
{
  "status": "healthy",
  "service": "DMGo-Whistler Recommendation API",
  "version": "1.0.0"
}
```

---

## Step 5: Add Environment Variables (1 minute)

In Railway dashboard → Variables tab, add:

```
RAILWAY_ENVIRONMENT=production
ALLOWED_ORIGINS=https://www.whistler.com,https://whistler.com
```

Click "Deploy" to apply changes.

---

## Step 6: Add Redis (Optional, 1 minute)

For better performance:

1. In Railway dashboard, click "New"
2. Select "Database" → "Redis"
3. Railway automatically creates `REDIS_URL` variable
4. Your API will detect and use it

---

## Step 7: Update Frontend (2 minutes)

Edit `/Users/abhishekmukherjee/Documents/git/WhistlerDummyFrontEnd/public/dmgo-recommendations.js`:

```javascript
// Find this section (around line 14-18):
const API_BASE_URL = (function() {
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:5000';
  }

  // Add your Railway URL here:
  return 'https://your-app.railway.app';  // Replace with your actual URL
})();
```

---

## Step 8: Test Everything (2 minutes)

```bash
# Start local frontend
cd /Users/abhishekmukherjee/Documents/git/WhistlerDummyFrontEnd
npm run dev
```

Visit http://localhost:3000 and:
- ✅ Open browser console (F12)
- ✅ Navigate to any test page
- ✅ Should see API calls to Railway URL
- ✅ Recommendations load from Railway

---

## ✅ Done! Your API is Live

Your API is now:
- 🌐 Publicly accessible at `https://your-app.railway.app`
- 🔒 Protected by HTTPS (automatic SSL)
- 📊 Monitored (view logs in Railway)
- 🔄 Auto-deploys on git push

---

## What's Next?

### Add Custom Domain (Optional)

Want `api.whistler.com` instead of Railway URL?

1. Railway dashboard → Settings → Domains
2. Add domain: `api.whistler.com`
3. Railway provides CNAME record
4. Add CNAME to your DNS:
   ```
   Type:  CNAME
   Name:  api
   Value: your-app.railway.app
   ```
5. Wait 5-60 minutes for DNS propagation
6. SSL automatically generated ✅

### Monitor Your Deployment

Railway dashboard shows:
- **Deployments**: History and logs
- **Metrics**: CPU, memory, requests
- **Logs**: Real-time application logs
- **Settings**: Environment variables, domains

---

## Common Issues

### Issue: Build fails

**Check:**
```bash
# Test locally first
pip install -r requirements_api.txt
gunicorn api_server:app
```

### Issue: File not found (DMGo.xlsx)

**Solution:**
```bash
# Make sure it's committed to git
git add DMGo.xlsx
git commit -m "Add data file"
git push
```

### Issue: CORS errors

**Solution:**
Add your domain to environment variables:
```
ALLOWED_ORIGINS=https://www.whistler.com
```

---

## Cost

Railway pricing:
- **Free tier**: $5/month credit (enough for testing)
- **Typical cost**: $10-20/month for production use
- **What you get**:
  - Hosting
  - SSL certificate
  - Auto-scaling
  - Redis (optional)
  - Monitoring

---

## Quick Commands

```bash
# View logs (requires Railway CLI)
npm i -g @railway/cli
railway login
railway logs

# Deploy new version
git push origin main
# Railway auto-deploys in ~2 minutes

# Rollback to previous version
# Do this in Railway dashboard → Deployments → Redeploy
```

---

## Need More Details?

See the comprehensive guide: **[RAILWAY-DEPLOYMENT.md](RAILWAY-DEPLOYMENT.md)**

Covers:
- Detailed configuration
- Custom domains
- Cost optimization
- Troubleshooting
- CI/CD setup
- Monitoring

---

## Success Checklist

- [x] Code prepared with Railway files
- [x] Pushed to GitHub
- [x] Deployed on Railway
- [x] Health check passes
- [x] Environment variables set
- [x] Frontend updated with Railway URL
- [x] Test recommendations loading
- [ ] Optional: Add Redis for caching
- [ ] Optional: Add custom domain
- [ ] Optional: Set up monitoring alerts

---

**Your API is live! 🎉**

Railway URL: `https://your-app.railway.app`

Test it: `curl https://your-app.railway.app/health`
