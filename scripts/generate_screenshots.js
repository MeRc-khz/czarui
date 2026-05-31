const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');

// Register fonts
try {
    registerFont('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', { family: 'DejaVu Sans', weight: 'bold' });
    registerFont('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', { family: 'DejaVu Sans' });
    registerFont('/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf', { family: 'DejaVu Mono' });
} catch(e) {
    console.log('Font registration issue:', e.message);
}

const OUTPUT = '/root/czarui/screenshots';
if (!fs.existsSync(OUTPUT)) fs.mkdirSync(OUTPUT, { recursive: true });

// Colors matching bzzrrr.link tactical theme
const C = {
    bg: '#0a0a0a',
    surface: '#1c2721',
    border: '#283930',
    primary: '#2bee8c',
    secondary: '#4A7040',
    text: '#ffffff',
    textMuted: '#a0a0a0',
    code: '#0a0f0c',
};

// ===== SCREENSHOT 1: Landing Page Hero =====
function drawHero() {
    const w = 1200, h = 800;
    const c = createCanvas(w, h);
    const ctx = c.getContext('2d');

    // Background
    ctx.fillStyle = C.bg;
    ctx.fillRect(0, 0, w, h);

    // Grid pattern
    ctx.strokeStyle = 'rgba(43, 238, 140, 0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // Scan line
    const scanY = (Date.now() / 20) % h;
    ctx.fillStyle = 'rgba(43, 238, 140, 0.08)';
    ctx.fillRect(0, scanY, w, 2);

    // Header
    ctx.fillStyle = 'rgba(10, 10, 10, 0.95)';
    ctx.fillRect(0, 0, w, 64);
    ctx.strokeStyle = C.border;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, 64); ctx.lineTo(w, 64); ctx.stroke();

    // Logo
    ctx.fillStyle = C.primary;
    ctx.font = 'bold 20px "DejaVu Sans", sans-serif';
    ctx.fillText('bzr-dial', 40, 40);
    ctx.fillStyle = C.text;
    ctx.fillText('.ui', 40 + ctx.measureText('bzr-dial').width, 40);

    // Nav
    ctx.fillStyle = C.textMuted;
    ctx.font = '13px "DejaVu Sans", sans-serif';
    const nav = ['Features', 'Demo', 'Pricing', 'Support'];
    let navX = 500;
    nav.forEach(item => {
        ctx.fillText(item, navX, 40);
        navX += ctx.measureText(item).width + 30;
    });

    // CTA button
    ctx.fillStyle = C.primary;
    roundRect(ctx, w - 180, 18, 140, 32, 4);
    ctx.fill();
    ctx.fillStyle = C.bg;
    ctx.font = 'bold 12px "DejaVu Sans", sans-serif';
    ctx.fillText('Get bzr-dial-ui', w - 165, 38);

    // Badge
    ctx.fillStyle = 'rgba(74, 112, 64, 0.2)';
    roundRect(ctx, 40, 110, 200, 28, 14);
    ctx.fill();
    ctx.strokeStyle = 'rgba(74, 112, 64, 0.4)';
    ctx.lineWidth = 1;
    roundRect(ctx, 40, 110, 200, 28, 14);
    ctx.stroke();
    ctx.fillStyle = C.primary;
    ctx.font = 'bold 10px "DejaVu Sans", sans-serif';
    ctx.fillText('⚙ PREMIUM WEB COMPONENT', 52, 128);

    // Hero title
    ctx.fillStyle = C.text;
    ctx.font = 'bold 64px "DejaVu Sans", sans-serif';
    ctx.fillText('BZRRR', 40, 220);
    
    const grad = ctx.createLinearGradient(40, 240, 300, 240);
    grad.addColorStop(0, C.primary);
    grad.addColorStop(1, C.secondary);
    ctx.fillStyle = grad;
    ctx.fillText('DIAL-UI', 40, 290);

    // Subtitle
    ctx.fillStyle = C.textMuted;
    ctx.font = '18px "DejaVu Sans", sans-serif';
    ctx.fillText('Physics-Based Radial Menu for the Modern Web.', 40, 340);
    ctx.fillStyle = C.text;
    ctx.fillText('Zero dependencies. 60 FPS. Fully customizable.', 40, 365);

    // CTA buttons
    ctx.fillStyle = C.primary;
    roundRect(ctx, 40, 400, 200, 48, 4);
    ctx.fill();
    ctx.fillStyle = C.bg;
    ctx.font = 'bold 14px "DejaVu Sans", sans-serif';
    ctx.fillText('🚀 Get Started — $49', 52, 430);

    ctx.strokeStyle = C.border;
    ctx.lineWidth = 2;
    roundRect(ctx, 260, 400, 160, 48, 4);
    ctx.stroke();
    ctx.fillStyle = C.text;
    ctx.fillText('▶ Live Demo', 280, 430);

    // Feature pills
    const pills = ['✓ Zero Dependencies', '✓ Touch Optimized', '✓ Shadow DOM', '✓ 60 FPS'];
    let pillX = 40;
    pills.forEach(pill => {
        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        roundRect(ctx, pillX, 480, 140, 28, 14);
        ctx.fill();
        ctx.strokeStyle = C.border;
        ctx.lineWidth = 1;
        roundRect(ctx, pillX, 480, 140, 28, 14);
        ctx.stroke();
        ctx.fillStyle = C.textMuted;
        ctx.font = '11px "DejaVu Sans", sans-serif';
        ctx.fillText(pill, pillX + 10, 498);
        pillX += 155;
    });

    // Right side: Component preview (dial mockup)
    const cx = 850, cy = 350, r = 160;
    
    // Outer ring
    ctx.strokeStyle = 'rgba(43, 238, 140, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();

    // Inner ring
    ctx.strokeStyle = 'rgba(43, 238, 140, 0.15)';
    ctx.beginPath(); ctx.arc(cx, cy, r * 0.6, 0, Math.PI * 2); ctx.stroke();

    // Dial items (8 items around the circle)
    const items = ['🏠', '🎵', '🎬', '🖼️', '⚙️', '👤', '💬', '🔍'];
    items.forEach((icon, i) => {
        const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
        const ix = cx + Math.cos(angle) * r;
        const iy = cy + Math.sin(angle) * r;
        
        ctx.fillStyle = i === 0 ? C.primary : 'rgba(255,255,255,0.1)';
        ctx.beginPath(); ctx.arc(ix, iy, 24, 0, Math.PI * 2); ctx.fill();
        
        if (i === 0) {
            ctx.strokeStyle = C.primary;
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(ix, iy, 28, 0, Math.PI * 2); ctx.stroke();
        }
        
        ctx.font = '18px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(icon, ix, iy);
    });

    // Center FAB
    ctx.fillStyle = C.primary;
    ctx.beginPath(); ctx.arc(cx, cy, 36, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.bg;
    ctx.font = 'bold 24px "DejaVu Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('+', cx, cy);

    // Corner brackets
    ctx.strokeStyle = 'rgba(43, 238, 140, 0.5)';
    ctx.lineWidth = 2;
    // Top-left
    ctx.beginPath(); ctx.moveTo(cx - r - 30, cy - r - 30); ctx.lineTo(cx - r - 10, cy - r - 30); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - r - 30, cy - r - 30); ctx.lineTo(cx - r - 30, cy - r - 10); ctx.stroke();
    // Bottom-right
    ctx.beginPath(); ctx.moveTo(cx + r + 30, cy + r + 30); ctx.lineTo(cx + r + 10, cy + r + 30); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx + r + 30, cy + r + 30); ctx.lineTo(cx + r + 30, cy + r + 10); ctx.stroke();

    // Coord label
    ctx.fillStyle = 'rgba(43, 238, 140, 0.4)';
    ctx.font = '10px "DejaVu Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('COORD: 34.22.91 // SEC: ALPHA', 40, 95);

    // Save
    fs.writeFileSync(`${OUTPUT}/01_hero.png`, c.toBuffer('image/png'));
    console.log('✅ 01_hero.png');
}

