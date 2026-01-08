# Deploy to Railway.app - Complete Guide

## What is Railway?

Railway.app is a modern Platform-as-a-Service (PaaS) that simplifies deployment. It provides:
- ✅ Automatic HTTPS/SSL certificates
- ✅ Zero configuration deployments
- ✅ Built-in Redis, PostgreSQL, etc.
- ✅ Free tier available ($5/month credit)
- ✅ Custom domains supported
- ✅ Environment variable management

**Perfect for deploying the DMGo-Whistler recommendation API!**

---

## Architecture Overview

We'll deploy two services on Railway:

```
┌─────────────────────────────────────────────────────┐
│ Railway.app                                         │
│                                                     │
│  ┌──────────────────┐        ┌─────────────────┐  │
│  │ Flask API        │◄───────┤ Redis           │  │
│  │ (Python)         │        │ (Caching)       │  │
│  │                  │        │                 │  │
│  │ Port: 5000       │        └─────────────────┘  │
│  │ Domain:          │                              │
│  │ api.railway.app  │                              │
│  └──────────────────┘                              │
│                                                     │
└─────────────────────────────────────────────────────┘
                     ▲
                     │ HTTPS
                     │
         ┌───────────┴──────────┐
         │ Whistler.com         │
         │ (calls API via JS)   │
         └──────────────────────┘
```

**Note:** The React frontend doesn't need to be deployed to Railway - it's just for testing. In production, you'll integrate the JavaScript into Whistler.com's existing site.

---

## Prerequisites

1. **Railway Account**: Sign up at https://railway.app
2. **GitHub Account**: Railway deploys from GitHub repositories
3. **Project Files**: Your DMGo-Whistler code

---

## Part 1: Prepare the API for Railway

### Step 1: Create Required Files

Railway needs specific files to know how to deploy your app.

#### 1.1 Create `railway.json` (Railway Configuration)

Create this file in the **DMGo-Whistler** directory:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "gunicorn --bind 0.0.0.0:$PORT api_server:app",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### 1.2 Create `Procfile` (Alternative Deployment Config)

Create in **DMGo-Whistler** directory:

```
web: gunicorn --bind 0.0.0.0:$PORT api_server:app
```

#### 1.3 Update `requirements_api.txt`

Add production server to your dependencies:

```txt
flask>=3.0.0
flask-cors>=4.0.0
pandas>=2.2.0
openpyxl>=3.1.0
scikit-learn>=1.4.0
numpy>=1.26.0
beautifulsoup4>=4.12.0
lxml>=5.0.0
gunicorn>=21.2.0
redis>=5.0.0
flask-caching>=2.1.0
```

#### 1.4 Create `runtime.txt` (Specify Python Version)

Create in **DMGo-Whistler** directory:

```
python-3.11.0
```

#### 1.5 Update `api_server.py` for Production

Edit the file to work with Railway's environment:

