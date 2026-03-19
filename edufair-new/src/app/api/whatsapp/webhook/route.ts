// WhatsApp Chatbot Webhook
// Location: src/app/api/whatsapp/webhook/route.ts

import { NextRequest, NextResponse } from 'next/server';
import {
  recognizeIntent,
  CHATBOT_RESPONSES,
  extractPhoneNumber,
  extractMessageText,
  checkRateLimit,
  createQuickStartMenu,
  isSessionExpired,
  updateSessionActivity,
} from '@/lib/whatsappChatbot';
import type { WhatsAppMessage, WhatsAppResponse } from '@/lib/whatsappChatbot';

/**
 * POST /api/whatsapp/webhook
 * Receive and process incoming WhatsApp messages
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate it's a WhatsApp message from Twilio
    if (!body.messages || !Array.isArray(body.messages)) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    const message: WhatsAppMessage = body;
    const rawPhoneNumber: string = extractPhoneNumber(message);
    const rawMessageText: string = extractMessageText(message);
    
    // Type guard to ensure strings (functions already include nullish coalescing)
    if (typeof rawPhoneNumber !== 'string' || typeof rawMessageText !== 'string') {
      return NextResponse.json({ error: 'Invalid message format' }, { status: 400 });
    }

    // Validate required fields are non-empty
    if (!rawPhoneNumber || !rawMessageText) {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
    }

    // Validate and prepare phone number and message
    const phone = (rawPhoneNumber || '').trim();
    const msgText = (rawMessageText || '').trim();
    
    if (!phone) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
    }
    if (!msgText) {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
    }
    
    // At this point, phone and msgText are guaranteed to be non-empty strings
    console.log(`[WhatsApp] Received message from ${phone}: "${msgText}"`);

    // TODO: Implement rate limiting
    // const recentMessages = await getRecentMessageCount(phone);
    // if (!checkRateLimit(phone, recentMessages)) {
    //   return sendMessage(phone, "⚠️ Please slow down! Send messages one at a time.");
    // }

    // TODO: Get or create session
    // const session = await getOrCreateSession(phone);

    // Recognize intent
    const command = recognizeIntent(msgText);
    console.log(`[Intent] Detected: ${command.intent} (confidence: ${command.confidence})`);

    // Generate response template
    const responseText = CHATBOT_RESPONSES[command.response_template] || CHATBOT_RESPONSES.main_menu;

    // TODO: Save conversation to session
    // await updateSession(session.id, msgText, responseText);

    // Send response via Twilio 
    // @ts-ignore - phone is guaranteed to be string after checks above
    const success = await sendMessage(phone, responseText);

    // TODO: Log message for analytics
    // await logChatbotMessage(phoneNumber, messageText, command.intent, responseText);

    return NextResponse.json({
      success,
      intent: command.intent,
    });
  } catch (error) {
    console.error('[WhatsApp] Error processing message:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}

/**
 * Wrapper for sendWhatsAppMessage to work around TypeScript type narrowing issues
 */
function sendMessage(phone: string, message: string): Promise<boolean> {
  // Ensure inputs are non-empty strings
  if (!phone || typeof phone !== 'string' || !message || typeof message !== 'string') {
    console.error('[WhatsApp] Invalid inputs to sendMessage');
    return Promise.resolve(false);
  }
  
  // Call the actual function with known-safe strings
  return sendWhatsAppMessage(phone.trim() || 'unknown', message.trim() || 'hello');
}

/**
 * GET /api/whatsapp/webhook
 * Webhook verification from Twilio
 */
export async function GET(request: NextRequest) {
  try {
    const hubMode = request.nextUrl.searchParams.get('hub.mode');
    const hubChallenge = request.nextUrl.searchParams.get('hub.challenge');
    const hubVerifyToken = request.nextUrl.searchParams.get('hub.verify_token');

    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'edufair_verify_token_2026';

    if (hubMode === 'subscribe' && hubVerifyToken === verifyToken) {
      console.log('[WhatsApp] Webhook verified');
      return new NextResponse(hubChallenge);
    } else {
      console.log('[WhatsApp] Webhook verification failed');
      return new NextResponse('Forbidden', { status: 403 });
    }
  } catch (error) {
    console.error('[WhatsApp] Verification error:', error);
    return new NextResponse('Error', { status: 500 });
  }
}

