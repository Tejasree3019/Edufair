# WhatsApp Integration Guide - EduFair Tier 1

## Overview
Complete guide for integrating WhatsApp messaging into EduFair for user support, notifications, and engagement.

## 🏗️ Architecture

```
WhatsApp Integration
├── Chatbot Engine (/src/lib/whatsappChatbot.ts)
│   ├── Intent Recognition (NLP-based)
│   ├── Response Templates
│   ├── Session Management
│   └── Rate Limiting
├── Webhook Handler (/src/app/api/whatsapp/webhook/route.ts)
│   ├── Message Reception (POST)
│   ├── Webhook Verification (GET)
│   ├── Intent Routing
│   └── Response Sending
├── Message Queue (Recommended)
│   └── Background job processing
└── Analytics
    └── Message tracking & user engagement
```

## 📱 Supported Platforms

### Option 1: Twilio (Recommended for MVP)
- **Ease of Setup:** ⭐⭐⭐⭐⭐ (Very Easy)
- **Cost:** Pay-as-you-go ($0.01-0.10 per message)
- **Reliability:** 99.99% uptime
- **Features:** Sandbox for testing, webhooks, templates

### Option 2: Meta WhatsApp Business API
- **Ease of Setup:** ⭐⭐⭐ (Moderate)
- **Cost:** Free tier available, then $0.01-0.04/message
- **Reliability:** 99.9% uptime
- **Features:** Official API, better for scale

### Option 3: Baileys (Local/Testing)
- **Ease of Setup:** ⭐ (Complex)
- **Cost:** Free
- **Reliability:** Best effort
- **Features:** No business account needed
- **Use Case:** Development/testing only

## 🚀 Quick Start (Twilio)

### Step 1: Create Twilio Account
```
1. Go to twilio.com
2. Sign up (free tier: $15 trial)
3. Verify email and phone
4. Create project
5. Navigate to "Messaging" → "WhatsApp"
```

### Step 2: Get Sandbox Number
```
1. In Twilio Dashboard, go to Messaging → WhatsApp → Sandbox
2. Copy your sandbox number (e.g., +1 (415) 523-8886)
3. Note the JOIN code (e.g., "join coward-dolphin")
4. Test by sending: "join coward-dolphin" to the number
```

### Step 3: Set Up Webhook
```
1. In Twilio Dashboard:
   Settings → Webhooks/Triggers
2. Set Webhook URL:
   https://yourdomain.com/api/whatsapp/webhook
3. Configure:
   - When a message comes in: POST
   - When recipient doesn't validate against profile policy: POST
```

### Step 4: Configure Environment
```bash
# .env.local
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=+1415523XXXX
WEBHOOK_VERIFY_TOKEN=your_random_token
```

### Step 5: Deploy & Test
```bash
# Terminal 1: Start local server
npm run dev

# Terminal 2: Expose local server
npx ngrok http 3000

# Terminal 3: Update Twilio webhook URL
# https://xxxxxabcd123.ngrok.io/api/whatsapp/webhook

# Terminal 4: Send test message
curl -X POST https://api.twilio.com/2010-04-01/Accounts/ACxxxxxxx/Messages.json \
  -u ACxxxxxxx:your_auth_token \
  -d "From=whatsapp:+1415523XXXX" \
  -d "To=whatsapp:+your_phone_number" \
  -d "Body=Hello from EduFair!"
```

## 💬 Intent System

### Available Intents

```typescript
const INTENTS = {
  // Discovery
  START: 'start',           // "Hi", "Hello"
  EXPLORE: 'explore',       // "Find scholarships", "Browse"
  
  // Application
  APPLY: 'apply',           // "Apply", "Submit"
  MY_APPS: 'my_apps',       // "My applications", "Status"
  
  // Profile
  PROFILE: 'profile',       // "Edit profile", "Update"
  
  // Community
  REFERRAL: 'referral',     // "Share code", "Refer"
  STORY: 'story',           // "My success", "Tell story"
  
  // Support
  HELP: 'help',             // "Help", "Support"
  
  // Response
  YES: 'yes',               // "Yes", "Okay"
  NO: 'no',                 // "No", "Cancel"
  MORE: 'more'              // "More", "Next"
};
```

### Intent Recognition Examples

```javascript
// Input: "Find me scholarships for engineering"
Intent: EXPLORE
Confidence: 0.95
Params: { field: "engineering", type: null }

// Input: "How do I apply?"
Intent: HELP
Confidence: 0.92
Params: { topic: "apply" }

// Input: "Show me my applications"
Intent: MY_APPS
Confidence: 0.98
Params: { filter: null }

// Input: "I got into IIT Delhi thanks to EduFair!"
Intent: STORY
Confidence: 0.87
Params: { institution: "IIT Delhi" }
```

