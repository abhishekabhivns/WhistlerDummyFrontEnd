# Using the DMGo Recommendations JavaScript Function

This document explains how to use the standalone JavaScript function to load recommendations on any page.

## Quick Start

### 1. Include the Script

Add the script to your HTML page:

```html
<script src="/dmgo-recommendations.js"></script>
```

### 2. Add a Container Div

Place an empty div where you want recommendations to appear:

```html
<div class="content content-wide">
  <div id="recommendations-container"></div>
</div>
```

### 3. Call the Function

Load recommendations using JavaScript:

```html
<script>
  loadRecommendations({
    pageUrl: 'https://www.whistler.com/activities/helicopter-tours/',
    containerId: 'recommendations-container',
    numTiles: 3
  });
</script>
```

## Complete Example

Here's a complete HTML page example (also available at `public/example-pure-html.html`):

**⚠️ Important:** This must be served through a web server (like Vite dev server), not opened directly as a file.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Helicopter Tours - Whistler</title>
  <link rel="stylesheet" href="/styles.css">

  <!-- Include DMGo Recommendations Script -->
  <script src="/dmgo-recommendations.js"></script>
</head>
<body>
  <div class="main-content">
    <div class="page-header">
      <h1>Helicopter Tours</h1>
      <p>Experience Whistler from above</p>
    </div>

    <div class="content content-wide">
      <h2>Soar Above the Mountains</h2>
      <p>Take in spectacular views of Whistler...</p>
    </div>

    <!-- Recommendations Section -->
    <div class="recommendations-section">
      <h2>You May Also Like</h2>
      <div class="content content-wide">
        <!-- Empty div to be populated with recommendations -->
        <div id="recommendations-container"></div>
      </div>
    </div>
  </div>

  <!-- Load recommendations when page loads -->
  <script>
    loadRecommendations({
      pageUrl: 'https://www.whistler.com/activities/helicopter-tours/',
      containerId: 'recommendations-container',
      numTiles: 3
    });
  </script>
</body>
</html>
```

## API Reference

### `loadRecommendations(options)`

Loads and displays recommendation tiles from the DMGo-Whistler API.

**Parameters:**

```javascript
{
  pageUrl: string,        // Required - The full URL of the current page
  containerId: string,    // Required - ID of the container div
  numTiles: number,       // Optional - Number of tiles to fetch (default: 3)
  onSuccess: function,    // Optional - Callback on successful load
  onError: function       // Optional - Callback on error
}
```

**Example with callbacks:**

```javascript
loadRecommendations({
  pageUrl: 'https://www.whistler.com/family/',
  containerId: 'recommendations-container',
  numTiles: 3,
  onSuccess: function(data) {
    console.log('Loaded recommendations:', data);
    // Track analytics, etc.
  },
  onError: function(error) {
    console.error('Failed to load:', error);
    // Send error to monitoring service
  }
});
```

### `getCurrentPageUrl()`

Helper function to get the current browser URL.

**Returns:** `string` - Current page URL

**Example:**

```javascript
var currentUrl = getCurrentPageUrl();
console.log(currentUrl); // https://www.whistler.com/family/
```

### `loadRecommendationsForCurrentPage(containerId, numTiles)`

Convenience function that automatically uses the current browser URL.

**Parameters:**
- `containerId` (string) - ID of the container div
- `numTiles` (number, optional) - Number of tiles (default: 3)

**Example:**

```javascript
// Automatically uses window.location.href
loadRecommendationsForCurrentPage('recommendations-container', 3);
```

## React Integration

If you're using React (like in this project), call the function in a `useEffect` hook:

```javascript
import React, { useEffect } from 'react';

