import React, { useState, useEffect } from 'react';
import { getRecommendations } from '../services/api';

/**
 * RecommendationTiles Component
 * Fetches and displays recommendation tiles from the DMGo-Whistler API
 * Replaces the static tiles section with dynamic content
 */
const RecommendationTiles = ({ pageUrl, numTiles = 3 }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecommendations();
  }, [pageUrl, numTiles]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getRecommendations(pageUrl, numTiles);

      setRecommendations(data.recommendations || []);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="row">
        <div className="loading">
          <p>Loading recommendations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="row">
        <div className="error">
          <p>Error loading recommendations: {error}</p>
          <p>Make sure the API server is running on http://localhost:5000</p>
          <button onClick={fetchRecommendations} style={{ marginTop: '1rem' }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="row">
        <div className="loading">
          <p>No recommendations available for this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="row">
      {recommendations.map((rec, index) => (
        <div
          key={rec.uc_id || index}
          dangerouslySetInnerHTML={{ __html: rec.html }}
        />
      ))}
    </div>
  );
};

export default RecommendationTiles;
