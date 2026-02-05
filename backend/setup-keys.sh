#!/bin/bash

# Stripe API Key Setup Helper
# This script helps you add your Stripe keys to .env

echo "🔑 Stripe API Key Setup"
echo "======================="
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found"
    echo "Please run this from the backend directory"
    exit 1
fi

echo "Your Stripe products are already created:"
echo "  ✅ Single License: $49 (price_1SxGKiISgRmTCqkwbPs8XSmZ)"
echo "  ✅ Team License: $149 (price_1SxGKqISgRmTCqkwV3b1r7dg)"
echo ""

echo "📝 You need to get 3 keys from Stripe Dashboard:"
echo ""
echo "1️⃣  SECRET KEY (sk_live_...)"
echo "2️⃣  PUBLISHABLE KEY (pk_live_...)"
echo "3️⃣  WEBHOOK SECRET (whsec_...)"
echo ""

# Function to update .env
update_env() {
    local key=$1
    local value=$2
    
    if grep -q "^${key}=" .env; then
        # Key exists, update it
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "s|^${key}=.*|${key}=${value}|" .env
        else
            sed -i "s|^${key}=.*|${key}=${value}|" .env
        fi
    else
        # Key doesn't exist, add it
        echo "${key}=${value}" >> .env
    fi
}

# Get Secret Key
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 1: Get your SECRET KEY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Opening Stripe Dashboard..."
echo "   URL: https://dashboard.stripe.com/apikeys"
echo ""
echo "2. Look for 'Secret key' section"
echo "3. Click 'Reveal live key token'"
echo "4. Copy the key (starts with sk_live_)"
echo ""

# Try to open browser
if command -v xdg-open &> /dev/null; then
    xdg-open "https://dashboard.stripe.com/apikeys" 2>/dev/null &
elif command -v open &> /dev/null; then
    open "https://dashboard.stripe.com/apikeys" 2>/dev/null &
fi

read -p "Paste your SECRET KEY here: " secret_key

if [[ $secret_key == sk_live_* ]] || [[ $secret_key == sk_test_* ]]; then
    update_env "STRIPE_SECRET_KEY" "$secret_key"
    echo "✅ Secret key saved!"
else
    echo "⚠️  Warning: Key doesn't start with sk_live_ or sk_test_"
    read -p "Save anyway? (y/n): " confirm
    if [[ $confirm == "y" ]]; then
        update_env "STRIPE_SECRET_KEY" "$secret_key"
        echo "✅ Secret key saved!"
    fi
fi

echo ""

# Get Publishable Key
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 2: Get your PUBLISHABLE KEY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. On the same page, look for 'Publishable key'"
echo "2. Copy the key (starts with pk_live_)"
echo ""

read -p "Paste your PUBLISHABLE KEY here: " pub_key

if [[ $pub_key == pk_live_* ]] || [[ $pub_key == pk_test_* ]]; then
    update_env "STRIPE_PUBLISHABLE_KEY" "$pub_key"
    echo "✅ Publishable key saved!"
else
    echo "⚠️  Warning: Key doesn't start with pk_live_ or pk_test_"
    read -p "Save anyway? (y/n): " confirm
    if [[ $confirm == "y" ]]; then
        update_env "STRIPE_PUBLISHABLE_KEY" "$pub_key"
        echo "✅ Publishable key saved!"
    fi
fi

echo ""

# Webhook setup
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 3: Set up WEBHOOK (for local testing)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "For local testing, use Stripe CLI:"
echo ""
echo "Run this command in a NEW terminal:"
echo "  stripe listen --forward-to localhost:3000/webhook"
echo ""
echo "It will output a webhook secret (whsec_...)"
echo ""

read -p "Paste your WEBHOOK SECRET here (or press Enter to skip): " webhook_secret

if [[ ! -z "$webhook_secret" ]]; then
    if [[ $webhook_secret == whsec_* ]]; then
        update_env "STRIPE_WEBHOOK_SECRET" "$webhook_secret"
        echo "✅ Webhook secret saved!"
    else
        echo "⚠️  Warning: Secret doesn't start with whsec_"
        read -p "Save anyway? (y/n): " confirm
        if [[ $confirm == "y" ]]; then
            update_env "STRIPE_WEBHOOK_SECRET" "$webhook_secret"
            echo "✅ Webhook secret saved!"
        fi
    fi
else
    echo "⏭️  Skipped webhook setup (you can add it later)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Your .env file has been updated with:"
if [[ ! -z "$secret_key" ]]; then
    echo "  ✅ STRIPE_SECRET_KEY"
fi
if [[ ! -z "$pub_key" ]]; then
    echo "  ✅ STRIPE_PUBLISHABLE_KEY"
fi
if [[ ! -z "$webhook_secret" ]]; then
    echo "  ✅ STRIPE_WEBHOOK_SECRET"
fi
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Restart your backend server:"
echo "   cd backend && npm start"
echo ""
echo "2. If you set up webhook, run in another terminal:"
echo "   stripe listen --forward-to localhost:3000/webhook"
echo ""
echo "3. Test a purchase:"
echo "   Open: http://localhost:8000/landing/index.html"
echo "   Use test card: 4242 4242 4242 4242"
echo ""
echo "🎉 You're ready to test!"
