import React, { useEffect } from 'react';

const FamilyPage = () => {
  const pageUrl = 'https://www.whistler.com/family/';

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
        <h1>Family Activities</h1>
        <p>Create lasting memories with your family in Whistler</p>
      </div>

      <div className="content content-wide">
        <h2>Fun for the Whole Family</h2>
        <p>
          Whistler is a world-class family destination offering activities and experiences for all
          ages. From skiing and snowboarding lessons to summer adventures, bike parks, and cultural
          experiences, there's something to delight every member of your family.
        </p>
        <h3>Winter Family Fun</h3>
        <p>
          The mountains offer dedicated family zones with magic carpets, gentle terrain, and
          progression parks. Professional instructors specialize in teaching children of all ages
          and abilities. Off the slopes, enjoy tubing, ice skating, sleigh rides, and snowshoeing
          adventures designed for families.
        </p>
        <h3>Summer Adventures</h3>
        <p>
          Summer brings endless possibilities - from easy hiking trails and scenic gondola rides to
          the thrilling Whistler Mountain Bike Park with dedicated family trails. Cool off at local
          beaches and lakes, or explore the village's parks and playgrounds. The Tree Trek canopy
          adventure offers age-appropriate challenges for young adventurers.
        </p>
        <h3>Year-Round Attractions</h3>
        <p>
          The Audain Art Museum offers family programs and workshops. Vallea Lumina provides an
          enchanting evening experience suitable for all ages. The Squamish Lil'wat Cultural Centre
          introduces families to Indigenous culture through interactive exhibits and storytelling.
        </p>
        <h3>Family-Friendly Dining</h3>
        <p>
          Whistler's restaurants welcome families with kids' menus, high chairs, and relaxed
          atmospheres. Many offer early dining specials perfect for families with young children.
        </p>
      </div>

      <div className="recommendations-section">
        <h2>More Family Ideas</h2>
        <div className="content content-wide">
          <div id="recommendations-container"></div>
        </div>
      </div>
    </div>
  );
};

export default FamilyPage;
