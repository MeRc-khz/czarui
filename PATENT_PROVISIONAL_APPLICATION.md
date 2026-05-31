# PROVISIONAL PATENT APPLICATION

## BZR-DIAL-MENU: Physics-Based Radial Dial Web Component with Inline Media Overlay System

---

**Inventor:** Bizarre Lynx (legal name: [TO BE FILED])
**Entity:** The Conglomerate Group
**Filing Date:** May 31, 2026
**Application Type:** Provisional Patent Application (PPA)
**Field of Invention:** Web browser user interfaces; Web Components; Radial menu systems; Inline media rendering within navigation interfaces

---

## TITLE

**Physics-Based Radial Dial Web Component with Integrated Inline Media Overlay System and Multi-Modal Content Rendering**

---

## CROSS-REFERENCE TO RELATED APPLICATIONS

This application claims priority to the invention described herein, filed as a provisional application with the United States Patent and Trademark Office (USPTO).

---

## FIELD OF THE INVENTION

The present invention relates to web browser user interface components, specifically a native Web Component implementing a physics-based radial dial menu that integrates an inline content overlay system capable of rendering multiple media types (audio, video, maps, email forms, phone dialers, and embedded web content) within the dial interface without navigating away from the current page.

---

## BACKGROUND OF THE INVENTION

### Problem

Existing radial/pie menu implementations in web applications suffer from several limitations:

1. **Navigation-only paradigm:** Prior art radial menus (e.g., US20140047372A1, US20120216117A1) are limited to navigation links or action triggers. They do not provide inline content rendering capabilities within the menu overlay itself.

2. **Framework dependency:** Most existing implementations require JavaScript frameworks (React, Vue, Angular) and cannot function as standalone native Web Components with Shadow DOM encapsulation.

3. **No physics simulation:** Existing radial menus use static positioning or simple CSS animations. None implement physics-based inertial scrolling with velocity decay and spring-based snapping to angular positions.

4. **No multi-type inline content:** No known radial menu system provides a unified content overlay that can render audio players with real-time visualization, video players with custom controls, interactive maps, email contact forms, phone dialers, and iframe-embedded web content — all within the same component overlay.

5. **No integrated licensing:** No existing Web Component includes client-side license validation with format-verified key checking and unlicensed watermarking as part of the component lifecycle.

### Prior Art Analysis

| Reference | Limitation Our Invention Overcomes |
|-----------|-----------------------------------|
| US20140047372A1 (Radial menu for browsers) | Navigation-only; no inline media; no physics |
| US20120216117A1 (Pie menu for mobile) | Static positioning; no content overlay |
| US20160092034A1 (Circular menu with preview) | Preview is thumbnail only; no interactive media |
| US20190370234A1 (Web component menu) | No physics; no inline content rendering |
| US20210096708A1 (Radial UI for touch) | No multi-type media overlay; framework-dependent |

---

## SUMMARY OF THE INVENTION

The present invention is a native Web Component (`<bzr-dial-menu>`) that provides:

1. **Physics-based radial dial interaction** with inertial scrolling, velocity decay, and spring-snapped angular positioning
2. **Hybrid Canvas/DOM rendering** combining Canvas API performance for dynamic dial elements with DOM flexibility for content overlay
3. **Multi-modal inline content overlay** that renders audio, video, maps, email forms, phone dialers, and iframes within the component's Shadow DOM overlay
4. **License-gated distribution** with client-side key format validation and unlicensed watermarking
5. **Zero-dependency architecture** as a self-contained native Web Component

---

## DETAILED DESCRIPTION

### 1. Architecture Overview

The invention comprises two custom HTML elements registered via the Custom Elements API:

- `<bzr-dial-menu>` — The primary container and controller
- `<bzr-item>` — Individual dial items with configurable content attributes

The component uses Shadow DOM encapsulation (`mode: 'open'`) to prevent style leakage and ensure zero conflicts with host page CSS.

### 2. Physics-Based Dial System

#### 2.1 Inertial Scrolling Model

The dial implements a physics simulation with the following properties:

