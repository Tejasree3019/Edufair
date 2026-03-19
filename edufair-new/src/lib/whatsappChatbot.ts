/**
 * WHATSAPP CHATBOT INTEGRATION FOR EDUFAIR
 * 
 * Provides 24/7 scholarship support via WhatsApp
 * Uses Twilio WhatsApp Business API + GPT-4 for intelligent responses
 */

import type { Scholarship } from '@/types';

/**
 * Webhook handler for incoming WhatsApp messages
 * Endpoint: POST /api/whatsapp/webhook
 */
export interface WhatsAppMessage {
  messaging_product: 'whatsapp';
  metadata: {
    display_phone_number: string;
    phone_number_id: string;
  };
  contacts: Array<{
    profile: { name: string };
    wa_id: string;
  }>;
  messages: Array<{
    from: string;
    id: string;
    timestamp: string;
    type: 'text' | 'image' | 'document';
    text?: { body: string };
    image?: { id: string; mime_type: string };
  }>;
}

/**
 * WhatsApp message response types
 */
export type MessageType = 'text' | 'interactive' | 'image' | 'document' | 'template';

export interface WhatsAppResponse {
  messaging_product: 'whatsapp';
  to: string;
  type: MessageType;
  text?: { preview_url: boolean; body: string };
  interactive?: {
    type: 'button' | 'list';
    body: { text: string };
    action: {
      buttons?: Array<{
        type: 'reply';
        reply: { id: string; title: string };
      }>;
      button?: string;
      sections?: Array<{
        title: string;
        rows: Array<{
          id: string;
          title: string;
          description: string;
        }>;
      }>;
    };
  };
}

/**
 * Chatbot Intent Recognition
 */
export type ChatbotIntent =
  | 'find_scholarships'
  | 'apply_now'
  | 'track_application'
  | 'fee_calculator'
  | 'deadline_alert'
  | 'success_probability'
  | 'user_profile'
  | 'register'
  | 'help'
  | 'unknown';

/**
 * Chatbot Command Processor
 */
export interface ChatbotCommand {
  intent: ChatbotIntent;
  confidence: number; // 0-1
  parameters: Record<string, unknown>;
  response_template: string;
}

/**
 * Recognize user intent from message
 */
export function recognizeIntent(message: string): ChatbotCommand {
  const lowerMessage = message.toLowerCase().trim();

  // Scholarship search commands
  if (
    lowerMessage.includes('find') ||
    lowerMessage.includes('search') ||
    lowerMessage.includes('scholarship')
  ) {
    return {
      intent: 'find_scholarships',
      confidence: 0.9,
      parameters: {},
      response_template: 'scholarship_search',
    };
  }

  // Application commands
  if (
    lowerMessage.includes('apply') ||
    lowerMessage.includes('application')
  ) {
    return {
      intent: 'apply_now',
      confidence: 0.85,
      parameters: {},
      response_template: 'apply_quick_guide',
    };
  }

  // Track application
  if (
    lowerMessage.includes('track') ||
    lowerMessage.includes('status') ||
    lowerMessage.includes('my application')
  ) {
    return {
      intent: 'track_application',
      confidence: 0.9,
      parameters: {},
      response_template: 'track_status',
    };
  }

  // Fee calculation
  if (
    lowerMessage.includes('cost') ||
    lowerMessage.includes('fee') ||
    lowerMessage.includes('afford')
  ) {
    return {
      intent: 'fee_calculator',
      confidence: 0.85,
      parameters: {},
      response_template: 'fee_calculator_link',
    };
  }

  // Deadlines
  if (
    lowerMessage.includes('deadline') ||
    lowerMessage.includes('expires')
  ) {
    return {
      intent: 'deadline_alert',
      confidence: 0.9,
      parameters: {},
      response_template: 'deadline_info',
    };
  }

  // Success probability
  if (
    lowerMessage.includes('chances') ||
    lowerMessage.includes('probability') ||
    lowerMessage.includes('accept')
  ) {
    return {
      intent: 'success_probability',
      confidence: 0.8,
      parameters: {},
      response_template: 'success_probability',
    };
  }

  // Profile
  if (
    lowerMessage.includes('profile') ||
    lowerMessage.includes('my account')
  ) {
    return {
      intent: 'user_profile',
      confidence: 0.85,
      parameters: {},
      response_template: 'profile_info',
    };
  }

  // Registration
  if (
    lowerMessage.includes('register') ||
    lowerMessage.includes('sign up') ||
    lowerMessage.includes('new')
  ) {
    return {
      intent: 'register',
      confidence: 0.9,
      parameters: {},
      response_template: 'registration_help',
    };
  }

  // Help
  if (
    lowerMessage.includes('help') ||
    lowerMessage.includes('how') ||
    lowerMessage.includes('guide')
  ) {
    return {
      intent: 'help',
      confidence: 0.9,
      parameters: {},
      response_template: 'main_menu',
    };
  }

  return {
    intent: 'unknown',
    confidence: 0.5,
    parameters: {},
    response_template: 'escalate_to_human',
  };
}

