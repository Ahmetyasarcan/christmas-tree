-- ============================================
-- Interactive Christmas Tree - Secret Notes
-- Supabase Schema and RLS Policies
-- ============================================
-- 
-- INSTRUCTIONS:
-- 1. Open your Supabase project dashboard
-- 2. Go to SQL Editor
-- 3. Copy and paste this entire file
-- 4. Execute it
-- ============================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Table: profiles
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all authenticated users to view profiles (needed for showing avatars/usernames on notes)
CREATE POLICY "Users can view all profiles"
  ON profiles
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- ============================================
-- Table: notes
-- ============================================
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  x FLOAT8 NOT NULL,
  y FLOAT8 NOT NULL,
  z FLOAT8 NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on notes
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert notes with their own user_id
CREATE POLICY "Users can insert own notes"
  ON notes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: All authenticated users can view notes (including text for the tree display)
CREATE POLICY "Users can view notes"
  ON notes
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- ============================================
-- Admin Access to Note Text
-- ============================================
-- 
-- NOTE: The frontend will check VITE_ADMIN_EMAIL to determine admin status.
-- For database-level admin access, you have two options:
--
-- Option 1: Create a custom function that checks admin status
-- Option 2: Use Supabase's built-in admin role (requires dashboard configuration)
--
-- For now, we'll create a function that can be used in policies.
-- You'll need to manually set admin users in Supabase or use a custom claim.
--
-- Example: Create a function to check if user is admin
-- (This is a placeholder - you'll need to implement based on your admin strategy)
--
-- CREATE OR REPLACE FUNCTION is_admin()
-- RETURNS BOOLEAN AS $$
-- BEGIN
--   -- Check if user has admin custom claim
--   -- This requires setting custom claims via Supabase Admin API
--   RETURN (auth.jwt() ->> 'user_role') = 'admin';
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;
--
-- Then create a policy:
-- CREATE POLICY "Admins can view note text"
--   ON notes
--   FOR SELECT
--   USING (is_admin() = true);
--
-- ============================================
-- Realtime Configuration
-- ============================================
-- Enable Realtime for notes table (for live updates)
-- This is typically done via Supabase Dashboard:
-- 1. Go to Database > Replication
-- 2. Enable replication for the 'notes' table
--
-- Or via SQL (if you have the right permissions):
-- ALTER PUBLICATION supabase_realtime ADD TABLE notes;
-- ============================================

-- ============================================
-- Indexes for Performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

