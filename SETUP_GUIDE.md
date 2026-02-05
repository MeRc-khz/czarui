# bzr-dial-ui - Complete Setup Guide
## License Key System with Stripe Checkout

This guide will walk you through setting up the complete sales system with license key generation.

## 📋 Prerequisites

- Node.js 16+ installed
- Stripe account
- Email service (Gmail, SendGrid, etc.)
- Domain name (for production)

---

## 🚀 Quick Start (Development)

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET

# Stripe Price IDs
STRIPE_PRICE_SINGLE=price_YOUR_SINGLE_PRICE_ID
STRIPE_PRICE_TEAM=price_YOUR_TEAM_PRICE_ID

# Server
PORT=3000
FRONTEND_URL=http://localhost:8000

# License Secret (generate random string)
LICENSE_SECRET=your-super-secret-random-string-here

# Email (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Download
DOWNLOAD_BASE_URL=http://localhost:3000/download
PACKAGE_FILE_PATH=./packages/bzr-dial-ui-v1.0.0.zip
```

### 3. Create Stripe Products

Go to [Stripe Dashboard → Products](https://dashboard.stripe.com/products):

**Single License:**
- Name: bzr-dial-ui Single License
- Price: $49 (one-time)
- Copy the Price ID (starts with `price_`)

**Team License:**
- Name: bzr-dial-ui Team License  
- Price: $149 (one-time)
- Copy the Price ID

Add these to your `.env` file.

### 4. Set Up Stripe Webhook

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Endpoint URL: `http://localhost:3000/webhook` (for testing)
4. Events to send: `checkout.session.completed`
5. Copy the Webhook Secret (starts with `whsec_`)
6. Add to `.env` file

**For local testing**, use Stripe CLI:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/webhook
```

This will give you a webhook secret starting with `whsec_`.

### 5. Configure Email

**Option A: Gmail (Easiest for testing)**

1. Enable 2-factor authentication on your Google account
2. Generate an App Password:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use this password in `EMAIL_PASS`

**Option B: SendGrid (Recommended for production)**

```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=YOUR_SENDGRID_API_KEY
```

### 6. Create Package File

```bash
# Create packages directory
mkdir -p backend/packages

# Package your component (we'll create this script)
./package-component.sh
```

### 7. Start the Backend

```bash
cd backend
npm start
```

You should see:
```
🚀 bzr-dial-ui backend running on port 3000
Environment: development
Frontend URL: http://localhost:8000
```

### 8. Start Frontend Server

In a new terminal:

```bash
cd ..
python3 -m http.server 8000
# or
npx serve -p 8000
```

### 9. Test the Flow

1. Open `http://localhost:8000/landing/index.html`
2. Click "Get bzr-dial-ui"
3. Use Stripe test card: `4242 4242 4242 4242`
4. Check your email for the license key!

---

## 🔧 Production Deployment

### Backend Deployment (Options)

**Option 1: Railway.app (Easiest)**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
cd backend
railway init
railway up
```

Add environment variables in Railway dashboard.

**Option 2: Heroku**

```bash
# Install Heroku CLI
brew install heroku/brew/heroku

# Login
heroku login

# Create app
cd backend
heroku create bzr-dial-backend

# Set env vars
heroku config:set STRIPE_SECRET_KEY=sk_live_...
heroku config:set LICENSE_SECRET=...
# ... set all other env vars

# Deploy
git push heroku main
```

**Option 3: DigitalOcean App Platform**

1. Connect GitHub repo
2. Select `backend` folder
3. Add environment variables
4. Deploy

### Frontend Deployment

**Option 1: Vercel (Recommended)**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd landing
vercel

# Update API_BASE_URL in app.js to your backend URL
```

**Option 2: Netlify**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd landing
netlify deploy --prod
```

### Update URLs

After deployment, update:

1. `landing/app.js` - Change `API_BASE_URL` to your backend URL
2. Backend `.env` - Update `FRONTEND_URL` to your frontend URL
3. Stripe webhook - Update endpoint URL to production backend

---

## 📦 Creating the Package

Create `package-component.sh`:

```bash
#!/bin/bash

VERSION="1.0.0"
PACKAGE_NAME="bzr-dial-ui-v${VERSION}"
OUTPUT_DIR="backend/packages"

