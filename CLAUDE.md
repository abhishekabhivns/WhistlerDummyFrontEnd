# DMGo-Whistler Frontend Test Application

## Business Requirements Document

### Executive Summary

This project implements a React-based frontend testing application for the DMGo-Whistler recommendation engine. The application replicates 10 key pages from Whistler.com to validate the recommendation algorithm by displaying dynamically-generated content tiles fetched from a Python-based recommendation API.

---

## 1. Business Objectives

### Primary Goals
- **Validate Recommendation Engine**: Test the DMGo-Whistler ML-based recommendation system in a realistic web environment
- **Demonstrate Dynamic Content**: Show how recommendation tiles can be dynamically inserted into web pages based on page context
- **Enable A/B Testing**: Provide a platform for comparing different recommendation strategies
- **Facilitate Stakeholder Review**: Allow non-technical stakeholders to review and evaluate recommendations visually

### Success Criteria
- All 10 test pages successfully load and display content
- Recommendation API returns relevant tiles within 2 seconds
- Tiles render correctly with proper HTML structure matching Whistler.com design
- Each page receives contextually appropriate recommendations
- System can be easily demonstrated to stakeholders

---

## 2. Functional Requirements

### 2.1 Test Pages

The application must replicate the following 10 Whistler.com pages:

| Page Name | URL Path | Category | Purpose |
|-----------|----------|----------|---------|
| Helicopter Tours | `/activities/helicopter-tours/` | Activities | Test adventure activity recommendations |
| Vallea Lumina | `/activities/vallea-lumina/` | Activities | Test evening activity recommendations |
| Chat | `/chat/` | Support | Test informational content recommendations |
| Parking | `/getting-around/parking/` | Logistics | Test transportation-related recommendations |
| Transit | `/getting-around/transit/` | Logistics | Test public transit recommendations |
| Getting Here | `/getting-here/` | Planning | Test trip planning recommendations |
| Family | `/family/` | Activities | Test family-oriented recommendations |
| Hours of Operation | `/hours-of-operation/` | Information | Test informational recommendations |
| Lift Tickets & Passes | `/skiing/lift-tickets/passes/` | Skiing | Test ski-specific recommendations |
| Scandinave Spa | `/wellness/scandinave-spa/` | Wellness | Test wellness recommendations |

### 2.2 Page Structure

Each test page must include:

1. **Navigation Bar**
   - Links to all 10 test pages
   - Visual indicator for current page
   - Consistent across all pages

2. **Page Header**
   - Page title (H1)
   - Brief description/tagline
   - Consistent styling with Whistler.com brand

3. **Main Content Section**
   - Representative content mimicking actual Whistler.com pages
   - 2-4 paragraphs of descriptive text
   - Relevant subheadings and structure
   - Should provide context about the page topic

4. **Recommendations Section**
   - Titled "You May Also Like" or similar
   - Container div that will be populated by API
   - Displays 3 recommendation tiles
   - Tiles rendered from HTML returned by API

### 2.3 Recommendation Integration

**Key Requirement**: Replace static recommendation tiles with dynamic API-driven content using a standalone JavaScript function.

**Original Whistler.com Pattern**:
```html
<div class="content content-wide">
  <div class="row">
    <!-- Static tile 1 -->
    <div class="third">...</div>
    <!-- Static tile 2 -->
    <div class="third">...</div>
    <!-- Static tile 3 -->
    <div class="third">...</div>
  </div>
</div>
```

**New Dynamic Pattern**:
```html
<!-- Include the script in page head -->
<script src="/dmgo-recommendations.js"></script>

<!-- Replace static tiles with empty container -->
<div class="content content-wide">
  <div id="recommendations-container"></div>
</div>

<!-- Call the function to load recommendations -->
<script>
  loadRecommendations({
    pageUrl: 'https://www.whistler.com/activities/helicopter-tours/',
    containerId: 'recommendations-container',
    numTiles: 3
  });
</script>
```

