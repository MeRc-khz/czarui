# Email Setup Guide for bzr-dial-ui

## 📧 Email Service Configuration

Your backend needs to send emails with license keys. Here are your options:

---

## Option 1: Gmail (Easiest for Testing)

### Prerequisites
- Gmail account
- 2-Factor Authentication enabled

### Step-by-Step Setup

1. **Enable 2-Factor Authentication**
   - Go to https://myaccount.google.com/security
   - Under "Signing in to Google", click "2-Step Verification"
   - Follow the setup process

2. **Generate App Password**
   - Go to https://myaccount.google.com/apppasswords
   - Select app: "Mail"
   - Select device: "Other (Custom name)"
   - Enter: "bzr-dial-ui"
   - Click "Generate"
   - **Copy the 16-character password** (looks like: `abcd efgh ijkl mnop`)

3. **Update .env file**
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=abcdefghijklmnop  # App password (no spaces)
   EMAIL_FROM=your-email@gmail.com
   ```

4. **Test it**
   ```bash
   cd backend
   node -e "
   require('dotenv').config();
   const EmailService = require('./email-service');
   const es = new EmailService();
   es.sendLicenseEmail({
     email: 'your-test-email@gmail.com',
     key: 'BZRD-TEST-1234-5678-9ABC',
     type: 'single',
     downloadUrl: 'http://localhost:3000/download/test'
   }).then(() => console.log('✅ Email sent!'))
     .catch(err => console.error('❌ Error:', err));
   "
   ```

### Limitations
- 500 emails/day limit
- May get flagged as spam
- Not recommended for production

---

## Option 2: SendGrid (Recommended for Production)

### Why SendGrid?
- ✅ 100 emails/day free forever
- ✅ Better deliverability
- ✅ Email analytics
- ✅ Professional sender reputation

### Setup Steps

1. **Create SendGrid Account**
   - Go to https://signup.sendgrid.com
   - Sign up (free tier is fine)
   - Verify your email

2. **Create API Key**
   - Go to https://app.sendgrid.com/settings/api_keys
   - Click "Create API Key"
   - Name: "bzr-dial-ui"
   - Permissions: "Full Access" (or "Mail Send" only)
   - Click "Create & View"
   - **Copy the API key** (starts with `SG.`)
   - ⚠️ You can only see this once!

3. **Verify Sender Identity**
   
   **Option A: Single Sender (Easiest)**
   - Go to https://app.sendgrid.com/settings/sender_auth/senders
   - Click "Create New Sender"
   - Fill in your details:
     - From Name: "bzr-dial-ui"
     - From Email: your-email@domain.com
     - Reply To: same or support email
   - Click "Create"
   - Check your email and verify

   **Option B: Domain Authentication (Professional)**
   - Go to https://app.sendgrid.com/settings/sender_auth
   - Click "Authenticate Your Domain"
   - Enter your domain (e.g., bzzrr.link)
   - Follow DNS setup instructions
   - Wait for verification (can take up to 48 hours)

4. **Update .env file**
   ```env
   EMAIL_HOST=smtp.sendgrid.net
   EMAIL_PORT=587
   EMAIL_USER=apikey
   EMAIL_PASS=SG.YOUR_SENDGRID_API_KEY_HERE
   EMAIL_FROM=your-verified-email@domain.com
   ```

5. **Test it**
   ```bash
   cd backend
   node -e "
   require('dotenv').config();
   const EmailService = require('./email-service');
   const es = new EmailService();
   es.sendLicenseEmail({
     email: 'your-test-email@gmail.com',
     key: 'BZRD-TEST-1234-5678-9ABC',
     type: 'single',
     downloadUrl: 'http://localhost:3000/download/test'
   }).then(() => console.log('✅ Email sent!'))
     .catch(err => console.error('❌ Error:', err));
   "
   ```

### Pricing
- **Free**: 100 emails/day forever
- **Essentials**: $19.95/mo - 50,000 emails/mo
- **Pro**: $89.95/mo - 100,000 emails/mo

---

## Option 3: Mailgun

### Setup Steps

1. **Create Account**
   - Go to https://signup.mailgun.com
   - Sign up (free trial available)

2. **Get SMTP Credentials**
   - Go to https://app.mailgun.com/app/sending/domains
   - Click on your sandbox domain (or add your own)
   - Find "SMTP credentials"
   - Copy username and password

3. **Update .env**
   ```env
   EMAIL_HOST=smtp.mailgun.org
   EMAIL_PORT=587
   EMAIL_USER=postmaster@your-domain.mailgun.org
   EMAIL_PASS=your-mailgun-password
   EMAIL_FROM=noreply@your-domain.com
   ```

### Pricing
- **Trial**: 5,000 emails/month for 3 months
- **Foundation**: $35/mo - 50,000 emails
- **Growth**: $80/mo - 100,000 emails

---

## Option 4: AWS SES (Advanced)

### Best for
- High volume (cheapest at scale)
- Already using AWS
- Need maximum deliverability

### Pricing
- $0.10 per 1,000 emails
- First 62,000 emails/month FREE if using EC2

### Setup
1. Go to https://aws.amazon.com/ses/
2. Create IAM user with SES permissions
3. Generate SMTP credentials
4. Verify domain or email
5. Request production access (starts in sandbox)

```env
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_PORT=587
EMAIL_USER=YOUR_SMTP_USERNAME
EMAIL_PASS=YOUR_SMTP_PASSWORD
EMAIL_FROM=verified-email@your-domain.com
```

---

## 🧪 Testing Email Delivery

### Test Script

Create `backend/test-email.js`:

```javascript
require('dotenv').config();
const EmailService = require('./email-service');

