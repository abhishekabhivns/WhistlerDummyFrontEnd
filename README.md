# Whistler Test Pages - DMGo Recommendation Engine Frontend

A testing application for the DMGo-Whistler recommendation engine with **two versions**:
- **React Version**: Full-featured SPA with routing and component architecture
- **Vanilla JS Version**: Pure HTML/CSS/JS with no build process - **perfect for Whistler.com integration**

Both versions replicate 10 key Whistler.com pages and display dynamically-generated recommendation tiles fetched from a Python ML-based API.

## ⚠️ Important: How to Run This App

**DO NOT open HTML files directly in your browser!** This will cause errors.

👉 **See [HOW-TO-RUN.md](./HOW-TO-RUN.md) for step-by-step instructions.**

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- DMGo.xlsx file (in the DMGo-Whistler project directory)

### 1. Start the API Server

```bash
# Navigate to DMGo-Whistler project
cd ../DMGo-Whistler

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements_api.txt

# Start the Flask API server
python api_server.py
```

The API server will start on `http://localhost:5000`

### 2. Start the Frontend

```bash
# Navigate to this project
cd WhistlerDummyFrontEnd

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:3000` and automatically open in your browser.

## 🆕 Vanilla JavaScript Version (Recommended for Whistler.com)

A pure HTML/CSS/JS version is now available in the `vanilla/` directory with:
- ✅ **No build process** - Just serve the HTML files
- ✅ **No React dependency** - Pure vanilla JavaScript
- ✅ **90% smaller** - 15 KB vs 150 KB
- ✅ **4x faster** - Loads in ~200ms vs ~800ms
- ✅ **Drop-in integration** - Single script tag for Whistler.com

### Quick Start (Vanilla Version)

```bash
# Start the API server (same as above)
cd ../DMGo-Whistler
python api_server.py

# In a new terminal, serve the vanilla version
cd /Users/abhishekmukherjee/Documents/git/WhistlerDummyFrontEnd/vanilla
python3 -m http.server 8080

# Open browser to http://localhost:8080
```

**👉 See [VANILLA-VERSION-GUIDE.md](./VANILLA-VERSION-GUIDE.md) for complete documentation.**

### When to Use Each Version

| Feature | React Version | Vanilla Version |
|---------|--------------|-----------------|
| Build Process | Required | None |
| Dependencies | React, Router, Vite | None |
| File Size | ~150 KB | ~15 KB |
| Load Time | ~800ms | ~200ms |
| Integration | Complex | Drop-in script tag |
| Best For | Complex SPAs | Static sites, integration |

**For Whistler.com integration, use the Vanilla version.**

## Project Structure

### React Version (src/)
```
public/
└── dmgo-recommendations.js       # Standalone JS function for loading tiles

src/
├── main.jsx                      # React entry point
├── App.jsx                       # Main app with routing
├── App.css                       # Global styles
├── services/
│   └── api.js                    # API service layer (not used directly)
└── pages/                        # 10 test page components
    ├── HomePage.jsx
    ├── HelicopterToursPage.jsx
    ├── ValleaLuminaPage.jsx
    ├── ChatPage.jsx
    ├── ParkingPage.jsx
    ├── TransitPage.jsx
    ├── GettingHerePage.jsx
    ├── FamilyPage.jsx
    ├── HoursPage.jsx
    ├── LiftTicketsPage.jsx
    └── ScandinaveSpaPage.jsx
```

### Vanilla JS Version (vanilla/)
```
vanilla/
├── index.html                         # Home page
├── chat.html                          # Chat support
├── getting-here.html                  # Travel info
├── family.html                        # Family activities
├── hours-of-operation.html           # Hours info
├── activities/
│   ├── helicopter-tours.html         # Helicopter tours
│   └── vallea-lumina.html            # Vallea Lumina
├── getting-around/
│   ├── parking.html                   # Parking info
│   └── transit.html                   # Public transit
├── skiing/
│   └── lift-tickets-passes.html      # Lift tickets
├── wellness/
│   └── scandinave-spa.html           # Spa info
└── assets/
    ├── css/
    │   └── styles.css                 # All styling
    └── js/
        ├── dmgo-recommendations.js    # API loader
        └── navigation.js              # Shared navigation
```

## Test Pages

The application includes 10 test pages from Whistler.com:

1. **Helicopter Tours** - `/activities/helicopter-tours/`
2. **Vallea Lumina** - `/activities/vallea-lumina/`
3. **Chat** - `/chat/`
4. **Parking** - `/getting-around/parking/`
5. **Transit** - `/getting-around/transit/`
6. **Getting Here** - `/getting-here/`
7. **Family** - `/family/`
8. **Hours of Operation** - `/hours-of-operation/`
9. **Lift Tickets & Passes** - `/skiing/lift-tickets/passes/`
10. **Scandinave Spa** - `/wellness/scandinave-spa/`