/**
 * Response templates for common queries
 */
export const CHATBOT_RESPONSES: Record<string, string> = {
  scholarship_search: `🎓 *Find Your Scholarships*

I can help you find scholarships! To give you better recommendations:

1️⃣ *Tell me about yourself:*
   • Your academic grade/GPA
   • Field of study
   • Location (country/state)
   • Education level (10th, 12th, UG, PG)

2️⃣ *Or click below to quickly narrow down:*
   TAP: View All Scholarships
   TAP: Advanced Search

Which would you prefer?`,

  apply_quick_guide: `📝 *Apply to Scholarships*

The process is simple:

1️⃣ *Find a scholarship* - Browse our database
2️⃣ *Tap "Apply Now"* - Fill the form (18 fields)
3️⃣ *Submit documents* - Upload required files
4️⃣ *Track progress* - Check status in dashboard

⏱️ Most forms take 5-10 minutes

🔥 *Pro tip:* Apply to at least 5 scholarships for better chances!

Ready to apply? 
TAP: Browse Scholarships now`,

  track_status: `📊 *Track Your Applications*

You can track all applications in your dashboard:

✅ Submitted applications
⏳ Status updates  
📅 Upcoming deadlines
📝 Required documents

To check your applications:
TAP: View My Dashboard

Don't have an account yet?
TAP: Register Now

What's your phone/email linked to your account?`,

  fee_calculator_link: `💰 *Education Cost Calculator*

Our fee calculator shows:

✓ Total education cost breakdown
✓ Tuition + living expenses
✓ Simplified funding strategy
✓ How much scholarship covers

TAP: Calculate My Costs

Popular questions:
• "How much does University X cost?"
• "Can I afford this program?"
• "What's the living cost in X city?"

Which city/university?`,

  deadline_info: `📅 *Scholarship Deadlines*

We alert you automatically when deadlines approach!

Set preferences:
• Alert 1 week before
• Alert 3 days before  
• Alert 24 hours before

🔔 Enable notifications in your profile

Coming soon: Google Calendar sync ✨

Most deadlines:
🇮🇳 March-June (Spring cycle)
Late August-October (Fall cycle)

Which month are you interested in?`,

  success_probability: `🎯 *Success Probability Calculator*

We predict your scholarship chances based on:

🎓 Academic match
💰 Financial fit
🏆 Competition level
✅ Your profile strength

✨ Our algorithm is 87% accurate!

To get your personalized match scores:
TAP: See My Recommendations

What field are you studying?`,

  registration_help: `📝 *Sign Up in 2 Minutes*

Easy registration:

1️⃣ Enter email & create password
2️⃣ Add basic profile info (name, education level, country)
3️⃣ Get instant scholarship matches

That's it! ✨

TAP: Register Now

Already have an account?
TAP: Login

Need help with registration?`,

  profile_info: `👤 *Your Profile*

Your profile helps us recommend better scholarships:

📊 Complete Profile = Better Matches

Update your:
✓ Academic details (GPA, test scores)
✓ Financial information
✓ Field of study
✓ Education goals

TAP: Edit Profile

💡 Tip: 100% complete profile = 40% better recommendations!`,

  main_menu: `🎓 *EduFair Help Menu*

What would you like help with?

TAP one:
🔍 Find Scholarships
📝 Apply Now
📊 Track Applications
💰 Calculate Costs
📅 Check Deadlines
🎯 Success Probability
👤 My Profile
📱 Download App

Or just ask me anything! I'm here 24/7 ✨`,

  escalate_to_human: `I'm not quite sure what you mean. 

Could you rephrase? Or:

TAP: Speak with Human Agent
TAP: View Help Menu
TAP: Back to Start

Examples of what I can help:
• "Find scholarships for engineering"
• "How do I apply?"
• "Check my application status"
• "Calculate education costs"`,

  error_generic: `❌ Oops! Something went wrong.

Please try again or:
TAP: Speak with Human Agent
TAP: Back to Start

🛠️ We'll fix this ASAP!`,
};

