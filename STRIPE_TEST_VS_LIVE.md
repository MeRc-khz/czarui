# Stripe Test Mode vs Live Mode

## 🎯 Understanding the Difference

### Live Mode (What You're Currently Using)
- **Real money** is charged
- **Real customers** make purchases
- Keys start with `sk_live_` and `pk_live_`
- Requires completed Stripe account activation
- **Your current setup**: Live mode products already created

### Test Mode (Recommended for Testing)
- **No real money** is charged
- **Test cards** work (4242 4242 4242 4242)
- Keys start with `sk_test_` and `pk_test_`
- No account activation needed
- Safe for development and testing

---

## 🔄 How to Switch to Test Mode

### Step 1: Toggle to Test Mode in Dashboard

1. Go to: https://dashboard.stripe.com
2. Look at the **top right corner**
3. You'll see a toggle: **"Test mode"** / **"Live mode"**
4. Click to switch to **Test mode**
5. The dashboard will reload in test mode

### Step 2: Get Test API Keys

1. Go to: https://dashboard.stripe.com/test/apikeys
2. Copy your test keys:
   - **Secret key**: `sk_test_...`
   - **Publishable key**: `pk_test_...`

### Step 3: Create Test Products

Since products are mode-specific, you need to create test versions:

1. Go to: https://dashboard.stripe.com/test/products
2. Click "Add product"

**Product 1: bzr-dial-ui Single License (Test)**
- Name: `bzr-dial-ui Single License (Test)`
- Description: `Test version - Full source code for 1 commercial project`
- Price: `$49.00 USD`
- Billing: `One time`
- Click "Save product"
- **Copy the Price ID** (starts with `price_`)

**Product 2: bzr-dial-ui Team License (Test)**
- Name: `bzr-dial-ui Team License (Test)`
- Description: `Test version - Full source code for unlimited projects`
- Price: `$149.00 USD`
- Billing: `One time`
- Click "Save product"
- **Copy the Price ID** (starts with `price_`)

### Step 4: Update Your .env File

Edit `backend/.env` and replace the live keys with test keys:

```env
# Stripe Configuration (TEST MODE)
STRIPE_SECRET_KEY=sk_test_YOUR_TEST_SECRET_KEY
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_TEST_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_TEST_WEBHOOK_SECRET

# Test Price IDs
STRIPE_PRICE_SINGLE=price_YOUR_TEST_SINGLE_PRICE_ID
STRIPE_PRICE_TEAM=price_YOUR_TEST_TEAM_PRICE_ID
```

### Step 5: Update Webhook

Your webhook forwarding needs to use the test webhook secret:

1. Stop the current `stripe listen` command (Ctrl+C)
2. Make sure you're in test mode: `stripe listen --forward-to localhost:3000/webhook`
3. Copy the new webhook secret (it will be different)
4. Update `STRIPE_WEBHOOK_SECRET` in `.env`

### Step 6: Restart Backend

```bash
# Stop current backend (Ctrl+C in that terminal)
cd backend && npm start
```

---

## 📊 Comparison Table

| Feature | Test Mode | Live Mode |
|---------|-----------|-----------|
| **Money** | Fake | Real |
| **API Keys** | `sk_test_...` | `sk_live_...` |
| **Test Cards** | ✅ Work | ❌ Don't work |
| **Real Cards** | ❌ Don't work | ✅ Work |
| **Products** | Separate | Separate |
| **Webhooks** | Separate | Separate |
| **Account Activation** | Not required | Required |
| **Dashboard URL** | `/test/...` | `/...` |

---

## 🧪 Test Cards (Test Mode Only)

### Success Cards
```
4242 4242 4242 4242  - Visa (default success)
5555 5555 5555 4444  - Mastercard
3782 822463 10005    - American Express
```

### Decline Cards
```
4000 0000 0000 0002  - Card declined
4000 0000 0000 9995  - Insufficient funds
4000 0000 0000 9987  - Lost card
```

