const { sendEmail } = require('../config/email');
const logger = require('../config/logger');

// Email templates
const getRegistrationEmailTemplate = (user, verificationToken) => {
  const verificationUrl = `${process.env.APP_URL || 'http://localhost:3000'}/api/verify-email?token=${verificationToken}`;
  const userName = user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user.email;

  return {
    subject: 'Welcome to Society System - Verify Your Email',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Society System</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
          <h1 style="margin: 0;">Welcome to Society System!</h1>
        </div>
        <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px;">
          <p>Hello ${userName},</p>
          <p>Thank you for registering with Society System. We're excited to have you on board!</p>
          <p>To complete your registration and verify your email address, please click the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Verify Email Address
            </a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666; font-size: 14px;">${verificationUrl}</p>
          <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
            <strong>Note:</strong> This verification link will expire in 24 hours. If you didn't create an account with us, please ignore this email.
          </p>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            Best regards,<br>
            The Society System Team
          </p>
        </div>
      </body>
      </html>
    `,
    text: `
      Welcome to Society System!
      
      Hello ${userName},
      
      Thank you for registering with Society System. We're excited to have you on board!
      
      To complete your registration and verify your email address, please visit the following link:
      
      ${verificationUrl}
      
      Note: This verification link will expire in 24 hours. If you didn't create an account with us, please ignore this email.
      
      Best regards,
      The Society System Team
    `,
  };
};

// Send registration email
const sendRegistrationEmail = async (user, verificationToken) => {
  try {
    const emailTemplate = getRegistrationEmailTemplate(user, verificationToken);
    
    const result = await sendEmail({
      to: user.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
    });

    if (result.success) {
      logger.info('Registration email sent successfully', {
        userId: user.id,
        email: user.email,
      });
    } else {
      logger.warn('Failed to send registration email', {
        userId: user.id,
        email: user.email,
        error: result.error || result.message,
      });
    }

    return result;
  } catch (error) {
    logger.error('Error sending registration email', {
      error: error.message,
      stack: error.stack,
      userId: user.id,
      email: user.email,
    });
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendRegistrationEmail,
};

