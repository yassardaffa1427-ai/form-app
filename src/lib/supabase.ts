import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Feedback = {
  id: string;
  attendee_name: string;
  email: string | null;
  workshop_date: string | null;
  event_name?: string | null;
  overall_rating: number;
  content_rating: number | null;
  speaker_rating: number | null;
  would_recommend: boolean | null;
  most_valuable: string | null;
  improvements: string | null;
  additional_comments: string | null;
  created_at: string;
};

export type FeedbackInput = {
  attendee_name: string;
  email?: string | null;
  workshop_date?: string | null;
  event_name?: string | null;
  overall_rating: number;
  content_rating?: number | null;
  speaker_rating?: number | null;
  would_recommend?: boolean | null;
  most_valuable?: string | null;
  improvements?: string | null;
  additional_comments?: string | null;
};
