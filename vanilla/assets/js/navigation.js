/**
 * Shared Navigation Component
 * Dynamically generates navigation for all pages
 */

function initNavigation(currentPage) {
  const nav = document.getElementById('navigation');
  if (!nav) return;

  const pages = [
    { id: 'home', title: 'Home', href: getRelativePath('index.html') },
    { id: 'helicopter', title: 'Helicopter Tours', href: getRelativePath('activities/helicopter-tours.html') },
    { id: 'vallea', title: 'Vallea Lumina', href: getRelativePath('activities/vallea-lumina.html') },
    { id: 'chat', title: 'Chat', href: getRelativePath('chat.html') },
    { id: 'parking', title: 'Parking', href: getRelativePath('getting-around/parking.html') },
    { id: 'transit', title: 'Transit', href: getRelativePath('getting-around/transit.html') },
    { id: 'getting-here', title: 'Getting Here', href: getRelativePath('getting-here.html') },
    { id: 'family', title: 'Family', href: getRelativePath('family.html') },
    { id: 'hours', title: 'Hours', href: getRelativePath('hours-of-operation.html') },
    { id: 'lift-tickets', title: 'Lift Tickets', href: getRelativePath('skiing/lift-tickets-passes.html') },
    { id: 'spa', title: 'Scandinave Spa', href: getRelativePath('wellness/scandinave-spa.html') }
  ];

  // Create navigation HTML
  nav.className = 'navigation';
  nav.innerHTML = `
    <div class="nav-container">
      <h2 class="nav-title">Whistler Test Pages - DMGo Recommendations</h2>
      <ul class="nav-links">
        ${pages.map(page => `
          <li>
            <a href="${page.href}" class="${page.id === currentPage ? 'active' : ''}">${page.title}</a>
          </li>
        `).join('')}
      </ul>
    </div>
  `;
}

/**
 * Get relative path based on current page location
 * Handles different directory depths
 */
function getRelativePath(target) {
  const currentPath = window.location.pathname;
  const depth = (currentPath.match(/\//g) || []).length - 1;

  // Determine base path based on depth
  let basePath = '';
  if (currentPath.includes('/activities/')) {
    basePath = '../';
  } else if (currentPath.includes('/getting-around/')) {
    basePath = '../';
  } else if (currentPath.includes('/skiing/')) {
    basePath = '../';
  } else if (currentPath.includes('/wellness/')) {
    basePath = '../';
  }

  return basePath + target;
}
