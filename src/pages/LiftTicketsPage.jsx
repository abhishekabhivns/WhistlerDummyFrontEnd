import React, { useEffect } from 'react';

const LiftTicketsPage = () => {
  const pageUrl = 'https://www.whistler.com/skiing/lift-tickets/passes/';

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
        <h1>Lift Tickets & Passes</h1>
        <p>Get on the mountain with the right ticket or pass</p>
      </div>

      <div className="content content-wide">
        <h2>Choose Your Pass</h2>
        <p>
          Whistler Blackcomb offers a variety of lift ticket options to suit every skier and
          snowboarder. From single-day tickets to season passes, we have flexible options for
          locals, visitors, and frequent riders.
        </p>
        <h3>Single & Multi-Day Tickets</h3>
        <p>
          Perfect for visitors planning a shorter stay. Multi-day tickets offer better value than
          purchasing daily tickets separately. Tickets are valid for consecutive days and provide
          full access to both Whistler and Blackcomb mountains, including the PEAK 2 PEAK Gondola.
        </p>
        <h3>Epic Pass</h3>
        <p>
          The Epic Pass provides unlimited access to Whistler Blackcomb plus 35+ other resorts
          worldwide. It's the best value for those planning multiple trips or a full season of
          skiing. Purchase early for the best rates - prices increase as the season approaches.
        </p>
        <h3>Edge Card</h3>
        <p>
          Designed for British Columbia residents, the Edge Card offers discounted rates and
          flexible options. Choose from unlimited passes, 10-day cards, or discounted single-day
          tickets.
        </p>
        <h3>Tips for Purchasing</h3>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li>Buy online in advance to save time and sometimes money</li>
          <li>Consider your total days on the mountain when choosing a pass</li>
          <li>Kids 12 and under ski free with a paying adult (conditions apply)</li>
          <li>Season pass holders get additional benefits including priority lift lines</li>
          <li>Upload your photo online before arriving to skip the ticket window</li>
        </ul>
      </div>

      <div className="recommendations-section">
        <h2>Enhance Your Ski Trip</h2>
        <div className="content content-wide">
          <div id="recommendations-container"></div>
        </div>
      </div>
    </div>
  );
};

export default LiftTicketsPage;
