# Production Integration Guide for Whistler.com

## Overview

Integrating this JavaScript recommendation engine into production Whistler.com requires addressing several critical concerns around security, performance, and reliability.

---

## 🔒 1. CORS (Cross-Origin Resource Sharing) Issues

### The Problem

If your API server is on a different domain than Whistler.com, browsers will block the API calls.

**Example Scenario:**
- Frontend: `https://www.whistler.com`
- API: `https://api-recommendations.whistler.com`
- Result: ❌ **CORS error**

### Solution Options

#### Option A: Same Domain (Recommended)
Deploy API on same domain as main site:
```
Frontend: https://www.whistler.com
API:      https://www.whistler.com/api/recommendations
```

**Implementation:**
```javascript
// Update dmgo-recommendations.js
const API_BASE_URL = '/api';  // Relative path, same domain
```

**Web Server Config (Nginx example):**
```nginx
server {
    server_name www.whistler.com;

    # Main site
    location / {
        proxy_pass http://cms_backend;
    }

    # API proxy
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### Option B: CORS Headers (If different domain required)
Configure Flask API to allow Whistler.com origin:

```python
# In api_server.py
from flask_cors import CORS

app = Flask(__name__)

# Production CORS config
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "https://www.whistler.com",
            "https://whistler.com"
        ],
        "methods": ["POST", "GET", "OPTIONS"],
        "allow_headers": ["Content-Type"],
        "max_age": 3600
    }
})
```

**Security Note:** Never use `CORS(app)` (allows all origins) in production!

---

## 🔐 2. SSL/HTTPS Certificate Issues

### The Problem

**Mixed Content Blocking:** If Whistler.com uses HTTPS (which it should), you cannot load HTTP resources.

```
https://www.whistler.com loads http://api.whistler.com/recommendations
❌ Blocked by browser: "Mixed Content"
```

### Solution

**Everything must be HTTPS in production:**

✅ **Required:**
- Main site: `https://www.whistler.com`
- API endpoint: `https://www.whistler.com/api` or `https://api.whistler.com`
- Script source: `https://cdn.whistler.com/dmgo-recommendations.js`

**Certificate Requirements:**
```bash
# API server needs valid SSL certificate
# Option 1: Let's Encrypt (free)
certbot certonly --nginx -d api.whistler.com

# Option 2: Wildcard cert for *.whistler.com
certbot certonly --dns-cloudflare -d "*.whistler.com"
```

**Flask with SSL (for testing):**
```python
# Production: Use Nginx/Apache with SSL, proxy to Flask
# Development with self-signed cert:
if __name__ == '__main__':
    app.run(
        ssl_context=('cert.pem', 'key.pem'),
        host='0.0.0.0',
        port=5000
    )
```

**Production Deployment (Recommended):**
Don't run Flask directly - use proper web server:
```
Internet → Nginx (SSL termination) → Gunicorn → Flask App
```

---

## 🛡️ 3. Content Security Policy (CSP)

### The Problem

If Whistler.com has a Content Security Policy header, it may block the script from loading or executing.

**Example CSP that blocks inline scripts:**
```
Content-Security-Policy: script-src 'self' https://cdn.whistler.com
```

### Solution

#### Check Current CSP:
```bash
curl -I https://www.whistler.com | grep -i content-security
```

#### Option A: Host script on approved CDN
```html
<!-- If CSP allows 'self' or cdn.whistler.com -->
<script src="https://cdn.whistler.com/dmgo/recommendations.js"></script>
```

#### Option B: Add script source to CSP
```
Content-Security-Policy:
  script-src 'self' https://cdn.whistler.com https://api.whistler.com;
  connect-src 'self' https://api.whistler.com;
```

#### Option C: Use nonce for inline scripts
```html
<!-- Server generates unique nonce per request -->
<script nonce="r4nd0m-n0nc3">
  loadRecommendations({...});
</script>
```

```
Content-Security-Policy: script-src 'nonce-r4nd0m-n0nc3'
```

---

## ⚡ 4. Performance Concerns

### API Latency Impact

**Problem:** API call blocks recommendation rendering. Slow API = poor user experience.

**Solutions:**

#### A. Async Loading (Non-blocking)
```javascript
// Load recommendations asynchronously, don't block page render
window.addEventListener('load', function() {
  // Page fully loaded, now fetch recommendations
  loadRecommendations({...});
});
```

#### B. Server-Side Rendering (Best for SEO)
Pre-render recommendations on the server:

