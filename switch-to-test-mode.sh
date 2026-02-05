#!/bin/bash

# Create Test Products in Stripe
# This script uses Stripe MCP to create test mode products

echo "🧪 Creating Test Mode Products"
echo "================================"
echo ""
echo "This will create test versions of your products."
echo "Make sure you're in TEST MODE in Stripe Dashboard!"
echo ""
read -p "Press Enter to continue..."

echo ""
echo "You can create test products by:"
echo ""
echo "1. Switch to Test Mode in Stripe Dashboard (toggle top right)"
echo "2. Go to: https://dashboard.stripe.com/test/products"
echo "3. Create these products:"
echo ""
echo "   Product 1: bzr-dial-ui Single License (Test)"
echo "   - Price: $49.00"
echo "   - One-time payment"
echo "   - Copy the Price ID (price_...)"
echo ""
echo "   Product 2: bzr-dial-ui Team License (Test)"
echo "   - Price: $149.00"
echo "   - One-time payment"
echo "   - Copy the Price ID (price_...)"
echo ""
echo "4. Update backend/.env with test keys and price IDs"
echo ""

read -p "Open Stripe Dashboard now? (y/n): " open_dash

if [[ $open_dash == "y" ]]; then
    if command -v xdg-open &> /dev/null; then
        xdg-open "https://dashboard.stripe.com/test/products" 2>/dev/null &
    elif command -v open &> /dev/null; then
        open "https://dashboard.stripe.com/test/products" 2>/dev/null &
    else
        echo "Please open: https://dashboard.stripe.com/test/products"
    fi
fi

echo ""
echo "After creating test products, update your .env file:"
echo ""
echo "STRIPE_SECRET_KEY=sk_test_YOUR_TEST_KEY"
echo "STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_TEST_KEY"
echo "STRIPE_WEBHOOK_SECRET=whsec_YOUR_TEST_WEBHOOK_SECRET"
echo "STRIPE_PRICE_SINGLE=price_YOUR_TEST_SINGLE_PRICE_ID"
echo "STRIPE_PRICE_TEAM=price_YOUR_TEST_TEAM_PRICE_ID"
echo ""
echo "Then restart your backend server."
