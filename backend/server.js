/**
 * bzr-dial-ui Backend Server
 * Handles Stripe payments, license generation, and file delivery
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const LicenseManager = require('./license-manager');
const EmailService = require('./email-service');
const path = require('path');
const fs = require('fs');

const app = express();
const licenseManager = new LicenseManager(process.env.LICENSE_SECRET);
const emailService = new EmailService();

// In-memory license storage (use database in production)
const licenses = new Map();

// Middleware
app.use(cors({
    origin: '*', // Allow all origins in development
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'stripe-signature'],
    credentials: true
}));

// Handle preflight requests
app.options('*', cors());

// Parse JSON for all routes except webhook (which needs raw body)
app.use((req, res, next) => {
    if (req.originalUrl === '/webhook') {
        next();
    } else {
        express.json()(req, res, next);
    }
});

// Webhook endpoint needs raw body
app.use('/webhook', express.raw({ type: 'application/json' }));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'bzr-dial-ui-backend' });
});

/**
 * Create Stripe Checkout Session
 */
app.post('/api/create-checkout-session', async (req, res) => {
    try {
        const { plan } = req.body;

        // Validate plan
        const validPlans = ['single', 'team'];
        if (!validPlans.includes(plan)) {
            return res.status(400).json({ error: 'Invalid plan' });
        }

        // Get price ID from environment
        const priceId = plan === 'single'
            ? process.env.STRIPE_PRICE_SINGLE
            : process.env.STRIPE_PRICE_TEAM;

        // Create checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price: priceId,
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/landing/index.html`,
            metadata: {
                product: 'bzr-dial-ui',
                license_type: plan,
                version: '1.0.0'
            },
            customer_email: req.body.email || undefined,
        });

        res.json({
            sessionId: session.id,
            url: session.url
        });

    } catch (error) {
        console.error('Checkout session error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Stripe Webhook Handler
 * Handles payment success and generates license
 */
app.post('/webhook', async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            await handleSuccessfulPayment(session);
            break;

        case 'payment_intent.succeeded':
            console.log('Payment succeeded:', event.data.object.id);
            break;

        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
});

/**
 * Handle successful payment
 */
async function handleSuccessfulPayment(session) {
    try {
        const { customer_email, metadata } = session;
        const { license_type } = metadata;

        console.log(`Processing payment for ${customer_email} - ${license_type}`);

        // Generate license
        const license = licenseManager.createLicense(
            customer_email,
            license_type,
            {
                stripeSessionId: session.id,
                amount: session.amount_total / 100,
                currency: session.currency
            }
        );

        // Store license (use database in production)
        licenses.set(license.key, license);

        // Send email with license and download link
        await emailService.sendLicenseEmail(license);

        console.log(`License generated and sent: ${license.key}`);

    } catch (error) {
        console.error('Payment handling error:', error);
        // In production, you'd want to retry or alert admins
    }
}

/**
 * Get session details (for success page)
 */
app.get('/api/session/:sessionId', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);

        res.json({
            status: session.payment_status,
            customerEmail: session.customer_email,
            metadata: session.metadata
        });
    } catch (error) {
        console.error('Session retrieval error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Download endpoint (with token validation)
 */
app.get('/download/:licenseKey', async (req, res) => {
    try {
        const { licenseKey } = req.params;
        const { token } = req.query;

        // Validate license key format
        if (!licenseManager.validateFormat(licenseKey)) {
            return res.status(400).json({ error: 'Invalid license key format' });
        }

        // Validate download token
        if (!licenseManager.validateDownloadToken(token, licenseKey)) {
            return res.status(403).json({ error: 'Invalid or expired download token' });
        }

        // Check if license exists
        const license = licenses.get(licenseKey);
        if (!license) {
            return res.status(404).json({ error: 'License not found' });
        }

        // Serve the file
        const filePath = path.join(__dirname, process.env.PACKAGE_FILE_PATH);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Package file not found' });
        }

        // Log download
        console.log(`Download: ${licenseKey} by ${license.email}`);

        // Send file
        res.download(filePath, 'bzr-dial-ui-v1.0.0.zip', (err) => {
            if (err) {
                console.error('Download error:', err);
            }
        });

    } catch (error) {
        console.error('Download endpoint error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Validate license key (for component validation)
 */
app.post('/api/validate-license', (req, res) => {
    try {
        const { licenseKey } = req.body;

        // Validate format
        if (!licenseManager.validateFormat(licenseKey)) {
            return res.json({ valid: false, reason: 'Invalid format' });
        }

        // Check if exists
        const license = licenses.get(licenseKey);
        if (!license) {
            return res.json({ valid: false, reason: 'License not found' });
        }

        res.json({
            valid: true,
            type: license.type,
            email: license.email
        });

    } catch (error) {
        console.error('License validation error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Generate new download token (for existing customers)
 */
app.post('/api/regenerate-download', async (req, res) => {
    try {
        const { licenseKey, email } = req.body;

        // Validate
        if (!licenseManager.validateFormat(licenseKey)) {
            return res.status(400).json({ error: 'Invalid license key' });
        }

        const license = licenses.get(licenseKey);
        if (!license || license.email !== email) {
            return res.status(404).json({ error: 'License not found or email mismatch' });
        }

        // Generate new token
        const downloadToken = licenseManager.generateDownloadToken(licenseKey);
        const downloadUrl = `${process.env.DOWNLOAD_BASE_URL}/${licenseKey}?token=${downloadToken}`;

        // Update license
        license.downloadToken = downloadToken;
        license.downloadUrl = downloadUrl;

        // Send email
        await emailService.sendSupportEmail(
            email,
            'Your bzr-dial-ui Download Link',
            `Here's your fresh download link (valid for 24 hours):<br><br>
            <a href="${downloadUrl}">Download bzr-dial-ui</a><br><br>
            License Key: ${licenseKey}`
        );

        res.json({
            success: true,
            message: 'Download link sent to your email'
        });

    } catch (error) {
        console.error('Regenerate download error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 bzr-dial-ui backend running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
});

module.exports = app;
