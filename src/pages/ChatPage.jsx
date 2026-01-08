import React, { useEffect } from 'react';

const ChatPage = () => {
  const pageUrl = 'https://www.whistler.com/chat/';

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
        <h1>Chat with Us</h1>
        <p>Get instant answers to your Whistler questions</p>
      </div>

      <div className="content content-wide">
        <h2>We're Here to Help</h2>
        <p>
          Have questions about planning your Whistler vacation? Our team is here to help! Whether
          you need information about accommodations, activities, dining, or getting around, we can
          provide personalized recommendations to make your trip unforgettable.
        </p>
        <p>
          Our chat service is available during regular business hours and connects you directly
          with knowledgeable Whistler experts. We can help with:
        </p>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li>Activity bookings and recommendations</li>
          <li>Accommodation suggestions</li>
          <li>Dining reservations</li>
          <li>Transportation and parking information</li>
          <li>Current weather and mountain conditions</li>
          <li>Event information</li>
        </ul>
        <p>
          For immediate assistance outside of chat hours, please visit our FAQ section or call our
          visitor information line.
        </p>
      </div>

      <div className="recommendations-section">
        <h2>Popular Resources</h2>
        <div className="content content-wide">
          <div id="recommendations-container"></div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
