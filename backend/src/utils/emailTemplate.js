// File: utils/emailTemplate.js

const config = {
  companyName: 'Your Company',
  companyLogo: 'https://yourcompany.com/logo.png',
  supportEmail: 'support@yourcompany.com',
  expiryMinutes: 10,
  socials: {
    twitter: 'https://twitter.com/yourcompany',
    instagram: 'https://instagram.com/yourcompany',
    facebook: 'https://facebook.com/yourcompany'
  }
};

const subjects = {
  verify: 'Verify Your Email',
  reset: 'Password Reset Request',
  forgot: 'Account Recovery Code'
};

function generateEmailTemplate(type, code, userName = '') {
  const greeting = userName ? `Hello ${userName},` : 'Hello,';

  const messages = {
    verify: `Your email verification code is: <strong>${code}</strong>`,
    reset: `Use the code below to reset your password: <strong>${code}</strong>`,
    forgot: `Use the following code to recover your account: <strong>${code}</strong>`
  };

  const subject = subjects[type] || 'Verification Code';

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    :root {
      --off-white: #F5F5F7;
      --black: #000000;
      --gray: #A3AAAE;
      --dark-gray: #333333;
      --blue: #2997FF;
      --light-gray: #D6D6D6;
      --white: #FFFFFF;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      background-color: var(--off-white);
      color: var(--dark-gray);
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: var(--white);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    }
    .header {
      background-color: var(--black);
      padding: 24px;
      text-align: center;
    }
    .logo {
      max-height: 40px;
    }
    .content {
      padding: 32px 24px;
    }
    .code-container {
      background-color: var(--off-white);
      border-radius: 8px;
      padding: 24px;
      margin: 24px 0;
      text-align: center;
    }
    .code {
      font-size: 30px;
      font-weight: bold;
      letter-spacing: 4px;
      color: var(--black);
    }
    .message {
      font-size: 16px;
      margin-bottom: 24px;
      color: var(--dark-gray);
    }
    .expiry {
      font-size: 14px;
      color: var(--gray);
      text-align: center;
      margin-top: 8px;
    }
    .cta-button {
      display: inline-block;
      background-color: var(--blue);
      color: var(--white);
      padding: 12px 24px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 500;
      margin-top: 24px;
    }
    .footer {
      background-color: var(--off-white);
      padding: 24px;
      text-align: center;
      font-size: 12px;
      color: var(--gray);
    }
    .social-links {
      margin: 16px 0;
    }
    .social-link {
      display: inline-block;
      margin: 0 8px;
      color: var(--blue);
      text-decoration: none;
    }
    .divider {
      height: 1px;
      background-color: var(--light-gray);
      margin: 24px 0;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <img src="${config.companyLogo}" alt="${config.companyName}" class="logo">
    </div>
    <div class="content">
      <p class="message">${greeting}</p>
      <p class="message">${messages[type] || messages.verify}</p>
      <div class="code-container">
        <div class="code">${code}</div>
        <p class="expiry">This code will expire in ${config.expiryMinutes} minutes</p>
      </div>
      <p class="message">If you did not request this code, please ignore this email or contact support.</p>
      <div style="text-align: center;">
        <a href="${config.socials.twitter}" class="cta-button">Go to ${config.companyName}</a>
      </div>
    </div>
    <div class="divider"></div>
    <div class="footer">
      <div class="social-links">
        <a href="${config.socials.twitter}" class="social-link">Twitter</a>
        <a href="${config.socials.instagram}" class="social-link">Instagram</a>
        <a href="${config.socials.facebook}" class="social-link">Facebook</a>
      </div>
      <p>
        &copy; ${new Date().getFullYear()} ${config.companyName}. All rights reserved.<br>
        Contact support: ${config.supportEmail}
      </p>
    </div>
  </div>
</body>
</html>`;

  return {
    subject,
    html
  };
}

export { generateEmailTemplate };
