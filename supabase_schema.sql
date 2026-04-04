-- Run this in your Supabase SQL Editor to set up the tables!

-- Create Students Table
CREATE TABLE public.students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admission_no TEXT UNIQUE NOT NULL,
    roll_no TEXT,
    name TEXT NOT NULL,
    class TEXT NOT NULL,
    section TEXT,
    dob DATE,
    gender TEXT,
    blood_group TEXT,
    joining_date DATE,
    status TEXT DEFAULT 'Active',
    aadhar TEXT,
    address TEXT,
    -- Store hashed or plain password for MVP as requested:
    password TEXT NOT NULL DEFAULT 'password123',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) but allow public access for easy client-side demoing:
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all operations for all users" ON public.students FOR ALL USING (true) WITH CHECK (true);

-- Insert dummy student to test login:
INSERT INTO public.students (admission_no, roll_no, name, class, section, dob, gender, blood_group, joining_date, status, aadhar, address, password)
VALUES 
('ADM001', '001', 'Arjun Kumar Reddy', 'Pre-KG', 'A', '2021-05-15', 'Male', 'O+', '2024-06-10', 'Active', 'XXXX-XXXX-1234', 'H.No. 5-4-32, Ootla Village, Jinnaram, Sangareddy, Telangana 502319', 'password123');

-- We can create more tables later depending on requirements, e.g. fees, notices.