The `loadRecommendations()` function:
- Accepts page URL, container ID, and number of tiles
- Fetches recommendations from the API via POST request
- Displays loading state during fetch
- Renders HTML tiles returned by API by injecting into container div
- Handles errors gracefully with user-friendly messages and retry button
- Can be used in any HTML page (not React-specific)

---

## 3. Technical Architecture

### 3.1 Technology Stack

**Frontend**:
- React 18.3+ (Component-based UI for test pages)
- React Router 6+ (Client-side routing)
- Vite (Fast build tool and dev server)
- Vanilla JavaScript (dmgo-recommendations.js - standalone function)
- Vanilla CSS (Styling matching Whistler.com)

**Backend API**:
- Python 3.8+
- Flask 3.0+ (REST API framework)
- Flask-CORS (Cross-origin resource sharing)
- Scikit-learn (TF-IDF vectorization and similarity)
- Pandas (Excel data processing)
- BeautifulSoup (HTML parsing)

### 3.2 System Architecture

```
┌─────────────────────────────────────────┐
│   React Frontend (Port 3000)            │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │  Navigation & Routing            │  │
│  │  (React Router)                  │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │  Test Page Components (10)       │  │
│  │  - Content Structure             │  │
│  │  - Page Context                  │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │  dmgo-recommendations.js         │  │
│  │  - loadRecommendations()         │  │
│  │  - API Integration               │  │
│  │  - HTML Injection                │  │
│  └──────────────────────────────────┘  │
│                                         │
└─────────────┬───────────────────────────┘
              │ HTTP POST
              │ /api/recommendations
              │
┌─────────────▼───────────────────────────┐
│   Flask API Server (Port 5000)          │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │  API Endpoints                   │  │
│  │  - POST /api/recommendations     │  │
│  │  - GET  /api/pages               │  │
│  │  - GET  /api/tiles               │  │
│  │  - GET  /health                  │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │  ImprovedPageRecommender         │  │
│  │  - TF-IDF Vectorization          │  │
│  │  - Cosine Similarity             │  │
│  │  - Keyword Matching              │  │
│  │  - Category Scoring              │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │  Data Source: DMGo.xlsx          │  │
│  │  - Test page URLs                │  │
│  │  - 19 Content tiles with HTML    │  │
│  └──────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

### 3.3 API Specification

#### POST /api/recommendations

**Request**:
```json
{
  "url": "https://www.whistler.com/activities/helicopter-tours/",
  "n_recommendations": 3
}
```

**Response**:
```json
{
  "page_url": "https://www.whistler.com/activities/helicopter-tours/",
  "recommendations": [
    {
      "name": "Tile-winterCampaign",
      "uc_id": 309,
      "html": "<div class='third'>...</div>",
      "score": 0.856,
      "rank": 1,
      "categories": ["winter", "activities", "events"]
    },
    {
      "name": "Tile-Apres",
      "uc_id": 549,
      "html": "<div class='third'>...</div>",
      "score": 0.743,
      "rank": 2,
      "categories": ["activities", "food"]
    },
    {
      "name": "Tile-InsiderWinter-activities",
      "uc_id": 246,
      "html": "<div class='third'>...</div>",
      "score": 0.681,
      "rank": 3,
      "categories": ["winter", "activities"]
    }
  ]
}
```

---

## 4. Recommendation Algorithm

### 4.1 Scoring Methodology

The recommendation engine uses a multi-factor scoring system:

**1. TF-IDF Similarity (50% weight)**
- Extracts keywords from page URL path
- Parses text content from tile HTML
- Vectorizes both using TF-IDF
- Calculates cosine similarity
- Range: 0.0 to 1.0

**2. Keyword Matching (30% weight)**
- Direct keyword presence in tile content
- URL segments matched against tile text
- Normalized by number of keywords
- Range: 0.0 to 1.0

**3. Category Bonus (20% weight)**
- Predefined category keywords
- Categories: skiing, activities, family, food, wellness, events, winter, summer, packages, accommodation
- Overlap between page categories and tile categories
- 0.2 points per matching category

**Final Score**:
```
score = (tfidf_score × 0.5) + (keyword_score × 0.3) + (category_score × 0.2)
```

### 4.2 Content Categories

Each tile and page is automatically categorized based on keyword presence:

| Category | Keywords |
|----------|----------|
| skiing | ski, skiing, snowboard, mountain, lift |
| activities | activity, activities, tour, adventure |
| family | family, kid, children |
| food | food, dining, restaurant, eat |
| wellness | spa, wellness, relax, health |
| events | event, festival, concert |
| winter | winter, snow, cold |
| summer | summer, bike, hike |
| packages | package, deal, offer, save |
| accommodation | hotel, rental, accommodation, stay |

---

## 5. Content Tiles

### 5.1 Tile Structure

All tiles follow Whistler.com's HTML structure:

```html
<div class="third">
  <div class="tile--event"> <!-- or tile--package -->
    <a href="/target-page/">
      <img src="//cdn.whistler.com/..." loading="lazy" class="tile__image" />
    </a>
    <div class="tile__content">
      <span class="tile__label">Category or Date</span>
      <h3 class="tile__title">Tile Title</h3>
      <p class="tile__desc">Description text...</p>
      <div class="tile__link">
        <a href="/target-page/" data-galabel="Tile: Category">Learn More</a>
      </div>
    </div>
  </div>
