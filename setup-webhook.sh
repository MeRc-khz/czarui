#!/bin/bash

# Stripe Webhook Setup Script
# This script helps you set up webhook forwarding for local testing

echo "🔗 Stripe Webhook Setup"
echo "======================="
echo ""

# Add stripe to PATH
export PATH="$HOME/.local/bin:$PATH"

# Check if stripe is installed
if ! command -v stripe &> /dev/null; then
    echo "❌ Stripe CLI not found in PATH"
    echo "Please run: export PATH=\"\$HOME/.local/bin:\$PATH\""
    exit 1
fi

echo "✅ Stripe CLI installed: $(stripe --version)"
echo ""

# Check if logged in
echo "📝 Step 1: Login to Stripe"
echo ""
echo "This will open your browser to authorize the CLI."
read -p "Press Enter to login..."

stripe login

if [ $? -ne 0 ]; then
    echo "❌ Login failed"
    exit 1
fi

echo ""
echo "✅ Logged in successfully!"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📡 Step 2: Start Webhook Forwarding"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "This will forward Stripe webhooks to your local server."
echo "Keep this terminal open while testing!"
echo ""
echo "⚠️  IMPORTANT: Copy the webhook secret (whsec_...) that appears"
echo "   and add it to backend/.env"
echo ""
read -p "Press Enter to start forwarding..."

echo ""
echo "🚀 Starting webhook forwarding..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start forwarding
stripe listen --forward-to localhost:3000/webhook
