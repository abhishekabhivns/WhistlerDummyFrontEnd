# How to View the Example HTML File

The `example-pure-html.html` file demonstrates using the DMGo recommendations function in plain HTML without React.

## ⚠️ Important: Do NOT open the file directly in your browser

Opening the HTML file directly (double-clicking it) will result in errors because:
1. The script path won't resolve correctly (file:// protocol)
2. CORS will block API calls to localhost:5000

## ✅ Correct Way to View the Example

### Option 1: Through Vite Dev Server (Recommended)

1. Make sure you have the API server running:
   ```bash
   cd ../DMGo-Whistler
   source venv/bin/activate
   python api_server.py
   ```

2. Start the Vite dev server:
   ```bash
   cd ../WhistlerDummyFrontEnd
   npm run dev
   ```

3. Open in browser:
   ```
   http://localhost:3000/example-pure-html.html
   ```

### Option 2: Using a Simple HTTP Server

If you want to serve just the HTML file without the full React app:

1. Make sure the API server is running (see step 1 above)

2. Serve the public directory:
   ```bash
   cd public
   python -m http.server 8080
   ```

3. Open in browser:
   ```
   http://localhost:8080/example-pure-html.html
   ```

### Option 3: For Production Testing

Copy the files to a web server:
```bash
# Copy to web server directory
cp dmgo-recommendations.js /var/www/html/
cp example-pure-html.html /var/www/html/

# Then access via:
# http://yourserver.com/example-pure-html.html
```

## Why This Matters

The JavaScript function makes API calls to `http://localhost:5000`. Browsers enforce CORS (Cross-Origin Resource Sharing) policies that prevent:
- `file://` protocol pages from making HTTP requests
- Direct file access from loading external scripts

**Solution:** Always serve the HTML through a web server (even if it's just for local development).

## Quick Test

To verify everything is working:

1. API server running → Check: `curl http://localhost:5000/health`
2. Dev server running → Check: Visit `http://localhost:3000`
3. View example → Go to `http://localhost:3000/example-pure-html.html`
4. Open browser console → Should see: "DMGo Recommendations script loaded successfully"