```python
"""
Flask API Server for DMGo-Whistler Recommendation Engine
Production-ready version for Railway.app deployment
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_caching import Cache
from page_recommender_api import ImprovedPageRecommender
import os

app = Flask(__name__)

# Environment detection
ENV = os.getenv('RAILWAY_ENVIRONMENT', 'development')
PORT = int(os.getenv('PORT', 5000))

# CORS configuration
if ENV == 'production':
    # Production: Allow specific origins
    allowed_origins = os.getenv('ALLOWED_ORIGINS', 'https://www.whistler.com').split(',')
    CORS(app, resources={
        r"/api/*": {
            "origins": allowed_origins,
            "methods": ["POST", "GET", "OPTIONS"],
            "allow_headers": ["Content-Type"]
        }
    })
else:
    # Development: Allow all origins
    CORS(app)

# Caching configuration
REDIS_URL = os.getenv('REDIS_URL')
if REDIS_URL:
    # Use Redis if available (Railway Redis plugin)
    cache = Cache(app, config={
        'CACHE_TYPE': 'redis',
        'CACHE_REDIS_URL': REDIS_URL,
        'CACHE_DEFAULT_TIMEOUT': 3600
    })
    print("✓ Redis caching enabled")
else:
    # Fall back to simple cache
    cache = Cache(app, config={'CACHE_TYPE': 'simple'})
    print("⚠ Using simple cache (add Redis for better performance)")

# Initialize recommender with Excel file
EXCEL_PATH = 'DMGo.xlsx'
recommender = None

def init_recommender():
    """Initialize the recommendation engine on startup"""
    global recommender
    if not os.path.exists(EXCEL_PATH):
        raise FileNotFoundError(f"Excel file not found: {EXCEL_PATH}")
    recommender = ImprovedPageRecommender(EXCEL_PATH)
    print("✓ Recommendation engine initialized successfully")

@app.route('/')
def home():
    """Root endpoint - API info"""
    return jsonify({
        'service': 'DMGo-Whistler Recommendation API',
        'version': '1.0.0',
        'status': 'running',
        'environment': ENV,
        'endpoints': {
            'health': '/health',
            'recommendations': '/api/recommendations',
            'pages': '/api/pages',
            'tiles': '/api/tiles'
        }
    })

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for Railway"""
    return jsonify({
        'status': 'healthy',
        'service': 'DMGo-Whistler Recommendation API',
        'version': '1.0.0',
        'environment': ENV
    })

@app.route('/api/recommendations', methods=['POST'])
@cache.cached(timeout=3600, query_string=True)
def get_recommendations():
    """
    Get recommendations for a specific page URL
    Cached for 1 hour per unique URL
    """
    try:
        data = request.get_json()

        if not data or 'url' not in data:
            return jsonify({
                'error': 'Missing required field: url'
            }), 400

        page_url = data['url']
        n_recommendations = data.get('n_recommendations', 3)

        # Get recommendations from the engine
        recommendations = recommender.get_recommendations_for_url(
            page_url,
            n_recommendations
        )

        return jsonify({
            'page_url': page_url,
            'recommendations': recommendations
        })

    except Exception as e:
        app.logger.error(f"Error in get_recommendations: {str(e)}")
        return jsonify({
            'error': str(e)
        }), 500

@app.route('/api/pages', methods=['GET'])
def get_test_pages():
    """Get list of all test pages"""
    try:
        pages = recommender.get_test_pages()
        return jsonify({
            'pages': pages
        })
    except Exception as e:
        app.logger.error(f"Error in get_test_pages: {str(e)}")
        return jsonify({
            'error': str(e)
        }), 500

@app.route('/api/tiles', methods=['GET'])
def get_all_tiles():
    """Get all available content tiles"""
    try:
        tiles = recommender.get_all_tiles()
        return jsonify({
            'tiles': tiles
        })
    except Exception as e:
        app.logger.error(f"Error in get_all_tiles: {str(e)}")
        return jsonify({
            'error': str(e)
        }), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'error': 'Endpoint not found'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'error': 'Internal server error'
    }), 500

# Initialize recommender on startup
try:
    init_recommender()
except Exception as e:
    print(f"⚠ Warning: Could not initialize recommender: {e}")
    print("The API will start but recommendations will not work.")

if __name__ == '__main__':
    # For local development
    print(f"Starting DMGo-Whistler API on port {PORT}...")
    app.run(host='0.0.0.0', port=PORT, debug=(ENV != 'production'))
```

---

## Part 2: Deploy to Railway

### Step 1: Push Code to GitHub

```bash
cd /Users/abhishekmukherjee/Documents/git/DMGo-Whistler

# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Prepare for Railway deployment"

# Create GitHub repository and push
# (Follow GitHub instructions to create new repo)
git remote add origin https://github.com/yourusername/DMGo-Whistler.git
git branch -M main
git push -u origin main
```

**Important:** Make sure `DMGo.xlsx` is included in the repository!

### Step 2: Create Railway Project

1. Go to https://railway.app
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway to access your GitHub account
5. Select the **DMGo-Whistler** repository

Railway will automatically:
- ✅ Detect it's a Python app
- ✅ Install dependencies from requirements_api.txt
- ✅ Start the app using Procfile or railway.json
- ✅ Assign a public URL (e.g., `your-app.railway.app`)
- ✅ Generate SSL certificate

### Step 3: Configure Environment Variables

In Railway dashboard:

1. Click on your project
2. Go to **"Variables"** tab
3. Add these variables:

```
RAILWAY_ENVIRONMENT=production
ALLOWED_ORIGINS=https://www.whistler.com,https://whistler.com
PORT=5000
```

### Step 4: Add Redis (Optional but Recommended)

In Railway dashboard:

1. Click **"New"** → **"Database"** → **"Add Redis"**
2. Railway automatically creates `REDIS_URL` environment variable
3. Your API will detect and use it automatically

### Step 5: Deploy!

Railway automatically deploys when you push to GitHub. Watch the deployment logs:

1. Click on your service
2. Go to **"Deployments"** tab
3. Click on the latest deployment
4. Watch the build and deploy logs

If successful, you'll see:
```
✓ Loaded 10 test pages
✓ Loaded 19 content tiles
✓ Recommendation engine initialized successfully
```

### Step 6: Get Your API URL

Once deployed, Railway provides a URL like:
```
https://dmgo-whistler-production.up.railway.app
```

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

## Part 3: Update Frontend to Use Railway API

### Update dmgo-recommendations.js

