# Quick Reference: Stripe Setup

## 🚀 5-Minute Setup

### 1. Get Your Keys (2 min)

```bash
# Go to: https://dashboard.stripe.com/apikeys

Publishable key: pk_test_51ABC...
Secret key:      sk_test_51XYZ...
```

### 2. Create Products (2 min)

```bash
# Go to: https://dashboard.stripe.com/products

Product 1: bzr-dial-ui Single License - $49
→ Copy Price ID: price_1ABC...

Product 2: bzr-dial-ui Team License - $149
→ Copy Price ID: price_2XYZ...
```

### 3. Setup Webhook (1 min)

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks (keep running)
stripe listen --forward-to localhost:3000/webhook

→ Copy Webhook Secret: whsec_...
```

### 4. Configure .env

```bash
cd backend
cp .env.example .env
nano .env  # or your favorite editor
```

Paste your keys:
```env
STRIPE_SECRET_KEY=sk_test_YOUR_KEY
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET
STRIPE_PRICE_SINGLE=price_YOUR_SINGLE_ID
STRIPE_PRICE_TEAM=price_YOUR_TEAM_ID
```

### 5. Test It!

```bash
# Terminal 1: Backend
cd backend && npm install && npm start

# Terminal 2: Webhook
stripe listen --forward-to localhost:3000/webhook

# Terminal 3: Frontend
python3 -m http.server 8000

# Browser: http://localhost:8000/landing/index.html
# Use test card: 4242 4242 4242 4242
```

---

## 🧪 Test Cards

| Card Number         | Result              |
|---------------------|---------------------|
| 4242 4242 4242 4242 | ✅ Success          |
| 4000 0000 0000 0002 | ❌ Declined         |
| 4000 0025 0000 3155 | 🔐 Requires 3D Sec  |

**Expiry**: Any future date (e.g., 12/34)  
**CVC**: Any 3 digits (e.g., 123)  
**ZIP**: Any 5 digits (e.g., 12345)

---

## 📋 Checklist

- [ ] Stripe account created
- [ ] API keys copied
- [ ] Products created
- [ ] Price IDs copied
- [ ] Webhook configured
- [ ] .env file updated
- [ ] Backend running
- [ ] Webhook listener running
- [ ] Test purchase successful
- [ ] Email received

---

## 🔗 Quick Links

- **Dashboard**: https://dashboard.stripe.com
- **API Keys**: https://dashboard.stripe.com/apikeys
- **Products**: https://dashboard.stripe.com/products
- **Webhooks**: https://dashboard.stripe.com/webhooks
- **Payments**: https://dashboard.stripe.com/payments
- **Docs**: https://stripe.com/docs

---

## 🆘 Common Issues

**"Webhook signature verification failed"**
→ Check `STRIPE_WEBHOOK_SECRET` matches Stripe CLI output

**"No such price"**
→ Verify `STRIPE_PRICE_SINGLE` and `STRIPE_PRICE_TEAM` are correct

**"Cannot connect to backend"**
→ Ensure backend is running on port 3000

**"Email not received"**
→ Check email configuration in .env (see EMAIL_SETUP.md)

---

## 🎯 What Each Key Does

| Key | Purpose | Example |
|-----|---------|---------|
| `STRIPE_SECRET_KEY` | Backend API calls | `sk_test_51...` |
| `STRIPE_PUBLISHABLE_KEY` | Frontend (not used in our setup) | `pk_test_51...` |
| `STRIPE_WEBHOOK_SECRET` | Verify webhook authenticity | `whsec_...` |
| `STRIPE_PRICE_SINGLE` | $49 product | `price_1...` |
| `STRIPE_PRICE_TEAM` | $149 product | `price_2...` |

---

## 🔄 Development Workflow

```bash
# Every time you develop:

# Terminal 1
cd backend && npm start

# Terminal 2
stripe listen --forward-to localhost:3000/webhook

# Terminal 3
python3 -m http.server 8000

# Browser
http://localhost:8000/landing/index.html
```

---

## 🚀 Going Live

When ready for real customers:

1. Complete Stripe activation
2. Switch to "Live mode" in dashboard
3. Get live API keys (`pk_live_`, `sk_live_`)
4. Create production webhook endpoint
5. Update `.env` with live keys
6. Deploy backend to production
7. Update `FRONTEND_URL` in .env
8. Test with small real purchase first!

---

**Need detailed help?** See `STRIPE_SETUP.md`
