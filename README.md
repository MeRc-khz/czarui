# bzr-dial-ui — Tactical Web Component Platform

> A complete commercial Web Component platform built with Hermes Agent.
> Physics-based radial dial menu + Stripe sales pipeline + tactical UI design system.

[![License: Commercial](https://img.shields.io/badge/license-commercial-red.svg)](LICENSE.txt)
[![Status: Launch Ready](https://img.shields.io/badge/status-launch%20ready-green.svg)]()

## What Is This?

**bzr-dial-ui** is a premium, zero-dependency Web Component implementing a physics-based radial dial menu — sold as a commercial product with automated Stripe payments, license key generation, and email delivery.

### The Component
- 1,744 lines of vanilla JavaScript — no frameworks, no dependencies
- Physics-based inertial scrolling with intelligent snapping
- Hybrid Canvas/DOM rendering at 60 FPS
- Shadow DOM encapsulation (zero style conflicts)
- Inline media: audio visualizer, video player, maps, email forms, phone dialers, iframes
- CSS custom properties for instant theming
- Touch-optimized with haptic feedback
- Works with vanilla JS, React, Vue, Angular, Svelte — anything that supports Web Components

### The Platform
- **Landing page** — Tactical UI design with live interactive demo, feature showcase, pricing, FAQ
- **Stripe integration** — Checkout sessions, webhook handling, payment verification
- **License system** — HMAC-SHA256 keys (`BZRD-XXXX-XXXX-XXXX-XXXX`), never expire, validation API
- **Email delivery** — Automated purchase emails with license key + 24-hour download link
- **Packaging** — Automated ZIP creation for customer delivery

## Quick Start (Customer)

```html
<script type="module" src="bzr-dial-menu.js"></script>

<bzr-dial-menu>
  <bzr-item label="Home" icon="🏠" href="/"></bzr-item>
  <bzr-item label="Music" icon="🎵" data-audio="song.mp3"></bzr-item>
  <bzr-item label="Video" icon="🎬" data-video="demo.mp4"></bzr-item>
  <bzr-item label="Settings" icon="⚙️" href="/settings"></bzr-item>
</bzr-dial-menu>
```

## Pricing

| License | Price | Scope |
|---------|-------|-------|
| Single | $49 | 1 project, lifetime updates, email support |
| Team | $149 | Unlimited projects, 10 devs, priority support |
| Enterprise | Custom | White-label, SLA, dedicated support |

All licenses include: full source code, lifetime updates, commercial use rights.

## Repository Structure

```
czarui/                          # Sales, landing, backend, packaging
├── landing/                     # Marketing page (Tailwind tactical UI)
│   ├── index.html               # Hero, features, pricing, FAQ
│   └── app.js                   # Stripe integration, demo loader
├── backend/                     # Express.js server
│   ├── server.js                # Stripe, license, download endpoints
│   ├── license-manager.js       # HMAC key generation + validation
│   └── email-service.js         # Nodemailer delivery
├── historical/                  # Archived lz-dial.js (superseded)
├── components/                  # Shared utilities (symlinked to bzr-dial-menu)
│   ├── ipfs-config.js -> ../bzr-dial-menu/ipfs-config.js
│   └── media-player-methods.js -> ../bzr-dial-menu/media-player-methods.js
├── create-package.sh            # ZIP packaging for customers
├── success.html                 # Post-purchase confirmation
└── docs/                        # Setup guides, Stripe config, email setup

bzr-dial-menu/                   # Canonical component source
├── src/
│   ├── bzr-dial-menu.js         # 1,744-line Web Component
│   └── bzr-dial-menu.test.js    # Vitest unit tests
├── conductor/                   # Product definition, guidelines, workflow
├── examples/                    # Demo pages
├── ipfs-config.js               # IPFS media configuration (canonical)
└── media-player-methods.js      # Audio/video player utilities (canonical)
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Component | Vanilla JS (Web Components API) |
| Frontend | Tailwind CSS, Material Symbols |
| Backend | Node.js, Express.js |
| Payments | Stripe Checkout API |
| Email | Nodemailer (SMTP) |
| Build | Vite, Vitest |
| Deployment | Nginx, systemd, IPFS |
| AI | Hermes Agent (architecture, code, docs, project management) |

## API

### `<bzr-dial-menu>` Attributes
| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `radius` | Number | `120` | Dial radius in pixels |
| `justify` | String | `center` | FAB position: `left`, `center`, `right` |

### `<bzr-item>` Attributes
| Attribute | Type | Description |
|-----------|------|-------------|
| `label` | String | Display name (required) |
| `icon` | URL | Icon image/SVG |
| `href` | URL | Navigation URL |
| `data-audio` | URL | Audio file (inline player) |
| `data-video` | URL | Video file (inline player) |
| `data-email` | Email | Email form |
| `data-phone` | Phone | Phone dialer |
| `data-map` | Address | OpenStreetMap embed |
| `data-iframe` | URL | Embedded website |

### Events
- `bzr-change` — Fired when active item changes (`{ index, item }`)

### JavaScript API
```javascript
const dial = document.querySelector('bzr-dial-menu');
dial.isOpen;        // Boolean
dial.activeIndex;   // Number
dial.toggle();      // Open/close
```

## Deployment

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with Stripe keys, email credentials
npm start
```

### Frontend
```bash
# Serve via Nginx (recommended)
# Proxy /api/* to Express backend on port 3000
# Serve landing/ as static files
```

### Environment Variables
| Variable | Description |
|----------|-------------|
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_PRICE_SINGLE` | Price ID for $49 license |
| `STRIPE_PRICE_TEAM` | Price ID for $149 license |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret |
| `LICENSE_SECRET` | HMAC signing secret |
| `EMAIL_HOST` | SMTP host |
| `EMAIL_USER` | SMTP username |
| `EMAIL_PASS` | SMTP password |
| `FRONTEND_URL` | Landing page URL |
| `DOWNLOAD_BASE_URL` | Download endpoint URL |

## Credits

Built by **Bizarre Lynx** / **MeRc-khz** — a cryptographically signed AIEOS v1.2 digital twin, multimedia mogul, and curator of the African American experience. Recording under stage names Coupe da Villian and Furious Styles.

*"Time is too expensive."*

---

© 2026 Bzzrrr.link Webwork / The Conglomerate Group. All rights reserved.
