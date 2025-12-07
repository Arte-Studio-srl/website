# ArteStudio Website - Design Documentation

## 🎨 Design Concept: "Blueprint Elegance"

A sophisticated, minimalist design inspired by architectural blueprints and technical drawings.

## Color Palette

### Primary Colors
- **Bronze** `#a67856` - Main accent color (buttons, highlights, decorative elements)
- **Cream** `#f5ede7` - Background color for soft, elegant feel
- **Charcoal** `#2a2a2a` - Primary text and dark sections

### Bronze Scale
```
bronze-50:  #faf7f5  (Lightest)
bronze-100: #f5ede7
bronze-200: #e8d6c7
bronze-300: #d4b39a
bronze-400: #c49574
bronze-500: #a67856  ← Main
bronze-600: #8b6347
bronze-700: #73513b
bronze-800: #5f4432
bronze-900: #4f392a  (Darkest)
```

## Typography

### Font Families
- **Display Font**: Cormorant Garamond (elegant serif for headings)
  - Used for: H1-H6, feature text, navigation
  - Weights: 300, 400, 500, 600, 700

- **Body Font**: Inter (clean sans-serif for readability)
  - Used for: Paragraphs, UI elements, labels
  - Weights: 400, 500, 600

### Typography Scale
```
Homepage Hero:        text-7xl (72px)
Page Headers:         text-6xl (60px)
Section Headings:     text-4xl (36px)
Subsections:          text-2xl (24px)
Body Text:            text-lg (18px)
Small Text:           text-sm (14px)
```

## Design Elements

### 1. Blueprint Grid Pattern
- Subtle grid overlay with 40px spacing
- Used in background sections
- Opacity: 10-30% for visual texture
- Creates architectural/technical aesthetic

### 2. Decorative Lines
- Horizontal lines with bronze color
- Animated drawing effect on page load
- Corner brackets on images and cards
- Emphasizes geometric precision

### 3. Corner Decorations
Technical blueprint-style corners on:
- Project cards
- Image containers
- Featured sections
- Adds authentic architectural drawing feel

### 4. Hover Effects
**Project Cards:**
- Lift on hover (-8px translateY)
- Scale up on images (1.1x)
- Blueprint grid overlay appears
- Bronze accent highlights

**Links:**
- Color transition to bronze
- Underline animations
- Arrow icon shifts

## Layout System

### Grid Structure
- **Homepage**: Hero → Categories (3-col) → Projects (3-col) → Quote
- **Category Pages**: Hero → Projects Grid (3-col responsive)
- **Project Detail**: Hero → Stage Tabs → Gallery → Thumbnails
- **Contact**: Split layout (Info | Form)

### Responsive Breakpoints
```
Mobile:     < 640px   (1 column)
Tablet:     768px     (2 columns)
Desktop:    1024px    (3 columns)
Large:      1280px+   (Full width, max 1536px container)
```

### Spacing Scale
- Container padding: 16px (mobile) → 32px (desktop)
- Section spacing: 80-96px vertical
- Card gaps: 32px
- Content spacing: 16-24px

## Components

### Navigation Header
- Fixed position, transparent initially
- Becomes solid white with shadow on scroll
- Dropdown menu for categories
- Mobile hamburger menu
- Logo on left, navigation right

### Project Card
- White background with shadow
- Image 288px height
- Bronze border-top (2px)
- Blueprint corner decoration
- Hover: Lift + blueprint overlay
- Shows: Title, Year, Client, Description, Stage count

### Footer
- Dark charcoal background
- 3-column layout (About | Links | Contact)
- Bronze accent decorations
- Social/contact information

### Forms
- Bronze-bordered inputs
- Focus state with bronze highlight
- Clear error messages
- Large touch targets (48px+)

## Animations

### Page Load Sequence
1. Header slides down (0.6s)
2. Hero content fades up (0.8s)
3. Decorative lines draw (1-2s)
4. Cards stagger in (0.1s delay each)

### Interaction Animations
- **Hover**: 0.3s ease transitions
- **Page transitions**: 0.4s fade
- **Modal/Lightbox**: 0.3s scale + fade
- **Scroll reveals**: Fade + slide up

### Animation Principles
- Ease-out curves for natural feel
- 300-600ms duration (not too slow)
- Subtle, professional movements
- Staggered timing for sequential elements

## Image Specifications

### Project Images
- **Thumbnails**: 1200x800px (3:2 ratio)
- **Gallery Images**: 1920x1080px or higher (16:9)
- **Format**: JPEG for photos, PNG for graphics
- **Optimization**: Compress to <500KB per image

### Logo
- **Size**: 600x200px or proportional
- **Format**: PNG with transparency or SVG
- **Placement**: Header (192px max width)

## Accessibility

### Implemented Features
- Semantic HTML5 elements
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus indicators
- Color contrast ratios WCAG AA compliant
- Alt text ready for images
- Responsive text sizing

### Color Contrast Ratios
- Bronze on Cream: 3.8:1 (AA Large Text)
- Charcoal on Cream: 12.5:1 (AAA)
- White on Bronze-600: 5.2:1 (AA)

## Special Effects

### Blueprint Grid
```css
background-image: 
  linear-gradient(rgba(166, 120, 86, 0.05) 1px, transparent 1px),
  linear-gradient(90deg, rgba(166, 120, 86, 0.05) 1px, transparent 1px);
background-size: 40px 40px;
```

### Line Drawing Animation
```css
@keyframes draw {
  from { stroke-dashoffset: 1000; }
  to { stroke-dashoffset: 0; }
}
```

### Hover Lift
```css
transform: translateY(-8px);
box-shadow: 0 12px 40px rgba(42, 42, 42, 0.15);
```

## Performance Optimizations

- Static export (no server required)
- Image lazy loading
- Code splitting by route
- CSS purging (unused styles removed)
- Preloading critical fonts
- Optimized bundle size (~155KB first load)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari 14+, Chrome Mobile)

## Design Philosophy

**Principles:**
1. **Sophisticated Simplicity** - Elegant without being ornate
2. **Technical Precision** - Blueprint elements convey expertise
3. **Visual Hierarchy** - Clear content structure
4. **Purposeful Animation** - Movement enhances, doesn't distract
5. **Professional Polish** - High-quality aesthetic throughout

**Avoided:**
- Overly complex animations
- Bright, saturated colors
- Heavy textures or patterns
- Cluttered layouts
- Gimmicky effects

## Extending the Design

### Adding New Sections
1. Use same spacing system (py-20, py-24)
2. Apply blueprint-grid background for variety
3. Include bronze accent elements
4. Maintain typography hierarchy

### Creating New Components
1. Follow hover-lift pattern for cards
2. Use bronze for primary actions
3. Add blueprint corner decorations
4. Include motion animations

### Color Usage Guidelines
- **Bronze**: CTA buttons, links, accents, active states
- **Cream**: Backgrounds, alternating sections
- **Charcoal**: Text, dark sections, footer
- **White**: Cards, modals, input fields

---

This design creates a professional, memorable identity that reflects ArteStudio's technical expertise while remaining approachable and modern.

