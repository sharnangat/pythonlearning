const nodemailer = require('nodemailer');
const logger = require('./logger');

// Create transporter based on environment variables
const createTransporter = () => {
  // For development, you can use Gmail, SendGrid, or other SMTP services
  // For production, consider using services like SendGrid, AWS SES, etc.
  
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  return transporter;
};

// Verify transporter configuration
const verifyTransporter = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    logger.info('Email transporter verified successfully');
    return transporter;
  } catch (error) {
    logger.error('Email transporter verification failed', {
      error: error.message,
      stack: error.stack,
    });
    // Return null if email is not configured, but don't crash the app
    return null;
  }
};

// Get transporter instance
let transporterInstance = null;

const getTransporter = async () => {
  if (!transporterInstance) {
    transporterInstance = await verifyTransporter();
  }
  return transporterInstance;
};

// Send email function
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = await getTransporter();
    
    if (!transporter) {
      logger.warn('Email transporter not configured, skipping email send', { to, subject });
      return { success: false, message: 'Email service not configured' };
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML tags for text version
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info('Email sent successfully', {
      to,
      subject,
      messageId: info.messageId,
    });
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error('Failed to send email', {
      error: error.message,
      stack: error.stack,
      to,
      subject,
    });
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendEmail,
  getTransporter,
  verifyTransporter,
};

