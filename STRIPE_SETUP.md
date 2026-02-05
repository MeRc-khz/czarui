# Stripe Setup Checklist for bzr-dial-ui

## ✅ Step-by-Step Setup

### 1. Create Stripe Account
- [ ] Go to https://stripe.com
- [ ] Click "Start now" or "Sign up"
- [ ] Enter your email and create password
- [ ] Verify your email address
- [ ] Complete business information

### 2. Activate Your Account
- [ ] Add business details (can use personal name for now)
- [ ] Add bank account for payouts
- [ ] Verify identity (may require ID)
- [ ] Enable payment methods (card is default)

### 3. Create Products

#### Product 1: Single License
1. Go to https://dashboard.stripe.com/products
2. Click "Add product"
3. Fill in:
   - Name: `bzr-dial-ui Single License`
   - Description: `Full source code for 1 commercial project. Lifetime updates and email support included.`
   - Pricing model: `Standard pricing`
   - Price: `$49.00 USD`
   - Billing period: `One time`
4. Click "Save product"
5. **COPY THE PRICE ID** (looks like `price_1AbCdEfGhIjKlMnO`)
6. Save it for later

#### Product 2: Team License
1. Click "Add product" again
2. Fill in:
   - Name: `bzr-dial-ui Team License`
   - Description: `Full source code for unlimited projects. Up to 10 developers. Lifetime updates and priority support.`
   - Pricing model: `Standard pricing`
   - Price: `$149.00 USD`
   - Billing period: `One time`
3. Click "Save product"
4. **COPY THE PRICE ID** (looks like `price_2XyZaBcDeFgHiJkL`)
5. Save it for later

### 4. Get API Keys

1. Go to https://dashboard.stripe.com/apikeys
2. You'll see two keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)
3. Click "Reveal test key" for the Secret key
4. **COPY BOTH KEYS** - you'll need them for .env file

⚠️ **IMPORTANT**: 
- Test keys start with `pk_test_` and `sk_test_`
- Live keys start with `pk_live_` and `sk_live_`
- Start with TEST keys, switch to LIVE when ready to sell

### 5. Set Up Webhook

#### Option A: For Local Development (Testing)

1. Install Stripe CLI:
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   
   # Linux
   wget https://github.com/stripe/stripe-cli/releases/download/v1.19.4/stripe_1.19.4_linux_x86_64.tar.gz
   tar -xvf stripe_1.19.4_linux_x86_64.tar.gz
   sudo mv stripe /usr/local/bin/
   
   # Windows
   # Download from https://github.com/stripe/stripe-cli/releases
   ```

2. Login to Stripe:
   ```bash
   stripe login
   ```
   This will open a browser to authorize.

3. Forward webhooks to local server:
   ```bash
   stripe listen --forward-to localhost:3000/webhook
   ```
   
4. **COPY THE WEBHOOK SECRET** from the output (starts with `whsec_`)
   It will look like: `whsec_1234567890abcdefghijklmnopqrstuvwxyz`

5. Keep this terminal running while testing!

#### Option B: For Production Deployment

1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Enter your endpoint URL:
   - Format: `https://your-backend-domain.com/webhook`
   - Example: `https://bzr-dial-backend.railway.app/webhook`
4. Select events to listen for:
   - Click "Select events"
   - Search for and select: `checkout.session.completed`
   - Click "Add events"
5. Click "Add endpoint"
6. **COPY THE SIGNING SECRET** (starts with `whsec_`)

### 6. Configure Environment Variables

Create/edit `backend/.env`:

```env
# Stripe Keys (from Step 4)
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE

# Webhook Secret (from Step 5)
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE

# Price IDs (from Step 3)
STRIPE_PRICE_SINGLE=price_YOUR_SINGLE_LICENSE_PRICE_ID
STRIPE_PRICE_TEAM=price_YOUR_TEAM_LICENSE_PRICE_ID

# Server Configuration
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:8000

# License Secret (generate random string)
LICENSE_SECRET=your-super-secret-random-string-change-this-to-something-random

# Email Configuration (see Email Setup section)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Download Configuration
DOWNLOAD_BASE_URL=http://localhost:3000/download
PACKAGE_FILE_PATH=./packages/bzr-dial-ui-v1.0.0.zip
```