```javascript
// /Users/abhishekmukherjee/Documents/git/WhistlerDummyFrontEnd/public/dmgo-recommendations.js

(function(window) {
  'use strict';

  // Environment detection with Railway support
  const API_BASE_URL = (function() {
    const hostname = window.location.hostname;

    // Local development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5000';
    }

    // Production Railway API
    // TODO: Replace with your actual Railway URL
    return 'https://dmgo-whistler-production.up.railway.app';

    // Alternative: Use environment variable in build process
    // return process.env.VITE_API_URL || 'https://your-app.railway.app';
  })();

  window.loadRecommendations = function(options) {
    // ... rest of the function stays the same
  };
})(window);
```

### Test the Integration

1. Start your local frontend:
```bash
cd /Users/abhishekmukherjee/Documents/git/WhistlerDummyFrontEnd
npm run dev
```

2. Open http://localhost:3000
3. Check browser console - you should see API calls to Railway URL
4. Recommendations should load from Railway

---

## Part 4: Custom Domain (Optional)

### Add Custom Domain to Railway

If you want to use `api.whistler.com` instead of Railway's default URL:

1. In Railway dashboard → Your service → **"Settings"**
2. Scroll to **"Domains"**
3. Click **"Add Domain"**
4. Enter: `api.whistler.com`
5. Railway provides CNAME record

### Update DNS at Your Domain Provider

Add CNAME record:
```
Type:  CNAME
Name:  api
Value: your-app.railway.app
TTL:   3600
```

Wait for DNS propagation (5-60 minutes), then:
- Railway automatically generates SSL certificate
- Your API is available at `https://api.whistler.com`

### Update Frontend with Custom Domain

```javascript
// dmgo-recommendations.js
const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5000'
  : 'https://api.whistler.com';  // Your custom domain
```

---

## Part 5: Environment-Specific Configuration

### Using Railway Environment Variables in Frontend

#### Option A: Build-time Variables (Vite)

Create `.env.production`:
```env
VITE_API_URL=https://dmgo-whistler-production.up.railway.app
```

Update dmgo-recommendations.js:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

#### Option B: Runtime Configuration

Create `config.js` deployed alongside your script:
```javascript
// config.js
window.DMGO_CONFIG = {
  apiUrl: 'https://dmgo-whistler-production.up.railway.app'
};
```

```html
<!-- In Whistler.com -->
<script src="/config.js"></script>
<script src="/dmgo-recommendations.js"></script>
```

---

## Part 6: Monitoring & Maintenance

### View Logs

In Railway dashboard:
1. Click on your service
2. Go to **"Deployments"** tab
3. Click **"View Logs"**

You'll see:
- Application logs
- Error messages
- Request logs

### Set Up Alerts

Railway can notify you of:
- Deployment failures
- High memory usage
- Service crashes

Configure in: Settings → Notifications

### Monitor Usage

Railway provides metrics for:
- CPU usage
- Memory usage
- Network traffic
- Request count

View in: Service → **"Metrics"** tab

---

## Part 7: Pricing & Cost Management

### Railway Pricing (as of 2024)

**Free Tier:**
- $5 of usage credit per month
- All features included
- No credit card required

**Pay as You Go:**
- $0.000463 per GB-hour (memory)
- $0.000231 per vCPU-hour
- Estimate: ~$10-20/month for this API

**Cost Optimization Tips:**

1. **Use Redis caching** - Reduces compute time
2. **Set memory limits** - Prevent overage
3. **Use sleep feature** - Auto-sleep during low traffic
4. **Monitor usage** - Check metrics regularly

### Set Resource Limits

In Railway dashboard → Service → Settings:
```
Memory Limit: 1GB (sufficient for this API)
Auto-sleep: After 1 hour of inactivity (optional)
```

---

## Part 8: CI/CD - Automatic Deployments

Railway automatically deploys when you push to GitHub:

```bash
# Make changes to code
git add .
git commit -m "Update recommendation algorithm"
git push origin main

# Railway automatically:
# 1. Detects the push
# 2. Builds the new version
# 3. Runs tests (if configured)
# 4. Deploys to production
# 5. Keeps old version running until new one is ready (zero downtime)
```

### Deployment Triggers

Configure in Railway:
- Deploy on: `main` branch (default)
- Or: Deploy on specific branches
- Or: Deploy on pull request

---

## Part 9: Rollback & Version Control

### Rollback to Previous Version

If deployment has issues:

1. Railway dashboard → Service → **"Deployments"**
2. Find previous successful deployment
3. Click **"Redeploy"**
4. Instant rollback!

### View Deployment History

All deployments are saved with:
- Git commit hash
- Build logs
- Deployment time
- Status (success/failed)

---

## Part 10: Troubleshooting Railway Deployment

### Common Issues

#### Issue 1: Build Fails - Missing Dependencies

**Error:** `ModuleNotFoundError: No module named 'flask'`

