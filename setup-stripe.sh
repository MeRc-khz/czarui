#!/bin/bash

# bzr-dial-ui Quick Setup Script
# This script helps you complete the Stripe setup

echo "🚀 bzr-dial-ui Stripe Setup"
echo "=============================="
echo ""

# Check if we're in the right directory
if [ ! -f "backend/.env" ]; then
    echo "❌ Error: Please run this from the czarui directory"
    exit 1
fi

echo "✅ Stripe products created:"
echo "   - Single License: $49 (price_1SxGKiISgRmTCqkwbPs8XSmZ)"
echo "   - Team License: $149 (price_1SxGKqISgRmTCqkwV3b1r7dg)"
echo ""

echo "📝 Next steps to complete setup:"
echo ""
echo "1️⃣  Get your Stripe API keys:"
echo "   → Open: https://dashboard.stripe.com/apikeys"
echo "   → Copy Publishable key (pk_live_...)"
echo "   → Copy Secret key (sk_live_...)"
echo ""

echo "2️⃣  Set up webhook:"
echo "   → Open: https://dashboard.stripe.com/webhooks"
echo "   → Click 'Add endpoint'"
echo "   → URL: https://your-backend-url.com/webhook"
echo "   → Events: checkout.session.completed"
echo "   → Copy Signing secret (whsec_...)"
echo ""

echo "3️⃣  Update backend/.env file:"
echo "   → Add your Stripe API keys"
echo "   → Add webhook secret"
echo "   → Configure email settings"
echo ""

echo "4️⃣  Install dependencies:"
echo "   cd backend && npm install"
echo ""

echo "5️⃣  Test locally:"
echo "   Terminal 1: cd backend && npm start"
echo "   Terminal 2: python3 -m http.server 8000"
echo "   Browser: http://localhost:8000/landing/index.html"
echo ""

echo "📚 Documentation:"
echo "   - STRIPE_CONFIG.md - Your Stripe setup summary"
echo "   - STRIPE_SETUP.md - Detailed setup guide"
echo "   - EMAIL_SETUP.md - Email configuration"
echo "   - START_HERE.md - Complete guide"
echo ""

read -p "Press Enter to open Stripe dashboard..."
open "https://dashboard.stripe.com/apikeys" 2>/dev/null || xdg-open "https://dashboard.stripe.com/apikeys" 2>/dev/null || echo "Please open: https://dashboard.stripe.com/apikeys"

echo ""
echo "✨ Happy selling!"
