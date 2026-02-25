import nodemailer from 'nodemailer';

const SMTP_ENV_VARS = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'CONTACT_FROM'] as const;

export function getMissingSmtpEnv(): string[] {
  return SMTP_ENV_VARS.filter((key) => !process.env[key]);
}

export function createSmtpTransport() {
  const port = Number(process.env.SMTP_PORT || 587);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}
