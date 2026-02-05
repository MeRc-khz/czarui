/**
 * Email Service for bzr-dial-ui
 * Handles automated email delivery for licenses
 */

const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT),
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    /**
     * Send license delivery email
     * @param {object} license - License object
     * @returns {Promise} Email send result
     */
    async sendLicenseEmail(license) {
        const { email, key, type, downloadUrl } = license;

        const subject = '🎉 Your bzr-dial-ui License Key';
        const html = this.getLicenseEmailTemplate(license);

        try {
            const info = await this.transporter.sendMail({
                from: `"bzr-dial-ui" <${process.env.EMAIL_FROM}>`,
                to: email,
                subject,
                html
            });

            console.log('License email sent:', info.messageId);
            return info;
        } catch (error) {
            console.error('Email send error:', error);
            throw error;
        }
    }

    /**
     * Get license email HTML template
     * @param {object} license - License object
     * @returns {string} HTML email content
     */
    getLicenseEmailTemplate(license) {
        const { key, type, downloadUrl, email } = license;

        const licenseTypeNames = {
            single: 'Single License',
            team: 'Team License',
            enterprise: 'Enterprise License'
        };

        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #00ff9d 0%, #135bec 100%);
            color: white;
            padding: 40px 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            background: #f9f9f9;
            padding: 40px 30px;
            border-radius: 0 0 8px 8px;
        }
        .license-box {
            background: white;
            border: 2px solid #00ff9d;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
        }
        .license-key {
            font-family: 'Courier New', monospace;
            font-size: 24px;
            font-weight: bold;
            color: #135bec;
            letter-spacing: 2px;
            margin: 10px 0;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #00ff9d 0%, #135bec 100%);
            color: white;
            padding: 16px 32px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            margin: 20px 0;
        }
        .info-box {
            background: #e8f5ff;
            border-left: 4px solid #135bec;
            padding: 15px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            color: #666;
            font-size: 12px;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎉 Thank You for Your Purchase!</h1>
        <p>Your bzr-dial-ui license is ready</p>
    </div>
    
    <div class="content">
        <h2>Welcome to bzr-dial-ui!</h2>
        <p>Thank you for purchasing <strong>${licenseTypeNames[type]}</strong>. You're now ready to build stunning radial menus!</p>
        
        <div class="license-box">
            <h3>Your License Key</h3>
            <div class="license-key">${key}</div>
            <p style="color: #666; font-size: 14px;">Keep this key safe - you'll need it for updates</p>
        </div>
        
        <div style="text-align: center;">
            <a href="${downloadUrl}" class="button">Download bzr-dial-ui</a>
        </div>
        
        <div class="info-box">
            <h4>📦 What's Included:</h4>
            <ul>
                <li>Full source code (unminified)</li>
                <li>Complete documentation</li>
                <li>Working examples</li>
                <li>Lifetime updates</li>
                <li>${type === 'team' ? 'Priority support' : 'Email support'}</li>
            </ul>
        </div>
        
        <h3>Getting Started</h3>
        <ol>
            <li>Download the package using the button above</li>
            <li>Extract the ZIP file</li>
            <li>Read the README.md for quick start guide</li>
            <li>Check out the examples folder</li>
        </ol>
        
        <div class="info-box">
            <h4>💡 Quick Start:</h4>
            <pre style="background: white; padding: 15px; border-radius: 4px; overflow-x: auto;">
&lt;script src="bzr-dial.js"&gt;&lt;/script&gt;

&lt;bzr-dial license="${key}"&gt;
  &lt;bzr-item label="Home" icon="🏠"&gt;&lt;/bzr-item&gt;
  &lt;bzr-item label="About" icon="ℹ️"&gt;&lt;/bzr-item&gt;
&lt;/bzr-dial&gt;
            </pre>
        </div>
        
        <h3>Need Help?</h3>
        <p>We're here to help! If you have any questions:</p>
        <ul>
            <li>📧 Email: <a href="mailto:support@bzzrr.link">support@bzzrr.link</a></li>
            <li>📚 Documentation: <a href="https://bzzrr.link/docs">bzzrr.link/docs</a></li>
            <li>💬 Community: <a href="https://bzzrr.link/community">bzzrr.link/community</a></li>
        </ul>
        
        <p style="margin-top: 30px;">Happy coding! 🚀</p>
        <p><strong>The bzr-dial-ui Team</strong></p>
    </div>
    
    <div class="footer">
        <p>This email was sent to ${email}</p>
        <p>© 2026 bzzrr.link. All rights reserved.</p>
        <p>Download link expires in 24 hours. Your license key never expires.</p>
    </div>
</body>
</html>
        `;
    }

    /**
     * Send support email
     * @param {string} to - Recipient email
     * @param {string} subject - Email subject
     * @param {string} message - Email message
     */
    async sendSupportEmail(to, subject, message) {
        try {
            const info = await this.transporter.sendMail({
                from: `"bzr-dial-ui Support" <${process.env.EMAIL_FROM}>`,
                to,
                subject,
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2>${subject}</h2>
                        <p>${message}</p>
                        <hr>
                        <p style="color: #666; font-size: 12px;">
                            Need help? Reply to this email or contact support@bzzrr.link
                        </p>
                    </div>
                `
            });

            console.log('Support email sent:', info.messageId);
            return info;
        } catch (error) {
            console.error('Support email error:', error);
            throw error;
        }
    }
}

module.exports = EmailService;