```
State variables:
  - rotation (θ): Current angular position in radians
  - velocity (ω): Angular velocity in radians/frame
  - friction (μ): Velocity decay coefficient (default: 0.95)
  - spring (k): Snap restoring force coefficient (default: 0.1)
  - snapAngle (α): Angular interval between items (2π / itemCount)
```

The physics loop runs via `requestAnimationFrame` and applies:

1. **Drag input:** Pointer/touch events calculate angular displacement from center
2. **Velocity tracking:** Δθ/Δt computed on pointer release
3. **Inertial decay:** `ω *= μ` per frame after release
4. **Spring snapping:** When `|ω| < threshold`, apply restoring force toward nearest snap angle: `θ += (nearestSnap - θ) * k`

#### 2.2 Hybrid Canvas/DOM Rendering

The dial ring is rendered via HTML5 Canvas for performance (60 FPS target), while the content overlay uses standard DOM elements for flexibility:

- **Canvas layer:** Dial ring, item icons, active indicator, glow effects
- **DOM overlay layer:** Content panels, media players, forms, maps
- **Synchronization:** Canvas redraw loop reads DOM state; DOM overlay reads Canvas active index

### 3. Multi-Modal Inline Content Overlay

#### 3.1 Content Type Detection

Each `<bzr-item>` supports data attributes that trigger inline content rendering:

| Attribute | Content Type | Rendered Output |
|-----------|-------------|-----------------|
| `data-audio` | Audio file URL | Canvas-based audio visualizer with custom controls |
| `data-video` | Video file URL | Custom video player with progress bar |
| `data-email` | Email address | Contact form with send functionality |
| `data-phone` | Phone number | Click-to-call dialer interface |
| `data-map` | Address string | OpenStreetMap embed via Leaflet.js |
| `data-iframe` | URL | Sandboxed iframe embed |
| `href` | URL | Standard navigation (fallback) |

#### 3.2 Content Resolution Priority

When an item is activated (rotated to the selection position and clicked):

1. Check `data-audio` → render audio visualizer
2. Check `data-video` → render video player
3. Check `data-email` → render email form
4. Check `data-phone` → render phone dialer
5. Check `data-map` → render map
6. Check `data-iframe` → render iframe
7. Fall back to `href` navigation

#### 3.3 Audio Visualizer

The audio visualizer creates an `<audio>` element, connects it to a Web Audio API `AnalyserNode`, and renders frequency data to a full-width Canvas element in real-time using `requestAnimationFrame`. Custom play/pause/progress controls are rendered as DOM overlays on the visualization canvas.

#### 3.4 Video Player

Creates a `<video>` element with custom controls (play/pause, progress bar, time display) styled to match the component's CSS custom properties. Supports `data-autoplay` attribute.

#### 3.5 Map Integration

Geocodes the address string and renders an interactive OpenStreetMap instance via Leaflet.js within the content overlay, with zoom controls and marker placement.

### 4. License Validation System

#### 4.1 Client-Side Format Validation

On construction, the component checks for a `license` attribute matching the pattern:

```
/^BZRD-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}$/
```

#### 4.2 Unlicensed Behavior

When no valid license is detected:
- Component functions fully (no feature degradation)
- Console warning displayed: "bzr-dial-ui: No valid license key. Purchase at [URL]"
- A visual watermark element is injected into the host page DOM: a fixed-position, semi-transparent overlay reading "bzr-dial-ui — UNLICENSED — [URL]"

#### 4.3 Server-Side Validation (Future Enhancement)

The component architecture supports server-side license verification via API endpoint (`POST /api/validate-license`) for full key authenticity checking.

### 5. Shadow DOM Encapsulation

All component styles are scoped within Shadow DOM, using CSS custom properties for theming:

```css
:host {
    --primary: #2bee8c;    /* Active item color */
    --bg: #111;            /* Background color */
    --text: #fff;          /* Text color */
}
```

Host pages can override these properties without penetrating the Shadow boundary.

---

## CLAIMS

### Independent Claims

**Claim 1.** A web browser user interface component comprising:
- A native Web Component implementing a radial dial menu with a plurality of selectable items arranged circumferentially
- A physics-based interaction system providing inertial scrolling with velocity decay and spring-based angular snapping to item positions
- An inline content overlay system that, upon selection of an item, renders content within the component overlay without navigating away from the current page
- Wherein the content overlay is capable of rendering a plurality of different content types selected from: audio with visualization, video with custom controls, interactive maps, email contact forms, phone dialers, and embedded web content via iframes

