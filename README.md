# genistar-ffp
Custom JavaScript files for the Genistar Financial Freedom Presentation

# Genistar Presentation Scripts

Custom JavaScript files for the Genistar business presentation website built in Webflow.

## Files

| File | Purpose | Size |
|------|---------|------|
| `viewport.js` | Dynamic viewport height for mobile devices | ~500 bytes |
| `slide-navigation.js` | Slide & modal navigation with audio-synced builds | ~5.5 KB |
| `slide-menu.js` | Dynamic slide menu generator | ~1.5 KB |
| `charts.js` | Chart.js configurations for data visualisations | ~4.8 KB |
| `audio-player.js` | Audio playback system with custom events | ~3.2 KB |
| `audio-progress.js` | Circular progress indicator for audio buttons | ~1.8 KB |
| `tracking.js` | GA4 tracking for audio and video engagement | ~6.5 KB |

**Total size**: ~24 KB (minified)

## Usage

Load via jsDelivr CDN in your Webflow footer code:

```html
<script src="https://cdn.jsdelivr.net/gh/YOUR_USERNAME/YOUR_REPO@main/viewport.js"></script>
<script src="https://cdn.jsdelivr.net/gh/YOUR_USERNAME/YOUR_REPO@main/slide-navigation.js"></script>
<script src="https://cdn.jsdelivr.net/gh/YOUR_USERNAME/YOUR_REPO@main/slide-menu.js"></script>
<script src="https://cdn.jsdelivr.net/gh/YOUR_USERNAME/YOUR_REPO@main/charts.js"></script>
<script src="https://cdn.jsdelivr.net/gh/YOUR_USERNAME/YOUR_REPO@main/audio-player.js"></script>
<script src="https://cdn.jsdelivr.net/gh/YOUR_USERNAME/YOUR_REPO@main/audio-progress.js"></script>
<script src="https://cdn.jsdelivr.net/gh/YOUR_USERNAME/YOUR_REPO@main/tracking.js"></script>
```

## Features

- ✅ Slide-based presentation navigation
- ✅ Audio-synced content builds
- ✅ Interactive charts (Chart.js)
- ✅ Audio playback with progress indicators
- ✅ GA4 event tracking
- ✅ Mobile-optimised viewport handling
- ✅ Vimeo video tracking

## Requirements

Your Webflow site must include:
- Chart.js CDN in page head
- Vimeo Player API for video tracking
- Google Tag Manager / GA4 setup

## Audio Progress Indicator

Add this SVG embed inside each `.audio-button` link in Webflow:

```html
<svg class="audio-progress-ring" width="100%" height="100%" viewBox="0 0 120 120">
  <circle 
    class="audio-progress-circle"
    stroke="#F39C12"
    stroke-width="4"
    fill="transparent"
    r="54"
    cx="60"
    cy="60"
  />
</svg>
```

## CSS Required

Add to Webflow custom code (head or footer):

```css
.audio-progress-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 10;
}

.audio-progress-circle {
  transition: stroke-dashoffset 0.3s ease;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
}

.audio-button {
  position: relative;
}
```

## Events Dispatched

### Audio Events
- `audioPlay` - When audio starts playing
- `audioProgress` - During audio playback (with percentage)
- `audioPause` - When audio is paused
- `audioEnded` - When audio finishes
- `audioStopped` - When audio is stopped by another audio starting
- `audioReset` - When all audio is reset
- `audioError` - When audio fails to load

### Slide Events
- `slidechange` - When slide changes (includes slide index)

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Development

To modify these scripts:

1. Edit files in your local repository
2. Commit changes
3. Push to GitHub
4. Wait 5-10 minutes for jsDelivr cache refresh
5. Test on your Webflow site

For immediate updates, use version query strings:
```html
<script src="https://cdn.jsdelivr.net/gh/USERNAME/REPO@main/audio-player.js?v=2"></script>
```

## License

MIT License - Feel free to use and modify for your projects.

## Author

Built by Inovara for Genistar
