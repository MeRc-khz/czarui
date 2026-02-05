#!/bin/bash

# Package bzr-dial-ui for distribution
# This creates a ZIP file that customers will download

VERSION="1.0.0"
PACKAGE_NAME="bzr-dial-ui-v${VERSION}"
TEMP_DIR="/tmp/${PACKAGE_NAME}"
OUTPUT_DIR="backend/packages"

echo "📦 Creating bzr-dial-ui package v${VERSION}..."
echo ""

# Clean up any existing temp directory
rm -rf "${TEMP_DIR}"

# Create temp directory structure
mkdir -p "${TEMP_DIR}"
mkdir -p "${TEMP_DIR}/examples"
mkdir -p "${TEMP_DIR}/docs"

echo "📋 Copying files..."

# Copy main component
if [ -f "components/lz-dial.js" ]; then
    cp components/lz-dial.js "${TEMP_DIR}/bzr-dial.js"
    echo "  ✅ bzr-dial.js"
else
    echo "  ⚠️  lz-dial.js not found, creating placeholder"
    echo "// bzr-dial.js - Premium Web Component" > "${TEMP_DIR}/bzr-dial.js"
fi

# Copy examples
if [ -d "components" ]; then
    cp components/*.html "${TEMP_DIR}/examples/" 2>/dev/null || true
    echo "  ✅ Examples"
fi

# Create README
cat > "${TEMP_DIR}/README.md" << 'EOF'
# bzr-dial-ui v1.0.0

Thank you for purchasing bzr-dial-ui! 🎉

## Quick Start

1. Include the component in your HTML:
```html
<script src="bzr-dial.js"></script>
```

2. Use it in your page:
```html
<bzr-dial 
    size="300"
    color="#00ff9d"
    data-title="My Dial">
</bzr-dial>
```

## Documentation

Full documentation available at: https://bzzrr.link/docs

## Support

- Email: support@bzzrr.link
- Documentation: https://bzzrr.link/docs
- Updates: You'll receive email notifications

## License

This is a commercial license. See LICENSE.txt for details.

Your license key: [Included in your purchase email]

---

Built with ❤️ by bzr-dial-ui
EOF

echo "  ✅ README.md"

# Create LICENSE
cat > "${TEMP_DIR}/LICENSE.txt" << 'EOF'
bzr-dial-ui Commercial License

Copyright (c) 2026 bzr-dial-ui

TERMS AND CONDITIONS

1. LICENSE GRANT
   This license grants you the right to use bzr-dial-ui in your projects
   according to the license type you purchased:
   
   - Single License: 1 commercial project
   - Team License: Unlimited projects, up to 10 developers
   - Enterprise License: Custom terms

2. PERMITTED USE
   - Use in commercial and personal projects
   - Modify the code for your needs
   - Include in client projects

3. RESTRICTIONS
   - No redistribution or resale
   - No use in competing products
   - No sharing of license key

4. UPDATES
   - Lifetime updates included
   - Email notifications for new versions

5. SUPPORT
   - Email support included
   - Priority support for Team/Enterprise

6. WARRANTY
   - 30-day money-back guarantee
   - Provided "as is" without warranty

For questions: support@bzzrr.link
EOF

echo "  ✅ LICENSE.txt"

# Create CHANGELOG
cat > "${TEMP_DIR}/CHANGELOG.md" << 'EOF'
# Changelog

## v1.0.0 (2026-02-05)

### Initial Release

- Premium dial component
- Full customization options
- Media support (images, video, audio)
- Physics-based interactions
- Responsive design
- Cross-browser compatible

---

For updates, check your email or visit: https://bzzrr.link
EOF

echo "  ✅ CHANGELOG.md"

# Create ZIP
echo ""
echo "🗜️  Creating ZIP archive..."

cd /tmp
zip -r "${PACKAGE_NAME}.zip" "${PACKAGE_NAME}" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    # Move to output directory
    mkdir -p "${OLDPWD}/${OUTPUT_DIR}"
    mv "${PACKAGE_NAME}.zip" "${OLDPWD}/${OUTPUT_DIR}/"
    
    # Get file size
    SIZE=$(du -h "${OLDPWD}/${OUTPUT_DIR}/${PACKAGE_NAME}.zip" | cut -f1)
    
    echo "✅ Package created successfully!"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📦 Package Details"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  Name: ${PACKAGE_NAME}.zip"
    echo "  Size: ${SIZE}"
    echo "  Location: ${OUTPUT_DIR}/${PACKAGE_NAME}.zip"
    echo ""
    echo "Contents:"
    unzip -l "${OLDPWD}/${OUTPUT_DIR}/${PACKAGE_NAME}.zip" | tail -n +4 | head -n -2
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
else
    echo "❌ Failed to create ZIP archive"
    exit 1
fi

# Cleanup
rm -rf "${TEMP_DIR}"

echo ""
echo "✨ Ready for distribution!"
echo ""
echo "Customers will download this file after purchase."