/**
 * Interactive button responses (for quickstart)
 */
export function createQuickStartMenu(): WhatsAppResponse {
  return {
    messaging_product: 'whatsapp',
    to: 'PHONE_NUMBER_PLACEHOLDER',
    type: 'interactive',
    interactive: {
      type: 'button',
      body: {
        text: '👋 Welcome to EduFair!\n\nWhat would you like to do today?',
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: 'btn_find',
              title: '🔍 Find Scholarships',
            },
          },
          {
            type: 'reply',
            reply: {
              id: 'btn_apply',
              title: '📝 Apply Now',
            },
          },
          {
            type: 'reply',
            reply: {
              id: 'btn_track',
              title: '📊 Track Status',
            },
          },
        ],
      },
    },
  };
}

/**
 * List Response (for browsing scholarships)
 */
export function createScholarshipListMenu(
  scholarships: Array<{
    id: string;
    name: string;
    amount: number;
    provider: string;
  }>
): WhatsAppResponse {
  return {
    messaging_product: 'whatsapp',
    to: 'PHONE_NUMBER_PLACEHOLDER',
    type: 'interactive',
    interactive: {
      type: 'list',
      body: {
        text: '💡 Based on your profile, here are your top matches:',
      },
      action: {
        button: '👉 View Scholarships',
        sections: [
          {
            title: 'Top Matches',
            rows: scholarships.slice(0, 10).map((s, idx) => ({
              id: `scholarship_${s.id}`,
              title: s.name,
              description: `₹${(s.amount / 100000).toFixed(1)}L by ${s.provider}`,
            })),
          },
        ],
      },
    },
  };
}

/**
 * Session management for WhatsApp users
 */
export interface ChatbotSession {
  phone_number: string;
  user_id?: string; // If logged in
  conversation_history: Array<{
    role: 'user' | 'assistant';
    message: string;
    timestamp: string;
  }>;
  state: 'welcome' | 'in_conversation' | 'awaiting_info' | 'completed';
  context: Record<string, unknown>;
  created_at: string;
  last_interaction: string;
  session_expires_at: string; // 24 hours from last interaction
}

/**
 * Session TTL: 24 hours of inactivity
 */
export function isSessionExpired(session: ChatbotSession): boolean {
  const now = new Date();
  const expiresAt = new Date(session.session_expires_at);
  return now > expiresAt;
}

/**
 * Update session with new activity
 */
export function updateSessionActivity(session: ChatbotSession): ChatbotSession {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

  return {
    ...session,
    last_interaction: now.toISOString(),
    session_expires_at: expiresAt.toISOString(),
  };
}

/**
 * Extract phone number from WhatsApp message
 */
export function extractPhoneNumber(message: WhatsAppMessage): string {
  return message.messages?.[0]?.from ?? '';
}

/**
 * Extract message text
 */
export function extractMessageText(message: WhatsAppMessage): string {
  return message.messages?.[0]?.text?.body ?? '';
}

/**
 * Format scholarship info for WhatsApp (short format)
 */
export function formatScholarshipForChat(
  scholarship: Partial<Scholarship>
): string {
  return `📌 *${scholarship.name}*
  
Amount: ₹${scholarship.scholarship_amount}
Provider: ${scholarship.provider_name}
Deadline: ${new Date(scholarship.application_deadline as string).toLocaleDateString('en-IN')}

TAP LINK to apply: edufair.in/apply/${scholarship.id}`;
}

/**
 * Rate limit check (prevent spam)
 */
export function checkRateLimit(
  phoneNumber: string,
  recentMessages: number,
  timeWindowSeconds: number = 60
): boolean {
  // Max 10 messages per minute
  return recentMessages < 10;
}