**Claim 2.** A web browser user interface component comprising:
- A native Web Component registered via the Custom Elements API with Shadow DOM encapsulation
- A hybrid rendering system combining Canvas API for dial ring rendering and DOM for content overlay
- A license validation system that checks for a valid license key on component construction and displays a visual watermark when no valid key is present
- Wherein the component operates with zero external framework dependencies

### Dependent Claims

**Claim 3.** The component of Claim 1, wherein the physics-based interaction system maintains angular velocity state after pointer release and applies a friction coefficient (μ ≈ 0.95) for exponential velocity decay, followed by a spring restoring force (k ≈ 0.1) toward the nearest item snap angle.

**Claim 4.** The component of Claim 1, wherein the audio content renderer creates a Web Audio API AnalyserNode connected to an HTML5 audio element and renders real-time frequency visualization to a Canvas element using requestAnimationFrame.

**Claim 5.** The component of Claim 1, wherein each selectable item supports data attributes (`data-audio`, `data-video`, `data-email`, `data-phone`, `data-map`, `data-iframe`) that determine the content type rendered in the overlay, with a priority resolution order and fallback to standard href navigation.

**Claim 6.** The component of Claim 2, wherein the license validation system validates key format using a regular expression pattern matching `BZRD-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}` and injects a fixed-position watermark DOM element into the host page when validation fails.

**Claim 7.** The component of Claim 1, wherein the dial position is adjustable via a `justify` attribute supporting values `left`, `center`, and `right` for positioning the dial button relative to the viewport edge.

**Claim 8.** The component of Claim 1, further comprising haptic feedback via the Vibration API on supported devices when items snap to the active position.

**Claim 9.** The component of Claim 1, wherein the content overlay includes a backdrop blur effect and auto-cleanup of media elements (audio/video) when the overlay is closed.

**Claim 10.** The component of Claim 2, wherein all component styles are scoped within Shadow DOM and configurable via CSS custom properties (`--primary`, `--bg`, `--text`) that can be overridden by the host page.

---

## ABSTRACT

A native Web Component implementing a physics-based radial dial menu with an integrated multi-modal inline content overlay system. The component provides inertial scrolling with velocity decay and spring-snapped angular positioning for intuitive dial interaction. A hybrid Canvas/DOM rendering architecture delivers 60 FPS dial performance while supporting rich inline content rendering — including audio visualization, video playback, interactive maps, email forms, phone dialers, and embedded web content — all within the component's Shadow DOM overlay without page navigation. The component includes a client-side license validation system with format-verified key checking and unlicensed watermarking. Zero external framework dependencies. Fully configurable via CSS custom properties and HTML attributes.

---

## DRAWINGS

### Figure 1: Component Architecture
```
┌─────────────────────────────────────────────┐
│              <bzr-dial-menu>                │
│  ┌───────────────────────────────────────┐  │
│  │         Shadow DOM (open)             │  │
│  │                                       │  │
│  │  ┌─────────────────────────────────┐  │  │
│  │  │     Canvas Layer (Dial Ring)    │  │  │
│  │  │  ┌───┐ ┌───┐ ┌───┐ ┌───┐       │  │  │
│  │  │  │ 🏠│ │ 🎵│ │ 🎬│ │ 🖼│       │  │  │
│  │  │  └───┘ └───┘ └───┘ └───┘       │  │  │
│  │  │        [+ FAB Button]           │  │  │
│  │  └─────────────────────────────────┘  │  │
│  │                                       │  │
│  │  ┌─────────────────────────────────┐  │  │
│  │  │   DOM Overlay (Content Panel)   │  │  │
│  │  │  ┌───────────────────────────┐  │  │  │
│  │  │  │  Audio / Video / Map /    │  │  │  │
│  │  │  │  Email / Phone / iframe   │  │  │  │
│  │  │  └───────────────────────────┘  │  │  │
│  │  └─────────────────────────────────┘  │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  <bzr-item label="Home" icon="🏠" href="/"> │
│  <bzr-item label="Music" data-audio="...">  │
│  <bzr-item label="Video" data-video="...">  │
└─────────────────────────────────────────────┘
```

