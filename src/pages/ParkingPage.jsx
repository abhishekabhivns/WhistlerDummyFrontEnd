import React, { useEffect } from 'react';

const ParkingPage = () => {
  const pageUrl = 'https://www.whistler.com/getting-around/parking/';

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
        <h1>Parking in Whistler</h1>
        <p>Find convenient parking options throughout the village</p>
      </div>

      <div className="content content-wide">
        <h2>Where to Park</h2>
        <p>
          Whistler Village offers several convenient parking options, including day parking lots,
          parkades, and on-street parking. During peak seasons, parking can be limited, so we
          recommend arriving early or using alternative transportation when possible.
        </p>
        <h3>Parking Lots and Parkades</h3>
        <p>
          Several parkades are located throughout the village with easy access to shops,
          restaurants, and the ski lifts. Day lots offer more affordable rates and are ideal for
          longer visits. Most parking facilities accept credit cards and have attendants during
          peak hours.
        </p>
        <h3>Rates and Payment</h3>
        <p>
          Parking rates vary by location and season. During winter, rates are typically higher due
          to increased demand. Many lots offer early bird specials if you arrive before 8 AM. Free
          parking is available in designated day lots outside the village core with free shuttle
          service to the village.
        </p>
        <h3>Tips for Parking</h3>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li>Consider using the free public transit system</li>
          <li>Book overnight parking in advance during peak season</li>
          <li>Download parking apps for real-time availability</li>
          <li>Carpool when possible to reduce congestion</li>
        </ul>
      </div>

      <div className="recommendations-section">
        <h2>Getting Around Whistler</h2>
        <div className="content content-wide">
          <div id="recommendations-container"></div>
        </div>
      </div>
    </div>
  );
};

export default ParkingPage;