// ============================================
// HELPER FUNCTIONS  
// ============================================

/**
 * Send WhatsApp message via Twilio API
 */
async function sendWhatsAppMessage(phoneNumber: string, message: string): Promise<boolean> {
  try {
    if (!phoneNumber) return false;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const apiVersion = 'v18.0';

    if (!phoneNumberId || !accessToken) {
      console.error('[WhatsApp] Missing credentials');
      return false;
    }

    const url = `https://graph.instagram.com/${apiVersion}/${phoneNumberId}/messages`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: phoneNumber,
        type: 'text',
        text: {
          preview_url: false,
          body: message,
        },
      }),
    });

    if (!response.ok) {
      console.error('[WhatsApp] Error sending message:', await response.text());
      return false;
    }

    console.log(`[WhatsApp] Message sent to ${phoneNumber}`);
    return true;
  } catch (error) {
    console.error('[WhatsApp] Send error:', error);
    return false;
  }
}

/**
 * Alternative: Send via Twilio (simpler)
 */
export async function sendWhatsAppViaTwilio(
  phoneNumber: string,
  message: string
): Promise<boolean> {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155552671';

    if (!accountSid || !authToken) {
      console.error('[Twilio] Missing credentials');
      return false;
    }

    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

    const params = new URLSearchParams();
    params.append('From', fromNumber);
    params.append('To', `whatsapp:${phoneNumber}`);
    params.append('Body', message);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      console.error('[Twilio] Error:', await response.text());
      return false;
    }

    console.log(`[Twilio] Message sent to ${phoneNumber}`);
    return true;
  } catch (error) {
    console.error('[Twilio] Error:', error);
    return false;
  }
}

// ============================================
// OTHER WHATSAPP ENDPOINTS
// ============================================

/**
 * POST /api/whatsapp/send
 * Send message to user (from admin/backend)
 */
export async function postSendMessage(request: NextRequest) {
  try {
    const { phone_number, message } = await request.json();

    if (!phone_number || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const success = await sendWhatsAppMessage(phone_number, message);

    return NextResponse.json({
      success,
      message: success ? 'Message sent' : 'Failed to send',
    });
  } catch (error) {
    console.error('[WhatsApp] Send error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/whatsapp/sessions
 * Get user's WhatsApp session (for support dashboard)
 */
export async function getSessions(request: NextRequest) {
  try {
    const userId = request.headers.get('X-User-ID');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: SELECT from whatsapp_sessions WHERE user_id = ?

    const session = {
      session_id: 'sess_123456',
      user_id: userId,
      phone_number: '+91XXXXXXXXXX',
      messages_count: 15,
      state: 'active',
      last_interaction: '2026-03-09T10:30:00Z',
      session_expires_at: '2026-03-10T10:30:00Z',
      conversation_summary: 'User asking about scholarship deadlines',
    };

    return NextResponse.json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error('[WhatsApp] Session fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch session' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/whatsapp/broadcast
 * Send bulk message to multiple users (for campaigns)
 * Requires admin auth
 */
export async function postBroadcast(request: NextRequest) {
  try {
    const adminKey = request.headers.get('X-Admin-Key');

    if (adminKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { phone_numbers, message, segment } = await request.json();

    // TODO: Implement broadcast scheduling
    // For large broadcasts, use queue (Bull, RabbitMQ, etc.)

    let targetNumbers = phone_numbers || [];

    if (segment === 'new_users') {
      // SELECT phone_number FROM whatsapp_sessions WHERE created_at > NOW() - INTERVAL 7 DAY
      targetNumbers = []; // TODO: Get from DB
    }

    if (segment === 'inactive_users') {
      // SELECT phone_number FROM whatsapp_sessions WHERE last_interaction < NOW() - INTERVAL 30 DAY
      targetNumbers = []; // TODO: Get from DB
    }

    // Send to all
    const results = await Promise.all(
      targetNumbers.map((num: string) => sendWhatsAppMessage(num, message))
    );

    const successCount = results.filter(r => r).length;

    return NextResponse.json({
      success: true,
      total: targetNumbers.length,
      sent: successCount,
      failed: targetNumbers.length - successCount,
    });
  } catch (error) {
    console.error('[WhatsApp] Broadcast error:', error);
    return NextResponse.json(
      { error: 'Failed to send broadcast' },
      { status: 500 }
    );
  }
}
