/**
 * DMGo-Whistler Recommendation Loader
 *
 * A standalone JavaScript function to load and display recommendation tiles
 * from the DMGo-Whistler API. Include this script in any page and call
 * loadRecommendations() to fetch and display tiles.
 *
 * Usage:
 *   <script src="/dmgo-recommendations.js"></script>
 *   <script>
 *     loadRecommendations({
 *       pageUrl: 'https://www.whistler.com/activities/helicopter-tours/',
 *       containerId: 'recommendations-container',
 *       numTiles: 3
 *     });
 *   </script>
 */

(function(window) {
  'use strict';

  // Configuration
  const API_BASE_URL = 'http://localhost:5000';

  /**
   * Load recommendations and inject them into the page
   *
   * @param {Object} options - Configuration options
   * @param {string} options.pageUrl - The full URL of the current page
   * @param {string} options.containerId - ID of the container div to populate
   * @param {number} [options.numTiles=3] - Number of recommendation tiles to fetch
   * @param {function} [options.onSuccess] - Callback function on successful load
   * @param {function} [options.onError] - Callback function on error
   */
  window.loadRecommendations = function(options) {
    // Validate required parameters
    if (!options || !options.pageUrl) {
      console.error('DMGo Recommendations: pageUrl is required');
      return;
    }

    if (!options.containerId) {
      console.error('DMGo Recommendations: containerId is required');
      return;
    }

    const pageUrl = options.pageUrl;
    const containerId = options.containerId;
    const numTiles = options.numTiles || 3;
    const onSuccess = options.onSuccess || function() {};
    const onError = options.onError || function() {};

    // Get the container element
    const container = document.getElementById(containerId);
    if (!container) {
      console.error('DMGo Recommendations: Container element not found with ID: ' + containerId);
      return;
    }

    // Show loading state
    showLoadingState(container);

    // Fetch recommendations from API
    fetch(API_BASE_URL + '/api/recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: pageUrl,
        n_recommendations: numTiles
      })
    })
    .then(function(response) {
      if (!response.ok) {
        throw new Error('API error: ' + response.status + ' ' + response.statusText);
      }
      return response.json();
    })
    .then(function(data) {
      if (!data.recommendations || data.recommendations.length === 0) {
        showEmptyState(container);
        return;
      }

      // Render the recommendations
      renderRecommendations(container, data.recommendations);
      onSuccess(data);
    })
    .catch(function(error) {
      console.error('DMGo Recommendations: Error fetching recommendations', error);
      showErrorState(container, error.message, function() {
        // Retry on button click
        window.loadRecommendations(options);
      });
      onError(error);
    });
  };

  /**
   * Show loading state in the container
   */
  function showLoadingState(container) {
    container.innerHTML = '<div class="dmgo-loading" style="text-align: center; padding: 2rem; color: #666;">' +
      '<p>Loading recommendations...</p>' +
      '</div>';
  }

  /**
   * Show error state with retry button
   */
  function showErrorState(container, errorMessage, retryCallback) {
    container.innerHTML = '<div class="dmgo-error" style="text-align: center; padding: 2rem; color: #d32f2f; background: #ffebee; border-radius: 4px;">' +
      '<p><strong>Error loading recommendations:</strong> ' + errorMessage + '</p>' +
      '<p style="font-size: 0.9rem; color: #666;">Make sure the API server is running on http://localhost:5000</p>' +
      '<button id="dmgo-retry-btn" style="margin-top: 1rem; padding: 0.5rem 1.5rem; background: #0055a5; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 1rem;">Retry</button>' +
      '</div>';

    // Attach retry handler
    var retryBtn = document.getElementById('dmgo-retry-btn');
    if (retryBtn) {
      retryBtn.addEventListener('click', retryCallback);
    }
  }

  /**
   * Show empty state when no recommendations are available
   */
  function showEmptyState(container) {
    container.innerHTML = '<div class="dmgo-empty" style="text-align: center; padding: 2rem; color: #666;">' +
      '<p>No recommendations available for this page.</p>' +
      '</div>';
  }

  /**
   * Render recommendations into the container
   */
  function renderRecommendations(container, recommendations) {
    // Create the row container
    var rowDiv = document.createElement('div');
    rowDiv.className = 'row';

    // Add each tile's HTML
    recommendations.forEach(function(rec) {
      var tempDiv = document.createElement('div');
      tempDiv.innerHTML = rec.html.trim();

      // Append the tile to the row
      if (tempDiv.firstChild) {
        rowDiv.appendChild(tempDiv.firstChild);
      }
    });

    // Replace container contents with the row
    container.innerHTML = '';
    container.appendChild(rowDiv);
  }

  /**
   * Helper function to get current page URL
   * Useful when you want to use the current browser URL
   */
  window.getCurrentPageUrl = function() {
    return window.location.href;
  };

  /**
   * Load recommendations for current page
   * Convenience function that uses the current URL
   */
  window.loadRecommendationsForCurrentPage = function(containerId, numTiles) {
    window.loadRecommendations({
      pageUrl: window.location.href,
      containerId: containerId,
      numTiles: numTiles || 3
    });
  };

  // Log that the script has loaded
  console.log('DMGo Recommendations script loaded successfully');

})(window);
