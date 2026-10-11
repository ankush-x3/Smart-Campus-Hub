const nodemailer = require('nodemailer');

/**
 * Checks whether SMTP configuration is present in environment variables.
 * @returns {boolean}
 */
const isEmailConfigured = () => {
  return !!(
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    (process.env.SMTP_PASS || process.env.SMTP_PASSWORD)
  );
};

/**
 * Sends an email using nodemailer transport if configured.
 * @param {Object} options - { email, subject, message, html }
 */
const sendEmail = async (options) => {
  if (!isEmailConfigured()) {
    throw new Error('Email service is not configured. Please set SMTP_HOST, SMTP_USER, and SMTP_PASS environment variables.');
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: process.env.SMTP_SECURE === 'true' || parseInt(process.env.SMTP_PORT, 10) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS || process.env.SMTP_PASSWORD,
    },
  });

  const message = {
    from: `${process.env.FROM_NAME || 'Smart Campus Hub'} <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  const info = await transporter.sendMail(message);
  return info;
};

module.exports = { sendEmail, isEmailConfigured };
