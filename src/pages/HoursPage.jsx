import React, { useEffect } from 'react';

const HoursPage = () => {
  const pageUrl = 'https://www.whistler.com/hours-of-operation/';

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
        <h1>Hours of Operation</h1>
        <p>Plan your day with current operating hours</p>
      </div>

      <div className="content content-wide">
        <h2>Know Before You Go</h2>
        <p>
          Operating hours vary by season, weather conditions, and special events. We recommend
          checking current hours before your visit as times can change. Below are typical operating
          hours for major facilities and attractions.
        </p>
        <h3>Mountain Operations</h3>
        <p>
          <strong>Winter Season (November - April):</strong> Lifts typically operate from 8:00 AM
          to 3:00 PM, with some high-elevation lifts closing earlier. Extended hours may be
          available during peak periods and holidays.
        </p>
        <p>
          <strong>Summer Season (May - October):</strong> Mountain activities and sightseeing
          operate from 10:00 AM to 5:00 PM, with variations based on specific attractions and
          weather.
        </p>
        <h3>Village Services</h3>
        <p>
          <strong>Shops:</strong> Most retail stores open at 10:00 AM and close between 6:00 PM
          and 9:00 PM. Extended hours during peak season.
        </p>
        <p>
          <strong>Restaurants:</strong> Breakfast service typically begins at 7:00 AM. Lunch and
          dinner service varies by establishment, with many restaurants serving until 10:00 PM or
          later.
        </p>
        <p>
          <strong>Visitor Centre:</strong> Open daily from 9:00 AM to 5:00 PM. Extended hours
          during winter season.
        </p>
        <h3>Recreation Facilities</h3>
        <p>
          Whistler's public facilities including the library, recreation centre, and public skating
          rink maintain regular hours with seasonal variations. Contact individual facilities for
          current schedules.
        </p>
      </div>

      <div className="recommendations-section">
        <h2>Plan Your Activities</h2>
        <div className="content content-wide">
          <div id="recommendations-container"></div>
        </div>
      </div>
    </div>
  );
};

export default HoursPage;