```php
// In Whistler.com CMS (PHP example)
<?php
$recommendations = file_get_contents(
    'https://api.whistler.com/api/recommendations',
    false,
    stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => 'Content-Type: application/json',
            'content' => json_encode([
                'url' => $current_page_url,
                'n_recommendations' => 3
            ])
        ]
    ])
);

$tiles = json_decode($recommendations, true);
?>

<!-- Server-rendered HTML (no JS required) -->
<div class="row">
  <?php foreach ($tiles['recommendations'] as $rec): ?>
    <?php echo $rec['html']; ?>
  <?php endforeach; ?>
</div>
```

**Benefits:**
- Faster initial render
- SEO-friendly (crawlers see content)
- Works without JavaScript

#### C. Caching Strategy
```python
# In Flask API - add caching
from flask_caching import Cache

cache = Cache(app, config={
    'CACHE_TYPE': 'redis',
    'CACHE_REDIS_URL': 'redis://localhost:6379/0',
    'CACHE_DEFAULT_TIMEOUT': 3600  # 1 hour
})

@app.route('/api/recommendations', methods=['POST'])
@cache.cached(timeout=3600, query_string=True)
def get_recommendations():
    # Cache recommendations per URL for 1 hour
    ...
```

#### D. CDN for Script
```html
<!-- Serve script from CDN for faster global delivery -->
<script src="https://cdn.whistler.com/dmgo/recommendations-v1.2.3.js"></script>
```

---

## 🌐 5. Domain and Path Configuration

### The Problem

Hardcoded localhost URLs won't work in production.

**Current (development):**
```javascript
const API_BASE_URL = 'http://localhost:5000';
```

**Production Issues:**
- ❌ localhost doesn't exist in production
- ❌ Port 5000 not exposed to internet
- ❌ HTTP not allowed on HTTPS sites

### Solution: Environment-Based Configuration

```javascript
// dmgo-recommendations.js - Updated version
(function(window) {
  'use strict';

  // Auto-detect environment
  const API_BASE_URL = (function() {
    // Check if running locally
    if (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1') {
      return 'http://localhost:5000';
    }

    // Production: Use relative path (same domain)
    return '';  // Relative URLs: /api/recommendations

    // OR: Use production API domain
    // return 'https://api.whistler.com';
  })();

  window.loadRecommendations = function(options) {
    fetch(API_BASE_URL + '/api/recommendations', {
      // ...
    });
  };
})(window);
```

---

## 🔑 6. Authentication & Authorization

### Considerations

**Do you need to:**
- Track which CMS user triggered the request?
- Prevent abuse/unauthorized access?
- Rate limit by user/IP?

### Solution: API Key Authentication

```javascript
// dmgo-recommendations.js
fetch(API_BASE_URL + '/api/recommendations', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'your-secure-api-key-here'
  },
  body: JSON.stringify({...})
});
```

```python
# Flask API
from functools import wraps
from flask import request, jsonify

API_KEY = os.environ.get('DMGO_API_KEY')

def require_api_key(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        key = request.headers.get('X-API-Key')
        if key != API_KEY:
            return jsonify({'error': 'Unauthorized'}), 401
        return f(*args, **kwargs)
    return decorated_function

@app.route('/api/recommendations', methods=['POST'])
@require_api_key
def get_recommendations():
    ...
```

**Better: Use IP Whitelisting**
```python
ALLOWED_IPS = ['192.168.1.100', '10.0.0.50']  # Whistler.com servers

def check_ip():
    client_ip = request.headers.get('X-Real-IP') or request.remote_addr
    if client_ip not in ALLOWED_IPS:
        abort(403)
```

---

## 📊 7. Rate Limiting

### The Problem

Production traffic can overwhelm the API server.

**Scenario:**
- 10,000 visitors/hour
- Each page loads 3 recommendations
- 30,000 API calls/hour
- Without caching: **Server overload**

### Solution: Implement Rate Limiting

```python
# Flask API
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["1000 per hour", "100 per minute"],
    storage_uri="redis://localhost:6379"
)

@app.route('/api/recommendations', methods=['POST'])
@limiter.limit("20 per minute")  # Per IP address
def get_recommendations():
    ...
```

**Alternative: Application-level caching**
```python
# Cache at multiple levels
1. Browser cache (304 Not Modified)
2. CDN cache (CloudFlare, Fastly)
3. Application cache (Redis)
4. Database query cache
```

---

## 🧪 8. Testing in Production-Like Environment

### Staging Environment Setup

Before deploying to production, test in staging:

```bash
# Staging setup
Frontend: https://staging.whistler.com
API:      https://staging-api.whistler.com

# Use same SSL, same domains, same config
# Different database/content for testing
```

