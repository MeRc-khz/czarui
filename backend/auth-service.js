/**
 * Auth Service for bzr-dial-ui
 * License key → HMAC session token (no user accounts)
 */

const crypto = require('crypto');

class AuthService {
    constructor(secret) {
        this.secret = secret || process.env.LICENSE_SECRET || 'default-secret-change-me';
        this.sessionSecret = process.env.SESSION_SECRET || this.secret + '-session';
    }

    /**
     * Generate a session token from a validated license key
     * Token format: base64(hmac):base64(payload)
     * Payload: { key, email, type, exp }
     */
    generateSession(license) {
        const payload = {
            key: license.key,
            email: license.email,
            type: license.type,
            exp: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
        };

        const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64');
        const sig = crypto
            .createHmac('sha256', this.sessionSecret)
            .update(payloadB64)
            .digest('base64');

        return `${sig}.${payloadB64}`;
    }

    /**
     * Validate a session token
     * Returns the payload object if valid, null if invalid/expired
     */
    validateSession(token) {
        try {
            const [sig, payloadB64] = token.split('.');
            if (!sig || !payloadB64) return null;

            // Verify signature
            const expectedSig = crypto
                .createHmac('sha256', this.sessionSecret)
                .update(payloadB64)
                .digest('base64');

            if (sig !== expectedSig) return null;

            // Decode and check expiry
            const payload = JSON.parse(Buffer.from(payloadB64, 'base64').toString('utf-8'));
            if (Date.now() > payload.exp) return null;

            return payload;
        } catch (error) {
            return null;
        }
    }

    /**
     * Generate a cookie string for the session
     */
    sessionCookie(token) {
        return `bzar_session=${token}; Path=/; Max-Age=${30 * 24 * 60 * 60}; HttpOnly; SameSite=Strict`;
    }

    /**
     * Generate a clear-cookie string
     */
    clearSessionCookie() {
        return 'bzar_session=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict';
    }
}

module.exports = AuthService;
