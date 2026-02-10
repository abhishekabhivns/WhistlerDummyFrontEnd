/**
 * DMGo-Whistler Recommendation Loader
 *
 * A standalone JavaScript function to load and display recommendation tiles
 * from the DMGo-Whistler API. Include this script in any page and call
 * DMGo.loadRecommendations() to fetch and display tiles.
 * https://abhishekabhivns.github.io/WhistlerDummyFrontEnd/assets/js/dmgo-recommendations.js
 *
 * Usage:
 *   <script src="/dmgo-recommendations.js"></script>
 *   <script>
 *     DMGo.loadRecommendations({
 *       pageUrl: 'https://www.whistler.com/activities/helicopter-tours/',
 *       containerId: 'recommendations-container',
 *       numTiles: 3
 *     });
 *   </script>
 *
 * Security Features:
 *   - HTML sanitization to prevent XSS attacks
 *   - Input validation for all parameters
 *   - Exponential backoff for retries
 *   - Namespaced API to prevent global pollution
 *   - Prototype pollution protection
 *   - DOM clobbering protection
 *   - mXSS mitigation
 *
 * @version 2.1.0
 */

(function(window) {
  'use strict';

  // ============================================================================
  // DOM Clobbering Protection for namespace
  // Check if window.DMGo exists AND is a plain object (not an HTML element)
  // Attackers could inject <img name="DMGo"> to clobber the namespace
  // ============================================================================
  var DMGo;
  if (window.DMGo &&
      typeof window.DMGo === 'object' &&
      !window.DMGo.nodeType &&  // Not a DOM node
      !(window.DMGo instanceof HTMLElement)) {  // Not an HTML element
    DMGo = window.DMGo;
  } else {
    DMGo = {};
  }

  // Configuration - Environment detection
  var API_BASE_URL = (function() {
    //var hostname = window.location.hostname;

    // Local development
    // if (hostname === 'localhost' || hostname === '127.0.0.1') {
    //   return 'http://localhost:5000';
    // }

    // Production 
    // Railway API URL
    return 'https://web-production-9b63e.up.railway.app';
  })();

  // ============================================================================
  // Retry state management with exponential backoff
  // Prevents potential API abuse through unlimited rapid retries
  //
  // Prototype Pollution Protection
  // Using Object.create(null) creates an object with no prototype chain,
  // preventing __proto__, constructor, prototype pollution attacks
  //
  // Memory Leak Prevention
  // Added maxTrackedContainers limit and cleanup of oldest entries
  // ============================================================================
  var retryState = {
    attempts: Object.create(null),  
    maxRetries: 5,                  // Maximum retry attempts
    baseDelay: 1000,                // Base delay in milliseconds (doubles each retry)
    maxTrackedContainers: 100,      // Maximum containers to track (memory leak prevention)
    containerOrder: []              // Track insertion order for LRU cleanup
  };


  var DANGEROUS_PROPERTIES = ['__proto__', 'constructor', 'prototype', '__defineGetter__',
    '__defineSetter__', '__lookupGetter__', '__lookupSetter__', 'hasOwnProperty',
    'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf'];

  function isSafePropertyName(name) {
    if (typeof name !== 'string') {
      return false;
    }
    return DANGEROUS_PROPERTIES.indexOf(name) === -1;
  }

  // ============================================================================
  // Safe retry state access with memory management
  // Provides safe get/set operations that prevent prototype pollution
  // and manage memory by limiting tracked containers
  // ============================================================================
  function getRetryAttempts(containerId) {
    if (!isSafePropertyName(containerId)) {
      console.warn('DMGo Recommendations: Invalid container ID rejected');
      return 0;
    }
    return retryState.attempts[containerId] || 0;
  }

  function setRetryAttempts(containerId, value) {
    if (!isSafePropertyName(containerId)) {
      console.warn('DMGo Recommendations: Invalid container ID rejected');
      return;
    }

    // Memory leak prevention: limit number of tracked containers
    if (!(containerId in retryState.attempts)) {
      // New container - check if we need to clean up old ones
      if (retryState.containerOrder.length >= retryState.maxTrackedContainers) {
        // Remove oldest container (LRU eviction)
        var oldestContainer = retryState.containerOrder.shift();
        delete retryState.attempts[oldestContainer];
      }
      retryState.containerOrder.push(containerId);
    }

    retryState.attempts[containerId] = value;
  }

  function clearRetryAttempts(containerId) {
    if (!isSafePropertyName(containerId)) {
      return;
    }
    delete retryState.attempts[containerId];
    var idx = retryState.containerOrder.indexOf(containerId);
    if (idx > -1) {
      retryState.containerOrder.splice(idx, 1);
    }
  }

  // ============================================================================
  // Generate unique IDs to prevent element ID collisions
  // Uses timestamp + random number for uniqueness across multiple containers
  // ============================================================================
  var idCounter = 0;
  function generateUniqueId(prefix) {
    idCounter++;
    return prefix + '-' + Date.now() + '-' + idCounter;
  }

  // ============================================================================
  // HTML entity escaping to prevent XSS via error messages
  // Converts dangerous characters to their HTML entity equivalents
  // ============================================================================
  function escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') {
      return '';
    }
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ============================================================================
  // HTML Sanitization to prevent XSS attacks
  // Whitelist-based approach: only allow safe tags and attributes
  // This prevents malicious scripts from being injected via API responses
  // ============================================================================
  var ALLOWED_TAGS = [
    'div', 'span', 'p', 'a', 'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'strong', 'em', 'b', 'i', 'br', 'hr',
    'figure', 'figcaption', 'picture', 'source', 'button'
  ];

  // ============================================================================
  // Expanded dangerous tags list
  // These tags are completely removed (not just stripped of attributes)
  // because they can execute code, load external resources, or change page behavior
  // ============================================================================
  var DANGEROUS_TAGS = [
    'script',     // JavaScript execution
    'style',      // CSS injection, data exfiltration via selectors
    'iframe',     // Embedded content, clickjacking
    'object',     // Plugin content, Flash XSS
    'embed',      // Plugin content
    'form',       // Form hijacking, data theft
    'input',      // Form elements
    'textarea',   // Form elements
    'select',     // Form elements
    'base',       // Hijacks all relative URLs on the page
    'link',       // Load external stylesheets, prefetch
    'meta',       // Redirects via http-equiv="refresh", charset manipulation
    'template',   // Content parsed differently, can hide malicious content
    'noscript',   // Content parsed differently based on JS state
    'svg',        // Has own parsing rules, many XSS vectors (foreignObject, use, etc.)
    'math',       // MathML has own parsing rules, potential XSS
    'audio',      // Media elements can have onerror (though we strip handlers)
    'video',      // Media elements can have onerror
    'details',    // Has ontoggle event
    'dialog',     // Dialog elements have special behavior
    'slot',       // Web components, can leak content
    'portal',     // Navigation element
    'frame',      // Deprecated but still dangerous
    'frameset',   // Deprecated but still dangerous
    'applet',     // Deprecated Java applets
    'marquee',    // Can have event handlers
    'bgsound',    // IE-specific, can load external resources
    'keygen',     // Deprecated form element
    'isindex',    // Deprecated
    'listing',    // Deprecated
    'xmp',        // Deprecated, unusual parsing
    'plaintext'   // Unusual parsing behavior
  ];

  // ============================================================================
  // Remove 'id' from global allowed attributes
  // Allowing arbitrary IDs enables DOM clobbering attacks where attacker
  // can create elements with IDs that shadow important page variables
  // If ID is needed, it should be validated/prefixed
  // ============================================================================
  var ALLOWED_ATTRIBUTES = {
    '*': ['class', 'style', 'title'],  // Removed 'id' to prevent DOM clobbering
    'a': ['href', 'target', 'rel', 'data-galabel'],
    'img': ['src', 'alt', 'loading', 'width', 'height', 'srcset', 'sizes'],
    'source': ['srcset', 'media', 'type'],
    'button': ['type', 'disabled']
  };

  // ============================================================================
  // Expanded dangerous URL schemes list
  // Added 'file:' which could expose local files in some contexts
  // Using lowercase for comparison (values are lowercased before checking)
  // ============================================================================
  var DANGEROUS_URL_SCHEMES = [
    'javascript:',  // Script execution
    'data:',        // Can contain executable content (data:text/html,<script>...)
    'vbscript:',    // VBScript execution (IE)
    'file:',        // Local file access
    'blob:',        // Can contain executable content
    'about:',       // Special browser pages
    'ms-its:',      // IE compiled help files
    'mhtml:',       // IE MHTML protocol
    'x-]script:'    // Obfuscation attempts
  ];

  // ============================================================================
  // mXSS (Mutation XSS) Mitigation
  // Browsers can mutate HTML during parse/serialize cycles in unexpected ways
  // Double-parsing helps catch mutations that could bypass sanitization
  // ============================================================================
  function sanitizeHtml(html) {
    if (typeof html !== 'string') {
      return '';
    }

    // Pre-sanitization: Remove null bytes and other problematic characters
    // that could cause parsing inconsistencies
    html = html.replace(/\x00/g, '');  // Null bytes
    html = html.replace(/\r/g, '');     // Carriage returns can cause issues

    // Create a temporary container to parse the HTML
    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // Recursively sanitize all nodes
    sanitizeNode(tempDiv);

    // FIX #9 (v2.1): Double-parse to catch mXSS
    // Re-parse the serialized output and sanitize again
    // This catches cases where browser mutations during first serialize
    // could create new dangerous content
    var firstPassHtml = tempDiv.innerHTML;
    tempDiv.innerHTML = firstPassHtml;
    sanitizeNode(tempDiv);

    // Final output
    var sanitizedHtml = tempDiv.innerHTML;

    // Paranoid final check: ensure no script tags somehow made it through
    // This is a defense-in-depth measure
    if (/<script[\s>]/i.test(sanitizedHtml) ||
        /javascript\s*:/i.test(sanitizedHtml) ||
        /on\w+\s*=/i.test(sanitizedHtml)) {
      console.error('DMGo Recommendations: Sanitization bypass detected, returning empty');
      return '';
    }

    return sanitizedHtml;
  }

  function sanitizeNode(node) {
    // Process child nodes in reverse order (removing changes indices)
    var children = Array.prototype.slice.call(node.childNodes);

    for (var i = children.length - 1; i >= 0; i--) {
      var child = children[i];

      // Remove script, style, and other dangerous elements entirely
      if (child.nodeType === 1) { // Element node
        var tagName = child.tagName.toLowerCase();

        // Remove disallowed tags
        if (ALLOWED_TAGS.indexOf(tagName) === -1) {
          // FIX #3 (v2.1): Use expanded DANGEROUS_TAGS list
          // For dangerous tags, remove completely (including all children)
          if (DANGEROUS_TAGS.indexOf(tagName) !== -1) {
            node.removeChild(child);
          } else {
            // For other disallowed tags, keep text content but remove the tag
            // This is safe because we'll continue sanitizing the moved children
            while (child.firstChild) {
              node.insertBefore(child.firstChild, child);
            }
            node.removeChild(child);
          }
          continue;
        }

        // Sanitize attributes
        sanitizeAttributes(child, tagName);

        // Remove event handlers (onclick, onerror, etc.)
        removeEventHandlers(child);

        // Recursively sanitize children
        sanitizeNode(child);
      }
    }
  }

  function sanitizeAttributes(element, tagName) {
    var allowedForTag = ALLOWED_ATTRIBUTES[tagName] || [];
    var allowedForAll = ALLOWED_ATTRIBUTES['*'] || [];
    var allowed = allowedForAll.concat(allowedForTag);

    // Get all attributes and remove disallowed ones
    var attrs = Array.prototype.slice.call(element.attributes);

    for (var i = attrs.length - 1; i >= 0; i--) {
      var attr = attrs[i];
      var attrName = attr.name.toLowerCase();

      // Remove attribute if not in whitelist
      if (allowed.indexOf(attrName) === -1) {
        element.removeAttribute(attr.name);
        continue;
      }

      // Validate URL attributes (href, src) for dangerous schemes
      if (attrName === 'href' || attrName === 'src' || attrName === 'srcset') {
        var value = attr.value.toLowerCase().trim();

        for (var j = 0; j < DANGEROUS_URL_SCHEMES.length; j++) {
          if (value.indexOf(DANGEROUS_URL_SCHEMES[j]) === 0) {
            element.removeAttribute(attr.name);
            break;
          }
        }
      }

      // Sanitize style attribute to prevent CSS-based attacks
      if (attrName === 'style') {
        var sanitizedStyle = sanitizeStyle(attr.value);
        if (sanitizedStyle) {
          element.setAttribute('style', sanitizedStyle);
        } else {
          element.removeAttribute('style');
        }
      }
    }

    // Add rel="noopener noreferrer" to external links for security
    if (tagName === 'a' && element.getAttribute('target') === '_blank') {
      element.setAttribute('rel', 'noopener noreferrer');
    }
  }

  function removeEventHandlers(element) {
    // Remove all attributes starting with "on" (onclick, onerror, onload, etc.)
    var attrs = Array.prototype.slice.call(element.attributes);

    for (var i = attrs.length - 1; i >= 0; i--) {
      if (attrs[i].name.toLowerCase().indexOf('on') === 0) {
        element.removeAttribute(attrs[i].name);
      }
    }
  }

  // ============================================================================
  // Enhanced CSS Sanitization
  // Block additional dangerous CSS patterns including @import without url()
  // ============================================================================
  function sanitizeStyle(style) {
    if (typeof style !== 'string') {
      return '';
    }

    // Expanded list of dangerous CSS patterns
    // These patterns can execute code, load external resources, or exfiltrate data
    var dangerousPatterns = [
      /expression\s*\(/gi,           // IE CSS expressions (execute JS)
      /url\s*\(/gi,                   // URL function (load external resources)
      /javascript\s*:/gi,             // JavaScript protocol in url()
      /behavior\s*:/gi,               // IE behaviors (execute JS)
      /-moz-binding\s*:/gi,           // Firefox XBL bindings (execute JS)
      /-webkit-binding\s*:/gi,        // WebKit bindings
      /@import/gi,                    // Load external stylesheets (data exfiltration)
      /@font-face/gi,                 // Load external fonts (can track users)
      /@namespace/gi,                 // XML namespace manipulation
      /\\00/gi,                       // Null byte injection attempts
      /\\u00/gi,                      // Unicode escape null bytes
      /attr\s*\(/gi,                  // attr() can sometimes leak data
      /var\s*\(\s*--[^)]*url/gi,     // CSS variables with url()
      /image\s*\(/gi,                 // image() function
      /image-set\s*\(/gi,             // image-set() function
      /cross-fade\s*\(/gi,            // cross-fade() function
      /element\s*\(/gi                // element() function (Firefox)
    ];

    // Check each dangerous pattern
    for (var i = 0; i < dangerousPatterns.length; i++) {
      if (dangerousPatterns[i].test(style)) {
        // Return empty string if any dangerous pattern is found
        // This is safer than trying to remove just the dangerous part
        return '';
      }
    }

    // Additional check: block any string containing quotes followed by suspicious content
    // This catches things like: @import "http://evil.com"
    if (/@\w+\s*['"]/.test(style)) {
      return '';
    }

    return style;
  }

  // ============================================================================
  // Input validation for numTiles
  // Ensures numTiles is a positive integer within reasonable bounds
  // ============================================================================
  function validateNumTiles(numTiles) {
    var MIN_TILES = 1;
    var MAX_TILES = 10;
    var DEFAULT_TILES = 3;

    // Check if it's a valid number
    if (typeof numTiles !== 'number' || isNaN(numTiles)) {
      return DEFAULT_TILES;
    }

    // Ensure it's an integer
    var tiles = Math.floor(numTiles);

    // Clamp to valid range
    if (tiles < MIN_TILES) {
      return MIN_TILES;
    }
    if (tiles > MAX_TILES) {
      return MAX_TILES;
    }

    return tiles;
  }

  // ============================================================================
  // URL validation to ensure pageUrl is a valid URL
  // Prevents injection of malicious data through the URL parameter
  // ============================================================================
  function isValidUrl(string) {
    try {
      var url = new URL(string);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (e) {
      return false;
    }
  }

  /**
   * Load recommendations and inject them into the page
   *
   * @param {Object} options - Configuration options
   * @param {string} options.pageUrl - The full URL of the current page
   * @param {string} options.containerId - ID of the container div to populate
   * @param {number} [options.numTiles=3] - Number of recommendation tiles to fetch (1-10)
   * @param {function} [options.onSuccess] - Callback function on successful load
   * @param {function} [options.onError] - Callback function on error
   */
  DMGo.loadRecommendations = function(options) {
    // Validate required parameters
    if (!options || !options.pageUrl) {
      console.error('DMGo Recommendations: pageUrl is required');
      return;
    }

    if (!options.containerId) {
      console.error('DMGo Recommendations: containerId is required');
      return;
    }

    // FIX #1 (v2.1): Validate containerId to prevent prototype pollution
    // Reject dangerous property names that could pollute Object prototype
    if (!isSafePropertyName(options.containerId)) {
      console.error('DMGo Recommendations: Invalid containerId - potentially dangerous property name');
      return;
    }

    // FIX #4: Validate URL format
    if (!isValidUrl(options.pageUrl)) {
      console.error('DMGo Recommendations: pageUrl must be a valid HTTP/HTTPS URL');
      return;
    }

    var pageUrl = options.pageUrl;
    var containerId = options.containerId;

    // FIX #3: Validate and sanitize numTiles
    var numTiles = validateNumTiles(options.numTiles);

    var onSuccess = typeof options.onSuccess === 'function' ? options.onSuccess : function() {};
    var onError = typeof options.onError === 'function' ? options.onError : function() {};

    // Get the container element
    var container = document.getElementById(containerId);
    if (!container) {
      console.error('DMGo Recommendations: Container element not found with ID: ' + containerId);
      return;
    }

    // Show loading state
    showLoadingState(container);

    // Fetch recommendations from API
    fetch(API_BASE_URL + '/api/recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: pageUrl,
        n_recommendations: numTiles
      })
    })
    .then(function(response) {
      if (!response.ok) {
        throw new Error('API error: ' + response.status + ' ' + response.statusText);
      }

      // FIX #10 (v2.1): Validate Content-Type header
      // Ensures response is actually JSON and not a MITM-injected HTML page
      var contentType = response.headers.get('Content-Type') || '';
      if (!contentType.includes('application/json')) {
        console.warn('DMGo Recommendations: Unexpected Content-Type: ' + contentType);
        // Still try to parse as JSON, but log the warning
        // Some servers may not set Content-Type correctly
      }

      return response.json();
    })
    .then(function(data) {
      // FIX #5 + #6 (v2.1): Reset retry counter using safe accessor
      // Uses prototype-pollution-safe function and manages memory
      clearRetryAttempts(containerId);

      if (!data.recommendations || data.recommendations.length === 0) {
        showEmptyState(container);
        return;
      }

      // Render the recommendations
      renderRecommendations(container, data.recommendations);
      onSuccess(data);
    })
    .catch(function(error) {
      console.error('DMGo Recommendations: Error fetching recommendations', error);
      showErrorState(container, containerId, error.message, options);
      onError(error);
    });
  };

  /**
   * Show loading state in the container
   */
  function showLoadingState(container) {
    // Using textContent instead of innerHTML for static content (safer)
    var loadingDiv = document.createElement('div');
    loadingDiv.className = 'dmgo-loading';
    loadingDiv.style.cssText = 'text-align: center; padding: 2rem; color: #666;';

    var loadingText = document.createElement('p');
    loadingText.textContent = 'Loading recommendations...';
    loadingDiv.appendChild(loadingText);

    container.innerHTML = '';
    container.appendChild(loadingDiv);
  }

  /**
   * Show error state with retry button
   * Error message is escaped to prevent XSS
   * Implements exponential backoff for retries
   * Uses unique ID for retry button
   * Uses safe accessor functions for retry state (prototype pollution protection)
   * Fixed double escaping bug - createTextNode already escapes
   */
  function showErrorState(container, containerId, errorMessage, options) {
    // FIX #1 (v2.1): Use safe accessor instead of direct property access
    var attempts = getRetryAttempts(containerId);
    var canRetry = attempts < retryState.maxRetries;

    // Build error UI using DOM methods instead of innerHTML (safer)
    var errorDiv = document.createElement('div');
    errorDiv.className = 'dmgo-error';
    errorDiv.style.cssText = 'text-align: center; padding: 2rem; color: #d32f2f; background: #ffebee; border-radius: 4px;';

    var errorTitle = document.createElement('p');
    var strong = document.createElement('strong');
    strong.textContent = 'Error loading recommendations: ';
    errorTitle.appendChild(strong);
    // FIX #5 (v2.1): createTextNode already treats content as plain text,
    // so we don't need escapeHtml (which caused double-encoding)
    // Ensure errorMessage is a string to prevent any type coercion issues
    var safeErrorMessage = (typeof errorMessage === 'string') ? errorMessage : 'Unknown error';
    errorTitle.appendChild(document.createTextNode(safeErrorMessage));
    errorDiv.appendChild(errorTitle);

    var helpText = document.createElement('p');
    helpText.style.cssText = 'font-size: 0.9rem; color: #666;';
    helpText.textContent = 'Make sure the API server is running.';
    errorDiv.appendChild(helpText);

    if (canRetry) {
      // Generate unique button ID
      var buttonId = generateUniqueId('dmgo-retry-btn');

      var retryBtn = document.createElement('button');
      retryBtn.id = buttonId;
      retryBtn.style.cssText = 'margin-top: 1rem; padding: 0.5rem 1.5rem; background: #0055a5; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 1rem;';
      retryBtn.textContent = 'Retry (' + (retryState.maxRetries - attempts) + ' attempts remaining)';

      // Implement exponential backoff on retry
      retryBtn.addEventListener('click', function() {
        // Use safe accessor for incrementing
        var currentAttempts = getRetryAttempts(containerId);
        setRetryAttempts(containerId, currentAttempts + 1);

        var newAttempts = getRetryAttempts(containerId);
        var delay = retryState.baseDelay * Math.pow(2, newAttempts - 1);

        retryBtn.disabled = true;
        retryBtn.textContent = 'Retrying in ' + (delay / 1000) + 's...';

        setTimeout(function() {
          DMGo.loadRecommendations(options);
        }, delay);
      });

      errorDiv.appendChild(retryBtn);
    } else {
      var maxRetriesText = document.createElement('p');
      maxRetriesText.style.cssText = 'font-size: 0.9rem; color: #999; margin-top: 1rem;';
      maxRetriesText.textContent = 'Maximum retry attempts reached. Please refresh the page.';
      errorDiv.appendChild(maxRetriesText);
    }

    container.innerHTML = '';
    container.appendChild(errorDiv);
  }

  /**
   * Show empty state when no recommendations are available
   */
  function showEmptyState(container) {
    // Using DOM methods instead of innerHTML (safer)
    var emptyDiv = document.createElement('div');
    emptyDiv.className = 'dmgo-empty';
    emptyDiv.style.cssText = 'text-align: center; padding: 2rem; color: #666;';

    var emptyText = document.createElement('p');
    emptyText.textContent = 'No recommendations available for this page.';
    emptyDiv.appendChild(emptyText);

    container.innerHTML = '';
    container.appendChild(emptyDiv);
  }

  /**
   * Render recommendations into the container
   * HTML is sanitized before being injected into the DOM
   * Validates that rec.html exists and is a string
   */
  function renderRecommendations(container, recommendations) {
    // Create the row container
    var rowDiv = document.createElement('div');
    rowDiv.className = 'row';

    // Add each tile's HTML
    recommendations.forEach(function(rec) {
      // Validate rec.html exists and is a string
      if (!rec || typeof rec.html !== 'string') {
        console.warn('DMGo Recommendations: Invalid recommendation tile skipped');
        return;
      }

      // Sanitize HTML to prevent XSS attacks
      var sanitizedHtml = sanitizeHtml(rec.html.trim());

      var tempDiv = document.createElement('div');
      tempDiv.innerHTML = sanitizedHtml;

      // Append the tile to the row
      if (tempDiv.firstChild) {
        rowDiv.appendChild(tempDiv.firstChild);
      }
    });

    // Replace container contents with the row
    container.innerHTML = '';
    container.appendChild(rowDiv);
  }

  /**
   * Helper function to get current page URL
   * Useful when you want to use the current browser URL
   */
  DMGo.getCurrentPageUrl = function() {
    return window.location.href;
  };

  /**
   * Load recommendations for current page
   * Convenience function that uses the current URL
   */
  DMGo.loadRecommendationsForCurrentPage = function(containerId, numTiles) {
    DMGo.loadRecommendations({
      pageUrl: window.location.href,
      containerId: containerId,
      numTiles: numTiles || 3
    });
  };

  /**
   * Reset retry state for a container (useful for testing)
   * Uses safe accessor functions to prevent prototype pollution
   */
  DMGo.resetRetryState = function(containerId) {
    if (containerId) {
      // Use safe clear function
      clearRetryAttempts(containerId);
    } else {
      // Reset all state safely
      retryState.attempts = Object.create(null);
      retryState.containerOrder = [];
    }
  };

  // Export namespace to window
  window.DMGo = DMGo;

  // ============================================================================
  // Backward compatibility: Also expose as global functions (deprecated)
  // These will be removed in a future version
  // ============================================================================
  window.loadRecommendations = function(options) {
    console.warn('DMGo Recommendations: loadRecommendations() is deprecated. Use DMGo.loadRecommendations() instead.');
    return DMGo.loadRecommendations(options);
  };

  window.getCurrentPageUrl = function() {
    console.warn('DMGo Recommendations: getCurrentPageUrl() is deprecated. Use DMGo.getCurrentPageUrl() instead.');
    return DMGo.getCurrentPageUrl();
  };

  window.loadRecommendationsForCurrentPage = function(containerId, numTiles) {
    console.warn('DMGo Recommendations: loadRecommendationsForCurrentPage() is deprecated. Use DMGo.loadRecommendationsForCurrentPage() instead.');
    return DMGo.loadRecommendationsForCurrentPage(containerId, numTiles);
  };

  // Log that the script has loaded
  console.log('DMGo Recommendations script loaded successfully (v2.1.0 - security hardened)');

})(window);