</div>
```

### 5.2 Tile Types

**Editorial Tiles** (`tile--event`):
- Blog posts
- Events and festivals
- Activity highlights
- Seasonal campaigns

**Commercial Tiles** (`tile--package`):
- Vacation packages
- Accommodation offers
- Gift certificates
- Special deals

### 5.3 Available Tiles (19 Total)

| Tile Name | UC ID | Type | Target Audience |
|-----------|-------|------|-----------------|
| Tile-winterCampaign | 309 | Campaign | Winter visitors |
| Tile-summerCampaign | 310 | Campaign | Summer visitors |
| Tile-Events-NextBigEvent | 274 | Event | Event attendees |
| Tile-Contest | 306 | Contest | Engaged users |
| Tile-Winter-Packages | 505 | Package | Winter planners |
| Tile-Apres | 549 | Activity | Skiers/Snowboarders |
| Tile-Biking | 544 | Activity | Summer visitors |
| Tile-InsiderWinter-activities | 246 | Blog | Winter activity seekers |
| Tile-InsiderSLCC | 247 | Blog | Culture enthusiasts |
| Tile-InsiderSkiLessons | 251 | Blog | Beginner skiers |
| Tile-InsiderFamily | 252 | Blog | Families |
| Tile-InsiderFood | 253 | Blog | Food lovers |
| Tile-VacationRentals | 506 | Accommodation | Long-stay visitors |
| Tile-GiftCertificate | 507 | Product | Gift shoppers |
| Tile-SelfGuided | 203 | Information | Independent travelers |
| Tile-Itineraries | 204 | Information | Trip planners |
| Tile-Nightlife | 205 | Information | Evening entertainment seekers |
| Tile-Transportation | 206 | Information | Logistics planners |

---

## 6. Implementation Guide

### 6.1 Setup Instructions

**Prerequisites**:
- Node.js 18+ and npm
- Python 3.8+
- DMGo.xlsx file in DMGo-Whistler directory

**Backend Setup**:
```bash
cd /path/to/DMGo-Whistler

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements_api.txt

# Start API server
python api_server.py
```

API will run on `http://localhost:5000`

