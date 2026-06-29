# ✅ Stripe Products Created Successfully!

## Your Stripe Configuration

### Products Created

1. **bzr-dial-ui Single License** - $49
   - Product ID: `prod_Tv6XyBuRAlePlz`
   - Price ID: `price_1SxGKiISgRmTCqkwbPs8XSmZ`
   - Amount: $49.00 USD

2. **bzr-dial-ui Team License** - $149
   - Product ID: `prod_Tv6XO44Rzsji2q`
   - Price ID: `price_1SxGKqISgRmTCqkwV3b1r7dg`
   - Amount: $149.00 USD

---

## ⚠️ IMPORTANT: You're in LIVE MODE

I noticed these products were created in **LIVE mode** (livemode: true). This means:

- ✅ Ready for real customers
- ⚠️ Real money will be charged
- ⚠️ You need to complete Stripe account activation

### For Testing First

If you want to test before going live, you should:

1. Switch to **Test Mode** in Stripe Dashboard (toggle in top right)
2. Create test products with test price IDs
3. Use test API keys (`sk_test_...` and `pk_test_...`)
4. Use test cards like `4242 4242 4242 4242`

---

## 📝 Update Your .env File

Copy this to your `backend/.env` file:

```env
# Stripe Configuration
STRIPE_PRICE_SINGLE=price_1SxGKiISgRmTCqkwbPs8XSmZ
STRIPE_PRICE_TEAM=price_1SxGKqISgRmTCqkwV3b1r7dg

# You still need to add:
# STRIPE_SECRET_KEY=sk_live_YOUR_SECRET_KEY (get from dashboard)
# STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_PUBLISHABLE_KEY (get from dashboard)
# STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET (create webhook endpoint)

# Server Configuration
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.com

# License Secret (generate random string)
LICENSE_SECRET=your-super-secret-random-string-change-this

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=sales@bzzrr.link

# Download Configuration
DOWNLOAD_BASE_URL=https://your-backend-url.com/download
PACKAGE_FILE_PATH=./packages/bzr-dial-ui-v1.0.0.zip
```

---

## 🔑 Next Steps

### 1. Get Your API Keys

Go to: https://dashboard.stripe.com/apikeys

You'll see:
- **Publishable key**: `pk_live_...` (safe to use in frontend)
- **Secret key**: `sk_live_...` (keep secret, backend only)

Click "Reveal live key token" to see the secret key.

### 2. Set Up Webhook

Go to: https://dashboard.stripe.com/webhooks

1. Click "Add endpoint"
2. Endpoint URL: `https://your-backend-url.com/webhook`
3. Events to send: Select `checkout.session.completed`
4. Click "Add endpoint"
5. Copy the **Signing secret** (starts with `whsec_...`)

### 3. Complete Account Activation

If you haven't already:
1. Go to: https://dashboard.stripe.com/account/onboarding
2. Complete business information
3. Add bank account for payouts
4. Verify identity

### 4. Update .env File

Add the keys you just got to `backend/.env`

### 5. Test Your Setup

```bash
# Install dependencies
cd backend
npm install

# Start server
npm start

# In another terminal, start frontend
cd ..
python3 -m http.server 8000

# Visit: http://localhost:8000/landing/index.html
```

---

## 🧪 Testing vs Production

### For Testing (Recommended First)

1. Switch to Test Mode in Stripe Dashboard
2. Create test versions of products
3. Use test API keys
4. Use test card: `4242 4242 4242 4242`

### For Production (When Ready)

1. Use the live products created above
2. Use live API keys
3. Complete Stripe activation
4. Test with small real purchase first

---

## 📊 View Your Products

Dashboard: https://dashboard.stripe.com/products

You should see:
- bzr-dial-ui Single License ($49)
- bzr-dial-ui Team License ($149)

---

## ✅ What's Done

- ✅ Products created in Stripe
- ✅ Prices set ($49 and $149)
- ✅ Price IDs ready for backend

## 🔲 What's Left

- [ ] Get API keys from dashboard
- [ ] Set up webhook endpoint
- [ ] Configure .env file
- [ ] Set up email service
- [ ] Test the flow
- [ ] Deploy to production

---

**Next**: Get your API keys from https://dashboard.stripe.com/apikeys
