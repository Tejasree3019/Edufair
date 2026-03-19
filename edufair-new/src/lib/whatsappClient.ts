/**
 * WhatsApp Client Helper
 * Location: src/lib/whatsappClient.ts
 *
 * Abstracts Twilio vs Meta WhatsApp Business API
 * Provides unified interface for sending messages
 */

let twilio: any;
try {
  twilio = require('twilio');
} catch (e) {
  console.warn('[WhatsApp] Twilio module not installed, using stub implementation');
  twilio = null;
}

// Determine which provider to use
const WHATSAPP_MODE = process.env.WHATSAPP_MODE || 'twilio'

/**
 * Send WhatsApp message via Twilio
 */
async function sendViatwilio(
  phoneNumber: string,
  message: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_WHATSAPP_NUMBER) {
      return {
        success: false,
        error: 'Missing Twilio credentials',
      }
    }

    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

    const response = await client.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${phoneNumber}`,
    })

    console.log(`[WhatsApp] Message sent to ${phoneNumber}: ${response.sid}`)

    return {
      success: true,
      messageId: response.sid,
    }
  } catch (err) {
    console.error('[WhatsApp] Twilio error:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}

/**
 * Send WhatsApp message via Meta API
 */
async function sendViaMeta(
  phoneNumber: string,
  message: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    if (!process.env.WHATSAPP_PHONE_NUMBER_ID || !process.env.WHATSAPP_ACCESS_TOKEN) {
      return {
        success: false,
        error: 'Missing Meta WhatsApp credentials',
      }
    }

    // Remove 'whatsapp:' prefix if present
    const cleanPhoneNumber = phoneNumber.replace('whatsapp:', '')

    const url = `https://graph.instagram.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: cleanPhoneNumber,
        type: 'text',
        text: {
          preview_url: false,
          body: message,
        },
      }),
    })

    const data = (await response.json()) as any

    if (!response.ok) {
      return {
        success: false,
        error: data.error?.message || 'Failed to send message',
      }
    }

    console.log(`[WhatsApp] Message sent to ${cleanPhoneNumber}: ${data.messages[0].id}`)

    return {
      success: true,
      messageId: data.messages[0].id,
    }
  } catch (err) {
    console.error('[WhatsApp] Meta error:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}

/**
 * Send WhatsApp message (unified interface)
 * Automatically routes to correct provider based on env var
 */
export async function sendWhatsAppMessage(
  phoneNumber: string,
  message: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!phoneNumber || !message) {
    return {
      success: false,
      error: 'Phone number and message are required',
    }
  }

  // Ensure phone number has country code
  if (!phoneNumber.includes('+') && !phoneNumber.includes('whatsapp:')) {
    // Add +91 for India if no country code
    if (phoneNumber.length === 10) {
      phoneNumber = '+91' + phoneNumber
    }
  }

  if (WHATSAPP_MODE === 'meta') {
    return sendViaMeta(phoneNumber, message)
  } else {
    return sendViatwilio(phoneNumber, message)
  }
}

/**
 * Send template message (if provider supports it)
 * Useful for structured messages like order confirmations, alerts, etc.
 */
export async function sendTemplateMessage(
  phoneNumber: string,
  templateName: string,
  parameters: Record<string, string>
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    if (WHATSAPP_MODE !== 'meta') {
      return {
        success: false,
        error: 'Template messages only supported with Meta API',
      }
    }

    if (!process.env.WHATSAPP_PHONE_NUMBER_ID || !process.env.WHATSAPP_ACCESS_TOKEN) {
      return {
        success: false,
        error: 'Missing Meta WhatsApp credentials',
      }
    }

    const cleanPhoneNumber = phoneNumber.replace('whatsapp:', '')

    const url = `https://graph.instagram.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`

    // Build parameter list for template
    const paramsList = Object.values(parameters).map(value => ({ type: 'text', text: value }))

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: cleanPhoneNumber,
        type: 'template',
        template: {
          name: templateName,
          language: {
            code: 'en_US',
          },
          components: [
            {
              type: 'body',
              parameters: paramsList,
            },
          ],
        },
      }),
    })

    const data = (await response.json()) as any

    if (!response.ok) {
      return {
        success: false,
        error: data.error?.message || 'Failed to send template',
      }
    }

    return {
      success: true,
      messageId: data.messages[0].id,
    }
  } catch (err) {
    console.error('[WhatsApp] Template send error:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}

/**
 * Send bulk messages
 */
export async function sendBulkMessages(
  phoneNumbers: string[],
  message: string,
  delayMs: number = 100
): Promise<{
  success: boolean
  total: number
  sent: number
  failed: number
  errors: string[]
}> {
  try {
    const results = {
      total: phoneNumbers.length,
      sent: 0,
      failed: 0,
      errors: [] as string[],
    }

    for (const phoneNumber of phoneNumbers) {
      try {
        const result = await sendWhatsAppMessage(phoneNumber, message)

        if (result.success) {
          results.sent++
        } else {
          results.failed++
          results.errors.push(`${phoneNumber}: ${result.error || 'Unknown error'}`)
        }

        // Rate limiting - wait between messages
        await new Promise(resolve => setTimeout(resolve, delayMs))
      } catch (err) {
        results.failed++
        results.errors.push(`${phoneNumber}: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }

    return {
      success: results.failed === 0,
      ...results,
    }
  } catch (err) {
    console.error('[WhatsApp] Bulk send error:', err)
    return {
      success: false,
      total: phoneNumbers.length,
      sent: 0,
      failed: phoneNumbers.length,
      errors: [err instanceof Error ? err.message : 'Unknown error'],
    }
  }
}

/**
 * Format phone number to E.164
 * Examples:
 * - "9876543210" -> "+919876543210"
 * - "919876543210" -> "+919876543210"
 * - "+919876543210" -> "+919876543210"
 */
export function formatPhoneNumber(phone: string, countryCode: string = '91'): string {
  // Remove any non-digit characters except +
  let cleaned = phone.replace(/[^\d+]/g, '')

  // Remove leading +
  cleaned = cleaned.replace(/^\+/, '')

  // Remove leading country code if present
  if (cleaned.startsWith(countryCode)) {
    cleaned = cleaned.substring(countryCode.length)
  }

  // Pad to 10 digits for India
  cleaned = cleaned.padStart(10, '0')

  return `+${countryCode}${cleaned}`
}

/**
 * Parse WhatsApp webhook payload
 */
export interface WhatsAppWebhookMessage {
  from: string
  id: string
  timestamp: string
  type: 'text' | 'image' | 'document' | 'video' | 'audio'
  text?: {
    body: string
  }
  image?: {
    id: string
    mime_type: string
  }
}

export function parseWhatsAppWebhook(payload: any): WhatsAppWebhookMessage | null {
  try {
    const message = payload.messages?.[0]

    if (!message || !message.from) {
      return null
    }

    return {
      from: message.from,
      id: message.id,
      timestamp: message.timestamp,
      type: message.type,
      text: message.text,
      image: message.image,
    }
  } catch (err) {
    console.error('[WhatsApp] Parse webhook error:', err)
    return null
  }
}
