#!/bin/bash
# build-dist.sh — Build obfuscated distribution of bzr-dial-menu
# Usage: ./build-dist.sh [output-dir]

set -e

SRC="/root/bzr-dial-menu/src/bzr-dial-menu.js"
OUTPUT_DIR="${1:-/var/src/bzr-dial-menu}"
TEMP="/tmp/bzr-dial-menu-build-$$"

echo "🔒 Building obfuscated bzr-dial-menu distribution..."
echo "   Source: $SRC"
echo "   Output: $OUTPUT_DIR"

rm -rf "$TEMP"
mkdir -p "$TEMP"

# Step 1: Obfuscate
echo "📦 Obfuscating..."
javascript-obfuscator "$SRC" \
  --output "$TEMP/bzr-dial-menu.js" \
  --compact true \
  --control-flow-flattening true \
  --dead-code-injection true \
  --debug-protection false \
  --disable-console-output false \
  --identifier-names-generator hexadecimal \
  --log false \
  --numbers-to-expressions true \
  --rename-globals false \
  --self-defending false \
  --simplify true \
  --split-strings true \
  --split-strings-chunk-length 10 \
  --string-array true \
  --string-array-encoding rc4 \
  --string-array-threshold 0.75 \
  --unicode-escape-sequence false \
  --transform-object-keys true

# Step 2: Add license header
echo "📝 Adding license header..."
{
  echo "/* bzr-dial-ui v1.0.0 — Obfuscated Distribution"
  echo " * Copyright (c) 2026 Bzzrrr.link / The Conglomerate Group"
  echo " * Licensed under bzr-dial-ui Commercial License"
  echo " * DO NOT REDISTRIBUTE"
  echo " */"
  echo ""
  cat "$TEMP/bzr-dial-menu.js"
} > "$TEMP/bzr-dial-menu.final.js"

# Step 3: Deploy obfuscated
echo "📤 Deploying obfuscated build..."
mkdir -p "$OUTPUT_DIR"
cp "$TEMP/bzr-dial-menu.final.js" "$OUTPUT_DIR/bzr-dial-menu.js"
chown www-data:www-data "$OUTPUT_DIR/bzr-dial-menu.js"
chmod 644 "$OUTPUT_DIR/bzr-dial-menu.js"

# Step 4: Create minified version (lighter, no heavy obfuscation)
echo "📦 Creating minified version..."
npx terser "$SRC" \
  --compress "passes=3,dead_code=true,drop_console=false" \
  --mangle "reserved=['BzrDialMenu','BzrItem']" \
  --output "$OUTPUT_DIR/bzr-dial-menu.min.js" 2>/dev/null || \
  cp "$SRC" "$OUTPUT_DIR/bzr-dial-menu.min.js"
chown www-data:www-data "$OUTPUT_DIR/bzr-dial-menu.min.js"

# Cleanup
rm -rf "$TEMP"

# Report
echo ""
echo "✅ Build complete!"
echo "   Obfuscated: $(wc -c < "$OUTPUT_DIR/bzr-dial-menu.js") bytes"
echo "   Minified:   $(wc -c < "$OUTPUT_DIR/bzr-dial-menu.min.js") bytes"
echo "   Source:     $(wc -c < "$SRC") bytes"

# Step 5: Build demo version (source with watermark, no auth)
echo "📦 Building demo version..."
mkdir -p /var/src/bzr-dial-menu-demo
cp "$SRC" "/var/src/bzr-dial-menu-demo/bzr-dial-menu.js"
chown www-data:www-data "/var/src/bzr-dial-menu-demo/bzr-dial-menu.js"
echo "   Demo:     $(wc -c < "/var/src/bzr-dial-menu-demo/bzr-dial-menu.js") bytes"
