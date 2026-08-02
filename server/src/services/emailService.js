const axios = require('axios');

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

const sendEmail = async (to, subject, htmlContent) => {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'info@fasreach.com';
  const senderName = 'FasReach Platform';

  if (!apiKey) {
    console.error('[Brevo] BREVO_API_KEY is not set in environment variables!');
    throw new Error('BREVO_API_KEY not configured');
  }

  console.log(`[Brevo] Sending email to ${JSON.stringify(to)} | Subject: ${subject} | From: ${senderEmail}`);

  try {
    const response = await axios.post(
      BREVO_API_URL,
      {
        sender: { name: senderName, email: senderEmail },
        to: to,
        subject: subject,
        htmlContent: htmlContent
      },
      {
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    console.log('[Brevo] Email sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('[Brevo] Email FAILED:', error.response ? JSON.stringify(error.response.data) : error.message);
    throw error;
  }
};

const emailStyles = `
  body { font-family: Arial, sans-serif; background-color: #1E232B; color: #ffffff; padding: 20px; }
  .container { max-width: 600px; margin: 0 auto; background-color: #2A303C; padding: 30px; border-radius: 8px; border-top: 4px solid #D4AF6A; }
  .logo { font-size: 24px; font-weight: bold; color: #D4AF6A; text-align: center; margin-bottom: 20px; }
  .content { line-height: 1.6; }
  .btn { display: inline-block; padding: 12px 24px; background-color: #D4AF6A; color: #1E232B; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 20px; }
  .code { font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #D4AF6A; text-align: center; padding: 20px; background-color: #1E232B; border-radius: 4px; margin: 20px 0; }
  .footer { margin-top: 30px; font-size: 12px; color: #888; text-align: center; }
`;

exports.sendVerificationEmail = async (toEmail, toName, verificationCode) => {
  const htmlContent = `
    <html>
      <head><style>${emailStyles}</style></head>
      <body>
        <div class="container">
          <div class="logo">FasReach</div>
          <div class="content">
            <p>Hi ${toName},</p>
            <p>Welcome to FasReach! To complete your registration and verify your email address, please use the following 6-digit code:</p>
            <div class="code">${verificationCode}</div>
            <p>This code will expire in 15 minutes.</p>
            <p>If you did not request this, please ignore this email.</p>
          </div>
          <div class="footer">&copy; ${new Date().getFullYear()} FasReach Platform. All rights reserved.</div>
        </div>
      </body>
    </html>
  `;
  return sendEmail([{ email: toEmail, name: toName }], 'Verify your FasReach account', htmlContent);
};

exports.sendPasswordResetEmail = async (toEmail, toName, resetToken, resetUrl) => {
  const htmlContent = `
    <html>
      <head><style>${emailStyles}</style></head>
      <body>
        <div class="container">
          <div class="logo">FasReach</div>
          <div class="content">
            <p>Hi ${toName},</p>
            <p>We received a request to reset your password. Click the button below to set a new password:</p>
            <div style="text-align: center;">
              <a href="${resetUrl}" class="btn">Reset Password</a>
            </div>
            <p style="margin-top: 20px;">If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #D4AF6A;">${resetUrl}</p>
            <p>This link will expire in 30 minutes.</p>
            <p>If you didn't request a password reset, you can safely ignore this email.</p>
          </div>
          <div class="footer">&copy; ${new Date().getFullYear()} FasReach Platform. All rights reserved.</div>
        </div>
      </body>
    </html>
  `;
  return sendEmail([{ email: toEmail, name: toName }], 'Reset your FasReach password', htmlContent);
};

exports.sendWelcomeEmail = async (toEmail, toName) => {
  const htmlContent = `
    <html>
      <head><style>${emailStyles}</style></head>
      <body>
        <div class="container">
          <div class="logo">FasReach</div>
          <div class="content">
            <p>Hi ${toName},</p>
            <p>Your email has been successfully verified!</p>
            <p>Welcome to the FasReach platform. We're excited to have you on board. You now have full access to our bulk SMS services and your initial free units are ready to use.</p>
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'https://fasreach.com'}/dashboard" class="btn">Go to Dashboard</a>
            </div>
          </div>
          <div class="footer">&copy; ${new Date().getFullYear()} FasReach Platform. All rights reserved.</div>
        </div>
      </body>
    </html>
  `;
  return sendEmail([{ email: toEmail, name: toName }], 'Welcome to FasReach!', htmlContent);
};
