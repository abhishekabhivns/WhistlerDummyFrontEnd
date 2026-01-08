import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const testPages = [
    { path: '/activities/helicopter-tours', title: 'Helicopter Tours', category: 'Activities' },
    { path: '/activities/vallea-lumina', title: 'Vallea Lumina', category: 'Activities' },
    { path: '/chat', title: 'Chat', category: 'Support' },
    { path: '/getting-around/parking', title: 'Parking', category: 'Getting Around' },
    { path: '/getting-around/transit', title: 'Transit', category: 'Getting Around' },
    { path: '/getting-here', title: 'Getting Here', category: 'Planning' },
    { path: '/family', title: 'Family', category: 'Activities' },
    { path: '/hours-of-operation', title: 'Hours of Operation', category: 'Information' },
    { path: '/skiing/lift-tickets/passes', title: 'Lift Tickets & Passes', category: 'Skiing' },
    { path: '/wellness/scandinave-spa', title: 'Scandinave Spa', category: 'Wellness' },
  ];

  return (
    <div className="main-content">
      <div className="home-page">
        <h1>Whistler Test Pages</h1>
        <p>Testing DMGo-Whistler Recommendation Engine</p>
        <p style={{ fontSize: '1rem', color: '#999' }}>
          Click on any page below to see dynamic recommendations served from the API
        </p>

        <div className="test-pages-grid">
          {testPages.map((page) => (
            <Link to={page.path} key={page.path} className="test-page-card">
              <h3>{page.title}</h3>
              <p>{page.category}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
