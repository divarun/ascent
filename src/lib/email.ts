import nodemailer from "nodemailer"

function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  })
}

export async function sendPasswordResetEmail(to: string, token: string) {
  const appUrl = process.env.APP_URL ?? "http://localhost:3000"
  const resetUrl = `${appUrl}/reset-password?token=${token}`
  const from = process.env.EMAIL_FROM ?? "Ascent <no-reply@ascent.app>"

  if (process.env.NODE_ENV !== "production") {
    console.log(`[email] Password reset link for ${to}: ${resetUrl}`)
    return
  }

  const transporter = createTransport()
  await transporter.sendMail({
    from,
    to,
    subject: "Reset your Ascent password",
    text: `Click the link below to reset your password. It expires in 1 hour.\n\n${resetUrl}\n\nIf you didn't request this, you can safely ignore this email.`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#1A1814">
        <h2 style="margin:0 0 16px;font-size:22px;font-weight:600">Reset your password</h2>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#65605A">
          Click the button below to set a new password. This link expires in 1 hour.
        </p>
        <a href="${resetUrl}" style="display:inline-block;padding:11px 20px;background:#1A1814;color:#F8F7F5;text-decoration:none;border-radius:4px;font-size:14px;font-weight:500">
          Reset password →
        </a>
        <p style="margin:24px 0 0;font-size:13px;color:#8A857E">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  })
}
