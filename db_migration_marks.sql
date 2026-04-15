-- ============================================================
-- SAPS DATABASE UPGRADE V4 - MARKS FEATURE
-- Run this in your Supabase SQL Editor
-- ============================================================

CREATE TABLE public.marks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    faculty_id UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    faculty_name TEXT,
    subject TEXT NOT NULL,
    exam_type TEXT NOT NULL,
    max_marks INTEGER NOT NULL,
    marks_obtained DECIMAL(5,2) NOT NULL,
    grade TEXT,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note: We use DECIMAL(5,2) for marks_obtained to support half-marks (e.g. 95.5)
