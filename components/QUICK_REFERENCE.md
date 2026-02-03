# LZ-Dial Quick Reference

## Basic Setup

```html
<!-- 1. Include the component -->
<script src="lz-dial.js"></script>

<!-- 2. Use it -->
<lz-dial radius="140" justify="left">
    <lz-item label="Home" icon="home.svg" href="#home"></lz-item>
    <lz-item label="Settings" icon="settings.svg" href="#settings"></lz-item>
</lz-dial>
```

## Attributes

### `<lz-dial>`
- `radius="120"` - Circle radius (default: 120)
- `justify="left|center|right"` - FAB position (default: center)

### `<lz-item>`
- `label="Text"` - Display name (required)
- `icon="url"` - Icon image URL
- `href="url"` - Navigation link

## Customization

### Custom Trigger Button
```html
<lz-dial>
    <div slot="trigger-content">☰</div>
    <!-- items -->
</lz-dial>
```

### CSS Variables
```css
lz-dial {
    --primary: #00ff9d;  /* Active color */
    --bg: #111;          /* Background */
    --text: #fff;        /* Text color */
}
```

## Events

```javascript
dial.addEventListener('lz-change', (e) => {
    console.log(e.detail.item.getAttribute('label'));
    console.log(e.detail.index);
});
```

## JavaScript API

```javascript
const dial = document.querySelector('lz-dial');

// Properties
dial.isOpen          // Boolean
dial.rotation        // Number (radians)
dial.activeIndex     // Number
dial.items           // Array of lz-item elements
dial.radius          // Number

// Methods
dial.toggle()        // Open/close
```

## User Interactions

- **Click FAB** - Open/close dial
- **Drag ring** - Rotate dial
- **Swipe icon** - Quick navigate (up/down)
- **Click active item** - Navigate to href

## Examples

### Navigation Menu
```html
<lz-dial justify="right">
    <div slot="trigger-content">☰</div>
    <lz-item label="Home" icon="home.svg" href="/"></lz-item>
    <lz-item label="About" icon="info.svg" href="/about"></lz-item>
</lz-dial>
```

### Action Menu
```html
<lz-dial justify="left">
    <div slot="trigger-content">+</div>
    <lz-item label="New Post" icon="edit.svg"></lz-item>
    <lz-item label="Upload" icon="upload.svg"></lz-item>
</lz-dial>
```

### With Iconify
```html
<lz-item 
    label="Home" 
    icon="https://api.iconify.design/mdi:home.svg?color=%23ffffff">
</lz-item>
```

## Best Practices

✅ Use 4-8 items for best UX
✅ Keep labels short (1-2 words)
✅ Use 40x40px icons
✅ Position FAB to avoid content overlap
✅ Test on mobile devices

## Browser Support

✅ Chrome/Edge, Firefox, Safari (latest)
✅ Mobile browsers (iOS/Android)

Requires: Custom Elements, Shadow DOM, ES6