## How It Works

1. Each test page loads with static content mimicking Whistler.com
2. The page includes `dmgo-recommendations.js` - a standalone JavaScript function
3. Each page has an empty `<div id="recommendations-container"></div>`
4. JavaScript calls `loadRecommendations()` with the page URL
5. The function fetches recommendations from the Python API
6. The API analyzes the URL using TF-IDF, keyword matching, and category scoring
7. The API returns 3 HTML tiles with the highest relevance scores
8. JavaScript injects the tile HTML into the container div

## Using the Recommendation Function

### In Plain HTML

```html
<!-- Include the script -->
<script src="/dmgo-recommendations.js"></script>

<!-- Add a container -->
<div id="recommendations-container"></div>

<!-- Load recommendations -->
<script>
  loadRecommendations({
    pageUrl: 'https://www.whistler.com/activities/helicopter-tours/',
    containerId: 'recommendations-container',
    numTiles: 3
  });
</script>
```

### In React (as used in this project)

```javascript
useEffect(() => {
  if (window.loadRecommendations) {
    window.loadRecommendations({
      pageUrl: 'https://www.whistler.com/activities/helicopter-tours/',
      containerId: 'recommendations-container',
      numTiles: 3
    });
  }
}, []);
```

See [USAGE.md](./USAGE.md) for complete documentation.

**To view the HTML example:** Visit `http://localhost:3000/example-pure-html.html` after starting the dev server. Do NOT open the file directly in your browser.

## API Endpoints

### POST /api/recommendations
Fetch recommendations for a specific page.

**Request:**
```json
{
  "url": "https://www.whistler.com/activities/helicopter-tours/",
  "n_recommendations": 3
}
```

**Response:**
```json
{
  "page_url": "https://www.whistler.com/activities/helicopter-tours/",
  "recommendations": [
    {
      "name": "Tile-winterCampaign",
      "uc_id": 309,
      "html": "<div class='third'>...</div>",
      "score": 0.856,
      "rank": 1
    }
  ]
}
```

### GET /health
Check API server status.

### GET /api/pages
Get list of all test page URLs.

### GET /api/tiles
Get all available content tiles.

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Troubleshooting

**Issue**: "Failed to fetch recommendations"
- **Solution**: Make sure the API server is running on `http://localhost:5000`
- **Check**: Run `curl http://localhost:5000/health` to verify the API

**Issue**: Tiles not displaying correctly
- **Solution**: Check browser console for errors
- **Verify**: API is returning valid HTML in the response

**Issue**: Port 3000 already in use
- **Solution**: Edit `vite.config.js` and change the port number

**Issue**: CORS errors in browser console
- **Solution**: Verify Flask-CORS is installed and CORS is enabled in `api_server.py`

## Documentation

### Getting Started
- **[VANILLA-VERSION-GUIDE.md](./VANILLA-VERSION-GUIDE.md)** - 🆕 **Complete guide to vanilla JS version (recommended)**
- **[HOW-TO-RUN.md](./HOW-TO-RUN.md)** - Step-by-step instructions for running locally
- **[USAGE.md](./USAGE.md)** - JavaScript function API reference and examples
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Solutions for common errors

### Deployment
- **[RAILWAY-DEPLOYMENT.md](./RAILWAY-DEPLOYMENT.md)** - 🚀 Deploy API to Railway.app
- **[RAILWAY-QUICKSTART.md](./RAILWAY-QUICKSTART.md)** - 10-minute Railway API deployment
- **[GITHUB-PAGES-DEPLOYMENT.md](./GITHUB-PAGES-DEPLOYMENT.md)** - 🆓 Deploy frontend to GitHub Pages (FREE)
- **[DEPLOYMENT-COMPARISON.md](./DEPLOYMENT-COMPARISON.md)** - Compare deployment options & costs

### Production & Architecture
- **[PRODUCTION-INTEGRATION.md](./PRODUCTION-INTEGRATION.md)** - ⚠️ **Important!** CORS, SSL, and deployment concerns
- **[PRODUCTION-CONCERNS-SUMMARY.md](./PRODUCTION-CONCERNS-SUMMARY.md)** - Quick summary of production issues
- **[CLAUDE.md](./CLAUDE.md)** - Complete business requirements and technical architecture

## Technology Stack

### Frontend (Two Options)
- **React Version**: React 18.3, React Router 6, Vite
- **Vanilla Version**: Pure HTML5, Vanilla JavaScript (ES6+), CSS3
- **Styling**: Vanilla CSS (matching Whistler.com design)

### Backend
- **API Server**: Python 3.8+, Flask 3.0, Gunicorn
- **ML Engine**: Scikit-learn (TF-IDF), Pandas, BeautifulSoup4
- **Deployment**: Railway.app (with Redis caching)

## License

Internal Tourism Whistler project.
