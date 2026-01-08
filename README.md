# Whistler Test Pages - DMGo Recommendation Engine Frontend

A React-based testing application for the DMGo-Whistler recommendation engine. This project replicates 10 key Whistler.com pages and displays dynamically-generated recommendation tiles fetched from a Python ML-based API using a standalone JavaScript function.

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

## Project Structure

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

- **[CLAUDE.md](./CLAUDE.md)** - Complete business requirements and technical architecture
- **[USAGE.md](./USAGE.md)** - JavaScript function API reference and examples
- **[HOW-TO-RUN.md](./HOW-TO-RUN.md)** - Step-by-step instructions for running locally
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Solutions for common errors
- **[PRODUCTION-INTEGRATION.md](./PRODUCTION-INTEGRATION.md)** - ⚠️ **Important!** CORS, SSL, and deployment concerns
- **[PRODUCTION-CONCERNS-SUMMARY.md](./PRODUCTION-CONCERNS-SUMMARY.md)** - Quick summary of production issues
- **[RAILWAY-DEPLOYMENT.md](./RAILWAY-DEPLOYMENT.md)** - 🚀 Deploy API to Railway.app
- **[RAILWAY-QUICKSTART.md](./RAILWAY-QUICKSTART.md)** - 10-minute Railway API deployment
- **[GITHUB-PAGES-DEPLOYMENT.md](./GITHUB-PAGES-DEPLOYMENT.md)** - 🆓 Deploy frontend to GitHub Pages (FREE)
- **[DEPLOYMENT-COMPARISON.md](./DEPLOYMENT-COMPARISON.md)** - Compare deployment options & costs

## Technology Stack

- **Frontend**: React 18.3, React Router 6, Vite
- **Backend**: Python 3.8+, Flask 3.0, Scikit-learn
- **Styling**: Vanilla CSS (matching Whistler.com design)

## License

Internal Tourism Whistler project.
