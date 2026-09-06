/**
 * Stand-in for a real transactional email provider (Resend, SendGrid,
 * Nodemailer + SMTP, etc). Every auth flow that needs to "send" something
 * calls one of these functions — swapping in a real provider later means
 * editing this one file, not every controller that triggers an email.
 */
export function sendVerificationEmail(email: string, token: string) {
  const link = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
  console.log(`[mailer stub] Verification email for ${email}: ${link}`);
}

export function sendPasswordResetEmail(email: string, token: string) {
  const link = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
  console.log(`[mailer stub] Password reset email for ${email}: ${link}`);
}