### Integration Checklist

- [ ] HTTPS working (valid certificate)
- [ ] CORS configured correctly
- [ ] CSP allows script loading
- [ ] API responds within 500ms (p95)
- [ ] Caching working (check headers)
- [ ] Rate limiting not blocking legitimate traffic
- [ ] Error handling works (simulate API down)
- [ ] Analytics tracking working
- [ ] Works in all target browsers
- [ ] Mobile responsive
- [ ] Accessible (screen readers)

---

## 🚨 9. Error Handling & Monitoring

### Production Error Handling

```javascript
// Enhanced error handling for production
loadRecommendations({
  pageUrl: pageUrl,
  containerId: 'recommendations-container',
  numTiles: 3,
  onError: function(error) {
    // Log to monitoring service
    if (window.analytics) {
      analytics.track('Recommendations Load Failed', {
        error: error.message,
        page: pageUrl
      });
    }

    // Graceful degradation - show static fallback
    document.getElementById('recommendations-container').innerHTML =
      '<div class="row">' +
      '  <!-- Static fallback tiles -->' +
      '</div>';
  }
});
```

### Monitoring Setup

**Application Monitoring:**
```python
# Flask API - Add logging
import logging
from logging.handlers import RotatingFileHandler

handler = RotatingFileHandler('recommendations.log', maxBytes=10000000, backupCount=5)
handler.setLevel(logging.INFO)
app.logger.addHandler(handler)

@app.route('/api/recommendations', methods=['POST'])
def get_recommendations():
    app.logger.info(f'Recommendation request for {page_url}')
    try:
        # ... process request
        app.logger.info(f'Returned {len(recs)} recommendations')
        return jsonify(result)
    except Exception as e:
        app.logger.error(f'Error: {str(e)}', exc_info=True)
        return jsonify({'error': 'Internal error'}), 500
```

**Monitoring Tools:**
- **Uptime:** Pingdom, UptimeRobot
- **APM:** New Relic, DataDog, Sentry
- **Logs:** ELK Stack, Splunk
- **Metrics:** Prometheus + Grafana

---

## 🌍 10. Browser Compatibility

### Potential Issues

The JavaScript uses modern features that may not work in older browsers:

```javascript
// Fetch API - Not supported in IE11
fetch('/api/recommendations', {...})

// Arrow functions - Not supported in IE11
const func = () => {...}

// Template literals - Not supported in IE11
const html = `<div>${content}</div>`
```

### Solution: Polyfills or Transpilation

**Option A: Add Polyfills**
```html
<!-- Load polyfills for older browsers -->
<script src="https://polyfill.io/v3/polyfill.min.js?features=fetch,Promise"></script>
<script src="/dmgo-recommendations.js"></script>
```

**Option B: Transpile for older browsers**
```javascript
// Use Babel to convert to ES5
// Build process already handles this if using Vite/Webpack
```

**Whistler.com Support Policy:**
Check what browsers you need to support:
- Chrome/Edge/Firefox latest? ✅ No polyfills needed
- IE11? ❌ Need polyfills
- Safari 10+? ⚠️ May need some polyfills

---

## 📋 Production Deployment Checklist

### Pre-Deployment

- [ ] Replace localhost with production API URL
- [ ] Configure HTTPS/SSL certificates
- [ ] Set up CORS headers correctly
- [ ] Update CSP to allow script
- [ ] Implement caching strategy
- [ ] Add rate limiting
- [ ] Set up error logging
- [ ] Configure monitoring/alerts
- [ ] Test in staging environment
- [ ] Load test API (simulate production traffic)
- [ ] Document rollback procedure

### Deployment

- [ ] Deploy API to production server
- [ ] Upload script to CDN
- [ ] Update Whistler.com templates
- [ ] Test on actual site
- [ ] Monitor error rates
- [ ] Check performance metrics

### Post-Deployment

- [ ] Monitor for 24 hours
- [ ] Check error logs
- [ ] Verify analytics tracking
- [ ] Measure page load impact
- [ ] Gather user feedback

---

## 🔧 Production Configuration Example

### Complete Production Setup

