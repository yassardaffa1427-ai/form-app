-- Add event_name column to workshop_feedback table
ALTER TABLE workshop_feedback 
ADD COLUMN IF NOT EXISTS event_name text DEFAULT 'Seminar AI (Markaz Al-Ma''tuq)';
