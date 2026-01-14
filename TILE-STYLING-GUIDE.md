# Recommendation Tile Styling Guide

## Quick Reference for Whistler.com-Inspired Tiles

This guide explains how the recommendation tiles are styled to match professional tourism website aesthetics.

## Tile HTML Structure

The tiles follow this structure from DMGo.xlsx:

```html
<div class="third">
  <div class="tile tile--event">
    <span class="tile__label"><b>Jan 25 – Feb 1</b> 2026</span>
    <img src="//cdn.whistler.com/..." alt="...">
    <h3 class="tile__title">Whistler Pride Festival</h3>
    <p>A weeklong celebration of belonging, inclusivity...</p>
    <div class="tile__link">
      <a href="/events/winterpride/">Learn More</a>
    </div>
  </div>
</div>
```

## CSS Class Breakdown

### `.third` - Column Wrapper
```css
flex: 0 0 33.333333%;        /* Takes 1/3 of row width */
max-width: 33.333333%;       /* Prevents overflow */
padding: 0 15px;             /* Gutter spacing */
margin-bottom: 30px;         /* Vertical spacing between rows */
```

**Purpose:** Creates the 3-column grid layout
**Responsive:** Becomes 50% on tablets, 100% on mobile

---

### `.row` - Tile Container
```css
display: flex;               /* Flexbox for equal-height tiles */
flex-wrap: wrap;             /* Wraps to multiple rows */
margin: 0 -15px;            /* Negative margin for gutters */
gap: 0;                     /* No gap (using padding instead) */
```

**Purpose:** Container for all tiles in a row
**Effect:** Creates consistent spacing and alignment

---

### `.tile` - Main Tile Card
```css
background: #fff;            /* White background */
border-radius: 0;           /* Sharp corners (no rounding) */
overflow: hidden;           /* Clips image zoom effect */
height: 100%;               /* Full height of column */
display: flex;              /* Flex container */
flex-direction: column;     /* Stack content vertically */
box-shadow: 0 1px 3px rgba(0,0,0,0.12);  /* Subtle elevation */
transition: all 0.3s ease;  /* Smooth hover animations */
```

**Purpose:** Main container for tile content
**Hover Effect:**
```css
.tile:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);  /* Enhanced shadow */
  transform: translateY(-2px);              /* Lifts up 2px */
}
```

---

### `.tile--event` / `.tile--package` - Tile Variants
```css
.tile--event {
  position: relative;         /* For absolute positioned labels */
}

.tile--event:hover img {
  transform: scale(1.05);     /* Zoom image on hover */
}
```

**Purpose:** Modifiers for different tile types
**Effect:** Enables image zoom animation on hover

---

### `.tile img` - Tile Images
```css
width: 100%;                 /* Full width of container */
height: 220px;              /* Fixed height for consistency */
object-fit: cover;          /* Crop to fit, maintain aspect ratio */
display: block;             /* Remove inline spacing */
border: none;               /* No borders */
transition: transform 0.3s ease;  /* Smooth zoom animation */
```

**Purpose:** Display high-quality images consistently
**Result:** All images are same height, properly cropped

---

### `.tile__label` - Date/Event Badge
```css
position: absolute;          /* Float over image */
top: 15px;                  /* 15px from top */
left: 15px;                 /* 15px from left */
background: rgba(255,255,255,0.95);  /* Almost-white with transparency */
padding: 6px 12px;          /* Compact padding */
font-size: 0.75rem;         /* Small text (12px) */
font-weight: 700;           /* Bold */
color: #0a2540;            /* Navy text */
text-transform: uppercase;  /* ALL CAPS */
letter-spacing: 0.5px;     /* Spread out letters */
border-radius: 2px;        /* Slight rounding */
z-index: 10;               /* Above image */
```

**Purpose:** Display dates or event tags over images
**Special:**
```css
.tile__label b {
  color: #ff6b35;           /* Orange for emphasized text */
}
```

---

### `.tile__title` / `.tile h3` - Tile Heading
```css
color: #0a2540;             /* Deep navy */
font-size: 1.375rem;        /* 22px */
font-weight: 700;           /* Bold */
line-height: 1.3;           /* Tight line spacing */
margin: 20px 0 15px;        /* Spacing above and below */
padding-left: 20px;         /* Inner padding */
padding-right: 20px;        /* Inner padding */
```