**1. API Server (Production Config)**
```python
# api_server.py - Production mode
import os
from flask import Flask
from flask_cors import CORS
from flask_limiter import Limiter
from flask_caching import Cache

app = Flask(__name__)

# Environment-based config
ENV = os.getenv('FLASK_ENV', 'production')

if ENV == 'production':
    # Production: Strict CORS
    CORS(app, resources={
        r"/api/*": {
            "origins": ["https://www.whistler.com", "https://whistler.com"]
        }
    })

    # Redis cache
    cache = Cache(app, config={
        'CACHE_TYPE': 'redis',
        'CACHE_REDIS_URL': os.getenv('REDIS_URL')
    })

    # Rate limiting
    limiter = Limiter(
        app=app,
        key_func=lambda: request.headers.get('X-Real-IP'),
        storage_uri=os.getenv('REDIS_URL')
    )
else:
    # Development: Permissive CORS
    CORS(app)
    cache = Cache(app, config={'CACHE_TYPE': 'simple'})
    limiter = Limiter(app=app, key_func=lambda: '127.0.0.1')

# Rest of your API code...
```

**2. Web Server Config (Nginx)**
```nginx
# /etc/nginx/sites-available/whistler.com

# Rate limiting
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=20r/m;

server {
    listen 443 ssl http2;
    server_name www.whistler.com;

    ssl_certificate /etc/letsencrypt/live/whistler.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/whistler.com/privkey.pem;

    # Main CMS
    location / {
        proxy_pass http://localhost:8080;
    }

    # API endpoints
    location /api/ {
        limit_req zone=api_limit burst=10 nodelay;

        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Caching
        proxy_cache_valid 200 1h;
        proxy_cache_bypass $http_cache_control;
        add_header X-Cache-Status $upstream_cache_status;
    }

    # CDN for static files
    location /dmgo/ {
        alias /var/www/whistler/static/dmgo/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**3. JavaScript (Production Version)**
```javascript
// dmgo-recommendations.js - Production version
(function(window) {
  'use strict';

  // Environment detection
  const IS_DEV = window.location.hostname === 'localhost';
  const API_BASE_URL = IS_DEV ? 'http://localhost:5000' : '';

  window.loadRecommendations = function(options) {
    // Validation
    if (!options || !options.pageUrl || !options.containerId) {
      console.error('[DMGo] Missing required parameters');
      return;
    }

    const container = document.getElementById(options.containerId);
    if (!container) {
      console.error('[DMGo] Container not found:', options.containerId);
      return;
    }

    // Loading state
    showLoadingState(container);

    // Fetch with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    fetch(API_BASE_URL + '/api/recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: options.pageUrl,
        n_recommendations: options.numTiles || 3
      }),
      signal: controller.signal
    })
    .then(response => {
      clearTimeout(timeoutId);
      if (!response.ok) throw new Error('API error: ' + response.status);
      return response.json();
    })
    .then(data => {
      renderRecommendations(container, data.recommendations);
      if (options.onSuccess) options.onSuccess(data);

      // Analytics
      if (window.gtag) {
        gtag('event', 'recommendations_loaded', {
          page: options.pageUrl,
          count: data.recommendations.length
        });
      }
    })
    .catch(error => {
      console.error('[DMGo] Error:', error);
      showErrorState(container, error.message, () => window.loadRecommendations(options));
      if (options.onError) options.onError(error);

      // Error tracking
      if (window.gtag) {
        gtag('event', 'recommendations_error', {
          error: error.message,
          page: options.pageUrl
        });
      }
    });
  };

  // Helper functions...
})(window);
```

---

## 🎯 Recommended Architecture for Whistler.com

```
┌─────────────────────────────────────────────────────────┐
│ CloudFlare CDN (SSL, DDoS protection, caching)          │
└────────────────────┬────────────────────────────────────┘
                     │
          ┌──────────┴──────────┐
          │                     │
    ┌─────▼──────┐       ┌──────▼────────┐
    │ Nginx      │       │ Nginx         │
    │ (SSL term) │       │ (SSL term)    │
    └─────┬──────┘       └──────┬────────┘
          │                     │
    ┌─────▼──────┐       ┌──────▼────────┐
    │ CMS        │◄──────┤ Gunicorn      │
    │ (WordPress/│       │ + Flask API   │
    │  Drupal)   │       └──────┬────────┘
    └────────────┘              │
                          ┌──────▼────────┐
                          │ Redis Cache   │
                          └───────────────┘
```

This setup provides:
- ✅ SSL/HTTPS everywhere
- ✅ No CORS issues (same domain)
- ✅ High performance (caching at multiple levels)
- ✅ Scalability (can add more API servers)
- ✅ Security (rate limiting, CDN protection)

---

## 📞 Support & Questions

For production deployment assistance, consider:
- Infrastructure review with DevOps team
- Load testing before launch
- Gradual rollout (A/B test on 10% of traffic first)
- Monitoring dashboard setup
- On-call procedure for incidents

