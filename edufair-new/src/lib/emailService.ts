/**
 * Email Service
 * Handles sending transactional emails
 * Can be integrated with SendGrid, Nodemailer, AWS SES, etc.
 */

/**
 * Send email verification link
 */
export async function sendVerificationEmail(
  email: string,
  fullName: string,
  verificationToken: string
) {
  try {
    const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?token=${verificationToken}`

    const emailBody = `
      <h2>Welcome to EduFair! 🎓</h2>
      <p>Hi ${fullName},</p>
      <p>Thank you for creating an account with EduFair. Please verify your email address by clicking the link below:</p>
      <p><a href="${verificationLink}" style="background-color: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a></p>
      <p>Or copy this link: ${verificationLink}</p>
      <p>This link will expire in 24 hours.</p>
      <p>Best regards,<br/>The EduFair Team</p>
    `

    await sendEmail(email, 'Verify Your Email - EduFair', emailBody)
  } catch (error) {
    console.error('Error sending verification email:', error)
    throw error
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  fullName: string,
  resetToken: string
) {
  try {
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`

    const emailBody = `
      <h2>Reset Your Password</h2>
      <p>Hi ${fullName},</p>
      <p>We received a request to reset your password. Click the link below to create a new password:</p>
      <p><a href="${resetLink}" style="background-color: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a></p>
      <p>Or copy this link: ${resetLink}</p>
      <p>This link will expire in 30 minutes.</p>
      <p>If you didn't request this, you can safely ignore this email.</p>
      <p>Best regards,<br/>The EduFair Team</p>
    `

    await sendEmail(email, 'Reset Your Password - EduFair', emailBody)
  } catch (error) {
    console.error('Error sending password reset email:', error)
    throw error
  }
}

/**
 * Send application confirmation email
 */
export async function sendApplicationConfirmationEmail(
  email: string,
  fullName: string,
  scholarshipName: string,
  applicationId: string
) {
  try {
    const applicationLink = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/applications/${applicationId}`

    const emailBody = `
      <h2>Application Submitted Successfully! 🎉</h2>
      <p>Hi ${fullName},</p>
      <p>Your application for <strong>${scholarshipName}</strong> has been successfully submitted.</p>
      <p>You can track the status of your application here:<br/>
      <a href="${applicationLink}">${applicationLink}</a></p>
      <p><strong>What happens next?</strong></p>
      <ul>
        <li>We'll review your application within 5-7 business days</li>
        <li>You'll receive an email update about the status</li>
        <li>Keep checking your EduFair dashboard for updates</li>
      </ul>
      <p>Thank you for using EduFair!</p>
      <p>Best regards,<br/>The EduFair Team</p>
    `

    await sendEmail(email, `Application Received - ${scholarshipName}`, emailBody)
  } catch (error) {
    console.error('Error sending application confirmation email:', error)
    throw error
  }
}

/**
 * Send application status update email
 */
export async function sendApplicationStatusEmail(
  email: string,
  fullName: string,
  scholarshipName: string,
  status: string,
  applicationId: string
) {
  try {
    const applicationLink = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/applications/${applicationId}`
    const statusMessage = getStatusMessage(status)

    const emailBody = `
      <h2>Application Status Update</h2>
      <p>Hi ${fullName},</p>
      <p>Your application for <strong>${scholarshipName}</strong> has been <strong>${status.toUpperCase()}</strong>.</p>
      <p>${statusMessage}</p>
      <p>View details: <a href="${applicationLink}">${applicationLink}</a></p>
      <p>Best regards,<br/>The EduFair Team</p>
    `

    await sendEmail(email, `Application ${status.toUpperCase()} - ${scholarshipName}`, emailBody)
  } catch (error) {
    console.error('Error sending status update email:', error)
    throw error
  }
}

/**
 * Core email sending function
 * TODO: Implement with SendGrid, AWS SES, or other provider
 */
async function sendEmail(to: string, subject: string, htmlBody: string) {
  // Placeholder - implement with your email provider
  // Examples:
  // - SendGrid API
  // - AWS SES
  // - Nodemailer
  // - Mailgun

  if (process.env.DISABLE_EMAILS === 'true') {
    console.log(`[EMAIL] To: ${to}, Subject: ${subject}`)
    return
  }

  try {
    // Example with fetch (SendGrid)
    if (process.env.SENDGRID_API_KEY) {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: to }],
            },
          ],
          from: {
            email: process.env.SENDGRID_FROM_EMAIL || 'noreply@edufair.com',
            name: 'EduFair',
          },
          subject,
          content: [
            {
              type: 'text/html',
              value: htmlBody,
            },
          ],
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(`SendGrid error: ${error.errors?.[0]?.message || response.statusText}`)
      }
    } else {
      // Fallback logging
      console.log(`[EMAIL] ${to}: ${subject}`)
    }
  } catch (error) {
    console.error('Email sending error:', error)
    // Log but don't throw - email failures shouldn't crash the app
  }
}

/**
 * Get status message based on application status
 */
function getStatusMessage(status: string): string {
  const messages: Record<string, string> = {
    approved:
      'Congratulations! Your application has been approved. You should receive further instructions soon.',
    rejected:
      'Unfortunately, your application was not selected. Please review feedback and try other scholarships.',
    pending:
      'Your application is still being reviewed. We appreciate your patience!',
    under_review:
      'Your application is being reviewed by the scholarship provider. You will be updated soon.',
  }

  return messages[status] || 'Your application status has been updated. Check your dashboard for details.'
}
