# bzr-dial-ui - Packaging & Sales Guide

## 📦 Package Structure

Your final deliverable should include:

```
bzr-dial-ui/
├── bzr-dial.js           # Main component (renamed from lz-dial.js)
├── bzr-item.js           # Item component (if separate)
├── README.md             # Documentation
├── LICENSE.txt           # License file
├── examples/
│   ├── basic.html        # Simple example
│   ├── media.html        # Media playback example
│   ├── advanced.html     # Advanced features
│   └── assets/           # Example media files
└── docs/
    ├── getting-started.md
    ├── api-reference.md
    ├── customization.md
    └── troubleshooting.md
```

## 💳 Stripe Integration Options

### Option 1: Payment Links (Easiest - No Backend)

**Pros:**
- No server required
- 5-minute setup
- Stripe handles everything
- Instant delivery via email

**Setup:**
1. Go to Stripe Dashboard → Products
2. Create product "bzr-dial-ui Single License" - $49
3. Create product "bzr-dial-ui Team License" - $149
4. Click "Create payment link" for each
5. Add download link in success page
6. Update `app.js` with your payment links

**Example:**
```javascript
const paymentLinks = {
    single: 'https://buy.stripe.com/test_xxxxx',
    team: 'https://buy.stripe.com/test_yyyyy'
};
```

### Option 2: Stripe Checkout (Recommended)

**Pros:**
- More control
- Custom success pages
- License key generation
- Email automation

**Setup:**
1. Create Stripe account
2. Create products with Price IDs
3. Set up webhook endpoint
4. Create simple backend (Node.js example below)

**Backend (Node.js + Express):**
```javascript
const stripe = require('stripe')('sk_live_YOUR_SECRET_KEY');
const express = require('express');
const app = express();

app.post('/api/create-checkout-session', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            price: req.body.priceId,
            quantity: 1,
        }],
        mode: 'payment',
        success_url: req.body.successUrl,
        cancel_url: req.body.cancelUrl,
        metadata: {
            product: 'bzr-dial-ui',
            license_type: req.body.licenseType
        }
    });
    
    res.json({ id: session.id });
});

app.listen(3000);
```

### Option 3: Third-Party Platforms (Simplest)

Use existing platforms that handle everything:

1. **Gumroad** (Recommended for beginners)
   - Upload ZIP file
   - Set price
   - Automatic delivery
   - 10% fee

2. **Lemon Squeezy**
   - Better for software
   - License key management
   - 5% + payment processing

3. **Paddle**
   - Handles VAT/taxes
   - Global payments
   - 5% + payment processing

## 🔐 License Key System (Optional)

If you want license validation:

### Simple License Key Generator:
```javascript
// generate-license.js
const crypto = require('crypto');

function generateLicense(email, type) {
    const data = `${email}:${type}:${Date.now()}`;
    const hash = crypto
        .createHash('sha256')
        .update(data + 'YOUR_SECRET_SALT')
        .digest('hex')
        .substring(0, 32)
        .toUpperCase();
    
    // Format: BZRD-XXXX-XXXX-XXXX-XXXX
    return 'BZRD-' + hash.match(/.{1,4}/g).slice(0, 4).join('-');
}

console.log(generateLicense('customer@example.com', 'single'));
// Output: BZRD-A3F2-8D1C-9E4B-7F6A
```

### License Validation in Component (Optional):
```javascript
// Add to bzr-dial.js
class BzrDial extends HTMLElement {
    constructor() {
        super();
        this.validateLicense();
    }
    
    validateLicense() {
        const license = this.getAttribute('license');
        if (!license) {
            console.warn('bzr-dial-ui: No license key provided');
            // Optionally add watermark or limit features
        }
        // Validate format
        if (!/^BZRD-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}$/.test(license)) {
            console.error('bzr-dial-ui: Invalid license key');
        }
    }
}
```

## 📝 License File Template

Create `LICENSE.txt`:

```
bzr-dial-ui Commercial License

Copyright (c) 2026 bzzrr.link

SINGLE LICENSE
- Use in 1 commercial project
- Lifetime updates
- Email support

TEAM LICENSE  
- Use in unlimited projects
- Up to 10 developers
- Lifetime updates
- Priority support

RESTRICTIONS
- Cannot resell or redistribute
- Cannot use in open-source projects
- Cannot create derivative products for sale

For full terms: https://bzzrr.link/license
```

## 📧 Delivery System

### Automated Email (via Stripe Webhook):

```javascript
// webhook-handler.js
const stripe = require('stripe')('sk_live_YOUR_SECRET_KEY');
const nodemailer = require('nodemailer');

app.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(req.body, sig, 'whsec_YOUR_WEBHOOK_SECRET');
    
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        
        // Generate license
        const license = generateLicense(session.customer_email, session.metadata.license_type);
        
        // Send email with download link
        await sendDeliveryEmail(session.customer_email, license);
    }
    
    res.json({received: true});
});

async function sendDeliveryEmail(email, license) {
    const transporter = nodemailer.createTransport({/* config */});
    
    await transporter.sendMail({
        from: 'sales@bzzrr.link',
        to: email,
        subject: 'Your bzr-dial-ui License',
        html: `
            <h1>Thank you for your purchase!</h1>
            <p>Your license key: <strong>${license}</strong></p>
            <p><a href="https://bzzrr.link/download/${license}">Download bzr-dial-ui</a></p>
        `
    });
}
```

## 🎯 Recommended Setup for You

Based on your needs, here's what I recommend:

### Phase 1: Quick Launch (This Week)
1. **Use Gumroad or Lemon Squeezy**
   - Upload ZIP package
   - Set pricing
   - Launch immediately
   - No coding required

### Phase 2: Custom Solution (Next Month)
1. **Stripe Payment Links**
   - More professional
   - Better branding
   - Lower fees (2.9% vs 10%)

### Phase 3: Full System (Later)
1. **Custom backend with license keys**
   - Stripe Checkout API
   - Automated delivery
   - License validation
   - Update notifications

## 📦 Creating the Package

Run this script to create the deliverable:

```bash
#!/bin/bash
# package.sh

VERSION="1.0.0"
PACKAGE_NAME="bzr-dial-ui-v${VERSION}"

# Create package directory
mkdir -p dist/${PACKAGE_NAME}

# Copy files
cp components/bzr-dial.js dist/${PACKAGE_NAME}/
cp -r examples dist/${PACKAGE_NAME}/
cp -r docs dist/${PACKAGE_NAME}/
cp LICENSE.txt dist/${PACKAGE_NAME}/
cp README.md dist/${PACKAGE_NAME}/

# Create ZIP
cd dist
zip -r ${PACKAGE_NAME}.zip ${PACKAGE_NAME}

echo "Package created: dist/${PACKAGE_NAME}.zip"
```

## 🚀 Next Steps

1. **Rename component**: `lz-dial.js` → `bzr-dial.js`
2. **Create documentation**: Getting started guide, API reference
3. **Choose platform**: Gumroad (easiest) or Stripe (more control)
4. **Set up payment**: Create products and pricing
5. **Test purchase flow**: Buy your own product to verify
6. **Launch**: Share on Twitter, Reddit, Product Hunt

## 💰 Pricing Strategy

Your current pricing ($49 single, $149 team) is good. Consider:

- **Early bird**: $39 for first 50 customers
- **Bundle**: Both licenses for $179 (save $19)
- **Lifetime updates**: Included (great selling point)
- **Money-back guarantee**: 30 days (reduces risk)

## 📊 Marketing Checklist

- [ ] Landing page live
- [ ] Demo working
- [ ] Documentation complete
- [ ] Payment processing tested
- [ ] Email delivery working
- [ ] Social media posts ready
- [ ] Product Hunt submission
- [ ] Reddit r/webdev post
- [ ] Twitter announcement
- [ ] Email to existing contacts

---

**Questions?** Email: support@bzzrr.link