**Frontend Setup**:
```bash
cd /path/to/WhistlerDummyFrontEnd

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

### 6.2 File Structure

```
WhistlerDummyFrontEnd/
├── index.html                  # HTML entry point (includes dmgo script)
├── package.json                # Dependencies
├── vite.config.js              # Vite configuration
├── CLAUDE.md                   # This document
├── README.md                   # Setup instructions
├── USAGE.md                    # JavaScript function documentation
├── example-pure-html.html      # Example of using function in plain HTML
├── public/
│   └── dmgo-recommendations.js # Standalone JS function (key file!)
└── src/
    ├── main.jsx                # React entry point
    ├── App.jsx                 # Main app with routing
    ├── App.css                 # Global styles
    ├── services/
    │   └── api.js              # API service functions (legacy)
    └── pages/                  # 10 test page components
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

DMGo-Whistler/
├── DMGo.xlsx                   # Data source
├── api_server.py               # Flask API server
├── page_recommender_api.py     # Recommendation engine
├── requirements_api.txt        # Python dependencies
└── venv/                       # Virtual environment
```

---

## 7. Testing & Validation

### 7.1 Manual Testing Checklist

**API Testing**:
- [ ] API server starts without errors
- [ ] Health check endpoint responds: `curl http://localhost:5000/health`
- [ ] Recommendations endpoint accepts POST requests
- [ ] API returns valid JSON with 3 recommendations
- [ ] HTML in response is properly formatted
- [ ] CORS headers allow frontend access

**Frontend Testing**:
- [ ] All 10 pages load without errors
- [ ] Navigation links work correctly
- [ ] Active page is highlighted in navigation
- [ ] Each page displays appropriate content
- [ ] Recommendation sections load properly
- [ ] Loading states display during API calls
- [ ] Error messages display if API is down
- [ ] Retry button works on error state
- [ ] Tiles render with correct styling
- [ ] Tile links are clickable (even if external)

**Integration Testing**:
- [ ] Frontend successfully calls API
- [ ] API returns recommendations within 2 seconds
- [ ] Tiles display correctly on all 10 pages
- [ ] Different pages receive different recommendations
- [ ] Recommendations are contextually relevant
- [ ] No console errors in browser
- [ ] Responsive design works on mobile

### 7.2 Validation Criteria

**Relevance**: Recommendations should relate to page content
- Helicopter Tours → Adventure activities, winter campaigns
- Family → Family activities, ski lessons, packages
- Spa → Wellness activities, relaxation content
- Lift Tickets → Ski packages, winter content, lift access

**Diversity**: Top 3 tiles should not all be the same type
- Mix of events, activities, packages, and information
- Variety of content sources (blog, packages, events)

**Quality**: Tiles should be complete and well-formed
- All images load correctly
- Text is readable and formatted
- Links are valid
- Analytics labels present

---

## 8. Business Use Cases

### 8.1 Primary Use Cases

**1. Stakeholder Demonstrations**
- Show recommendation engine to Tourism Whistler leadership
- Demonstrate real-time content matching
- Validate investment in ML-based recommendations

**2. A/B Testing Platform**
- Test different recommendation algorithms
- Compare TF-IDF vs. other approaches
- Measure click-through rates on different tile types

**3. Content Strategy Validation**
- Identify which tiles appear most frequently
- Find gaps in content coverage
- Determine if tile inventory matches visitor needs

**4. Algorithm Tuning**
- Adjust scoring weights (TF-IDF, keywords, categories)
- Add new categories or content types
- Test different numbers of recommendations (3 vs. 5)

### 8.2 Future Enhancements

**Phase 2 - Analytics Integration**:
- Track which recommendations are clicked
- Measure time on page after recommendations
- A/B test different recommendation counts

**Phase 3 - Real User Data**:
- Integrate with actual Whistler.com traffic
- Use real user behavior for training
- Implement collaborative filtering

**Phase 4 - Personalization**:
- User session tracking
- Previous page history consideration
- Time of year / seasonality adjustments

**Phase 5 - Performance**:
- Cache frequently requested recommendations
- Implement CDN for tile images
- Optimize API response time

---

## 9. Success Metrics

### 9.1 Technical Metrics
- API response time < 2 seconds (95th percentile)
- Zero console errors in production
- 100% page load success rate
- Tile rendering time < 500ms