**Purpose:** Main heading for the tile
**Result:** Clear, readable titles that stand out

---

### `.tile p` - Tile Description
```css
color: #555;                /* Medium gray for readability */
font-size: 0.9375rem;       /* 15px */
line-height: 1.6;           /* Comfortable reading */
margin-bottom: 15px;        /* Space below */
padding-left: 20px;         /* Inner padding */
padding-right: 20px;        /* Inner padding */
flex-grow: 1;              /* Expands to fill available space */
```

**Purpose:** Descriptive text for the activity/event
**Key Feature:** `flex-grow: 1` pushes the link to the bottom

---

### `.tile__link` - Link Container
```css
margin-top: auto;           /* Push to bottom of tile */
padding: 0 20px 25px;       /* Bottom and side padding */
```

**Purpose:** Container for the call-to-action link
**Effect:** Always positioned at the bottom of the tile

---

### `.tile__link a` - Call-to-Action Link
```css
display: inline-block;      /* Block-level inline */
color: #ff6b35;            /* Vibrant orange */
text-decoration: none;      /* No underline (custom one below) */
font-weight: 700;          /* Bold */
font-size: 0.9rem;         /* Slightly smaller (14.4px) */
text-transform: uppercase;  /* ALL CAPS */
letter-spacing: 0.5px;     /* Spread letters */
transition: color 0.3s ease;  /* Smooth color change */
position: relative;         /* For pseudo-element underline */
padding-bottom: 3px;       /* Space for underline */
```

**Hover State:**
```css
.tile__link a:hover {
  color: #e05a2a;           /* Darker orange on hover */
}
```

**Animated Underline:**
```css
.tile__link a::after {
  content: '';               /* Empty pseudo-element */
  position: absolute;        /* Positioned relative to link */
  bottom: 0;                /* At bottom of link */
  left: 0;                  /* Starting from left */
  width: 0;                 /* Initially hidden (no width) */
  height: 2px;              /* 2px thick line */
  background-color: #ff6b35;  /* Orange to match link */
  transition: width 0.3s ease;  /* Animate width change */
}

.tile__link a:hover::after {
  width: 100%;              /* Expands to full width on hover */
}
```

**Purpose:** Eye-catching call-to-action with smooth underline animation
**Effect:** Underline slides from left to right on hover

---

## Color Palette

### Primary Colors
- **Deep Navy**: `#0a2540` - Headings, text, professional tone
- **Vibrant Orange**: `#ff6b35` - Links, accents, energy
- **Darker Orange**: `#e05a2a` - Hover states

### Secondary Colors
- **White**: `#fff` - Backgrounds
- **Light Gray**: `#f8f8f8` - Section backgrounds
- **Medium Gray**: `#555` - Body text
- **Border Gray**: `#e0e0e0` - Subtle dividers

### Shadow Colors
- **Light Shadow**: `rgba(0,0,0,0.12)` - Default tile elevation
- **Hover Shadow**: `rgba(0,0,0,0.15)` - Enhanced elevation

---

## Typography

### Font Stack
```css
font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
```

### Font Sizes
- **Tile Title**: 1.375rem (22px)
- **Description**: 0.9375rem (15px)
- **Link**: 0.9rem (14.4px)
- **Label**: 0.75rem (12px)

### Font Weights
- **Regular**: 400 (default)
- **Medium**: 500 (navigation links)
- **Bold**: 700 (headings, labels, links)

---

## Spacing System

### Padding
- **Tile Inner Content**: 20px left/right
- **Tile Bottom**: 25px
- **Column Gutters**: 15px
- **Label**: 6px vertical, 12px horizontal

### Margins
- **Tile Title**: 20px top, 15px bottom
- **Description**: 15px bottom
- **Tile Rows**: 30px bottom
- **Link Container**: auto top (pushes to bottom)

---

## Animation & Transitions

### Duration
- **Standard**: 0.3s ease (most transitions)