const MyPage = () => {
  const pageUrl = 'https://www.whistler.com/activities/helicopter-tours/';

  useEffect(() => {
    if (window.loadRecommendations) {
      window.loadRecommendations({
        pageUrl: pageUrl,
        containerId: 'recommendations-container',
        numTiles: 3
      });
    }
  }, []); // Empty dependency array = run once on mount

  return (
    <div className="main-content">
      <h1>My Page</h1>

      <div className="recommendations-section">
        <h2>You May Also Like</h2>
        <div className="content content-wide">
          <div id="recommendations-container"></div>
        </div>
      </div>
    </div>
  );
};
```

## Loading States

The function automatically handles three states:

### 1. Loading State
Shows while fetching from API:
```html
<div class="dmgo-loading">
  <p>Loading recommendations...</p>
</div>
```

### 2. Error State
Shows if API call fails (includes retry button):
```html
<div class="dmgo-error">
  <p><strong>Error loading recommendations:</strong> API error: 500</p>
  <p>Make sure the API server is running on http://localhost:5000</p>
  <button id="dmgo-retry-btn">Retry</button>
</div>
```

### 3. Empty State
Shows if no recommendations are available:
```html
<div class="dmgo-empty">
  <p>No recommendations available for this page.</p>
</div>
```

### 4. Success State
Renders the recommendation tiles in a grid:
```html
<div class="row">
  <div class="third">
    <div class="tile--event">
      <!-- Tile content -->
    </div>
  </div>
  <!-- More tiles... -->
</div>
```

## Styling

The function uses Whistler.com's CSS classes:

- `.row` - Grid container for tiles
- `.third` - Individual tile wrapper (1/3 width)
- `.tile--event` - Editorial content tile
- `.tile--package` - Commercial/package tile
- `.tile__image` - Tile image
- `.tile__title` - Tile heading
- `.tile__desc` - Tile description
- `.tile__link` - Call-to-action link

Make sure these styles are included in your CSS file.

## Multiple Containers on Same Page

You can have multiple recommendation sections on one page:

```html
<!-- First section -->
<div id="recommendations-main"></div>
<script>
  loadRecommendations({
    pageUrl: 'https://www.whistler.com/family/',
    containerId: 'recommendations-main',
    numTiles: 3
  });
</script>

<!-- Second section (different page context) -->
<div id="recommendations-related"></div>
<script>
  loadRecommendations({
    pageUrl: 'https://www.whistler.com/activities/',
    containerId: 'recommendations-related',
    numTiles: 2
  });
</script>
```

## API Configuration

The script is configured to call:
```
http://localhost:5000/api/recommendations
```

To change the API URL, edit `dmgo-recommendations.js`:

```javascript
// At the top of the file
const API_BASE_URL = 'https://your-api-domain.com';
```

## Troubleshooting

**Problem:** "Container element not found with ID: recommendations-container"
- **Solution:** Make sure the div exists in your HTML with the exact ID

**Problem:** API errors in console
- **Solution:** Verify the Flask API server is running on http://localhost:5000
- **Check:** Run `curl http://localhost:5000/health` in terminal

**Problem:** Tiles not styling correctly
- **Solution:** Ensure Whistler.com CSS classes are included in your stylesheet

**Problem:** Script not loading
- **Solution:** Check the script path is correct relative to your HTML file

## Browser Compatibility

The script uses vanilla JavaScript (ES5) and is compatible with:
- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

No polyfills required for modern browsers.

## Performance Tips

1. **Cache API responses** - The API can cache frequently requested pages
2. **Lazy load images** - Tiles include `loading="lazy"` attribute
3. **Defer script loading** - Add `defer` to script tag if recommendations aren't critical
4. **Preload API** - Call `/api/pages` on site load to warm up the cache

## Security Notes

- The function uses `innerHTML` to render tile HTML
- Tile HTML comes from a trusted API (your own)
- HTML is pre-sanitized in the DMGo.xlsx file
- All tiles are reviewed before being added to the system
- External links include `rel="noopener"` for security

## Next Steps

- See [README.md](./README.md) for setup instructions
- See [CLAUDE.md](./CLAUDE.md) for business requirements
- Check console logs for debugging information
