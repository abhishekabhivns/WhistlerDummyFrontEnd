# 🚀 START HERE

## You Saw This Error, Right?

```
❌ Failed to load resource: net::ERR_FILE_NOT_FOUND
❌ Uncaught ReferenceError: loadRecommendations is not defined
```

## Here's Why It Happened

You tried to open the HTML file directly by **double-clicking** it. This opens the file with the `file://` protocol, which browsers block for security reasons.

## ✅ How to Fix It (2 Simple Steps)

### Step 1: Start the API Server

```bash
cd /Users/abhishekmukherjee/Documents/git/DMGo-Whistler
source venv/bin/activate
python api_server.py
```

Leave this terminal **open and running**.

---

### Step 2: Start the Frontend Server (New Terminal)

```bash
cd /Users/abhishekmukherjee/Documents/git/WhistlerDummyFrontEnd
npm install  # First time only
npm run dev
```

Your browser will automatically open to: **http://localhost:3000**

---

## That's It!

Now you can:
- ✅ View all 10 test pages
- ✅ See dynamic recommendations loading
- ✅ View the pure HTML example at http://localhost:3000/example-pure-html.html

---

## The Golden Rule

### ❌ NEVER Do This:
- Double-click HTML files
- Open files directly in browser
- Use `file://` URLs

### ✅ ALWAYS Do This:
- Run `npm run dev`
- Access via `http://localhost:3000`
- Use a web server

---

## Quick Verification

After starting both servers, run:

```bash
# Check API (should return JSON)
curl http://localhost:5000/health

# Check Frontend (should return HTML)
curl http://localhost:3000
```

If both work, you're good to go! 🎉

---

## Still Confused?

Read the detailed guide: [HOW-TO-RUN.md](./HOW-TO-RUN.md)

Or troubleshooting: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