**Solution:** Check `requirements_api.txt` includes all dependencies:
```bash
# Test locally first
pip install -r requirements_api.txt
python api_server.py
```

#### Issue 2: File Not Found - DMGo.xlsx

**Error:** `FileNotFoundError: Excel file not found: DMGo.xlsx`

**Solution:** Ensure DMGo.xlsx is committed to git:
```bash
git add DMGo.xlsx
git commit -m "Add data file"
git push origin main
```

#### Issue 3: Port Binding Error

**Error:** `Address already in use`

**Solution:** Use Railway's `$PORT` environment variable:
```python
PORT = int(os.getenv('PORT', 5000))
app.run(host='0.0.0.0', port=PORT)
```

#### Issue 4: CORS Errors in Production

**Error:** `Access to fetch blocked by CORS policy`

**Solution:** Add your domain to `ALLOWED_ORIGINS` variable in Railway:
```
ALLOWED_ORIGINS=https://www.whistler.com,https://whistler.com
```

#### Issue 5: Out of Memory

**Error:** `Killed (out of memory)`

**Solution:**
- Increase memory limit in Railway settings
- Optimize code (reduce pandas memory usage)
- Use Redis caching to reduce compute

---

## Complete Deployment Checklist

### Pre-Deployment

- [ ] Create `railway.json` in DMGo-Whistler directory
- [ ] Create `Procfile` in DMGo-Whistler directory
- [ ] Update `requirements_api.txt` with gunicorn
- [ ] Create `runtime.txt` with Python version
- [ ] Update `api_server.py` with Railway configuration
- [ ] Ensure `DMGo.xlsx` is in repository
- [ ] Test locally: `gunicorn api_server:app`

### Railway Setup

- [ ] Create Railway account
- [ ] Push code to GitHub
- [ ] Create new Railway project from GitHub
- [ ] Add environment variables (ALLOWED_ORIGINS, etc.)
- [ ] Add Redis database (optional)
- [ ] Wait for deployment to complete
- [ ] Test health endpoint: `curl https://your-app.railway.app/health`

### Frontend Integration

- [ ] Get Railway API URL from dashboard
- [ ] Update `dmgo-recommendations.js` with Railway URL
- [ ] Test integration locally
- [ ] Deploy frontend changes

### Production Validation

- [ ] Test all API endpoints
- [ ] Check CORS headers
- [ ] Verify caching working
- [ ] Monitor logs for errors
- [ ] Test from actual Whistler.com (if integrated)
- [ ] Set up monitoring/alerts

### Optional Enhancements

- [ ] Add custom domain (api.whistler.com)
- [ ] Set resource limits
- [ ] Configure auto-sleep for cost savings
- [ ] Set up deployment notifications
- [ ] Document rollback procedure

---

## Quick Commands Reference

```bash
# Local testing with Gunicorn (same as Railway)
gunicorn --bind 0.0.0.0:5000 api_server:app

# Test API endpoints
curl https://your-app.railway.app/health
curl -X POST https://your-app.railway.app/api/recommendations \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.whistler.com/family/","n_recommendations":3}'

# Deploy new version
git add .
git commit -m "Update"
git push origin main

# View Railway logs
railway logs
# (requires Railway CLI: npm i -g @railway/cli)
```

---

## Railway vs Other Options

| Feature | Railway | Heroku | AWS | DigitalOcean |
|---------|---------|--------|-----|--------------|
| Setup Time | 5 min | 15 min | 1-2 hrs | 30 min |
| Free Tier | $5/month | Limited | Limited | No |
| Auto SSL | ✅ | ✅ | Manual | Manual |
| Auto Deploy | ✅ | ✅ | Manual | Manual |
| Easy Rollback | ✅ | ✅ | Complex | Manual |
| Cost (est.) | $10-20 | $7-50 | $20-50 | $12-24 |

**Railway is perfect for this use case** because:
- Fastest setup
- Built-in Redis
- Automatic HTTPS
- Simple pricing
- Great for small APIs

---

## Support & Resources

- **Railway Docs:** https://docs.railway.app
- **Railway Discord:** https://discord.gg/railway
- **Status Page:** https://status.railway.app

---

## Summary

**Deployment Time: ~15 minutes**

1. ✅ Create Railway account (2 min)
2. ✅ Prepare files (5 min)
3. ✅ Push to GitHub (2 min)
4. ✅ Deploy on Railway (3 min)
5. ✅ Update frontend URL (2 min)
6. ✅ Test everything (5 min)

**Total Cost: ~$10-20/month** (includes Redis, SSL, hosting)

**Benefits:**
- Zero infrastructure management
- Automatic HTTPS
- One-click deployments
- Built-in monitoring
- Easy rollbacks

Your API will be live at: `https://your-app.railway.app` 🚀
