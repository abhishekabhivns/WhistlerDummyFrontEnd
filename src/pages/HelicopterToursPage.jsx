import React, { useEffect } from 'react';

const HelicopterToursPage = () => {
  const pageUrl = 'https://www.whistler.com/activities/helicopter-tours/';

  useEffect(() => {
    // Load recommendations when component mounts
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
        <h1>Helicopter Tours</h1>
        <p>Experience Whistler from above with breathtaking helicopter tours</p>
      </div>

      <div className="content content-wide">
        <h2>Soar Above the Mountains</h2>
        <p>
          Take in the spectacular views of Whistler, Blackcomb, and the surrounding Coast Mountains
          on an unforgettable helicopter tour. Whether you're looking for a scenic flight, glacier
          landing, or adventure tour, there's a helicopter experience perfect for you.
        </p>
        <p>
          Our helicopter tour operators offer a variety of experiences, from short 12-minute scenic
          flights to extended tours that include glacier landings and alpine picnics. All tours are
          led by experienced pilots who provide insightful commentary about the region's geography,
          wildlife, and history.
        </p>
        <p>
          Tours operate year-round, weather permitting. During winter months, you can witness
          snow-capped peaks and pristine glaciers. Summer tours showcase vibrant alpine meadows and
          stunning turquoise lakes. Each season offers its own unique perspective on this
          magnificent landscape.
        </p>
      </div>

      <div className="recommendations-section">
        <h2>You May Also Like</h2>
        <div className="content content-wide">
          <div id="recommendations-container"></div>
        </div>
      </div>
    </div>
  );
};

export default HelicopterToursPage;
