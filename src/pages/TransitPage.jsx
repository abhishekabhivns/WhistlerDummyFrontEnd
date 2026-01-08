import React, { useEffect } from 'react';

const TransitPage = () => {
  const pageUrl = 'https://www.whistler.com/getting-around/transit/';

  useEffect(() => {
    if (window.loadRecommendations) {
      window.loadRecommendations({
        pageUrl: pageUrl,
        containerId: 'recommendations-container',
        numTiles: 3
      });
    }
  }, []);

  return (
    <div className="main-content">
      <div className="page-header">
        <h1>Public Transit</h1>
        <p>Free and convenient transit throughout Whistler</p>
      </div>

      <div className="content content-wide">
        <h2>Getting Around is Easy</h2>
        <p>
          Whistler's public transit system is completely FREE and provides convenient access to all
          major areas of the resort. With regular service throughout the day and evening, you can
          easily get around without a car.
        </p>
        <h3>Route Information</h3>
        <p>
          Multiple bus routes serve Whistler Village, the Upper Village, Creekside, and
          surrounding neighborhoods. During peak winter season, service runs frequently from early
          morning until late evening. In summer, schedules are adjusted for typical vacation
          patterns.
        </p>
        <h3>How to Use the System</h3>
        <p>
          Simply board at any marked bus stop throughout Whistler. No tickets or passes required -
          all transit is free! Buses are equipped with bike racks in summer and ski racks in
          winter. Real-time arrival information is available at major stops and through mobile
          apps.
        </p>
        <h3>Key Routes</h3>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li><strong>Route 1:</strong> Village to Upper Village via Blackcomb Way</li>
          <li><strong>Route 2:</strong> Village to Function Junction</li>
          <li><strong>Route 3:</strong> Village to Emerald Estates</li>
          <li><strong>Route 5:</strong> Village to Creekside</li>
          <li><strong>Route 7:</strong> Village to Nordic Estates</li>
        </ul>
      </div>

      <div className="recommendations-section">
        <h2>Plan Your Visit</h2>
        <div className="content content-wide">
          <div id="recommendations-container"></div>
        </div>
      </div>
    </div>
  );
};

export default TransitPage;
