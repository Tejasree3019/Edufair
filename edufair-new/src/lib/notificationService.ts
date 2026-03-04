/**
 * Notification Service
 * Handles email, SMS, and in-app notifications
 */

interface NotificationTemplate {
  id: string
  name: string
  subject?: string
  template: string
  type: 'email' | 'sms' | 'in-app'
  variables: string[]
}

interface NotificationQueue {
  id: string
  recipient: string
  type: 'email' | 'sms' | 'in-app'
  templateId: string
  data: Record<string, any>
  status: 'pending' | 'sent' | 'failed'
  retries: number
  createdAt: Date
  sentAt?: Date
}

class NotificationService {
  private templates: Map<string, NotificationTemplate> = new Map()
  private queue: NotificationQueue[] = []
  private readonly MAX_RETRIES = 3
  private readonly RETRY_DELAY = 5000 // 5 seconds

  constructor() {
    this.initializeTemplates()
  }

  /**
   * Initialize notification templates
   */
  private initializeTemplates(): void {
    // Application Submitted Template
    this.templates.set('app_submitted', {
      id: 'app_submitted',
      name: 'Application Submitted',
      subject: 'Your scholarship application has been submitted',
      template: `
        <h2>Application Submitted Successfully</h2>
        <p>Dear {{fullName}},</p>
        <p>Your application for <strong>{{scholarshipName}}</strong> has been received.</p>
        <p><strong>Application ID:</strong> {{applicationId}}</p>
        <p><strong>Submitted Date:</strong> {{submittedDate}}</p>
        <p>You can track your application status at: {{trackingLink}}</p>
        <p>Best of luck!</p>
      `,
      type: 'email',
      variables: ['fullName', 'scholarshipName', 'applicationId', 'submittedDate', 'trackingLink'],
    })

    // Deadline Reminder Template
    this.templates.set('deadline_reminder', {
      id: 'deadline_reminder',
      name: 'Application Deadline Reminder',
      subject: 'Reminder: {{scholarshipName}} deadline is {{daysLeft}} days away',
      template: `
        <h2>Scholarship Application Deadline Reminder</h2>
        <p>Dear {{fullName}},</p>
        <p>This is a reminder that the application deadline for <strong>{{scholarshipName}}</strong> is in {{daysLeft}} days.</p>
        <p><strong>Deadline:</strong> {{deadline}}</p>
        <p>Don't miss this opportunity! Apply now: {{applicationLink}}</p>
      `,
      type: 'email',
      variables: ['fullName', 'scholarshipName', 'daysLeft', 'deadline', 'applicationLink'],
    })

    // Application Status Update Template
    this.templates.set('status_update', {
      id: 'status_update',
      name: 'Application Status Update',
      subject: 'Update on your {{scholarshipName}} application',
      template: `
        <h2>Application Status Update</h2>
        <p>Dear {{fullName}},</p>
        <p>Your application for <strong>{{scholarshipName}}</strong> status has been updated to: <strong>{{status}}</strong></p>
        <p>{{statusMessage}}</p>
        <p>View more details: {{trackingLink}}</p>
      `,
      type: 'email',
      variables: ['fullName', 'scholarshipName', 'status', 'statusMessage', 'trackingLink'],
    })

    // Acceptance Notification Template
    this.templates.set('application_accepted', {
      id: 'application_accepted',
      name: 'Application Accepted',
      subject: '🎉 Congratulations! Your application for {{scholarshipName}} has been accepted',
      template: `
        <h2>🎉 Congratulations!</h2>
        <p>Dear {{fullName}},</p>
        <p>We're thrilled to inform you that your application for <strong>{{scholarshipName}}</strong> has been <strong style="color:green;">ACCEPTED</strong>!</p>
        <p><strong>Award Amount:</strong> {{awardAmount}}</p>
        <p><strong>Next Steps:</strong> {{nextSteps}}</p>
        <p>Enrollment instructions have been sent to your email.</p>
      `,
      type: 'email',
      variables: ['fullName', 'scholarshipName', 'awardAmount', 'nextSteps'],
    })

    // Rejection Notification Template
    this.templates.set('application_rejected', {
      id: 'application_rejected',
      name: 'Application Status Update',
      subject: 'Update on your {{scholarshipName}} application',
      template: `
        <h2>Application Status Update</h2>
        <p>Dear {{fullName}},</p>
        <p>Thank you for your interest in <strong>{{scholarshipName}}</strong>. Unfortunately, your application was not selected this cycle.</p>
        <p>{{feedbackMessage}}</p>
        <p>We encourage you to apply for other scholarships: {{otherScholarshipsLink}}</p>
      `,
      type: 'email',
      variables: ['fullName', 'scholarshipName', 'feedbackMessage', 'otherScholarshipsLink'],
    })
  }

  /**
   * Send notification based on template
   */
  async sendNotification(
    recipient: string,
    templateId: string,
    data: Record<string, any>,
    type: 'email' | 'sms' | 'in-app' = 'email'
  ): Promise<boolean> {
    const template = this.templates.get(templateId)

    if (!template) {
      console.error(`Template ${templateId} not found`)
      return false
    }

    const notification: NotificationQueue = {
      id: `notif_${Date.now()}`,
      recipient,
      type,
      templateId,
      data,
      status: 'pending',
      retries: 0,
      createdAt: new Date(),
    }

    this.queue.push(notification)
    console.log(`[Notification] Queued ${type} notification for ${recipient}`)

    // Process immediately
    return await this.processNotification(notification)
  }