const emailService = new EmailService();

const testLicense = {
    email: process.argv[2] || 'test@example.com',
    key: 'BZRD-TEST-1234-5678-9ABC',
    type: 'single',
    downloadUrl: 'http://localhost:3000/download/BZRD-TEST-1234-5678-9ABC?token=test123',
    metadata: {
        version: '1.0.0',
        product: 'bzr-dial-ui'
    }
};

console.log(`📧 Sending test email to: ${testLicense.email}`);

emailService.sendLicenseEmail(testLicense)
    .then(() => {
        console.log('✅ Email sent successfully!');
        console.log('Check your inbox (and spam folder)');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Email failed:', err.message);
        process.exit(1);
    });
```

Run it:
```bash
node backend/test-email.js your-email@example.com
```

---

## 🔍 Troubleshooting

### Gmail Issues

**"Invalid login"**
- Ensure 2FA is enabled
- Use App Password, not regular password
- Remove spaces from app password

**"Less secure app access"**
- This is deprecated, use App Passwords instead

**Emails going to spam**
- Normal for Gmail SMTP
- Use SendGrid for production

### SendGrid Issues

**"Sender address rejected"**
- Verify your sender email first
- Use exact email from verified sender

**"API key invalid"**
- Regenerate API key
- Ensure no extra spaces in .env

**Emails not arriving**
- Check SendGrid Activity Feed
- Look for bounces or blocks
- Verify recipient email is valid

### General Issues

**"Connection timeout"**
- Check EMAIL_HOST and EMAIL_PORT
- Verify firewall isn't blocking port 587
- Try port 465 with `secure: true`

**"Authentication failed"**
- Double-check EMAIL_USER and EMAIL_PASS
- Ensure no trailing spaces in .env

**Emails in spam**
- Set up SPF/DKIM records
- Use verified domain
- Avoid spam trigger words

---

## 📊 Email Deliverability Tips

1. **Use a Custom Domain**
   - `sales@bzzrr.link` > `randomuser@gmail.com`

2. **Set Up SPF/DKIM**
   - SendGrid does this automatically
   - Improves deliverability significantly

3. **Warm Up Your Domain**
   - Start with low volume
   - Gradually increase over weeks

4. **Monitor Bounces**
   - Remove invalid emails
   - Check SendGrid analytics

5. **Avoid Spam Triggers**
   - Don't use ALL CAPS
   - Avoid excessive exclamation marks!!!
   - Include unsubscribe link (for marketing)

---

## 🎯 Recommended Setup

**For Testing/Development:**
→ Use Gmail with App Password

**For Production (Low Volume < 100/day):**
→ Use SendGrid Free Tier

**For Production (High Volume):**
→ Use SendGrid Paid or AWS SES

---

## ✅ Email Setup Checklist

- [ ] Email service chosen
- [ ] Account created and verified
- [ ] SMTP credentials obtained
- [ ] .env file updated
- [ ] Test email sent successfully
- [ ] Email received (check spam)
- [ ] Email looks professional
- [ ] Links work correctly
- [ ] Sender address verified (if using custom domain)

---

## 📧 Email Template Customization

Edit `backend/email-service.js` to customize:

- Email subject line
- Header colors
- Logo (add your own)
- Footer text
- Support links

Example customization:
```javascript
// Add your logo
const html = `
  <div class="header" style="background: linear-gradient(135deg, #00ff9d 0%, #135bec 100%);">
    <img src="https://your-domain.com/logo.png" alt="Logo" style="height: 50px;">
    <h1>🎉 Thank You for Your Purchase!</h1>
  </div>
  ...
`;
```

---

**Next**: Once email is configured, you're ready to test the complete flow!

See `STRIPE_SETUP.md` for testing the full purchase → email → download flow.
