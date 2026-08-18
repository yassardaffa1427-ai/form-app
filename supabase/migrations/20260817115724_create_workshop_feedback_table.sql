/*
# Create workshop_feedback table (single-tenant, no auth)

1. New Tables
- `workshop_feedback`
  - `id` (uuid, primary key)
  - `attendee_name` (text, not null) — name of the person giving feedback
  - `email` (text, nullable) — optional contact email
  - `workshop_date` (date, nullable) — the date the workshop was attended
  - `overall_rating` (integer 1-5, not null) — overall satisfaction rating
  - `content_rating` (integer 1-5, nullable) — rating of workshop content
  - `speaker_rating` (integer 1-5, nullable) — rating of the speaker/presenter
  - `venue_rating` (integer 1-5, nullable) — rating of the venue/facilities
  - `would_recommend` (boolean, nullable) — would they recommend this workshop
  - `most_valuable` (text, nullable) — most valuable part of the workshop
  - `improvements` (text, nullable) — suggested improvements
  - `additional_comments` (text, nullable) — any other comments
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `workshop_feedback`.
- Allow anon + authenticated CRUD because this is a public feedback form with no sign-in.
*/

CREATE TABLE IF NOT EXISTS workshop_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attendee_name text NOT NULL,
  email text,
  workshop_date date,
  overall_rating integer NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
  content_rating integer CHECK (content_rating >= 1 AND content_rating <= 5),
  speaker_rating integer CHECK (speaker_rating >= 1 AND speaker_rating <= 5),
  venue_rating integer CHECK (venue_rating >= 1 AND venue_rating <= 5),
  would_recommend boolean,
  most_valuable text,
  improvements text,
  additional_comments text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE workshop_feedback ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_feedback" ON workshop_feedback;
CREATE POLICY "anon_select_feedback"
  ON workshop_feedback FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_feedback" ON workshop_feedback;
CREATE POLICY "anon_insert_feedback"
  ON workshop_feedback FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_feedback" ON workshop_feedback;
CREATE POLICY "anon_update_feedback"
  ON workshop_feedback FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_feedback" ON workshop_feedback;
CREATE POLICY "anon_delete_feedback"
  ON workshop_feedback FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS workshop_feedback_created_at_idx ON workshop_feedback (created_at DESC);