  /**
   * Process a queued notification
   */
  private async processNotification(notification: NotificationQueue): Promise<boolean> {
    try {
      const template = this.templates.get(notification.templateId)

      if (!template) {
        notification.status = 'failed'
        return false
      }

      // Render template with data
      const renderedContent = this.renderTemplate(template.template, notification.data)
      const renderedSubject = template.subject ? this.renderTemplate(template.subject, notification.data) : undefined

      // Send based on type
      let result = false

      switch (notification.type) {
        case 'email':
          result = await this.sendEmail(notification.recipient, renderedSubject || '', renderedContent)
          break

        case 'sms':
          result = await this.sendSMS(notification.recipient, renderedContent)
          break

        case 'in-app':
          result = await this.sendInAppNotification(notification.recipient, renderedContent)
          break
      }

      if (result) {
        notification.status = 'sent'
        notification.sentAt = new Date()
        console.log(`[Notification] ${notification.type.toUpperCase()} sent to ${notification.recipient}`)
      } else if (notification.retries < this.MAX_RETRIES) {
        notification.retries++
        console.log(`[Notification] Retrying (attempt ${notification.retries}/${this.MAX_RETRIES})`)

        // Retry after delay
        setTimeout(() => this.processNotification(notification), this.RETRY_DELAY)
        return false
      } else {
        notification.status = 'failed'
        console.error(`[Notification] Failed after ${this.MAX_RETRIES} retries`)
      }

      return result
    } catch (error) {
      console.error(`[Notification] Error processing notification:`, error)
      notification.status = 'failed'
      return false
    }
  }

  /**
   * Send email notification
   */
  private async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    try {
      // Mock email sending - replace with actual email service (SendGrid, AWS SES, etc.)
      console.log(`[Email] Sending to ${to}`)
      console.log(`[Email] Subject: ${subject}`)

      // In production, this would call an email API
      // const response = await fetch('/api/send-email', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ to, subject, html })
      // })

      // For now, return success
      return true
    } catch (error) {
      console.error(`[Email] Error sending email:`, error)
      return false
    }
  }

  /**
   * Send SMS notification
   */
  private async sendSMS(phoneNumber: string, message: string): Promise<boolean> {
    try {
      // Mock SMS sending - replace with actual SMS service (Twilio, AWS SNS, etc.)
      console.log(`[SMS] Sending to ${phoneNumber}`)
      console.log(`[SMS] Message: ${message.substring(0, 100)}...`)

      // In production, this would call an SMS API
      // const response = await fetch('/api/send-sms', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ phoneNumber, message })
      // })

      // For now, return success
      return true
    } catch (error) {
      console.error(`[SMS] Error sending SMS:`, error)
      return false
    }
  }

  /**
   * Send in-app notification
   */
  private async sendInAppNotification(userId: string, message: string): Promise<boolean> {
    try {
      // Mock in-app notification - would store in database
      console.log(`[InApp] Notification for ${userId}`)
      console.log(`[InApp] Message: ${message.substring(0, 100)}...`)

      // In production, this would store in database
      // await db.inAppNotifications.create({
      //   userId,
      //   message,
      //   read: false,
      //   createdAt: new Date()
      // })

      // For now, return success
      return true
    } catch (error) {
      console.error(`[InApp] Error sending in-app notification:`, error)
      return false
    }
  }

  /**
   * Render template with data
   */
  private renderTemplate(template: string, data: Record<string, any>): string {
    let rendered = template

    Object.entries(data).forEach(([key, value]) => {
      rendered = rendered.replace(new RegExp(`{{${key}}}`, 'g'), String(value))
    })

    return rendered
  }

  /**
   * Send deadline reminder notifications
   */
  async sendDeadlineReminders(daysBeforeDeadline: number = 7): Promise<number> {
    console.log(`[Notifications] Sending deadline reminders for scholarships with ${daysBeforeDeadline} days left`)

    // This would query database for scholarships with upcoming deadlines
    // and users who haven't applied yet

    // Mock implementation
    const remindersSent = 0
    // remindersSent would be incremented for each notification sent

    return remindersSent
  }

  /**
   * Send status update notifications
   */
  async sendStatusUpdateNotification(
    applicationId: string,
    newStatus: string,
    userEmail: string,
    userFullName: string,
    scholarshipName: string
  ): Promise<boolean> {
    const statusMessages: Record<string, string> = {
      reviewing: 'Your application is currently being reviewed by our committee.',
      accepted: 'Congratulations! Your application has been accepted.',
      rejected: 'Unfortunately, your application was not selected.',
      withdrawn: 'Your application has been withdrawn.',
    }

    return await this.sendNotification(userEmail, 'status_update', {
      fullName: userFullName,
      scholarshipName,
      status: newStatus.charAt(0).toUpperCase() + newStatus.slice(1),
      statusMessage: statusMessages[newStatus] || 'Your application status has been updated.',
      trackingLink: `https://edufair.com/track/${applicationId}`,
    })
  }

  /**
   * Get notification queue stats
   */
  getQueueStats(): {
    total: number
    pending: number
    sent: number
    failed: number
  } {
    return {
      total: this.queue.length,
      pending: this.queue.filter((n) => n.status === 'pending').length,
      sent: this.queue.filter((n) => n.status === 'sent').length,
      failed: this.queue.filter((n) => n.status === 'failed').length,
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService()
export default NotificationService
