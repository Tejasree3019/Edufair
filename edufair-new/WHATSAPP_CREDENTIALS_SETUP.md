# 🚀 WhatsApp Credentials Setup - Quick Checklist

**Status:** ⏳ Pending User Action  
**Timeline:** 2-4 hours (includes approval time)  
**Cost:** ~$100/month for moderate usage (~50K messages)

---

## Option 1: Twilio WhatsApp (⭐ Recommended for MVP)

### ✅ Step 1: Create Twilio Account (5 min)
1. Go to **https://www.twilio.com/try-twilio**
2. Sign up with email
3. Choose: **"Messaging"** as your use case
4. Verify phone number (get 2FA code)
5. Complete KYC (name, address, use case)

### ✅ Step 2: Enable WhatsApp Channel (2 min)
1. Go to **Twilio Dashboard** → **Messaging** (left sidebar)
2. Click **"Try WhatsApp"**
3. Accept terms
4. Get **Twilio WhatsApp Sandbox Number** (format: `+1 415 523 8886`)
5. Important: Save this number!

### ✅ Step 3: Adjust WhatsApp Sandbox Settings (2 min)
1. In Twilio Console, go **Messaging → Whatsapp → Sandbox**
2. Under "Sandbox Configuration":
   - **Message Status Callback URL**: `https://your-domain.com/api/whatsapp/webhook`
   - **Incoming Message URL**: `https://your-domain.com/api/whatsapp/webhook`
   - **HTTP POST**

3. Save

### ✅ Step 4: Get API Credentials (1 min)
1. Go to **Account → API keys & tokens**
2. Copy (and securely store):
   - Account SID: `ACxxxxxxxxxxxxxxxx`
   - Auth Token: `auth_token_here` (keep secret!)
   - WhatsApp Phone Number ID: `+1-415-523-8886`

### ✅ Step 5: Test Sandbox (5 min)
1. Send message to Sandbox number from your personal WhatsApp:
   ```
   join [code-from-dashboard]
   ```
   (Example: `join polite-lamp`)

2. You'll receive confirmation: "You are connected to the Twilio WhatsApp Sandbox!"

3. Send any message - should get auto-reply from your code

### ✅ Step 6: Set Environment Variables
Create/update `.env.local`:

```bash
# Twilio WhatsApp Credentials
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=+14155238886  # Get this from Twilio

# Additional
WHATSAPP_VERIFY_TOKEN=edufair_verify_token_2026
WHATSAPP_MODE=twilio  # or 'meta'
```

### ✅ Step 7: Upgrade to Production (24-48 hours wait)
To move beyond sandbox (50K users limit):
1. Fill "Request Production Instance" form in Twilio
2. Submit business info:
   - Company name: EduFair
   - Use case: Education scholarship support chatbot
   - Expected volume: 50-100K messages/month
3. Wait 24-48 hours for approval
4. Once approved, get production phone number

---

## Option 2: Meta WhatsApp Business API (Advanced)

### Prerequisites
- Facebook Business Account
- WhatsApp Business Account
- Verified business
- 2-4 days for approval

### Quick Setup
1. **Create Business Account**: https://business.facebook.com
2. **Add WhatsApp Business Account**
3. **Request API Access** via Meta for Developers
4. **Get Credentials**:
   - Business Account ID
   - Phone Number ID
   - API access token
   - Webhook URL

### Pros vs Cons
- ✅ Official, more feature-rich
- ✅ Better long-term pricing at scale
- ✅ Direct Meta support
- ❌ Longer setup time (2-4 days)
- ❌ Stricter approval requirements

---

## 📝 Current Status

- [ ] Twilio Account Created
- [ ] WhatsApp Sandbox Joined
- [ ] API Credentials Obtained
- [ ] Environment Variables Set
- [ ] Webhook URL Tested
- [ ] Production Instance Requested

---

## 🧪 Testing Webhook Locally

### Using ngrok (Free tunnel)
```bash
# Install: https://ngrok.com/download
ngrok http 3000

# Output:
# Forwarding  http://3e5b1234.ngrok.io -> localhost:3000

# Update Twilio:
# Message Status Callback URL: http://3e5b1234.ngrok.io/api/whatsapp/webhook
# Incoming Message URL: http://3e5b1234.ngrok.io/api/whatsapp/webhook

# Restart:
npm run dev

# Test by sending WhatsApp message to Twilio sandbox
```

### Check Webhook Logs
```bash
# In VS Code terminal
cd edufair-new
npm run dev

# Send test message, check console output:
[LOG] "Received message from +919876543210"
```

---

## 📞 Send Test Message via API

```bash
curl -X POST https://api.twilio.com/2010-04-01/Accounts/{ACCOUNT_SID}/Messages.json \
  -d "Body=Hello from EduFair!" \
  -d "From=whatsapp:+14155238886" \
  -d "To=whatsapp:+919876543210" \
  -u {ACCOUNT_SID}:{AUTH_TOKEN}
```

**Expected Response:**
```json
{
  "sid": "SMxxxxxxxxxxxxxxxx",
  "body": "Hello from EduFair!",
  "status": "queued"
}
```

---

## 🔗 Useful Links

- **Twilio Dashboard**: https://console.twilio.com
- **Twilio WhatsApp Docs**: https://www.twilio.com/docs/sms/whatsapp/api
- **Webhook Verification**: https://www.twilio.com/docs/sms/webhooks
- **Production Instance Request**: https://www.twilio.com/console/sms/whatsapp/learn
- **Sandbox Testing Guide**: https://www.twilio.com/docs/sms/whatsapp/sandbox

---

## ⏰ Timeline

| Step | Duration | Notes |
|------|----------|-------|
| Account + Sandbox | 15 min | Immediate |
| Send first message | 20 min | Manual testing |
| Webhook integration | 30 min | Code + testing |
| Production request | 24-48 hours | Automatic approval usually |
| **Total to MVP** | **1-2 hours** | w/ pending approval |

---

## 🆘 Troubleshooting

### Issue: "Webhook not verified"
**Solution:**
1. Check `.env.local` has `WHATSAPP_VERIFY_TOKEN`
2. Ensure Twilio webhook URL is exactly: `https://your-domain/api/whatsapp/webhook`
3. Make sure code is deployed (or use ngrok for local testing)

### Issue: "Message failed to send"
**Solution:**
1. Verify credentials in `.env.local`
2. Phone number format must include country code: `whatsapp:+919876543210`
3. Check Twilio account balance (add card if needed)

### Issue: "Input validation failed"
**Solution:**
1. Message must be 1-1600 characters
2. Check for special characters
3. Ensure phone number is E.164 format

---

## 📊 Pricing

### Twilio
| Volume | Cost |
|--------|------|
| 100K msgs/month | ~$5K/month ($0.05/msg) |
| 10K msgs/month | ~$500/month |
| Sandbox (test) | Free |

### Success Formula
- Sandbox: Free testing (perfect for MVP)
- Production: ~$0.01-0.05 per message depending on volume

---

## ✨ Next Steps After Setup

1. ✅ **Send test message** from WhatsApp to confirm working
2. ✅ **Integrate with gamification** (award points for WhatsApp interactions)
3. ✅ **Set up automated notifications** (badge unlocks, referral rewards)
4. ✅ **Create broadcast messaging** (announcements to all users)
5. ✅ **Add AI responses** (later - GPT integration)

---

**Status:** Ready to proceed  
**Estimated Total Time:** 2-4 hours  
**Created:** March 9, 2026