echo "📦 Creating bzr-dial-ui package..."

# Create temp directory
mkdir -p /tmp/${PACKAGE_NAME}

# Copy component files
cp components/bzr-dial.js /tmp/${PACKAGE_NAME}/
cp -r examples /tmp/${PACKAGE_NAME}/
cp -r docs /tmp/${PACKAGE_NAME}/
cp LICENSE.txt /tmp/${PACKAGE_NAME}/
cp README.md /tmp/${PACKAGE_NAME}/

# Create ZIP
cd /tmp
zip -r ${PACKAGE_NAME}.zip ${PACKAGE_NAME}

# Move to packages directory
mkdir -p ${OUTPUT_DIR}
mv ${PACKAGE_NAME}.zip ${OUTPUT_DIR}/

# Cleanup
rm -rf /tmp/${PACKAGE_NAME}

echo "✅ Package created: ${OUTPUT_DIR}/${PACKAGE_NAME}.zip"
```

Make it executable:

```bash
chmod +x package-component.sh
./package-component.sh
```

---

## 🧪 Testing

### Test License Generation

```bash
cd backend
node -e "
const LicenseManager = require('./license-manager');
const lm = new LicenseManager('test-secret');
const license = lm.createLicense('test@example.com', 'single');
console.log(license);
"
```

### Test Email Sending

```bash
node -e "
require('dotenv').config();
const EmailService = require('./email-service');
const es = new EmailService();
es.sendLicenseEmail({
  email: 'your-email@example.com',
  key: 'BZRD-TEST-1234-5678-9ABC',
  type: 'single',
  downloadUrl: 'http://localhost:3000/download/test'
}).then(() => console.log('Email sent!'));
"
```

### Test Stripe Checkout

```bash
curl -X POST http://localhost:3000/api/create-checkout-session \
  -H "Content-Type: application/json" \
  -d '{"plan":"single"}'
```

---

## 🔒 Security Checklist

- [ ] Use strong `LICENSE_SECRET` (32+ random characters)
- [ ] Never commit `.env` file
- [ ] Use HTTPS in production
- [ ] Enable Stripe webhook signature verification
- [ ] Rate limit API endpoints
- [ ] Validate all user inputs
- [ ] Use environment variables for all secrets
- [ ] Enable CORS only for your frontend domain
- [ ] Set up monitoring and error alerts

---

## 📊 Monitoring

### Add Logging

Install Winston:

```bash
npm install winston
```

Add to `server.js`:

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Use logger.info(), logger.error(), etc.
```

### Track Metrics

- Total sales
- License types sold
- Email delivery success rate
- Download counts
- Failed payments

---

## 🆘 Troubleshooting

### Webhook not receiving events

```bash
# Test with Stripe CLI
stripe listen --forward-to localhost:3000/webhook

# In another terminal, trigger test event
stripe trigger checkout.session.completed
```

### Email not sending

- Check Gmail app password is correct
- Verify 2FA is enabled
- Check spam folder
- Test with a simple email first

### License key not generating

- Check `LICENSE_SECRET` is set
- Verify webhook is receiving events
- Check server logs for errors

### Download link expired

- Regenerate token using `/api/regenerate-download` endpoint
- Tokens are valid for 24 hours

---

## 📚 Next Steps

1. **Add Database**: Store licenses in PostgreSQL/MongoDB
2. **Add Analytics**: Track sales with Stripe Dashboard or custom analytics
3. **Add Support Portal**: Let customers retrieve lost licenses
4. **Add Updates System**: Notify customers of new versions
5. **Add Affiliate Program**: Use Stripe's affiliate features

---

## 💡 Tips

- Test with Stripe test mode first
- Use Stripe CLI for local webhook testing
- Keep license keys in database for production
- Send welcome email with getting started guide
- Offer 30-day money-back guarantee
- Provide excellent documentation

---

## 🎉 You're Ready!

Your bzr-dial-ui sales system is now complete with:

✅ Stripe Checkout integration
✅ Automatic license key generation
✅ Email delivery with download links
✅ Secure download endpoints
✅ Professional landing page

**Questions?** Check the [PACKAGING_GUIDE.md](./PACKAGING_GUIDE.md) or email support@bzzrr.link
