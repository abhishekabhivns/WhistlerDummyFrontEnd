# Troubleshooting Guide

## Common Errors and Solutions

### Error: "Failed to load resource: net::ERR_FILE_NOT_FOUND"

**File:** `dmgo-recommendations.js:1`

**Cause:** You opened the HTML file directly in your browser (file:// protocol) instead of serving it through a web server.

**Solution:**
1. Start the Vite dev server:
   ```bash
   npm run dev
   ```

2. Access the page through the server:
   ```
   http://localhost:3000/example-pure-html.html
   ```

**Why:** Browsers restrict file:// protocol pages from loading scripts and making HTTP requests due to security policies.

---

### Error: "Uncaught ReferenceError: loadRecommendations is not defined"

**Cause:** The `dmgo-recommendations.js` script didn't load successfully.

**Common Reasons:**
1. Script tag has wrong path
2. File opened directly (file:// protocol)
3. Script loaded after the function call

**Solutions:**

✅ **Check script is included in `<head>` before any calls:**
```html
<head>
  <script src="/dmgo-recommendations.js"></script>
</head>
<body>
  <!-- ... -->
  <script>
    // This will work because script loaded in head
    loadRecommendations({...});
  </script>
</body>
```

✅ **Or wait for DOMContentLoaded:**
```html
<script>
  window.addEventListener('DOMContentLoaded', function() {
    loadRecommendations({...});
  });
</script>
```

✅ **Serve through web server (not file://):**
```bash
npm run dev
# Then visit http://localhost:3000
```

---

### Error: "Container element not found with ID: recommendations-container"

**Console:** `DMGo Recommendations: Container element not found with ID: recommendations-container`

**Cause:** The div with the specified ID doesn't exist when the function is called.

**Solutions:**

✅ **Make sure div exists:**
```html
<div id="recommendations-container"></div>
```

✅ **Check ID matches exactly:**
```javascript
loadRecommendations({
  pageUrl: '...',
  containerId: 'recommendations-container', // Must match div id
  numTiles: 3
});
```

✅ **Call function after DOM loads:**
```javascript
window.addEventListener('DOMContentLoaded', function() {
  loadRecommendations({...});
});
```

---

### Error: "API error: Failed to fetch" or CORS errors

**Console:**
- `Failed to fetch`
- `Access to fetch at 'http://localhost:5000' from origin 'file://' has been blocked by CORS policy`
- `net::ERR_FAILED`

**Cause:** API server not running or CORS issue.

**Solutions:**

✅ **Start the API server:**
```bash
cd ../DMGo-Whistler
source venv/bin/activate  # On Windows: venv\Scripts\activate
python api_server.py
```

✅ **Verify API is running:**
```bash
curl http://localhost:5000/health
# Should return: {"status":"healthy",...}
```

✅ **Don't use file:// protocol:**
- ❌ `file:///Users/.../example.html`
- ✅ `http://localhost:3000/example.html`

✅ **Check Flask-CORS is installed:**
```bash
pip list | grep Flask-CORS
# Should show: Flask-CORS  4.x.x
```

---

### Error: "API error: 500 Internal Server Error"

**Cause:** Python API server crashed or encountered an error.

**Solutions:**

✅ **Check API server terminal for errors:**
Look for Python stack traces in the terminal where `api_server.py` is running.

✅ **Verify DMGo.xlsx file exists:**
```bash
cd ../DMGo-Whistler
ls -la DMGo.xlsx
# Should show the file
```

✅ **Reinstall Python dependencies:**
```bash
pip install -r requirements_api.txt
```

✅ **Test API directly:**
```bash
curl -X POST http://localhost:5000/api/recommendations \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.whistler.com/family/","n_recommendations":3}'
```

---

### Error: No recommendations appear (no error shown)

**Symptoms:** Page loads, no error messages, but recommendations section is empty.

**Debugging Steps:**

✅ **Open browser console (F12):**
Look for any JavaScript errors or warnings.

✅ **Check if function was called:**
```javascript
console.log('About to call loadRecommendations');
loadRecommendations({
  pageUrl: '...',
  containerId: 'recommendations-container',
  numTiles: 3,
  onSuccess: function(data) {
    console.log('SUCCESS:', data);
  },
  onError: function(error) {
    console.error('ERROR:', error);
  }
});
```

✅ **Verify container exists:**
```javascript
console.log(document.getElementById('recommendations-container'));
// Should NOT be null
```

✅ **Check Network tab:**
1. Open DevTools (F12)
2. Go to Network tab
3. Reload page
4. Look for POST to `/api/recommendations`
5. Check response

---

### Tiles render but look broken (no styling)

**Cause:** CSS classes not defined or CSS file not loaded.

**Solutions:**

✅ **Include Whistler.com CSS classes:**
Make sure your stylesheet includes all the tile classes:
- `.row` - Grid container
- `.third` - Tile wrapper
- `.tile--event`, `.tile--package` - Tile types
- `.tile__image`, `.tile__title`, etc.

✅ **Use the provided App.css:**
```html
<link rel="stylesheet" href="/src/App.css">
```

✅ **Or copy styles from example:**
See `public/example-pure-html.html` for complete inline styles.

---

### React pages: "window.loadRecommendations is undefined"

**Cause:** Script not loaded before React component mounts.

**Solutions:**

✅ **Add script to index.html:**
```html
<head>
  <script src="/dmgo-recommendations.js"></script>
</head>
```

✅ **Check if script loaded:**
```javascript
useEffect(() => {
  if (window.loadRecommendations) {
    window.loadRecommendations({...});
  } else {
    console.error('loadRecommendations function not found!');
  }
}, []);
```

✅ **Ensure Vite serves public files:**
Files in `public/` directory are automatically served at root path.

---

## Verification Checklist

Before asking for help, verify:

- [ ] API server is running: `curl http://localhost:5000/health`
- [ ] Dev server is running: `npm run dev`
- [ ] Accessing via http:// not file://
- [ ] Browser console shows: "DMGo Recommendations script loaded successfully"
- [ ] Container div exists: `<div id="recommendations-container"></div>`
- [ ] Script included in HTML: `<script src="/dmgo-recommendations.js"></script>`
- [ ] No JavaScript errors in console (F12)
- [ ] Network tab shows successful POST to `/api/recommendations`

---

## Getting Help

If issues persist:

1. **Check all error messages** in browser console
2. **Check API server logs** for Python errors
3. **Verify all services running:**
   - API: `curl http://localhost:5000/health`
   - Frontend: `curl http://localhost:3000`
4. **Share specific error messages** with full stack trace

---

## Quick Reset

If everything is broken, try this:

```bash
# 1. Stop all servers (Ctrl+C)

# 2. Restart API server
cd ../DMGo-Whistler
source venv/bin/activate
python api_server.py

# 3. In new terminal, restart frontend
cd ../WhistlerDummyFrontEnd
npm run dev

# 4. Access the app
# Open: http://localhost:3000
```

---

## Still Having Issues?

Common forgotten steps:
- Did you run `npm install`?
- Did you install Python dependencies?
- Is port 3000 already in use?
- Is port 5000 already in use?
- Do you have the DMGo.xlsx file in DMGo-Whistler directory?

Check the main [README.md](./README.md) for complete setup instructions.
