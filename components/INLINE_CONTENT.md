# Inline Content Feature - LZ-Dial Component

## Overview

The lz-dial component now supports displaying rich media and interactive content inline instead of navigating away from the page. When a user clicks an active item with content attributes, an overlay modal appears with the content.

## Supported Content Types

### 1. 🎵 Audio Player
Play audio files inline with full controls.

**Attributes:**
- `data-audio="url"` - Path to audio file
- `data-autoplay` - Optional: Auto-play when opened

**Example:**
```html
<lz-item 
    label="Podcast" 
    icon="music.svg"
    data-audio="episode.mp3"
    data-autoplay>
</lz-item>
```

**Supported Formats:** MP3, WAV, OGG, AAC

---

### 2. 🎬 Video Player
Play video files inline with full controls.

**Attributes:**
- `data-video="url"` - Path to video file
- `data-autoplay` - Optional: Auto-play when opened

**Example:**
```html
<lz-item 
    label="Tutorial" 
    icon="video.svg"
    data-video="tutorial.mp4">
</lz-item>
```

**Supported Formats:** MP4, WebM, OGG

---

### 3. 📧 Email Form
Show a pre-filled email form that opens the user's mail client.

**Attributes:**
- `data-email="address"` - Email address

**Example:**
```html
<lz-item 
    label="Contact" 
    icon="email.svg"
    data-email="hello@example.com">
</lz-item>
```

**Features:**
- Pre-filled "To" field
- Subject line input
- Message textarea
- Opens default mail client on submit

---

### 4. 📞 Phone Dialer
Show a clickable phone number that triggers the device's phone app.

**Attributes:**
- `data-phone="number"` - Phone number

**Example:**
```html
<lz-item 
    label="Call Us" 
    icon="phone.svg"
    data-phone="+1-555-123-4567">
</lz-item>
```

**Features:**
- Large, clickable phone number
- Automatic `tel:` link
- Works on mobile and desktop

---

### 5. 🗺️ Google Maps
Embed Google Maps showing a specific location.

**Attributes:**
- `data-map="address"` - Address or location name

**Example:**
```html
<lz-item 
    label="Location" 
    icon="map.svg"
    data-map="Eiffel Tower, Paris, France">
</lz-item>
```

**Features:**
- Interactive Google Maps embed
- Automatic geocoding
- Full map controls (zoom, pan, etc.)

---

### 6. 🌐 iframe Embed
Embed any website or web content.

**Attributes:**
- `data-iframe="url"` - URL to embed

**Example:**
```html
<lz-item 
    label="Documentation" 
    icon="web.svg"
    data-iframe="https://docs.example.com">
</lz-item>
```

**Use Cases:**
- Documentation pages
- External tools
- Embedded apps
- YouTube videos
- Any embeddable content

---

## Priority System

Content attributes take priority over `href`:

```html
<!-- This will show video inline, NOT navigate -->
<lz-item 
    label="Tutorial" 
    data-video="tutorial.mp4"
    href="/tutorials">
</lz-item>

<!-- This will navigate (no content attributes) -->
<lz-item 
    label="Tutorials" 
    href="/tutorials">
</lz-item>
```

## Overlay Features

The content overlay includes:

- ✅ **Close button** - X button in top-right corner
- ✅ **Title** - Shows the item's label
- ✅ **Backdrop blur** - Blurred background
- ✅ **Responsive** - Adapts to screen size
- ✅ **Themed** - Uses component's CSS variables
- ✅ **Auto-cleanup** - Media stops when closed

## Usage Examples

### Media Gallery
```html
<lz-dial>
    <lz-item label="Song 1" data-audio="song1.mp3"></lz-item>
    <lz-item label="Song 2" data-audio="song2.mp3"></lz-item>
    <lz-item label="Song 3" data-audio="song3.mp3"></lz-item>
</lz-dial>
```

### Contact Menu
```html
<lz-dial>
    <lz-item label="Email" data-email="contact@example.com"></lz-item>
    <lz-item label="Call" data-phone="+1-555-0123"></lz-item>
    <lz-item label="Visit" data-map="123 Main St, City"></lz-item>
</lz-dial>
```

### Mixed Content
```html
<lz-dial>
    <lz-item label="Video" data-video="intro.mp4"></lz-item>
    <lz-item label="Audio" data-audio="podcast.mp3"></lz-item>
    <lz-item label="Email" data-email="hi@example.com"></lz-item>
    <lz-item label="Map" data-map="Office Location"></lz-item>
    <lz-item label="Docs" data-iframe="https://docs.example.com"></lz-item>
    <lz-item label="Home" href="/"></lz-item> <!-- Regular link -->
</lz-dial>
```

## Technical Implementation

### HTML Structure
```html
<div id="content-overlay">
    <div id="content-container">
        <button id="content-close">×</button>
        <div id="content-title"></div>
        <div id="content-body"></div>
    </div>
</div>
```

### JavaScript API
```javascript
// Show content programmatically
dial.showContent(item);

// Hide content
dial.hideContent();
```

### CSS Customization
```css
lz-dial {
    --primary: #00ff9d;  /* Overlay border/buttons */
    --bg: #111;          /* Overlay background */
    --text: #fff;        /* Text color */
}
```

## Browser Compatibility

- ✅ **Audio/Video:** All modern browsers
- ✅ **Email:** All browsers with mail client
- ✅ **Phone:** Mobile browsers + desktop with phone apps
- ✅ **Maps:** All browsers (requires internet)
- ✅ **iframe:** All modern browsers (subject to CORS)

## Best Practices

1. **File Sizes:** Keep audio/video files optimized
2. **Formats:** Use widely supported formats (MP4, MP3)
3. **Autoplay:** Use sparingly (can be annoying)
4. **Maps:** Provide specific addresses for better results
5. **iframes:** Ensure target site allows embedding
6. **Mobile:** Test phone/email on actual devices

## Demo

See `inline-content-demo.html` for a complete working example with all content types.

## Future Enhancements

Potential additions:
- PDF viewer
- Image gallery/lightbox
- Calendar/date picker
- Form builder
- Chat widget
- Custom HTML content

---

Part of the Lawn Czar UI Project