## 📧 Message Templates

### Template Categories

#### 1. Welcome Messages
```
Hi {name}! 👋

Welcome to EduFair - Your AI Scholarship Companion

Choose what you'd like to do:
1️⃣ Explore Scholarships
2️⃣ View My Applications
3️⃣ Update Profile
4️⃣ Get Help

Reply with 1, 2, 3, or 4
```

#### 2. Scholarship Match
```
🎯 Perfect Match Found!

{scholarship_name}
💰 {amount} / {duration}
📚 {eligibility}
⏰ Deadline: {deadline}

Reply:
• VIEW for details
• APPLY to start
• NEXT for more scholarships
```

#### 3. Application Status
```
📋 Your Applications

✅ Applied: 5
⏳ Pending: 2
🎉 Approved: 1

Recent:
→ IIT Delhi Scholarship - UNDER REVIEW
  Last update: 2 days ago

Reply DETAILS for more info
```

#### 4. Referral Reminder
```
👥 Share & Earn!

Your referral code: EDU{code}

For every friend who joins, you earn ₹250!

Share: https://edufair.com/ref/{code}

Friends joined: 5 | Earnings: ₹1,250
```

#### 5. Achievement Notification
```
🎉 Achievement Unlocked!

🏆 {achievement_name}
{description}

+{points} points

Total: {total_points} points | Level {level}

Keep it up! 💪
```

#### 6. Support Response
```
🆘 Help & Support

Choose your topic:
1️⃣ How to Apply
2️⃣ Scholarships Q&A
3️⃣ Account & Profile
4️⃣ Technical Issues
5️⃣ Contact Support Team

Reply with number
```

## 🔄 Message Flow Examples

### Flow 1: Explore Scholarships
```
User: "Find scholarships"
Bot: "What field interests you? Engineering, Medicine, Commerce, etc.?"
User: "Engineering"
Bot: "[Shows 3 top matches with details]"
User: "More"
Bot: "[Shows next 3 scholarships]"
User: "View 2"
Bot: "[Shows detailed information for scholarship #2]"
User: "Apply"
Bot: "[Starts application flow or opens web link]"
```

### Flow 2: Referral Share
```
User: "How do I make money?"
Bot: "[Explains referral system]"
User: "Share my code"
Bot: "Your code: EDU12345 | Earnings: ₹500
Link: https://edufair.com/ref/EDU12345

Share on: WhatsApp | Telegram | SMS | Copy"
User: "Copy"
Bot: "(Code copied to clipboard)"
```

### Flow 3: Support Ticket
```
User: "I'm having an issue"
Bot: "[Troubleshooting options]"
User: "Still not working"
Bot: "Agent connecting... Please wait.
[Agent message]"
Agent: "Hi! I'm here to help. What's your issue?"
```

## 🔐 Security & Compliance

### Message Encryption
```typescript
// All messages should be encrypted end-to-end
// WhatsApp uses Signal Protocol by default
// No additional encryption needed
```

### Privacy Compliance
- ✅ GDPR compliant (opt-in messaging)
- ✅ WhatsApp terms compliance
- ✅ User consent tracking
- ✅ Easy unsubscribe option

### Rate Limiting
```typescript
// Max 1 message per second per user
// Max 100 messages per day per user
// Hourly limits displayed in header

Check in /src/lib/whatsappChatbot.ts:
checkRateLimit(userId: string): boolean
```

### Message Auditing
```sql
-- All messages logged in database
SELECT * FROM whatsapp_sessions
WHERE user_id = 'user-123'
ORDER BY created_at DESC
```

## 📊 Analytics & Monitoring

### Key Metrics
```javascript
{
  // Volume
  daily_messages: 5000,
  users_engaged: 1200,
  new_users: 45,
  
  // Engagement
  avg_response_time: "2.3s",
  intent_hit_rate: 0.94,
  completion_rate: 0.78,
  
  // Performance
  webhook_success: 0.9999,
  avg_webhook_latency: "250ms",
  error_rate: 0.0001,
  
  // Business
  referrals_from_whatsapp: 156,
  applications_initiated: 234,
  support_tickets_resolved: 89
}
```

