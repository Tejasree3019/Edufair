/**
 * Test Suite for Notification Service
 * Tests email, SMS, and in-app notifications
 */

import NotificationService from '@/lib/notificationService'

describe('NotificationService', () => {
  let notificationService: NotificationService

  beforeEach(() => {
    notificationService = new NotificationService()
  })

  describe('Email Notifications', () => {
    test('should send application submitted email', async () => {
      const result = await notificationService.sendNotification(
        'student@example.com',
        'app_submitted',
        {
          fullName: 'John Doe',
          scholarshipName: 'KVPY Fellowship',
          applicationId: 'app_001',
          submittedDate: new Date().toLocaleDateString(),
          trackingLink: 'https://edufair.com/track/app_001',
        },
        'email'
      )

      expect(result).toBe(true)
    })

    test('should send deadline reminder email', async () => {
      const result = await notificationService.sendNotification(
        'student@example.com',
        'deadline_reminder',
        {
          fullName: 'Jane Smith',
          scholarshipName: 'IIT JEE Merit',
          daysLeft: '7',
          deadline: '2026-02-28',
          applicationLink: 'https://edufair.com/apply/iit_001',
        },
        'email'
      )

      expect(result).toBe(true)
    })

    test('should send acceptance notification email', async () => {
      const result = await notificationService.sendNotification(
        'student@example.com',
        'application_accepted',
        {
          fullName: 'Raj Kumar',
          scholarshipName: 'National Scholarship Scheme',
          awardAmount: '₹10,000',
          nextSteps: 'Complete enrollment form within 7 days',
        },
        'email'
      )

      expect(result).toBe(true)
    })

    test('should send rejection notification email', async () => {
      const result = await notificationService.sendNotification(
        'student@example.com',
        'application_rejected',
        {
          fullName: 'Priya Singh',
          scholarshipName: 'BITS Pilani',
          feedbackMessage: 'Your application did not meet the required criteria this cycle.',
          otherScholarshipsLink: 'https://edufair.com/scholarships',
        },
        'email'
      )

      expect(result).toBe(true)
    })
  })

  describe('SMS Notifications', () => {
    test('should send SMS notification', async () => {
      const result = await notificationService.sendNotification(
        '+919876543210',
        'deadline_reminder',
        {
          fullName: 'John Doe',
          scholarshipName: 'KVPY Fellowship',
          daysLeft: '3',
          deadline: '2026-02-25',
          applicationLink: 'https://edufair.com/apply/kvpy',
        },
        'sms'
      )

      expect(result).toBe(true)
    })
  })

  describe('In-App Notifications', () => {
    test('should send in-app notification', async () => {
      const result = await notificationService.sendNotification(
        'user_12345',
        'status_update',
        {
          fullName: 'John Doe',
          scholarshipName: 'KVPY Fellowship',
          status: 'Reviewing',
          statusMessage: 'Your application is being reviewed.',
          trackingLink: 'https://edufair.com/track/app_001',
        },
        'in-app'
      )

      expect(result).toBe(true)
    })
  })

  describe('Status Update Notifications', () => {
    test('should send status update notification', async () => {
      const result = await notificationService.sendStatusUpdateNotification(
        'app_001',
        'accepted',
        'student@example.com',
        'John Doe',
        'KVPY Fellowship'
      )

      expect(result).toBe(true)
    })

    test('should handle different status types', async () => {
      const statuses = ['reviewing', 'accepted', 'rejected', 'withdrawn']

      for (const status of statuses) {
        const result = await notificationService.sendStatusUpdateNotification(
          'app_001',
          status,
          'student@example.com',
          'John Doe',
          'Scholarship'
        )

        expect(result).toBe(true)
      }
    })
  })

  describe('Queue Management', () => {
    test('should track notification queue stats', async () => {
      await notificationService.sendNotification(
        'student@example.com',
        'app_submitted',
        {
          fullName: 'Test User',
          scholarshipName: 'Test Scholarship',
          applicationId: 'test_001',
          submittedDate: new Date().toLocaleDateString(),
          trackingLink: 'https://test.com',
        },
        'email'
      )

      const stats = notificationService.getQueueStats()

      expect(stats.total).toBeGreaterThan(0)
      expect(stats.sent + stats.failed + stats.pending).toBe(stats.total)
    })
  })
})
