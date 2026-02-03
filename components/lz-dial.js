/**
 * lz-dial.js
 * A native web component implementing a physics-based radial dial menu.
 * 
 * Features:
 * - Hybrid Canvas/DOM rendering
 * - Inertial scrolling with snapping
 * - Haptic/Audio feedback
 * - Shadow DOM encapsulation
 */

class LawnCzarDial extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        // State
        this.isOpen = false;
        this.rotation = 0; // Current rotation in radians
        this.velocity = 0;
        this.isDragging = false;
        this.lastAngle = 0;
        this.items = []; // List of item elements
        this.radius = 120;
        this.snapAngle = Math.PI / 4; // 45 degrees default
        this.activeIndex = -1;
        this.targetRotation = null;

        // Physics
        this.friction = 0.95;
        this.spring = 0.1;

        // Animation Loop
        this._raf = null;
        this._boundLoop = this._loop.bind(this);
    }

    static get observedAttributes() {
        return ['radius', 'snap', 'sensitivity', 'justify'];
    }

    connectedCallback() {
        this.render();
        this.setupEvents();
        this.updateItems();

        // Initial tick
        this._loop();
    }

    disconnectedCallback() {
        cancelAnimationFrame(this._raf);
        // Clean up events... needed if we want to be strict, 
        // but for a demo component usually acceptable to leave as is if element is destroyed.
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'radius') {
            this.radius = parseInt(newValue) || 120;
            this.updateLayout();
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
        <style>
            :host {
                display: block;
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 100px; /* Trigger size */
                height: 100px;
                z-index: 9999;
                font-family: sans-serif;
                --primary: #00ff9d;
                --bg: #111;
                --text: #fff;
                transition: all 0s; /* Instant snap for layout changes */
            }

            :host([open]) {
                top: 0; left: 0;
                transform: none !important; /* Override edge shifts when open to fullscreen */
                width: 100%;
                height: 100%;
                right: auto;
            }

            /* Edge Justification */
            :host([justify="right"]) {
                left: auto;
                right: 0;
                transform: translate(50%, -50%);
            }
            :host([justify="left"]) {
                left: 0;
                right: auto;
                transform: translate(-50%, -50%);
            }
            
            /* When open and justified, keep the trigger at the edge */
            :host([open][justify="right"]) #trigger,
            :host([open][justify="right"]) #dial-container {
                left: auto;
                right: 0;
                transform: translate(50%, -50%) scale(1);
            }
            
            :host([open][justify="left"]) #trigger,
            :host([open][justify="left"]) #dial-container {
                left: 0;
                right: auto;
                transform: translate(-50%, -50%) scale(1);
            }

            /* The fullscreen overlay for capturing input and showing the rail */
            #overlay {
                position: fixed;
                top: 0; left: 0; right: 0; bottom: 0;
                pointer-events: none; /* Pass through when closed */
                touch-action: none;
                transition: background 0.3s, opacity 0.3s, backdrop-filter 0.3s;
                opacity: 0;
                display: block; /* Removed flex */
                backdrop-filter: blur(5px);
                -webkit-backdrop-filter: blur(5px);
            }
            
            :host([open]) #overlay {
                pointer-events: auto;
                background: rgba(0,0,0,0.60);
                backdrop-filter: blur(5px);
                -webkit-backdrop-filter: blur(5px);
                opacity: 1;
            }

            /* Center Trigger Button */
            #trigger {
                position: absolute;
                top: 50%; left: 50%;
                transform: translate(-50%, -50%);
                width: 80px; height: 80px;
                border-radius: 50%;
                background: var(--primary);
                color: #000;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(0,255,157,0.4);
                transition: transform 0.2s, background 0.2s;
                z-index: 2;
                font-weight: bold;
                user-select: none;
            }
            
            @keyframes pulse {
                0% { box-shadow: 0 0 0 0 rgba(0, 255, 157, 0.4); }
                70% { box-shadow: 0 0 0 20px rgba(0, 255, 157, 0); }
                100% { box-shadow: 0 0 0 0 rgba(0, 255, 157, 0); }
            }

            #trigger:hover {
                animation: pulse 1.5s infinite;
            }

            /* Container for the rotating dial elements */
            #dial-container {
                position: absolute;
                top: 50%; left: 50%;
                width: 0; height: 0;
                opacity: 0;
                transition: opacity 0.3s, transform 0.3s;
                transform: translate(-50%, -50%) scale(0.8);
                pointer-events: none;
            }

            :host([open]) #dial-container {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
                pointer-events: auto;
            }

            /* Active Label (Bottom Center) */
            #active-label {
                position: absolute;
                bottom: 15%; 
                left: 50%;
                transform: translateX(-50%);
                color: #ffffff; /* White for max contrast */
                font-size: 32px; /* Larger */
                font-weight: 900;
                text-transform: uppercase;
                letter-spacing: 4px;
                pointer-events: none;
                text-shadow: 0 2px 10px rgba(0,0,0,0.5);
                transition: opacity 0.3s, transform 0.3s;
                opacity: 0;
                z-index: 1000; /* Ensure on top */
            }
            
            :host([open]) #active-label {
                opacity: 1;
            }

            /* The Canvas Rail */
            canvas {
                position: absolute;
                top: -300px; left: -300px;
                width: 600px; height: 600px; /* Big enough area */
                pointer-events: none;
            }
            
            /* The Icons Wrapper */
            #items {
                position: absolute;
                top: 0; left: 0;
            }

            ::slotted(lz-item) {
                position: absolute;
                width: 60px; height: 60px;
                margin-left: -30px; margin-top: -30px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: var(--text);
                font-size: 12px;
                text-align: center;
                user-select: none;
                -webkit-user-select: none;
                -webkit-user-drag: none;
                will-change: transform;
                /* No transition during drag - instant response */
            }
            
            ::slotted(lz-item[active]) {
                transform: scale(1.2);
                color: var(--primary);
                text-shadow: 0 0 10px var(--primary);
            }

            /* Content Overlay Modal */
            #content-overlay {
                position: fixed;
                top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0, 0, 0, 0.9);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                display: none;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s;
            }

            #content-overlay.active {
                display: flex;
                opacity: 1;
            }

            #content-container {
                background: var(--bg);
                border: 2px solid var(--primary);
                border-radius: 12px;
                padding: 30px;
                max-width: 90%;
                max-height: 90%;
                overflow: auto;
                position: relative;
                box-shadow: 0 10px 50px rgba(0, 255, 157, 0.3);
            }

            #content-close {
                position: absolute;
                top: 10px;
                right: 10px;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: var(--primary);
                color: #000;
                border: none;
                font-size: 24px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                transition: transform 0.2s;
            }

            #content-close:hover {
                transform: scale(1.1);
            }

            #content-body {
                margin-top: 20px;
            }

            /* Media Styles */
            #content-body video,
            #content-body audio {
                width: 100%;
                max-width: 800px;
                border-radius: 8px;
            }

            #content-body iframe {
                width: 100%;
                height: 500px;
                border: none;
                border-radius: 8px;
            }

            /* Form Styles */
            #content-body form {
                max-width: 500px;
            }

            #content-body input,
            #content-body textarea {
                width: 100%;
                padding: 12px;
                margin: 10px 0;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 6px;
                color: var(--text);
                font-size: 16px;
                font-family: inherit;
            }

            #content-body input:focus,
            #content-body textarea:focus {
                outline: none;
                border-color: var(--primary);
                box-shadow: 0 0 10px rgba(0, 255, 157, 0.3);
            }

            #content-body button[type="submit"] {
                background: var(--primary);
                color: #000;
                border: none;
                padding: 12px 30px;
                border-radius: 6px;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                transition: transform 0.2s;
                margin-top: 10px;
            }

            #content-body button[type="submit"]:hover {
                transform: scale(1.05);
            }

            #content-body label {
                display: block;
                margin-top: 15px;
                margin-bottom: 5px;
                color: var(--primary);
                font-weight: bold;
            }

            #content-title {
                font-size: 28px;
                font-weight: bold;
                color: var(--primary);
                margin-bottom: 20px;
            }

        </style>

        <div id="overlay">
            <div id="dial-container">
                <canvas width="600" height="600"></canvas>
                <div id="items">
                    <slot></slot>
                </div>
            </div>
            <div id="active-label"></div>
        </div>
        
        <div id="trigger">
            <slot name="trigger-content">MENU</slot>
        </div>

        <!-- Content Overlay Modal -->
        <div id="content-overlay">
            <div id="content-container">
                <button id="content-close">×</button>
                <div id="content-title"></div>
                <div id="content-body"></div>
            </div>
        </div>
        `;

        this.els = {
            overlay: this.shadowRoot.getElementById('overlay'),
            trigger: this.shadowRoot.getElementById('trigger'),
            container: this.shadowRoot.getElementById('dial-container'),
            canvas: this.shadowRoot.querySelector('canvas'),
            ctx: this.shadowRoot.querySelector('canvas').getContext('2d'),
            itemsSlot: this.shadowRoot.querySelector('slot:not([name])'),
            contentOverlay: this.shadowRoot.getElementById('content-overlay'),
            contentTitle: this.shadowRoot.getElementById('content-title'),
            contentBody: this.shadowRoot.getElementById('content-body'),
            contentClose: this.shadowRoot.getElementById('content-close')
        };
    }

    setupEvents() {
        this.els.trigger.addEventListener('click', () => this.toggle());
        this.els.itemsSlot.addEventListener('slotchange', () => this.updateItems());
        this.els.contentClose.addEventListener('click', () => this.hideContent());



        // Drag Interaction on Overlay
        const start = (e) => {
            if (!this.isOpen) return;
            e.preventDefault(); // Prevent default drag behavior/ghosting
            this.isDragging = true;
            this.velocity = 0;
            this.targetRotation = null;

            let x = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
            let y = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;

            // Check for Icon Hit
            const path = e.composedPath();
            const hitIcon = path.find(el => el.tagName === 'LZ-ITEM');
            this.iconDragState = hitIcon ? { active: true, startY: y, locked: false } : null;
            this.clickedIcon = hitIcon;
            this.hasMoved = false;
            this.startPos = { x, y };

            // Get FAB center for rotation calculations
            const rect = this.els.trigger.getBoundingClientRect();
            const fabCx = rect.left + rect.width / 2;
            const fabCy = rect.top + rect.height / 2;

            // Check for Inner Ring Hit (if not icon)
            if (!hitIcon) {
                const d = Math.hypot(x - fabCx, y - fabCy);
                // FAB is 40px radius (80px width). Inner ring visual is ~75.
                // Let's say active zone is 40px to 100px.
                if (d > 40 && d < 110) {
                    this.innerRingDrag = { active: true, startY: y, locked: false };
                } else {
                    this.innerRingDrag = null;
                }
            } else {
                this.innerRingDrag = null;
            }

            // Calculate initial angle relative to FAB center (not screen center)
            // This ensures correct rotation direction regardless of justify position
            this.lastAngle = Math.atan2(y - fabCy, x - fabCx);

            // Long Press for Sliding
            this.longPressTimer = setTimeout(() => {
                if (!this.hasMoved && this.iconDragState === null) {
                    this.isSliding = true;
                    if (navigator.vibrate) navigator.vibrate(50); // Feedback
                    // Visual feedback could be added here (e.g., pulse color change)
                }
            }, 600);
        };

        const move = (e) => {
            if (!this.isOpen || !this.isDragging) return;
            e.preventDefault();

            let x = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
            let y = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;

            // Check for movement threshold
            if (!this.hasMoved) {
                let dx = x - this.startPos.x;
                let dy = y - this.startPos.y;
                if (Math.hypot(dx, dy) > 5) {
                    this.hasMoved = true;
                    // Cancel long press if moved early
                    clearTimeout(this.longPressTimer);
                }
            }

            // Vertical Sliding Logic
            if (this.isSliding) {
                let newTop = y;
                // Constraints
                const minTop = this.radius + 20; // Padding
                const maxTop = window.innerHeight - (this.radius + 20);

                if (newTop < minTop) newTop = minTop;
                if (newTop > maxTop) newTop = maxTop;

                this.style.top = `${newTop}px`;
                return; // Stop other interactions
            }

            // Icon or Inner Ring Auto-Rotate Logic
            const dragState = this.iconDragState || this.innerRingDrag;

            if (dragState && dragState.active) {
                if (dragState.locked) return;

                let dy = y - dragState.startY;
                if (Math.abs(dy) > 10) { // Sensitivity threshold
                    dragState.locked = true;
                    this.isDragging = false; // Stop physics drag

                    // Direction: Down (+) -> Prev (Increments rotation), Up (-) -> Next (Decrements rotation)
                    // Standard: dy > 0 ? 1 : -1
                    // Right Justified: Up should simulate Clockwise (Next/Prev depending on logic).
                    // User said: "up now should rotate clockwise".
                    // Clockwise adds to rotation (Angle increases). so direction = 1.
                    // So Up (dy < 0) -> direction = 1.
                    // Down (dy > 0) -> direction = -1.

                    let direction = dy > 0 ? 1 : -1;

                    if (this.getAttribute('justify') === 'right') {
                        direction = dy > 0 ? -1 : 1;
                    }

                    let currentSlot = Math.round(this.rotation / this.snapAngle);
                    this.targetRotation = (currentSlot + direction) * this.snapAngle;
                    return;
                }
            }


            // Calculate angle relative to FAB center (not screen center)
            // This ensures correct rotation direction regardless of justify position
            const rect = this.els.trigger.getBoundingClientRect();
            const fabCx = rect.left + rect.width / 2;
            const fabCy = rect.top + rect.height / 2;
            let currentAngle = Math.atan2(y - fabCy, x - fabCx);

            let delta = currentAngle - this.lastAngle;

            // Normalize
            if (delta > Math.PI) delta -= Math.PI * 2;
            if (delta < -Math.PI) delta += Math.PI * 2;

            // Fix Global Drag Mirroring for Right Docking
            if (this.getAttribute('justify') === 'right') {
                delta = -delta;
            }

            this.rotation += delta;
            this.velocity = delta; // Simple velocity tracking
            this.lastAngle = currentAngle;

            this.checkSnapFeedback();

        };

        const end = () => {
            clearTimeout(this.longPressTimer);
            if (!this.hasMoved && this.clickedIcon && !this.isSliding) {
                // Handle Click - Check for inline content first, then href
                if (this.clickedIcon.hasAttribute('active')) {
                    // Check for inline content types
                    if (this.clickedIcon.hasAttribute('data-audio') ||
                        this.clickedIcon.hasAttribute('data-video') ||
                        this.clickedIcon.hasAttribute('data-email') ||
                        this.clickedIcon.hasAttribute('data-phone') ||
                        this.clickedIcon.hasAttribute('data-map') ||
                        this.clickedIcon.hasAttribute('data-iframe')) {
                        this.showContent(this.clickedIcon);
                    } else if (this.clickedIcon.hasAttribute('href')) {
                        window.location.href = this.clickedIcon.getAttribute('href');
                    }
                }
            }
            this.isDragging = false;
            this.isSliding = false; // Reset sliding state
            this.iconDragState = null;
            this.innerRingDrag = null;
            this.clickedIcon = null;
        };

        this.els.overlay.addEventListener('mousedown', start);
        this.els.overlay.addEventListener('touchstart', start, { passive: false });

        window.addEventListener('mousemove', move);
        window.addEventListener('touchmove', move, { passive: false });

        window.addEventListener('mouseup', end);
        window.addEventListener('touchend', end);
    }

    updateItems() {
        this.items = this.els.itemsSlot.assignedElements();
        // Calculate snap angle based on count
        if (this.items.length > 0) {
            this.snapAngle = (Math.PI * 2) / this.items.length;
        }
        this.updateLayout();
    }

    updateLayout() {
        this.items.forEach((item, index) => {
            // Distribute evenly
            let angle = index * this.snapAngle;
            item.dataset.baseAngle = angle;
        });
    }

    toggle() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.setAttribute('open', '');
            document.body.style.overflow = 'hidden'; // Lock scroll
            // Centering logic can go here if we wanted strictly JS positioning
        } else {
            this.removeAttribute('open');
            document.body.style.overflow = '';
        }
    }

    showContent(item) {
        const label = item.getAttribute('label') || 'Content';
        this.els.contentTitle.textContent = label;
        this.els.contentBody.innerHTML = '';

        // Audio
        if (item.hasAttribute('data-audio')) {
            const audioSrc = item.getAttribute('data-audio');
            const audio = document.createElement('audio');
            audio.controls = true;
            audio.autoplay = item.hasAttribute('data-autoplay');
            audio.src = audioSrc;
            this.els.contentBody.appendChild(audio);
        }

        // Video
        else if (item.hasAttribute('data-video')) {
            const videoSrc = item.getAttribute('data-video');
            const video = document.createElement('video');
            video.controls = true;
            video.autoplay = item.hasAttribute('data-autoplay');
            video.src = videoSrc;
            this.els.contentBody.appendChild(video);
        }

        // Email Form
        else if (item.hasAttribute('data-email')) {
            const emailTo = item.getAttribute('data-email');
            const form = document.createElement('form');
            form.innerHTML = `
                <label>To:</label>
                <input type="email" name="to" value="${emailTo}" readonly>
                
                <label>Subject:</label>
                <input type="text" name="subject" placeholder="Enter subject" required>
                
                <label>Message:</label>
                <textarea name="message" rows="6" placeholder="Enter your message" required></textarea>
                
                <button type="submit">Send Email</button>
            `;
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const subject = formData.get('subject');
                const message = formData.get('message');
                window.location.href = `mailto:${emailTo}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
                this.hideContent();
            });
            this.els.contentBody.appendChild(form);
        }

        // Phone Dialer
        else if (item.hasAttribute('data-phone')) {
            const phoneNumber = item.getAttribute('data-phone');
            const phoneDiv = document.createElement('div');
            phoneDiv.innerHTML = `
                <p style="font-size: 24px; margin: 20px 0; text-align: center;">
                    <a href="tel:${phoneNumber}" style="color: var(--primary); text-decoration: none; font-weight: bold;">
                        📞 ${phoneNumber}
                    </a>
                </p>
                <p style="text-align: center; color: #aaa;">
                    Click the number to call
                </p>
            `;
            this.els.contentBody.appendChild(phoneDiv);
        }

        // Map
        else if (item.hasAttribute('data-map')) {
            const address = item.getAttribute('data-map');
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
            iframe.style.width = '100%';
            iframe.style.height = '500px';
            iframe.style.border = 'none';
            iframe.style.borderRadius = '8px';
            this.els.contentBody.appendChild(iframe);
        }

        // Generic iframe
        else if (item.hasAttribute('data-iframe')) {
            const iframeSrc = item.getAttribute('data-iframe');
            const iframe = document.createElement('iframe');
            iframe.src = iframeSrc;
            this.els.contentBody.appendChild(iframe);
        }

        // Show overlay
        this.els.contentOverlay.classList.add('active');
    }

    hideContent() {
        this.els.contentOverlay.classList.remove('active');
        // Clean up media
        const media = this.els.contentBody.querySelectorAll('audio, video');
        media.forEach(m => {
            m.pause();
            m.src = '';
        });
        this.els.contentBody.innerHTML = '';
    }

    checkSnapFeedback() {
        // Detect if we crossed a "tick"
        // TODO: Implement sophisticated tick logic
        // For now, simple visual check in loop
    }

    _loop() {
        this._raf = requestAnimationFrame(this._boundLoop);

        if (!this.isOpen && Math.abs(this.velocity) < 0.001 && this.targetRotation === null) return;

        // Auto-rotation override
        if (this.targetRotation !== null) {
            let diff = this.targetRotation - this.rotation;
            if (Math.abs(diff) < 0.005) {
                this.rotation = this.targetRotation;
                this.targetRotation = null;
                this.velocity = 0;
            } else {
                this.rotation += diff * 0.15;
            }
            this.draw();
            this.positionItems();
            return;
        }

        // Physics
        if (!this.isDragging) {
            // Inertia
            this.rotation += this.velocity;
            this.velocity *= this.friction;

            // Snapping
            // Find nearest slot
            if (Math.abs(this.velocity) < 0.01) {
                let slot = Math.round(this.rotation / this.snapAngle);
                let target = slot * this.snapAngle;
                let diff = target - this.rotation;

                this.velocity += diff * this.spring;
            }
        }

        this.draw();
        this.positionItems();
    }

    draw() {
        const ctx = this.els.ctx;
        ctx.clearRect(0, 0, 600, 600);

        // Draw Rail
        const cx = 300;
        const cy = 300;

        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, this.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Active Indicator (at 3 o'clock? or 12?)
        // Standard: 3 o'clock (0 degrees).
        // Right Justified: 9 o'clock (PI degrees) - Lefty mode / Visible side.

        const isRight = this.getAttribute('justify') === 'right';
        const indicatorAngle = isRight ? Math.PI : 0;

        ctx.strokeStyle = '#00ff9d';
        ctx.lineWidth = 4;
        ctx.beginPath();

        // Calculate position based on angle
        // 0: cx + r, cy
        // PI: cx - r, cy
        let ix = cx + Math.cos(indicatorAngle) * this.radius;
        let iy = cy + Math.sin(indicatorAngle) * this.radius;

        // Draw a small tick/line
        // Tangent is vertical.
        ctx.moveTo(ix, iy - 10);
        ctx.lineTo(ix, iy + 10);
        ctx.stroke();

        // Optional: Velocity Warp?
        if (Math.abs(this.velocity) > 0.05) {
            ctx.strokeStyle = `rgba(0,255,157,${Math.min(1, Math.abs(this.velocity) * 5)})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(cx, cy, this.radius + 10, this.rotation, this.rotation + Math.PI / 4);
            ctx.stroke();
        }

        this.drawInnerControls(ctx, cx, cy);
    }

    drawInnerControls(ctx, cx, cy) {
        // Inner radius for the jog dial area
        const r = 75;

        ctx.save();

        // 1. Subtle Track
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 30; // 60px - 90px zone
        ctx.stroke();

        // 2. Directional Arrows
        ctx.strokeStyle = '#00ff9d';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';

        // Right Side Arrow (Clockwise / Down)
        // Arc from -10deg to +10deg
        ctx.beginPath();
        ctx.arc(cx, cy, r, -0.2, 0.2);
        ctx.stroke();

        // Arrowhead at bottom (0.2 rad)
        let x = cx + Math.cos(0.2) * r;
        let y = cy + Math.sin(0.2) * r;
        // Simple triangle
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - 5, y - 5);
        ctx.lineTo(x + 2, y - 8);
        // Actually slightly complex to align with tangent. 
        // Let's use drawing primitives relative to angle.

        this.drawArrowHead(ctx, cx, cy, r, 0.2, 1); // 1 = clockwise (Down)
        this.drawArrowHead(ctx, cx, cy, r, -0.2, -1); // -1 = counter (Up)

        // Left Side Arrow
        // We want them to point "Outward" (Up at top, Down at bottom) to indicate scroll direction.
        // Upper Left (PI - 0.2): CW is Up. So dir = 1.
        // Lower Left (PI + 0.2): CCW is Down. So dir = -1.
        this.drawArrowHead(ctx, cx, cy, r, Math.PI - 0.2, 1);
        this.drawArrowHead(ctx, cx, cy, r, Math.PI + 0.2, -1);

        ctx.restore();
    }

    drawArrowHead(ctx, cx, cy, r, angle, dir) {
        let x = cx + Math.cos(angle) * r;
        let y = cy + Math.sin(angle) * r;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle + (Math.PI / 2 * dir)); // Tangent

        ctx.fillStyle = '#00ff9d';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-4, -8);
        ctx.lineTo(4, -8);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }

    positionItems() {
        // Center of items container should be center of screen?
        // Actually shadow DOM style centers #overlay children.
        // So (0,0) in #items is effectively screen center.

        let nearestIndex = -1;
        let minDiff = Infinity;

        this.items.forEach((item, i) => {
            let baseParams = parseFloat(item.dataset.baseAngle || 0);

            // Current final angle
            let currentAngle = baseParams + this.rotation;

            let x = Math.cos(currentAngle) * this.radius;
            let y = Math.sin(currentAngle) * this.radius;

            // DOM Move
            item.style.transform = `translate(${x}px, ${y}px)`;
            // Keep upright? 
            // item.style.transform += ` rotate(${-currentAngle}rad)`; // If we wanted them upright

            // Interaction Check (Distance to 0 rad or PI rad)
            // Normalize angle to -PI to PI
            let normAngle = Math.atan2(Math.sin(currentAngle), Math.cos(currentAngle));

            // Check closeness to 3 o'clock (0) or 9 o'clock (PI) depending on justify
            const isRight = this.getAttribute('justify') === 'right';
            const targetAngle = isRight ? Math.PI : 0;

            // For distance logic with PI, we need to handle the wrap around safely.
            // Vector dot product or just angular diff?
            // Simple angular diff:
            let angDiff = Math.abs(normAngle - (isRight ? (normAngle > 0 ? Math.PI : -Math.PI) : 0));
            // Actually 'Math.PI' normAngle can be PI or -PI.
            if (isRight) {
                angDiff = Math.abs(Math.abs(normAngle) - Math.PI);
            }

            let dist = angDiff;
            if (dist < minDiff) {
                minDiff = dist;
                nearestIndex = i;
            }

            if (dist < 0.2) {
                if (!item.hasAttribute('active')) {
                    item.setAttribute('active', '');
                    // Haptic "Click"
                    if (navigator.vibrate) navigator.vibrate(10);
                }
            } else {
                item.removeAttribute('active');
            }
        });

        if (nearestIndex !== this.activeIndex) {
            this.activeIndex = nearestIndex;

            // Update Active Label
            const labelEl = this.shadowRoot.getElementById('active-label');
            if (this.activeIndex >= 0 && this.items[this.activeIndex]) {
                labelEl.textContent = this.items[this.activeIndex].getAttribute('label');
                // Rely on CSS for opacity:1 when open
            }

            // Emit Change Event
            this.dispatchEvent(new CustomEvent('lz-change', {
                detail: {
                    index: this.activeIndex,
                    item: this.items[this.activeIndex]
                }
            }));
        }
    }
}

customElements.define('lz-dial', LawnCzarDial);

// Helper Item Component
class LawnCzarItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        let icon = this.getAttribute('icon') || '';
        let label = this.getAttribute('label') || '';
        this.render();

        this.addEventListener('click', (e) => {
            // Only navigate if active? User said: "user should be a to click IT... to navigate"
            // Usually implies clicking the active one.
            // Let's allow clicking any if it has an href, but maybe prioritize active check?
            // "click it as the select icon" -> implies it must be selected first?
            // For now, let's just check if it has href. 
            // If we want to strictly follow "click AS the selected icon", we might check 'active'.
            if (this.hasAttribute('active') && this.hasAttribute('href')) {
                window.location.href = this.getAttribute('href');
            }
        });
    }

    static get observedAttributes() { return ['active', 'icon', 'label']; }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    render() {
        let icon = this.getAttribute('icon') || '';
        let label = this.getAttribute('label') || '';

        this.shadowRoot.innerHTML = `
        <style>
            :host { 
                display: flex; 
                flex-direction: column; 
                align-items: center; 
                justify-content: center;
                cursor: pointer;
                user-select: none;
                -webkit-user-select: none;
            }
            .icon-wrapper {
                position: relative;
                width: 60px; height: 60px;
                display: flex; align-items: center; justify-content: center;
                border-radius: 50%;
                /* No transition - instant response during drag */
            }
            img { 
                width: 40px; 
                height: 40px; 
                object-fit: contain; 
                z-index: 2; 
                position: relative;
                user-select: none;
                -webkit-user-select: none;
                -webkit-user-drag: none;
                pointer-events: none;
            }
            .placeholder { width: 40px; height: 40px; background:#333; border-radius:50%; z-index: 2; }
            
            .label { 
                display: none; /* Hidden - moved to main dial overlay */
            }
            
            /* Active State */
            :host([active]) .label { opacity: 0; }
            
            :host([active]) .icon-wrapper {
                 /* We don't want the wrapper to scale everything, maybe just the ring? */
                 /* Previous code scaled the host relative to dial. */
            }

            /* Pulsating Glow Ring */
            @keyframes pulse-ring {
                0% { box-shadow: 0 0 0 0 rgba(0, 255, 157, 0.4); border-color: rgba(0, 255, 157, 0.8); }
                70% { box-shadow: 0 0 0 15px rgba(0, 255, 157, 0); border-color: rgba(0, 255, 157, 0); }
                100% { box-shadow: 0 0 0 0 rgba(0, 255, 157, 0); border-color: rgba(0, 255, 157, 0); }
            }
            
            :host([active]) .icon-wrapper::after {
                content: '';
                position: absolute;
                top: 0; left: 0; right: 0; bottom: 0;
                border-radius: 50%;
                border: 2px solid #00ff9d;
                animation: pulse-ring 2s infinite;
                z-index: 1;
            }

        </style>
        <div class="icon-wrapper">
            ${icon ? `<img src="${icon}">` : '<div class="placeholder"></div>'}
        </div>
        <div class="label">${label}</div>
        `;
    }
}
customElements.define('lz-item', LawnCzarItem);
