import React, { useEffect } from 'react';

const ValleaLuminaPage = () => {
  const pageUrl = 'https://www.whistler.com/activities/vallea-lumina/';

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
        <h1>Vallea Lumina</h1>
        <p>An enchanting multimedia night walk through the forest</p>
      </div>

      <div className="content content-wide">
        <h2>A Magical Journey Awaits</h2>
        <p>
          Vallea Lumina is an enchanting multimedia experience set in a spectacular outdoor setting
          in Cougar Mountain at the base of Whistler Blackcomb. This unique attraction combines
          video projections, lighting, and music to create an immersive storytelling experience as
          you walk through the forest.
        </p>
        <p>
          Follow the story of two travelers searching for hidden wonders in a valley that comes
          alive at night. The 1.5 km trail takes approximately 50 minutes to complete and is
          suitable for all ages. The experience operates in both summer and winter seasons, with
          each offering its own magical atmosphere.
        </p>
        <p>
          Advanced reservations are highly recommended as tours often sell out. The trail is
          relatively easy but does include some uneven terrain. Dress warmly in winter and bring a
          light jacket even in summer as temperatures drop in the evening.
        </p>
      </div>

      <div className="recommendations-section">
        <h2>More Things to Do</h2>
        <div className="content content-wide">
          <div id="recommendations-container"></div>
        </div>
      </div>
    </div>
  );
};

export default ValleaLuminaPage;