### Effects
1. **Tile Hover**: Lift up 2px + enhanced shadow
2. **Image Zoom**: Scale to 1.05 (5% larger)
3. **Link Color**: Orange to darker orange
4. **Underline**: Width 0 to 100% (slides in)

### Timing Functions
- **Ease**: Default for smooth, natural motion
- **Ease-in-out**: For more dramatic effects (not used currently)

---

## Responsive Behavior

### Desktop (Default)
```css
.third {
  flex: 0 0 33.333333%;     /* 3 columns */
  max-width: 33.333333%;
}
```

### Tablet (max-width: 992px)
```css
.third {
  flex: 0 0 50%;            /* 2 columns */
  max-width: 50%;
}
```

### Mobile (max-width: 768px)
```css
.third {
  flex: 0 0 100%;           /* 1 column */
  max-width: 100%;
}

.row {
  margin: 0;                /* Remove negative margins */
}

.tile h3 {
  font-size: 1.25rem;       /* Smaller titles (20px) */
}
```

### Small Mobile (max-width: 480px)
```css
.tile img {
  height: 180px;            /* Shorter images */
}
```

---

## Usage Examples

### Basic Tile (No Label)
```html
<div class="third">
  <div class="tile tile--event">
    <img src="image.jpg" alt="Description">
    <h3 class="tile__title">Activity Name</h3>
    <p>Brief description of the activity.</p>
    <div class="tile__link">
      <a href="/link/">Learn More</a>
    </div>
  </div>
</div>
```

### Tile with Date Label
```html
<div class="third">
  <div class="tile tile--event">
    <span class="tile__label"><b>Jan 25 – Feb 1</b> 2026</span>
    <img src="event.jpg" alt="Event">
    <h3 class="tile__title">Event Name</h3>
    <p>Event description...</p>
    <div class="tile__link">
      <a href="/events/event-name/">Register</a>
    </div>
  </div>
</div>
```

### Complete Row (3 Tiles)
```html
<div class="row">
  <div class="third"><!-- Tile 1 --></div>
  <div class="third"><!-- Tile 2 --></div>
  <div class="third"><!-- Tile 3 --></div>
</div>
```

---

## Testing Checklist

### Visual Tests
- ✅ All tiles have equal height in a row
- ✅ Images are consistently 220px height
- ✅ Text doesn't overflow containers
- ✅ Spacing is consistent across tiles
- ✅ Orange color is vibrant and visible

### Interaction Tests
- ✅ Hover on tile: lifts and shadow enhances
- ✅ Hover on image: zooms smoothly
- ✅ Hover on link: changes color and underline appears
- ✅ All animations are smooth (no jank)

### Responsive Tests
- ✅ Desktop: 3 tiles per row
- ✅ Tablet: 2 tiles per row
- ✅ Mobile: 1 tile per row
- ✅ All screen sizes: tiles remain readable

---

## Tips for Customization

### Change Colors
```css
/* In styles.css, search and replace: */
#0a2540  →  YOUR_NAVY_COLOR      /* Primary */
#ff6b35  →  YOUR_ACCENT_COLOR    /* Links/Accents */
```

### Adjust Tile Size
```css
.tile img {
  height: 250px;  /* Change from 220px */
}
```

### Modify Hover Effects
```css
.tile:hover {
  transform: translateY(-4px);  /* Larger lift (default: -2px) */
}

.tile--event:hover img {
  transform: scale(1.1);        /* More zoom (default: 1.05) */
}
```

### Change Grid Columns
```css
.third {
  flex: 0 0 25%;         /* 4 columns instead of 3 */
  max-width: 25%;
}
```

---

## Summary

The tile styling creates a professional, tourism-focused design with:

✅ **Clean 3-column layout** that's fully responsive
✅ **Consistent image heights** for visual harmony
✅ **Vibrant orange accents** for energy and calls-to-action
✅ **Smooth hover animations** for interactivity
✅ **Professional typography** with Helvetica Neue
✅ **Flexible content** that adapts to different tile heights
✅ **Animated underlines** on links for modern feel

All styles match the actual HTML structure from DMGo.xlsx and work seamlessly with the recommendation API.

---

**Reference:** See `styles.css` lines 135-277 for complete tile styling
**Last Updated:** 2026-01-13