// ===== SCREENSHOT 2: Component Code Example =====
function drawCodeExample() {
    const w = 900, h = 600;
    const c = createCanvas(w, h);
    const ctx = c.getContext('2d');

    ctx.fillStyle = C.bg;
    ctx.fillRect(0, 0, w, h);

    // Title
    ctx.fillStyle = C.text;
    ctx.font = 'bold 28px "DejaVu Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Simple to Use', w / 2, 50);
    
    ctx.fillStyle = C.textMuted;
    ctx.font = '16px "DejaVu Sans", sans-serif';
    ctx.fillText('Just drop it in. No build tools required.', w / 2, 80);

    // Code window
    const codeX = 50, codeY = 120, codeW = w - 100, codeH = 400;
    
    // Window chrome
    ctx.fillStyle = C.surface;
    roundRect(ctx, codeX, codeY, codeW, codeH, 8);
    ctx.fill();
    ctx.strokeStyle = C.border;
    ctx.lineWidth = 1;
    roundRect(ctx, codeX, codeY, codeW, codeH, 8);
    ctx.stroke();

    // Traffic lights
    ctx.fillStyle = 'rgba(255,80,80,0.3)';
    ctx.beginPath(); ctx.arc(codeX + 25, codeY + 20, 6, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(255,80,80,0.5)';
    ctx.stroke();
    
    ctx.fillStyle = 'rgba(255,200,50,0.3)';
    ctx.beginPath(); ctx.arc(codeX + 50, codeY + 20, 6, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(255,200,50,0.5)';
    ctx.stroke();
    
    ctx.fillStyle = 'rgba(80,200,80,0.3)';
    ctx.beginPath(); ctx.arc(codeX + 75, codeY + 20, 6, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(80,200,80,0.5)';
    ctx.stroke();

    // Copy button
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    roundRect(ctx, codeX + codeW - 80, codeY + 10, 60, 24, 4);
    ctx.fill();
    ctx.fillStyle = C.text;
    ctx.font = '11px "DejaVu Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Copy', codeX + codeW - 50, codeY + 26);

    // Code content
    ctx.textAlign = 'left';
    ctx.font = '14px "DejaVu Mono", monospace';
    
    const lines = [
        { text: '<script type="module" src="bzr-dial-menu.js"></script>', color: '#c084fc' },
        { text: '', color: C.text },
        { text: '<bzr-dial-menu>', color: '#f472b6' },
        { text: '  <bzr-item label="Home" icon="🏠" href="/"></bzr-item>', color: '#f472b6' },
        { text: '  <bzr-item label="Music" icon="🎵" data-audio="song.mp3"></bzr-item>', color: '#f472b6' },
        { text: '  <bzr-item label="Video" icon="🎬" data-video="demo.mp4"></bzr-item>', color: '#f472b6' },
        { text: '  <bzr-item label="Settings" icon="⚙️" href="/settings"></bzr-item>', color: '#f472b6' },
        { text: '</bzr-dial-menu>', color: '#f472b6' },
    ];

    lines.forEach((line, i) => {
        if (line.text) {
            // Syntax highlight
            if (line.text.includes('<script')) {
                ctx.fillStyle = '#c084fc';
                ctx.fillText('<script', codeX + 20, codeY + 60 + i * 28);
                ctx.fillStyle = '#fbbf24';
                ctx.fillText(' type="module" ', codeX + 20 + ctx.measureText('<script').width, codeY + 60 + i * 28);
                ctx.fillStyle = '#2bee8c';
                ctx.fillText('src=', codeX + 20 + ctx.measureText('<script type="module" ').width, codeY + 60 + i * 28);
                ctx.fillStyle = '#2bee8c';
                const rest = '"bzr-dial-menu.js"></script>';
                ctx.fillText(rest, codeX + 20 + ctx.measureText('<script type="module" src=').width, codeY + 60 + i * 28);
            } else {
                ctx.fillStyle = line.color || C.text;
                ctx.fillText(line.text, codeX + 20, codeY + 60 + i * 28);
            }
        }
    });

    // Label
    ctx.fillStyle = 'rgba(43, 238, 140, 0.4)';
    ctx.font = '10px "DejaVu Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('DECRYPTED SOURCE', w / 2, codeY + codeH + 30);

    fs.writeFileSync(`${OUTPUT}/02_code_example.png`, c.toBuffer('image/png'));
    console.log('✅ 02_code_example.png');
}

// ===== SCREENSHOT 3: Pricing Cards =====
function drawPricing() {
    const w = 1000, h = 500;
    const c = createCanvas(w, h);
    const ctx = c.getContext('2d');

    ctx.fillStyle = C.bg;
    ctx.fillRect(0, 0, w, h);

    // Title
    ctx.textAlign = 'center';
    ctx.fillStyle = C.text;
    ctx.font = 'bold 28px "DejaVu Sans", sans-serif';
    ctx.fillText('Simple, Transparent Pricing', w / 2, 45);
    ctx.fillStyle = C.textMuted;
    ctx.font = '14px "DejaVu Sans", sans-serif';
    ctx.fillText('One-time payment. Lifetime updates included.', w / 2, 70);

    const cards = [
        { name: 'Single License', price: '$49', desc: 'one-time', features: ['Full source code', 'Use in 1 project', 'Lifetime updates', 'Email support', 'Commercial use'], featured: false },
        { name: 'Team License', price: '$149', desc: 'one-time', features: ['Full source code', 'Unlimited projects', 'Lifetime updates', 'Priority support', 'Commercial use', 'Up to 10 developers'], featured: true },
        { name: 'Enterprise', price: 'Custom', desc: '', features: ['Everything in Team', 'Custom features', 'Dedicated support', 'SLA guarantee', 'White-label option', 'Unlimited developers'], featured: false },
    ];

    const cardW = 280, cardH = 360;
    const startX = (w - (cardW * 3 + 30 * 2)) / 2;

    cards.forEach((card, i) => {
        const x = startX + i * (cardW + 30);
        const y = 100;

        if (card.featured) {
            // Featured badge
            ctx.fillStyle = C.primary;
            roundRect(ctx, x + cardW / 2 - 50, y - 10, 100, 22, 11);
            ctx.fill();
            ctx.fillStyle = C.bg;
            ctx.font = 'bold 10px "DejaVu Sans", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('MOST POPULAR', x + cardW / 2, y + 4);
        }

        // Card background
        ctx.fillStyle = C.surface;
        roundRect(ctx, x, y, cardW, cardH, 8);
        ctx.fill();
        
        if (card.featured) {
            ctx.strokeStyle = C.primary;
            ctx.lineWidth = 2;
        } else {
            ctx.strokeStyle = C.border;
            ctx.lineWidth = 1;
        }
        roundRect(ctx, x, y, cardW, cardH, 8);
        ctx.stroke();

        // Card content
        ctx.textAlign = 'center';
        ctx.fillStyle = C.text;
        ctx.font = 'bold 18px "DejaVu Sans", sans-serif';
        ctx.fillText(card.name, x + cardW / 2, y + 45);

        // Price
        ctx.fillStyle = C.primary;
        ctx.font = 'bold 48px "DejaVu Sans", sans-serif';
        ctx.fillText(card.price, x + cardW / 2, y + 100);
        
        if (card.desc) {
            ctx.fillStyle = C.textMuted;
            ctx.font = '12px "DejaVu Sans", sans-serif';
            ctx.fillText(card.desc, x + cardW / 2, y + 120);
        }

        // Features
        ctx.textAlign = 'left';
        ctx.font = '13px "DejaVu Sans", sans-serif';
        card.features.forEach((feat, fi) => {
            ctx.fillStyle = C.primary;
            ctx.fillText('✓', x + 20, y + 155 + fi * 24);
            ctx.fillStyle = C.textMuted;
            ctx.fillText(feat, x + 38, y + 155 + fi * 24);
        });

        // Button
        const btnY = y + cardH - 55;
        if (card.featured) {
            ctx.fillStyle = C.primary;
            roundRect(ctx, x + 20, btnY, cardW - 40, 40, 4);
            ctx.fill();
            ctx.fillStyle = C.bg;
            ctx.font = 'bold 13px "DejaVu Sans", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Get Started', x + cardW / 2, btnY + 26);
        } else {
            ctx.strokeStyle = card.name === 'Enterprise' ? 'rgba(255,255,255,0.3)' : C.primary;
            ctx.lineWidth = 1;
            roundRect(ctx, x + 20, btnY, cardW - 40, 40, 4);
            ctx.stroke();
            ctx.fillStyle = card.name === 'Enterprise' ? C.textMuted : C.primary;
            ctx.font = 'bold 13px "DejaVu Sans", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(card.name === 'Enterprise' ? 'Contact Sales' : 'Get Started', x + cardW / 2, btnY + 26);
        }
    });

    fs.writeFileSync(`${OUTPUT}/03_pricing.png`, c.toBuffer('image/png'));
    console.log('✅ 03_pricing.png');
}