### Dashboard Queries
```sql
-- Daily active users
SELECT DATE(created_at) as date, COUNT(DISTINCT user_id) as dau
FROM whatsapp_sessions
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Most common intents
SELECT intent, COUNT(*) as count
FROM whatsapp_sessions
GROUP BY intent
ORDER BY count DESC;

-- Average session duration
SELECT AVG(duration_seconds) as avg_duration
FROM whatsapp_sessions;
```

## 🚨 Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| 401 Unauthorized | Invalid credentials | Check TWILIO_AUTH_TOKEN |
| 400 Bad Request | Invalid phone number | Ensure E.164 format (+1234567890) |
| 429 Too Many Requests | Rate limit exceeded | Implement exponential backoff |
| 503 Service Unavailable | Twilio down | Implement retry mechanism |
| Webhook timeout | Processing taking too long | Use async processing/queues |

### Implementation
```typescript
// In webhook handler
try {
  const response = await sendMessage(phoneNumber, text);
  return NextResponse.json({ success: true });
} catch (error) {
  if (error.status === 429) {
    // Rate limited - retry later
    await retryWithBackoff();
  }
  log.error('WhatsApp error:', error);
  return NextResponse.json(
    { error: error.message },
    { status: error.status || 500 }
  );
}
```

## 🧪 Testing

### Local Testing with ngrok
```bash
# 1. Install ngrok
npm install -g ngrok

# 2. Start dev server
npm run dev

# 3. In another terminal, expose it
ngrok http 3000

# 4. Copy ngrok URL to Twilio webhook

# 5. Send test message
curl -X POST https://your-ngrok-url/api/whatsapp/webhook \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "From=whatsapp:+14155238886" \
  -d "To=whatsapp:+your_number" \
  -d "Body=Test message" \
  -d "MessageSid=SM1234567890abcdef"
```

### Unit Tests
```typescript
// __tests__/whatsappChatbot.test.ts
describe('WhatsApp Chatbot', () => {
  it('should recognize explore intent', () => {
    const result = recognizeIntent('Find me scholarships');
    expect(result.intent).toBe('explore');
    expect(result.confidence).toBeGreaterThan(0.8);
  });

  it('should enforce rate limits', () => {
    const limit1 = checkRateLimit('user-123');
    expect(limit1).toBe(true);
    // Call 101 times
    for (let i = 0; i < 101; i++) {
      checkRateLimit('user-123');
    }
    const limit2 = checkRateLimit('user-123');
    expect(limit2).toBe(false);
  });
});
```

## 📈 Scaling Considerations

### From MVP to Production

```
MVP Phase (0-1 Month)
├── Twilio Sandbox only
├── Max 50 concurrent users
├── Basic intents (4-5)
└── Single region

Phase 1 (1-3 Months)
├── Twilio Production
├── Max 500 concurrent users
├── Extended intents (8-10)
├── Message queuing
└── Single region

Phase 2 (3-6 Months)
├── Meta WhatsApp API
├── Max 5,000 concurrent users
├── Custom intents
├── Multi-region support
└── Advanced analytics

Phase 3 (6-12 Months)
├── Multiple channels (SMS, RCS)
├── Max 50,000 concurrent users
├── AI-powered responses
├── Global scale
└── Enterprise features
```

### Database Indexing
```sql
CREATE INDEX idx_whatsapp_sessions_user_id 
ON whatsapp_sessions(user_id);

CREATE INDEX idx_whatsapp_sessions_created_at 
ON whatsapp_sessions(created_at DESC);

CREATE INDEX idx_whatsapp_sessions_phone 
ON whatsapp_sessions(phone_number);
```

### Message Queue Architecture
```
┌─────────────┐
│ Incoming    │
│ Message     │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│ Webhook Handler     │
│ (Fast response)     │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Message Queue       │
│ (Redis/Kafka)       │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Worker Process      │
│ (Process intent)    │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Send Response       │
│ (Async)             │
└─────────────────────┘
```

## 📞 Support Resources

- **Twilio Docs:** https://www.twilio.com/docs/whatsapp
- **Meta API Docs:** https://www.meta.com/business/help/111519132169727
- **EduFair Support:** support@edufair.com
- **Status Page:** status.twilio.com

## 🎯 Success Metrics

Target by Q2 2026:
- ✅ 10,000 WhatsApp users
- ✅ 50,000 messages/day
- ✅ 40% user engagement via WhatsApp
- ✅ $50K revenue from referrals (WhatsApp driven)
- ✅ 4.8/5 sentiment score

---
**Implementation Timeline:** 15-20 hours  
**Complexity:** Moderate  
**ROI Potential:** 3x return in Year 1
