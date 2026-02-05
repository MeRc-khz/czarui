/**
 * bzr-dial-ui Landing Page
 * Stripe Integration & Interactivity
 */

// API Configuration
const API_BASE_URL = 'http://localhost:3000'; // Change to your production URL

// Handle Purchase with Backend
async function handlePurchase(plan) {
    try {
        // Show loading state
        const btn = event.target;
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span>Processing...</span>';
        btn.disabled = true;

        // For enterprise, redirect to contact
        if (plan === 'enterprise') {
            window.location.href = 'mailto:sales@bzzrr.link?subject=Enterprise License Inquiry';
            btn.innerHTML = originalText;
            btn.disabled = false;
            return;
        }

        // Create checkout session via backend
        const response = await fetch(`${API_BASE_URL}/api/create-checkout-session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ plan })
        });

        if (!response.ok) {
            throw new Error('Failed to create checkout session');
        }

        const { url } = await response.json();

        // Redirect to Stripe Checkout
        window.location.href = url;

    } catch (error) {
        console.error('Purchase error:', error);
        alert('Something went wrong. Please try again or contact support@bzzrr.link');

        // Restore button
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
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    });
}

// Smooth Scroll
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Initialize Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Buy buttons
    const buyButtons = document.querySelectorAll('[data-plan]');
    buyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const plan = btn.getAttribute('data-plan');
            handlePurchase(plan);
        });
    });

    // Hero CTA buttons
    const buyNowBtn = document.getElementById('buyNowBtn');
    const ctaBuyBtn = document.getElementById('ctaBuyBtn');

    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', () => {
            handlePurchase('single');
        });
    }

    if (ctaBuyBtn) {
        ctaBuyBtn.addEventListener('click', () => {
            handlePurchase('single');
        });
    }

    // Copy code buttons
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(btn => {
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

// Load Demo Component
function loadDemoComponent() {
    const demoContainer = document.getElementById('demoContainer');
    const fullDemo = document.getElementById('fullDemo');

    if (!demoContainer && !fullDemo) return;

    // Create demo HTML
    const demoHTML = `
        <bzr-dial radius="150">
            <bzr-item label="Home" icon="🏠"></bzr-item>
            <bzr-item label="Music" icon="🎵"></bzr-item>
            <bzr-item label="Video" icon="🎬"></bzr-item>
            <bzr-item label="Gallery" icon="🖼️"></bzr-item>
            <bzr-item label="Settings" icon="⚙️"></bzr-item>
            <bzr-item label="Profile" icon="👤"></bzr-item>
            <bzr-item label="Messages" icon="💬"></bzr-item>
            <bzr-item label="Search" icon="🔍"></bzr-item>
        </bzr-dial>
    `;

    // Add to containers
    if (demoContainer) {
        demoContainer.innerHTML = demoHTML;
    }
    if (fullDemo) {
        fullDemo.innerHTML = demoHTML;
    }

    // Load component script
    const script = document.createElement('script');
    script.src = '../components/lz-dial.js'; // Will be renamed from lz-dial.js
    document.body.appendChild(script);
}

// Analytics tracking (optional)
function trackEvent(eventName, data = {}) {
    // Google Analytics
    if (window.gtag) {
        gtag('event', eventName, data);
    }

    // Plausible
    if (window.plausible) {
        plausible(eventName, { props: data });
    }
}

// Track purchase attempts
document.addEventListener('click', (e) => {
    if (e.target.matches('[data-plan]')) {
        const plan = e.target.getAttribute('data-plan');
        trackEvent('purchase_initiated', { plan });
    }
});

// Export for use in other scripts
window.bzrLanding = {
    handlePurchase,
    copyCode,
    smoothScroll,
    trackEvent
};