### 3D Secure Cards
```
4000 0025 0000 3155  - Requires authentication
4000 0027 6000 3184  - Requires authentication (decline)
```

**Expiry**: Any future date (e.g., `12/34`)  
**CVC**: Any 3 digits (e.g., `123`)  
**ZIP**: Any 5 digits (e.g., `12345`)

---

## 🔐 Best Practices

### For Development
✅ **Use Test Mode**
- Safe testing
- No real money risk
- Unlimited test transactions
- Easy to reset

### For Production
✅ **Use Live Mode**
- Real customer payments
- Actual revenue
- Requires activation
- Monitor carefully

### Recommended Workflow

1. **Develop in Test Mode**
   - Build features
   - Test payment flow
   - Debug issues
   - Perfect the experience

2. **Final Testing in Test Mode**
   - Complete purchase flow
   - Email delivery
   - Download links
   - License generation

3. **Switch to Live Mode**
   - Update to live keys
   - Create live products
   - Set up live webhook
   - Monitor first transactions

4. **Keep Test Mode Available**
   - Test new features
   - Debug customer issues
   - Verify updates

---

## 🔄 Quick Switch Commands

### Switch to Test Mode
```bash
# 1. Update .env with test keys
nano backend/.env

# 2. Restart webhook listener
stripe listen --forward-to localhost:3000/webhook

# 3. Restart backend
cd backend && npm start
```

### Switch to Live Mode
```bash
# 1. Update .env with live keys
nano backend/.env

# 2. Restart webhook listener (or use production webhook)
stripe listen --forward-to localhost:3000/webhook

# 3. Restart backend
cd backend && npm start
```

---

## 📝 Checklist: Switching to Test Mode

- [ ] Toggle to Test Mode in Stripe Dashboard
- [ ] Get test API keys
- [ ] Create test products
- [ ] Copy test price IDs
- [ ] Update backend/.env with test keys
- [ ] Restart webhook listener
- [ ] Copy new webhook secret to .env
- [ ] Restart backend server
- [ ] Test with card 4242 4242 4242 4242
- [ ] Verify license generation
- [ ] Check email delivery

---

## 🆘 Troubleshooting

### "No such price"
- Make sure you created products in the correct mode
- Verify price IDs match the mode you're in
- Check .env has the right price IDs

### "Invalid API key"
- Ensure keys match the mode (test vs live)
- Check for typos in .env
- Verify you copied the entire key

### "Webhook signature verification failed"
- Webhook secret is mode-specific
- Restart `stripe listen` and copy new secret
- Update .env and restart backend

### Test card not working
- Make sure you're in Test Mode
- Use exact card number: 4242 4242 4242 4242
- Any future expiry date works

---

## 💡 Pro Tips

1. **Keep separate .env files**
   ```bash
   backend/.env.test    # Test mode keys
   backend/.env.live    # Live mode keys
   backend/.env         # Current active
   ```

2. **Use environment variable**
   ```bash
   # In .env
   NODE_ENV=test  # or production
   ```

3. **Document which mode you're in**
   ```bash
   # Add comment at top of .env
   # MODE: TEST
   # or
   # MODE: LIVE
   ```

4. **Test thoroughly before going live**
   - Complete 5-10 test purchases
   - Verify all emails
   - Check all download links
   - Test refund flow

---

## 🎯 Current Status

You are currently in: **LIVE MODE**

Your current .env has:
- Live API keys (`sk_live_...`)
- Live price IDs
- Live webhook secret

**Recommendation**: Switch to Test Mode for safer testing!

---

## 📞 Need Help?

- Stripe Test Mode Docs: https://stripe.com/docs/testing
- Test Cards: https://stripe.com/docs/testing#cards
- API Keys: https://dashboard.stripe.com/test/apikeys

---

**Ready to switch?** Run: `./switch-to-test-mode.sh`
