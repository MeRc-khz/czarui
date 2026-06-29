/**
 * bzr-dial-ui Landing Page
 * Stripe Integration & Interactivity
 * Theme: bzzrrr.link Tactical UI
 */

// API Configuration
const API_BASE_URL = window.location.origin;

// Handle Purchase with Backend
async function handlePurchase(plan) {
    try {
        const btn = event.target;
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span>Processing...</span>';
        btn.disabled = true;

        if (plan === 'enterprise') {
            window.location.href = 'mailto:sales@bzzrr.link?subject=Enterprise License Inquiry';
            btn.innerHTML = originalText;
            btn.disabled = false;
            return;
        }

        const response = await fetch(`${API_BASE_URL}/api/create-checkout-session`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ plan })
        });

        if (!response.ok) throw new Error('Failed to create checkout session');

        const { url } = await response.json();
        window.location.href = url;

    } catch (error) {
        console.error('Purchase error:', error);
        alert('Something went wrong. Please try again or contact support@bzzrr.link');
        if (event && event.target) {
            event.target.innerHTML = originalText;
            event.target.disabled = false;
        }
    }
}

// Copy Code to Clipboard
function copyCode(elementId) {
    const code = document.getElementById(elementId).textContent;
    navigator.clipboard.writeText(code).then(() => {
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = originalText; }, 2000);
    });
}

// Smooth Scroll
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Load Demo Component — uses bzr-dial-menu (canonical)
function loadDemoComponent() {
    const heroDemo = document.getElementById('hero-demo');
    const fullDemo = document.getElementById('fullDemo');
    if (!heroDemo && !fullDemo) return;

    const demoHTML = `
        <bzr-dial-menu demo>
            <bzr-item label="Home" icon="/icons/home.svg" href="#demo"></bzr-item>
            <bzr-item label="Music" icon="/icons/music.svg" data-audio="/media/makeufamo.us.mp3" data-autoplay></bzr-item>
            <bzr-item label="Video" icon="/icons/video.svg" data-video="/media/paperchasers2.mp4"></bzr-item>
            <bzr-item label="Gallery" icon="/icons/gallery.svg" data-image="/media/illienfront.png"></bzr-item>
            <bzr-item label="Search" icon="/icons/search.svg"></bzr-item>
            <bzr-item label="Messages" icon="/icons/messages.svg"></bzr-item>
            <bzr-item label="Profile" icon="/icons/profile.svg" data-image="/media/qrillielogo.png"></bzr-item>
            <bzr-item label="Settings" icon="/icons/settings.svg"></bzr-item>
        </bzr-dial-menu>
    `;

    // Load the canonical bzr-dial-menu component FIRST
    const script = document.createElement('script');
    script.src = '/demo/bzr-dial-menu.js';
    script.onload = () => {
        // Wait for BOTH custom elements to be defined before injecting DOM.
        // This guarantees connectedCallback fires with slotted children ready
        // and icons resolve immediately on render.
        Promise.all([
            customElements.whenDefined('bzr-dial-menu'),
            customElements.whenDefined('bzr-item')
        ]).then(() => {
            if (heroDemo) heroDemo.innerHTML = demoHTML;
            if (fullDemo) fullDemo.innerHTML = demoHTML;
        });
    };
    script.onerror = () => console.error('[bzr-dial-ui] Failed to load /demo/bzr-dial-menu.js');
    document.body.appendChild(script);
}

// Initialize Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Plan buttons
    document.querySelectorAll('.plan-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const plan = btn.getAttribute('data-plan');
            handlePurchase(plan);
        });
    });

    // Copy code button
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const codeId = btn.getAttribute('data-copy');
            copyCode(codeId);
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            smoothScroll(this.getAttribute('href'));
        });
    });

    // Load demo component
    loadDemoComponent();
});

// Theme Toggle Functionality
const html = document.documentElement;
const toggleDayOps = document.getElementById('toggleDayOps');
const toggleNightVision = document.getElementById('toggleNightVision');

const savedTheme = localStorage.getItem('webwork-theme') || 'dark';
if (savedTheme === 'light') {
    html.classList.remove('dark');
    html.classList.add('light');
} else {
    html.classList.remove('light');
    html.classList.add('dark');
}

if (toggleDayOps) {
    toggleDayOps.addEventListener('click', () => {
        html.classList.remove('dark');
        html.classList.add('light');
        localStorage.setItem('webwork-theme', 'light');
    });
}

if (toggleNightVision) {
    toggleNightVision.addEventListener('click', () => {
        html.classList.remove('light');
        html.classList.add('dark');
        localStorage.setItem('webwork-theme', 'dark');
    });
}

// Analytics tracking (optional)
function trackEvent(eventName, data = {}) {
    if (window.gtag) gtag('event', eventName, data);
    if (window.plausible) plausible(eventName, { props: data });
}

document.addEventListener('click', (e) => {
    if (e.target.matches('[data-plan]')) {
        const plan = e.target.getAttribute('data-plan');
        trackEvent('purchase_initiated', { plan });
    }
});

window.bzrLanding = { handlePurchase, copyCode, smoothScroll, trackEvent };