### 7. Test Payment Flow

1. Start your backend:
   ```bash
   cd backend
   npm install
   npm start
   ```

2. In another terminal, start Stripe webhook forwarding:
   ```bash
   stripe listen --forward-to localhost:3000/webhook
   ```

3. In another terminal, start frontend:
   ```bash
   python3 -m http.server 8000
   ```

4. Open http://localhost:8000/landing/index.html

5. Click "Get bzr-dial-ui"

6. Use Stripe test card:
   - Card number: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., `12/34`)
   - CVC: Any 3 digits (e.g., `123`)
   - ZIP: Any 5 digits (e.g., `12345`)

7. Complete the purchase

8. Check your email for the license key!

### 8. More Test Cards

```
Success:
4242 4242 4242 4242  - Visa (default success)
5555 5555 5555 4444  - Mastercard
3782 822463 10005    - American Express

Decline:
4000 0000 0000 0002  - Card declined
4000 0000 0000 9995  - Insufficient funds

3D Secure:
4000 0025 0000 3155  - Requires authentication
```

### 9. Switch to Live Mode (When Ready)

1. Complete Stripe account activation
2. Go to https://dashboard.stripe.com/apikeys
3. Toggle to "Live mode" (top right)
4. Get LIVE API keys (start with `pk_live_` and `sk_live_`)
5. Create webhook endpoint for production URL
6. Update `.env` with live keys
7. Test with real card (small amount first!)

### 10. Enable Additional Features (Optional)

#### Customer Portal
- Go to https://dashboard.stripe.com/settings/billing/portal
- Enable customer portal
- Customers can manage their purchases

#### Tax Collection
- Go to https://dashboard.stripe.com/settings/tax
- Enable automatic tax collection
- Stripe handles VAT/sales tax

#### Email Receipts
- Go to https://dashboard.stripe.com/settings/emails
- Enable "Successful payments"
- Customers get automatic receipts

---

## 🔐 Security Best Practices

- [ ] Never commit `.env` file to git
- [ ] Use test keys for development
- [ ] Verify webhook signatures (already implemented)
- [ ] Use HTTPS in production
- [ ] Keep secret keys secure
- [ ] Rotate keys if compromised

---

## 📊 Monitoring

### View Payments
- Dashboard: https://dashboard.stripe.com/payments
- See all transactions, refunds, disputes

### View Customers
- Dashboard: https://dashboard.stripe.com/customers
- See customer details and purchase history

### View Webhooks
- Dashboard: https://dashboard.stripe.com/webhooks
- See webhook events and delivery status

---

## 🆘 Troubleshooting

### Webhook not receiving events?
```bash
# Check webhook is running
stripe listen --forward-to localhost:3000/webhook

# Test webhook manually
stripe trigger checkout.session.completed
```

### Payment not completing?
- Check Stripe dashboard logs
- Verify webhook secret is correct
- Check backend server logs
- Ensure backend is running

### Can't find Price ID?
- Go to Products page
- Click on the product
- Price ID is shown under "Pricing"

---

## ✅ Verification Checklist

Before going live:

- [ ] Stripe account fully activated
- [ ] Products created with correct prices
- [ ] API keys copied to `.env`
- [ ] Webhook endpoint configured
- [ ] Test purchase completed successfully
- [ ] Email received with license key
- [ ] Download link works
- [ ] License key format correct

---

## 📞 Need Help?

- Stripe Docs: https://stripe.com/docs
- Stripe Support: https://support.stripe.com
- Test your integration: https://stripe.com/docs/testing

---

**Next**: Once Stripe is configured, proceed to Email Setup!
