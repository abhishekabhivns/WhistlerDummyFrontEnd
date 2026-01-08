# How to Run This Application

### Step 1: Start the API Server

Open a terminal and run:

```bash
cd /Users/abhishekmukherjee/Documents/git/DMGo-Whistler

# Activate virtual environment
source venv/bin/activate

# Start the API server
python api_server.py
```

You should see:
```
Starting DMGo-Whistler Recommendation API Server...
✓ Loaded 10 test pages
✓ Loaded 19 content tiles
✓ Recommendation engine initialized successfully
Server running on http://localhost:5000
```

**Keep this terminal open!** The API server needs to stay running.

---

### Step 2: Start the Frontend Development Server

Open a **NEW terminal** (keep the API server running) and run:

```bash
cd /Users/abhishekmukherjee/Documents/git/WhistlerDummyFrontEnd

# Install dependencies (first time only)
npm install

# Start the development server
npm run dev
```

You should see:
```
  VITE v6.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  press h + enter to show help
```

The application will automatically open in your browser at `http://localhost:3000`

---

### Step 3: View the Test Pages

Once both servers are running:

**React Test Pages:**
- http://localhost:3000/ - Home page with links to all test pages
- http://localhost:3000/activities/helicopter-tours - Helicopter Tours
- http://localhost:3000/family - Family Activities
- (and 8 more test pages)

**Plain HTML Example:**
- http://localhost:3000/example-pure-html.html - Pure HTML example (no React)

---

## ⚠️ Common Mistakes to Avoid

### ❌ DON'T: Open files directly
```
file:///Users/.../example-pure-html.html  ← This won't work!
```

### ✅ DO: Access through the web server
```
http://localhost:3000/example-pure-html.html  ← This works!
```

### Why?
- Direct file access (file://) can't load external scripts
- Direct file access can't make API calls to localhost:5000
- Browsers block this for security reasons (CORS policy)

---

## Verification Steps

### 1. Check API Server is Running

In a new terminal:
```bash
curl http://localhost:5000/health
```

Should return:
```json
{
  "status": "healthy",
  "service": "DMGo-Whistler Recommendation API",
  "version": "1.0.0"
}
```

### 2. Check Frontend Server is Running

```bash
curl http://localhost:3000
```

Should return HTML content (not an error).

### 3. Open Browser Console

1. Visit http://localhost:3000
2. Press F12 to open Developer Tools
3. Go to Console tab
4. You should see: `DMGo Recommendations script loaded successfully`
5. Navigate to any test page
6. You should see: `Successfully loaded 3 recommendations`

---

## Quick Troubleshooting

### Problem: Port already in use

**Error:** `Port 3000 is already in use`

**Solution:**
```bash
# Find what's using the port
lsof -i :3000

# Kill the process or use a different port
# Edit vite.config.js and change: port: 3001
```

### Problem: API server errors

**Error:** `FileNotFoundError: Excel file not found`

**Solution:**
Make sure you're in the DMGo-Whistler directory and DMGo.xlsx exists:
```bash
cd /Users/abhishekmukherjee/Documents/git/DMGo-Whistler
ls -la DMGo.xlsx
```

### Problem: Recommendations not loading

**Check browser console** (F12) for errors.

**Common fixes:**
1. Make sure API server is running (check terminal)
2. Make sure you're accessing via http://localhost:3000 (not file://)
3. Clear browser cache and reload

---

## File Structure

```
Your setup should look like this:

/Users/abhishekmukherjee/Documents/git/
├── DMGo-Whistler/              ← API Server
│   ├── DMGo.xlsx               ← Data file (required!)
│   ├── api_server.py           ← Flask API
│   ├── page_recommender_api.py ← ML engine
│   └── venv/                   ← Python virtual environment
│
└── WhistlerDummyFrontEnd/      ← Frontend
    ├── public/
    │   ├── dmgo-recommendations.js  ← The magic script!
    │   └── example-pure-html.html   ← HTML example
    └── src/
        └── pages/              ← 10 React test pages
```

---

## Two Servers, Two Terminals

You need to keep **both terminals open** while developing:

**Terminal 1: API Server**
```bash
cd DMGo-Whistler
source venv/bin/activate
python api_server.py
# Runs on http://localhost:5000
# Serves recommendation data
```

**Terminal 2: Frontend**
```bash
cd WhistlerDummyFrontEnd
npm run dev
# Runs on http://localhost:3000
# Serves the web pages
```

---

## Next Steps

1. ✅ Start both servers (follow Step 1 and Step 2 above)
2. ✅ Visit http://localhost:3000 in your browser
3. ✅ Click on any test page to see dynamic recommendations
4. ✅ Check the browser console to see the API calls
5. ✅ Try the HTML example: http://localhost:3000/example-pure-html.html

---

## Need More Help?

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for detailed error solutions.