### 9.2 Business Metrics
- Stakeholder approval of recommendation quality
- Positive feedback on tile relevance
- Decision to proceed with production implementation
- Increased engagement with recommended content

### 9.3 Quality Metrics
- At least 80% of recommendations rated as "relevant"
- No duplicate tiles in top 3 recommendations
- Visual consistency with Whistler.com design
- Proper categorization of all content

---

## 10. Risk Management

### 10.1 Technical Risks

**Risk**: API server crashes or becomes unavailable
- **Impact**: Frontend shows error state, no recommendations
- **Mitigation**: Error handling with retry button, clear error messages

**Risk**: Excel file structure changes
- **Impact**: Parser fails, no tiles available
- **Mitigation**: Validation on startup, clear error messages

**Risk**: Tile HTML contains invalid markup
- **Impact**: Page layout breaks
- **Mitigation**: HTML validation, fallback rendering

### 10.2 Business Risks

**Risk**: Recommendations not relevant to page content
- **Impact**: Loss of stakeholder confidence
- **Mitigation**: Algorithm tuning, manual review of top recommendations

**Risk**: Limited tile inventory (only 19 tiles)
- **Impact**: Same tiles appear repeatedly
- **Mitigation**: Document as known limitation, plan for expanded inventory

**Risk**: Performance issues with real traffic
- **Impact**: Slow page loads, poor user experience
- **Mitigation**: Load testing, caching strategy, API optimization

---

## 11. Glossary

**DMGo**: Dynamic Monetization & Growth Optimization - the broader project initiative

**UC (User Content)**: Content tiles managed in Whistler's CMS, identified by numeric IDs

**TF-IDF**: Term Frequency-Inverse Document Frequency - statistical measure for text relevance

**Cosine Similarity**: Mathematical measure of similarity between two vectors (0 to 1)

**Tile**: Visual content card with image, title, description, and CTA link

**Recommendation Engine**: ML-based system that matches content to pages

**Test Pages**: 10 Whistler.com pages selected for validation testing

---

---

## 12. Implementation Approach

### JavaScript Function vs React Component

This project uses a **standalone JavaScript function** approach rather than a React-specific component. This decision provides several advantages:

**Benefits:**
1. **Framework Agnostic**: Can be used in any website (React, Vue, vanilla HTML, WordPress, etc.)
2. **Easy Integration**: Single script include, works without build tools
3. **Whistler.com Compatible**: Can be directly integrated into production CMS
4. **No Dependencies**: Pure JavaScript, no React/npm required on production site
5. **Simple Testing**: Can test in plain HTML files without React setup

**How It Works:**

1. **Include Script**: Add `<script src="/dmgo-recommendations.js"></script>` to page
2. **Add Container**: Place `<div id="recommendations-container"></div>` where tiles should appear
3. **Call Function**: Execute `loadRecommendations({pageUrl, containerId, numTiles})`
4. **Automatic Rendering**: Function fetches from API and injects HTML into container

**Real-World Usage on Whistler.com:**

```html
<!-- In Whistler.com page template -->
<div class="content content-wide">
  <h2>Recommended For You</h2>

  <!-- Remove static tiles, replace with empty div -->
  <div id="dmgo-recommendations"></div>
</div>

<!-- Add at bottom of page -->
<script src="https://cdn.whistler.com/dmgo/recommendations.js"></script>
<script>
  loadRecommendations({
    pageUrl: window.location.href,
    containerId: 'dmgo-recommendations',
    numTiles: 3
  });
</script>
```

This approach allows Whistler's web team to integrate recommendations without changing their entire stack to React.

---

## Document Control

**Version**: 2.0
**Created**: 2026-01-06
**Updated**: 2026-01-06
**Author**: Claude (Anthropic)
**Status**: Final
**Review Cycle**: Updated as requirements change

**Changelog:**
- v2.0 (2026-01-06): Updated to use standalone JavaScript function instead of React component
- v1.0 (2026-01-06): Initial version with React component approach
