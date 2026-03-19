-- EDUFAIR DATABASE SCHEMA - TIER 1 ENHANCEMENTS
-- Gamification, Referral System, and WhatsApp Integration
-- Run these queries in Supabase SQL Editor

-- ============================================
-- TABLE 1: GAMIFICATION SYSTEM
-- ============================================

CREATE TABLE IF NOT EXISTS user_gamification (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  
  -- Points and Level
  total_points INT DEFAULT 0,
  level INT DEFAULT 1, -- 1-100
  
  -- Badges
  badges_earned TEXT[] DEFAULT ARRAY[]::TEXT[],
  badges_count INT DEFAULT 0,
  
  -- Streak tracking
  current_streak INT DEFAULT 0, -- Days
  max_streak INT DEFAULT 0,
  last_activity_date DATE,
  
  -- Referral system
  referral_code TEXT UNIQUE NOT NULL,
  referrals_count INT DEFAULT 0,
  referral_earnings BIGINT DEFAULT 0, -- In rupees/dollars
  
  -- Leaderboard
  leaderboard_rank INT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_user_gamification_points ON user_gamification(total_points DESC);
CREATE INDEX idx_user_gamification_level ON user_gamification(level DESC);
CREATE INDEX idx_user_gamification_rank ON user_gamification(leaderboard_rank ASC);

-- ============================================
-- TABLE 2: ACHIEVEMENT UNLOCKS
-- ============================================

CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL, -- References gamificationEngine.ts
  
  points_earned INT DEFAULT 0,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement ON user_achievements(achievement_id);

-- ============================================
-- TABLE 3: REFERRAL TRACKING
-- ============================================

CREATE TABLE IF NOT EXISTS user_referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  referrer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referred_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  referral_code TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'signed_up', 'applied', 'won_scholarship')) DEFAULT 'pending',
  
  -- Reward tracking
  reward_tier INT DEFAULT 1, -- 1: signup, 2: apply, 3: win
  reward_amount BIGINT DEFAULT 0,
  reward_paid BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_referrals_referrer ON user_referrals(referrer_id);
CREATE INDEX idx_referrals_referred ON user_referrals(referred_user_id);
CREATE INDEX idx_referrals_code ON user_referrals(referral_code);

-- ============================================
-- TABLE 4: USER ACTIVITY LOG (for streaks & analytics)
-- ============================================

CREATE TABLE IF NOT EXISTS user_activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  activity_type TEXT NOT NULL, -- 'login', 'application', 'profile_update', 'referral'
  activity_data JSONB, -- Flexible storage for activity details
  points_earned INT DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_activity_user ON user_activity_log(user_id);
CREATE INDEX idx_activity_type ON user_activity_log(activity_type);
CREATE INDEX idx_activity_date ON user_activity_log(created_at DESC);

-- ============================================
-- TABLE 5: WHATSAPP INTEGRATION
-- ============================================

CREATE TABLE IF NOT EXISTS whatsapp_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  phone_number TEXT NOT NULL, -- WhatsApp phone number
  
  session_state TEXT CHECK (session_state IN ('welcome', 'in_conversation', 'awaiting_info', 'completed')) DEFAULT 'welcome',
  conversation_history JSONB, -- Array of messages
  session_context JSONB, -- Store context of conversation
  
  messages_count INT DEFAULT 0,
  last_interaction TIMESTAMP WITH TIME ZONE,
  session_expires_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_whatsapp_phone ON whatsapp_sessions(phone_number);
CREATE INDEX idx_whatsapp_user ON whatsapp_sessions(user_id);
CREATE INDEX idx_whatsapp_expired ON whatsapp_sessions(session_expires_at);

-- ============================================
-- TABLE 6: NOTIFICATION PREFERENCES (Enhanced)
-- ============================================

CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  
  -- Channel preferences
  email_enabled BOOLEAN DEFAULT TRUE,
  sms_enabled BOOLEAN DEFAULT TRUE,
  whatsapp_enabled BOOLEAN DEFAULT FALSE, -- NEW
  push_enabled BOOLEAN DEFAULT FALSE, -- NEW (for mobile app)
  
  -- Notification types
  deadline_alerts BOOLEAN DEFAULT TRUE,
  new_matches BOOLEAN DEFAULT TRUE,
  application_updates BOOLEAN DEFAULT TRUE,
  achievement_unlocks BOOLEAN DEFAULT TRUE, -- NEW (gamification)
  referral_updates BOOLEAN DEFAULT TRUE, -- NEW
  
  -- Alert timing
  deadline_days_before INT DEFAULT 7, -- Alert N days before deadline
  
  -- Quiet hours
  quiet_hours_enabled BOOLEAN DEFAULT FALSE,
  quiet_start_hour INT, -- 0-23
  quiet_end_hour INT,
  
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE 7: SUCCESS STORIES / TESTIMONIALS
-- ============================================