// ===== SCREENSHOT 4: Feature Grid =====
function drawFeatures() {
    const w = 1100, h = 600;
    const c = createCanvas(w, h);
    const ctx = c.getContext('2d');

    ctx.fillStyle = 'rgba(28, 39, 33, 0.3)';
    ctx.fillRect(0, 0, w, h);

    // Section label
    ctx.fillStyle = C.primary;
    ctx.font = '10px "DejaVu Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('🔒 CLASSIFIED INTEL', 50, 40);

    ctx.fillStyle = C.text;
    ctx.font = 'bold 32px "DejaVu Sans", sans-serif';
    ctx.fillText('Packed with Premium Features', 50, 80);
    
    ctx.fillStyle = C.textMuted;
    ctx.font = '16px "DejaVu Sans", sans-serif';
    ctx.fillText('Everything you need to deploy mission-critical interfaces.', 50, 110);

    const features = [
        { icon: '3d_rotation', title: 'Physics-Based', desc: 'Smooth inertial scrolling with intelligent snapping.' },
        { icon: 'perm_media', title: 'Rich Media', desc: 'Audio viz, video, maps, iframes, email, phone.' },
        { icon: 'palette', title: 'Customizable', desc: 'CSS variables for colors, sizes, animations.' },
        { icon: 'touch_app', title: 'Touch Optimized', desc: 'Haptic feedback, gestures, mobile-first.' },
        { icon: 'speed', title: 'Lightning Fast', desc: 'Hybrid Canvas/DOM rendering at 60 FPS.' },
        { icon: 'visibility_off', title: 'Shadow DOM', desc: 'Fully encapsulated. No style conflicts.' },
    ];

    const cols = 3, rows = 2;
    const cardW = 320, cardH = 140;
    const gapX = 30, gapY = 20;
    const startX = 50, startY = 150;

    features.forEach((feat, i) => {
        const col = i % cols, row = Math.floor(i / cols);
        const x = startX + col * (cardW + gapX);
        const y = startY + row * (cardH + gapY);

        ctx.fillStyle = C.surface;
        roundRect(ctx, x, y, cardW, cardH, 8);
        ctx.fill();
        ctx.strokeStyle = C.border;
        ctx.lineWidth = 1;
        roundRect(ctx, x, y, cardW, cardH, 8);
        ctx.stroke();

        // Icon circle
        ctx.fillStyle = 'rgba(43, 238, 140, 0.1)';
        ctx.beginPath(); ctx.arc(x + 40, y + 45, 24, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = C.primary;
        ctx.font = '20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('●', x + 40, y + 52);

        // Title
        ctx.textAlign = 'left';
        ctx.fillStyle = C.text;
        ctx.font = 'bold 16px "DejaVu Sans", sans-serif';
        ctx.fillText(feat.title, x + 75, y + 50);

        // Description
        ctx.fillStyle = C.textMuted;
        ctx.font = '13px "DejaVu Sans", sans-serif';
        wrapText(ctx, feat.desc, x + 20, y + 80, cardW - 40, 18);
    });

    fs.writeFileSync(`${OUTPUT}/04_features.png`, c.toBuffer('image/png'));
    console.log('✅ 04_features.png');
}

// ===== SCREENSHOT 5: Architecture Diagram =====
function drawArchitecture() {
    const w = 1000, h = 700;
    const c = createCanvas(w, h);
    const ctx = c.getContext('2d');

    ctx.fillStyle = C.bg;
    ctx.fillRect(0, 0, w, h);

    // Title
    ctx.textAlign = 'center';
    ctx.fillStyle = C.text;
    ctx.font = 'bold 28px "DejaVu Sans", sans-serif';
    ctx.fillText('System Architecture', w / 2, 45);
    ctx.fillStyle = C.textMuted;
    ctx.font = '14px "DejaVu Sans", sans-serif';
    ctx.fillText('Built entirely with Hermes Agent', w / 2, 70);

    // Architecture boxes
    const boxes = [
        { x: 50, y: 120, w: 280, h: 120, label: '🎨 Landing Page', sub: 'Tailwind CSS • Tactical UI • Dark/Light Theme', color: C.primary },
        { x: 360, y: 120, w: 280, h: 120, label: '⚡ bzr-dial-menu', sub: '1,744 LOC • Zero Dependencies • Shadow DOM', color: C.primary },
        { x: 670, y: 120, w: 280, h: 120, label: '📦 Packaging', sub: 'Auto ZIP • Stripe Config • Docs', color: C.primary },
        { x: 200, y: 300, w: 280, h: 120, label: '💳 Stripe Backend', sub: 'Checkout • Webhooks • HMAC Licenses', color: C.secondary },
        { x: 520, y: 300, w: 280, h: 120, label: '📧 Email Service', sub: 'Nodemailer • Auto Delivery • Tokens', color: C.secondary },
        { x: 360, y: 480, w: 280, h: 120, label: '🔐 License System', sub: 'HMAC-SHA256 • Validation API • 24h Tokens', color: '#6366f1' },
    ];

    // Draw connections
    ctx.strokeStyle = 'rgba(43, 238, 140, 0.2)';
    ctx.lineWidth = 1;
    // Landing → Stripe
    ctx.beginPath(); ctx.moveTo(190, 240); ctx.lineTo(280, 300); ctx.stroke();
    // Component → Stripe
    ctx.beginPath(); ctx.moveTo(500, 240); ctx.lineTo(420, 300); ctx.stroke();
    // Stripe → Email
    ctx.beginPath(); ctx.moveTo(480, 360); ctx.lineTo(520, 360); ctx.stroke();
    // Stripe → License
    ctx.beginPath(); ctx.moveTo(340, 420); ctx.lineTo(420, 480); ctx.stroke();
    // Email → License
    ctx.beginPath(); ctx.moveTo(600, 420); ctx.lineTo(540, 480); ctx.stroke();

    boxes.forEach(box => {
        ctx.fillStyle = 'rgba(28, 39, 33, 0.8)';
        roundRect(ctx, box.x, box.y, box.w, box.h, 8);
        ctx.fill();
        ctx.strokeStyle = box.color;
        ctx.lineWidth = 1.5;
        roundRect(ctx, box.x, box.y, box.w, box.h, 8);
        ctx.stroke();

        ctx.textAlign = 'center';
        ctx.fillStyle = C.text;
        ctx.font = 'bold 16px "DejaVu Sans", sans-serif';
        ctx.fillText(box.label, box.x + box.w / 2, box.y + 45);
        
        ctx.fillStyle = C.textMuted;
        ctx.font = '12px "DejaVu Sans", sans-serif';
        ctx.fillText(box.sub, box.x + box.w / 2, box.y + 75);
    });

    // Footer
    ctx.fillStyle = 'rgba(43, 238, 140, 0.4)';
    ctx.font = '10px "DejaVu Mono", monospace';
    ctx.fillText('AI: Hermes Agent • Frontend: Vanilla JS + Tailwind • Backend: Node.js + Express • Payments: Stripe', w / 2, 660);

    fs.writeFileSync(`${OUTPUT}/05_architecture.png`, c.toBuffer('image/png'));
    console.log('✅ 05_architecture.png');
}

// ===== SCREENSHOT 6: Before/After (for GitHub Copilot) =====
function drawBeforeAfter() {
    const w = 1100, h = 650;
    const c = createCanvas(w, h);
    const ctx = c.getContext('2d');

    ctx.fillStyle = C.bg;
    ctx.fillRect(0, 0, w, h);

    // Title
    ctx.textAlign = 'center';
    ctx.fillStyle = C.text;
    ctx.font = 'bold 28px "DejaVu Sans", sans-serif';
    ctx.fillText('Before → After: Finishing What Was Broken', w / 2, 45);

    // BEFORE column
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 18px "DejaVu Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('❌ BEFORE (Unfinished)', 50, 90);

    const beforeItems = [
        'Two repos, couldn\'t work together',
        'Landing demo: loaded wrong component file',
        '3 different color schemes across pages',
        'Hardcoded localhost:3000 everywhere',
        'Packaging script: referenced deleted files',
        'Email template: used old component API',
        'Shared files: diverging duplicates',
        'No unified design system',
    ];

    ctx.font = '13px "DejaVu Sans", sans-serif';
    beforeItems.forEach((item, i) => {
        ctx.fillStyle = '#ef4444';
        ctx.fillText('•', 50, 120 + i * 28);
        ctx.fillStyle = C.textMuted;
        ctx.fillText(item, 70, 120 + i * 28);
    });

    // AFTER column
    ctx.fillStyle = C.primary;
    ctx.font = 'bold 18px "DejaVu Sans", sans-serif';
    ctx.fillText('✅ AFTER (Finished)', 580, 90);

    const afterItems = [
        'Single canonical component (bzr-dial-menu)',
        'Demo loads correct component — works live',
        '1 unified tactical design system',
        'Relative URLs — production ready',
        'Packaging script: correct source paths',
        'Email template: correct component API',
        'Symlinks — single source of truth',
        'Consistent: colors, fonts, icons, naming',
    ];

    ctx.font = '13px "DejaVu Sans", sans-serif';
    afterItems.forEach((item, i) => {
        ctx.fillStyle = C.primary;
        ctx.fillText('•', 580, 120 + i * 28);
        ctx.fillStyle = C.text;
        ctx.fillText(item, 600, 120 + i * 28);
    });

    // Arrow in middle
    ctx.fillStyle = C.primary;
    ctx.font = '40px "DejaVu Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('→', w / 2, 250);

    // Tools used
    ctx.fillStyle = C.surface;
    roundRect(ctx, 50, 380, w - 100, 120, 8);
    ctx.fill();
    ctx.strokeStyle = C.border;
    ctx.lineWidth = 1;
    roundRect(ctx, 50, 380, w - 100, 120, 8);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = C.text;
    ctx.font = 'bold 16px "DejaVu Sans", sans-serif';
    ctx.fillText('Tools Used', w / 2, 410);

    const tools = ['Hermes Agent', 'GitHub Copilot', 'Node.js', 'Tailwind CSS', 'Vite', 'Stripe API'];
    ctx.font = '13px "DejaVu Sans", sans-serif';
    tools.forEach((tool, i) => {
        ctx.fillStyle = i % 2 === 0 ? C.primary : C.textMuted;
        ctx.fillText(tool, 120 + i * 150, 445);
    });

    // Result
    ctx.fillStyle = C.primary;
    ctx.font = 'bold 14px "DejaVu Sans", sans-serif';
    ctx.fillText('Result: A launch-ready micro-SaaS platform. Component + Sales + Payments + Delivery.', w / 2, 540);

    ctx.fillStyle = 'rgba(43, 238, 140, 0.4)';
    ctx.font = '10px "DejaVu Mono", monospace';
    ctx.fillText('github.com/MeRc-khz/czarui', w / 2, 580);

    fs.writeFileSync(`${OUTPUT}/06_before_after.png`, c.toBuffer('image/png'));
    console.log('✅ 06_before_after.png');
}

// Helper: rounded rectangle
function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

// Helper: word wrap
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
            ctx.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, y);
}

// Generate all
drawHero();
drawCodeExample();
drawPricing();
drawFeatures();
drawArchitecture();
drawBeforeAfter();

console.log(`\n✅ All 6 screenshots saved to ${OUTPUT}/`);
