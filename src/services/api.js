/**
 * API Service for DMGo-Whistler Recommendations
 * Handles all communication with the Flask backend
 */

const API_BASE_URL = 'http://localhost:5000';

/**
 * Fetch recommendations for a specific page URL
 * @param {string} pageUrl - The URL of the page
 * @param {number} nRecommendations - Number of recommendations to fetch (default: 3)
 * @returns {Promise<Object>} - Recommendations data
 */
export async function getRecommendations(pageUrl, nRecommendations = 3) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: pageUrl,
        n_recommendations: nRecommendations
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
}

/**
 * Get list of all test pages
 * @returns {Promise<Array>} - List of test page URLs
 */
export async function getTestPages() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/pages`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.pages;
  } catch (error) {
    console.error('Error fetching test pages:', error);
    throw error;
  }
}

/**
 * Get all available content tiles
 * @returns {Promise<Array>} - List of all tiles
 */
export async function getAllTiles() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tiles`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.tiles;
  } catch (error) {
    console.error('Error fetching tiles:', error);
    throw error;
  }
}

/**
 * Check API health status
 * @returns {Promise<Object>} - Health status
 */
export async function checkHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking API health:', error);
    throw error;
  }
}