### Figure 2: Physics State Machine
```
┌──────────┐    pointerdown    ┌──────────┐
│   IDLE   │ ───────────────→  │ DRAGGING │
│          │                   │          │
│ ω = 0    │ ←───────────────  │ ω = Δθ/Δt│
└──────────┘    pointerup      └──────────┘
     ↑                              │
     │                              ↓
     │    |ω| < threshold   ┌──────────────┐
     │ ←─────────────────── │   INERTIAL   │
     │                      │   DECAY      │
     │                      │ ω *= μ       │
     │                      └──────────────┘
     │                              │
     │                              ↓
     │                      ┌──────────────┐
     └───────────────────── │   SNAPPING   │
                            │ θ += Δθ * k  │
                            └──────────────┘
```

### Figure 3: Content Resolution Flow
```
Item Clicked
     │
     ↓
┌─────────────┐    Yes    ┌──────────────────┐
│ data-audio? │ ───────→  │ Render Audio Viz │
└─────────────┘           └──────────────────┘
     │ No
     ↓
┌─────────────┐    Yes    ┌──────────────────┐
│ data-video? │ ───────→  │ Render Video     │
└─────────────┘           └──────────────────┘
     │ No
     ↓
┌─────────────┐    Yes    ┌──────────────────┐
│ data-email? │ ───────→  │ Render Email Form│
└─────────────┘           └──────────────────┘
     │ No
     ↓
┌─────────────┐    Yes    ┌──────────────────┐
│ data-phone? │ ───────→  │ Render Phone     │
└─────────────┘           └──────────────────┘
     │ No
     ↓
┌─────────────┐    Yes    ┌──────────────────┐
│  data-map?  │ ───────→  │ Render Map       │
└─────────────┘           └──────────────────┘
     │ No
     ↓
┌─────────────┐    Yes    ┌──────────────────┐
│data-iframe? │ ───────→  │ Render iframe    │
└─────────────┘           └──────────────────┘
     │ No
     ↓
┌─────────────┐    Yes    ┌──────────────────┐
│    href?    │ ───────→  │ Navigate to URL  │
└─────────────┘           └──────────────────┘
```

---

## FILING INFORMATION

**Application Type:** Provisional Patent Application (PPA)
**Filing Jurisdiction:** United States Patent and Trademark Office (USPTO)
**Entity Status:** Small entity (The Conglomerate Group)
**Filing Fee:** $160 (small entity PPA fee as of 2026)
**Priority Date:** May 31, 2026 (date of this provisional filing)
**Conversion Deadline:** 12 months from filing date (May 31, 2027)

---

## INVENTOR DECLARATION

I hereby declare that I am the original inventor of the subject matter described in this provisional patent application. The invention was conceived and reduced to practice as described herein.

**Inventor:** Bizarre Lynx
**Date:** May 31, 2026

---

## NOTES FOR PATENT ATTORNEY

1. **Priority:** File PPA immediately to establish priority date. The public demo site (bzzrr.link) is already live — this constitutes public disclosure. File BEFORE any additional public demonstrations or conference presentations.

2. **Non-Provisional Conversion:** Within 12 months, file a non-provisional utility patent application claiming priority to this PPA. The non-provisional should include formal claims, formal drawings (replacing ASCII art), and an Information Disclosure Statement (IDS) citing the prior art references identified above.

3. **International Considerations:** If international protection is desired, file a PCT application within 12 months of the PPA filing date.

4. **Trade Secret vs. Patent:** The obfuscation and license system protect the implementation as trade secret. The patent would protect the *method* and *system* claims. Both layers of IP protection are recommended.

5. **Continuation Strategy:** Consider filing continuation applications for:
   - The physics-based interaction method (Claim 1, 3)
   - The multi-modal content overlay system (Claim 1, 5)
   - The license-gated Web Component architecture (Claim 2, 6)
   - The audio visualization method (Claim 4)

---

*This document is a draft provisional patent application prepared for review by a registered patent attorney before filing with the USPTO. It is not legal advice.*