CREATE TABLE IF NOT EXISTS user_success_stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scholarship_id UUID REFERENCES scholarships(id) ON DELETE SET NULL,
  
  title TEXT NOT NULL,
  story_text TEXT NOT NULL,
  
  -- Media
  story_video_url TEXT,
  story_image_url TEXT,
  
  -- Engagement
  is_published BOOLEAN DEFAULT FALSE,
  views_count INT DEFAULT 0,
  shares_count INT DEFAULT 0,
  reactions_count INT DEFAULT 0,
  
  -- Visibility
  visibility TEXT CHECK (visibility IN ('public', 'private', 'friends_only')) DEFAULT 'public',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_success_stories_user ON user_success_stories(user_id);
CREATE INDEX idx_success_stories_published ON user_success_stories(is_published);
CREATE INDEX idx_success_stories_scholarship ON user_success_stories(scholarship_id);

-- ============================================
-- UPDATES TO EXISTING TABLES
-- ============================================

-- Add new columns to users table if not exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS has_notifications BOOLEAN DEFAULT TRUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS whatsapp_phone TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_scholarships_applied INT DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_scholarships_won INT DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_completion_percentage INT DEFAULT 0;

-- Add to scholarships table
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS views_count INT DEFAULT 0;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS applications_count INT DEFAULT 0;

-- ============================================
-- VIEWS FOR LEADERBOARD
-- ============================================

CREATE OR REPLACE VIEW leaderboard_top_100 AS
SELECT 
  ROW_NUMBER() OVER (ORDER BY ug.total_points DESC) as rank,
  u.id,
  u.full_name,
  ug.total_points,
  ug.level,
  array_length(ug.badges_earned, 1) as badges_count,
  ug.referrals_count,
  u.created_at
FROM user_gamification ug
JOIN users u ON ug.user_id = u.id
WHERE u.role = 'student'
ORDER BY ug.total_points DESC
LIMIT 100;

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created ON users(created_at DESC);
CREATE INDEX idx_scholarships_status ON scholarships(status);
CREATE INDEX idx_applications_status ON scholarship_applications(status);

-- ============================================
-- RLS POLICIES (Row-Level Security)
-- ============================================

-- Enable RLS on gamification table
ALTER TABLE user_gamification ENABLE ROW LEVEL SECURITY;

-- Users can only see their own gamification data
CREATE POLICY "Users can view own gamification"
  ON user_gamification
  FOR SELECT
  USING (user_id = auth.uid());

-- Users can update own gamification
CREATE POLICY "Users can update own gamification"
  ON user_gamification
  FOR UPDATE
  USING (user_id = auth.uid());

-- Enable RLS on referrals
ALTER TABLE user_referrals ENABLE ROW LEVEL SECURITY;

-- Users can view their referrals
CREATE POLICY "Users can view own referrals"
  ON user_referrals
  FOR SELECT
  USING (referrer_id = auth.uid());

-- Enable RLS on success stories
ALTER TABLE user_success_stories ENABLE ROW LEVEL SECURITY;

-- Public stories visible to everyone
CREATE POLICY "Public success stories visible to all"
  ON user_success_stories
  FOR SELECT
  USING (is_published = TRUE AND visibility = 'public');

-- Users can manage own stories
CREATE POLICY "Users can manage own success stories"
  ON user_success_stories
  USING (user_id = auth.uid());

-- ============================================
-- TRIGGERS FOR AUTO-UPDATES
-- ============================================

-- Trigger to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_gamification_timestamp
BEFORE UPDATE ON user_gamification
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_referral_timestamp
BEFORE UPDATE ON user_referrals
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- ============================================
-- STORED PROCEDURES
-- ============================================

-- Add points to user and update level
CREATE OR REPLACE FUNCTION add_user_points(
  p_user_id UUID,
  p_points INT,
  p_activity_id UUID DEFAULT NULL
) RETURNS INT AS $$
DECLARE
  v_new_points INT;
  v_new_level INT;
BEGIN
  -- Update gamification
  UPDATE user_gamification
  SET total_points = total_points + p_points
  WHERE user_id = p_user_id
  RETURNING total_points INTO v_new_points;

  -- Calculate new level
  SELECT CASE
    WHEN v_new_points < 500 THEN 1
    WHEN v_new_points < 1000 THEN 2
    WHEN v_new_points < 2000 THEN 3
    WHEN v_new_points < 4000 THEN 5
    WHEN v_new_points < 8000 THEN 7
    WHEN v_new_points < 16000 THEN 10
    WHEN v_new_points < 32000 THEN 15
    WHEN v_new_points < 64000 THEN 20
    WHEN v_new_points < 128000 THEN 30
    WHEN v_new_points < 256000 THEN 40
    WHEN v_new_points < 512000 THEN 50
    ELSE 100
  END INTO v_new_level;

  -- Update level if changed
  UPDATE user_gamification
  SET level = v_new_level
  WHERE user_id = p_user_id
  AND level != v_new_level;

  RETURN v_new_points;
END;
$$ LANGUAGE plpgsql;

-- Get user rank
CREATE OR REPLACE FUNCTION get_user_rank(
  p_user_id UUID
) RETURNS INT AS $$
DECLARE
  v_rank INT;
BEGIN
  SELECT rank INTO v_rank
  FROM leaderboard_top_100
  WHERE id = p_user_id;

  RETURN COALESCE(v_rank, 0);
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SEED DATA (Optional - for testing)
-- ============================================

-- Nothing to seed here - data is user-generated
