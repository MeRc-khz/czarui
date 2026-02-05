/**
 * License Key Generator for bzr-dial-ui
 * Generates and validates unique license keys
 */

const crypto = require('crypto');

class LicenseManager {
    constructor(secret) {
        this.secret = secret || process.env.LICENSE_SECRET || 'default-secret-change-me';
    }

    /**
     * Generate a unique license key
     * @param {string} email - Customer email
     * @param {string} type - License type (single, team, enterprise)
     * @returns {string} License key in format BZRD-XXXX-XXXX-XXXX-XXXX
     */
    generate(email, type) {
        const timestamp = Date.now();
        const data = `${email}:${type}:${timestamp}`;

        // Create HMAC hash
        const hash = crypto
            .createHmac('sha256', this.secret)
            .update(data)
            .digest('hex')
            .substring(0, 16)
            .toUpperCase();

        // Format as BZRD-XXXX-XXXX-XXXX-XXXX
        const formatted = hash.match(/.{1,4}/g).join('-');
        return `BZRD-${formatted}`;
    }

    /**
     * Validate license key format
     * @param {string} key - License key to validate
     * @returns {boolean} True if valid format
     */
    validateFormat(key) {
        const pattern = /^BZRD-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}$/;
        return pattern.test(key);
    }

    /**
     * Generate download token (short-lived)
     * @param {string} licenseKey - License key
     * @returns {string} Download token
     */
    generateDownloadToken(licenseKey) {
        const timestamp = Date.now();
        const expiresIn = 24 * 60 * 60 * 1000; // 24 hours
        const expiresAt = timestamp + expiresIn;

        const data = `${licenseKey}:${expiresAt}`;
        const hash = crypto
            .createHmac('sha256', this.secret)
            .update(data)
            .digest('hex');

        // Return token with expiry
        return Buffer.from(`${hash}:${expiresAt}`).toString('base64');
    }

    /**
     * Validate download token
     * @param {string} token - Download token
     * @param {string} licenseKey - License key
     * @returns {boolean} True if valid and not expired
     */
    validateDownloadToken(token, licenseKey) {
        try {
            const decoded = Buffer.from(token, 'base64').toString('utf-8');
            const [hash, expiresAt] = decoded.split(':');

            // Check expiry
            if (Date.now() > parseInt(expiresAt)) {
                return false;
            }

            // Verify hash
            const data = `${licenseKey}:${expiresAt}`;
            const expectedHash = crypto
                .createHmac('sha256', this.secret)
                .update(data)
                .digest('hex');

            return hash === expectedHash;
        } catch (error) {
            return false;
        }
    }

    /**
     * Create license object with metadata
     * @param {string} email - Customer email
     * @param {string} type - License type
     * @param {object} metadata - Additional metadata
     * @returns {object} License object
     */
    createLicense(email, type, metadata = {}) {
        const key = this.generate(email, type);
        const downloadToken = this.generateDownloadToken(key);

        return {
            key,
            email,
            type,
            createdAt: new Date().toISOString(),
            downloadToken,
            downloadUrl: `${process.env.DOWNLOAD_BASE_URL}/${key}?token=${downloadToken}`,
            metadata: {
                ...metadata,
                version: '1.0.0',
                product: 'bzr-dial-ui'
            }
        };
    }
}

module.exports = LicenseManager;
