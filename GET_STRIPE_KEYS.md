# 🔑 Quick Guide: Get Your Stripe API Keys

## You Have 2 Options:

### Option 1: Interactive Script (Easiest)

Run this command in your terminal:

```bash
cd backend
./setup-keys.sh
```

This will:
1. Open Stripe Dashboard automatically
2. Guide you through copying each key
3. Update your .env file automatically
4. Tell you what to do next

---

### Option 2: Manual Setup (If script doesn't work)

#### Step 1: Get Your Keys

1. **Open Stripe Dashboard**
   - Go to: https://dashboard.stripe.com/apikeys
   - Make sure you're in the correct mode (Test or Live)

2. **Copy Secret Key**
   - Find "Secret key" section
   - Click "Reveal live key token" (or "Reveal test key")
   - Copy the key (starts with `sk_live_` or `sk_test_`)

3. **Copy Publishable Key**
   - Find "Publishable key" section  
   - Copy the key (starts with `pk_live_` or `pk_test_`)

#### Step 2: Update .env File

Edit `backend/.env`:

```bash
nano backend/.env
```

Replace these lines:

```env
STRIPE_SECRET_KEY=sk_live_YOUR_ACTUAL_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_ACTUAL_KEY_HERE
```

Save and exit (Ctrl+X, then Y, then Enter)

#### Step 3: Set Up Webhook (For Testing)

In a **new terminal**:

```bash
# Install Stripe CLI (if not already installed)
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks
stripe listen --forward-to localhost:3000/webhook
```

This will output a webhook secret like: `whsec_abc123...`

Copy it and add to `backend/.env`:

```env
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE
```

#### Step 4: Restart Backend

Stop the current backend (Ctrl+C) and restart:

```bash
cd backend
npm start
```

---

## 🎯 What Each Key Does

| Key | Purpose | Example |
|-----|---------|---------|
| **Secret Key** | Backend API calls, creates charges | `sk_live_51ABC...` |
| **Publishable Key** | Frontend (not used in our setup) | `pk_live_51XYZ...` |
| **Webhook Secret** | Verify webhook authenticity | `whsec_123...` |

---

## ⚠️ Important Notes

### Test vs Live Mode

- **Test Mode**: Use for testing, no real money
  - Keys start with `sk_test_` and `pk_test_`
  - Use test card: `4242 4242 4242 4242`
  
- **Live Mode**: Real customers, real money
  - Keys start with `sk_live_` and `pk_live_`
  - Requires completed Stripe activation

### Your Products (Already Created)

You already have these products in **LIVE mode**:
- Single License: $49 (price_1SxGKiISgRmTCqkwbPs8XSmZ)
- Team License: $149 (price_1SxGKqISgRmTCqkwV3b1r7dg)

If you want to test first, create test versions in Test Mode.

---

## 🧪 Testing After Setup

1. **Open landing page**: http://localhost:8000/landing/index.html
2. **Click "Get bzr-dial-ui"**
3. **Use test card**: 4242 4242 4242 4242
4. **Check terminal** for webhook events
5. **Check email** for license key (if email configured)

---

## 🆘 Troubleshooting

**"Invalid API key"**
- Make sure you copied the entire key
- Check for extra spaces
- Verify you're using the right mode (test vs live)

**"Webhook signature verification failed"**
- Make sure `stripe listen` is running
- Copy the webhook secret from the terminal output
- Restart backend after updating .env

**"No such price"**
- Verify price IDs in .env match your Stripe products
- Check you're in the right mode (test vs live)

---

## ✅ Quick Checklist

- [ ] Stripe Dashboard opened
- [ ] Secret key copied
- [ ] Publishable key copied
- [ ] Keys added to backend/.env
- [ ] Webhook secret obtained (optional for testing)
- [ ] Backend restarted
- [ ] Test purchase attempted

---

**Ready?** Run: `cd backend && ./setup-keys.sh`

Or manually get your keys from: https://dashboard.stripe.com/apikeys
