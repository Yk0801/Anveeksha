-- ============================================================
-- SAPS DATABASE UPGRADE V4 - MARKS FEATURE FIX
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Disable Row Level Security on the marks table so the React app can insert records
ALTER TABLE public.marks DISABLE ROW LEVEL SECURITY;

-- Alternatively, if you want to keep RLS enabled but allow public access:
-- CREATE POLICY "Enable full access for all to marks" ON public.marks FOR ALL USING (true) WITH CHECK (true);
/.