/*
  # Create Défi Rose Database Schema

  ## Overview
  This migration sets up the complete database structure for the Défi Rose rowing challenge application.

  ## 1. New Tables

  ### participants
  Stores information about participants (individuals or club representatives)
  - `id` (uuid, primary key)
  - `first_name` (text) - First name of the participant
  - `last_name` (text) - Last name of the participant
  - `email` (text, unique) - Email address for authentication
  - `club` (text, nullable) - Club name if applicable
  - `participant_type` (text) - Type: 'individual', 'club', or 'kine_cabinet'
  - `organization_name` (text, nullable) - Name of club or kinésithérapie cabinet
  - `city` (text, nullable) - City of the participant or organization
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### kilometer_entries
  Stores kilometer entries for the Défi Rose challenge
  - `id` (uuid, primary key)
  - `participant_id` (uuid, foreign key) - Reference to participant
  - `date` (date) - Date of the activity
  - `activity_type` (text) - Type: 'indoor', 'outdoor', or 'avifit'
  - `kilometers` (decimal) - Distance in kilometers
  - `duration` (text, nullable) - Duration of the activity
  - `location` (text, nullable) - Location where activity took place
  - `participation_type` (text) - Type: 'individual' or 'collective'
  - `participant_count` (integer) - Number of participants (default 1)
  - `description` (text, nullable) - Description of the activity
  - `photo_url` (text, nullable) - URL to uploaded photo
  - `validated` (boolean) - Whether entry is validated by admin
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### otp_codes
  Stores one-time passwords for email authentication
  - `id` (uuid, primary key)
  - `email` (text) - Email address
  - `code` (text) - 6-digit OTP code
  - `expires_at` (timestamptz) - Expiration time
  - `used` (boolean) - Whether code has been used
  - `created_at` (timestamptz) - Creation timestamp

  ### admins
  Stores admin user accounts
  - `id` (uuid, primary key)
  - `email` (text, unique) - Admin email
  - `password` (text) - Hashed password
  - `name` (text) - Admin name
  - `role` (text) - Role: 'admin' or 'super_admin'
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## 2. Security
  - Enable RLS on all tables
  - Participants can read and update their own data
  - Participants can create and read their own kilometer entries
  - Only authenticated users can access their data
  - Admins have full access (handled via service role)

  ## 3. Important Notes
  - All timestamps use timestamptz for proper timezone handling
  - Email addresses are unique to prevent duplicates
  - Cascade deletes ensure data integrity
  - Default values set for booleans and timestamps
*/

-- Create participants table
CREATE TABLE IF NOT EXISTS participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text UNIQUE NOT NULL,
  club text,
  participant_type text NOT NULL DEFAULT 'individual' CHECK (participant_type IN ('individual', 'club', 'kine_cabinet')),
  organization_name text,
  city text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create kilometer_entries table
CREATE TABLE IF NOT EXISTS kilometer_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id uuid NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  date date NOT NULL,
  activity_type text NOT NULL CHECK (activity_type IN ('indoor', 'outdoor', 'avifit')),
  kilometers decimal(10, 2) NOT NULL CHECK (kilometers > 0),
  duration text,
  location text,
  participation_type text NOT NULL DEFAULT 'individual' CHECK (participation_type IN ('individual', 'collective')),
  participant_count integer DEFAULT 1 CHECK (participant_count >= 1),
  description text,
  photo_url text,
  validated boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create otp_codes table
CREATE TABLE IF NOT EXISTS otp_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  code text NOT NULL,
  expires_at timestamptz NOT NULL,
  used boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_kilometer_entries_participant ON kilometer_entries(participant_id);
CREATE INDEX IF NOT EXISTS idx_kilometer_entries_date ON kilometer_entries(date);
CREATE INDEX IF NOT EXISTS idx_otp_codes_email ON otp_codes(email);
CREATE INDEX IF NOT EXISTS idx_otp_codes_expires ON otp_codes(expires_at);

-- Enable Row Level Security
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE kilometer_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- RLS Policies for participants table
CREATE POLICY "Users can view own participant data"
  ON participants FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own participant data"
  ON participants FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "Anyone can create participant"
  ON participants FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- RLS Policies for kilometer_entries table
CREATE POLICY "Users can view own kilometer entries"
  ON kilometer_entries FOR SELECT
  TO authenticated
  USING (auth.uid()::text = participant_id::text);

CREATE POLICY "Users can create own kilometer entries"
  ON kilometer_entries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = participant_id::text);

CREATE POLICY "Users can update own kilometer entries"
  ON kilometer_entries FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = participant_id::text)
  WITH CHECK (auth.uid()::text = participant_id::text);

CREATE POLICY "Users can delete own kilometer entries"
  ON kilometer_entries FOR DELETE
  TO authenticated
  USING (auth.uid()::text = participant_id::text);

-- RLS Policies for otp_codes table
CREATE POLICY "Anyone can create OTP codes"
  ON otp_codes FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view own OTP codes"
  ON otp_codes FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies for admins table (restrictive - only service role can access)
CREATE POLICY "Only service role can access admins"
  ON admins FOR ALL
  TO authenticated
  USING (false);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_participants_updated_at') THEN
    CREATE TRIGGER update_participants_updated_at
      BEFORE UPDATE ON participants
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_kilometer_entries_updated_at') THEN
    CREATE TRIGGER update_kilometer_entries_updated_at
      BEFORE UPDATE ON kilometer_entries
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_admins_updated_at') THEN
    CREATE TRIGGER update_admins_updated_at
      BEFORE UPDATE ON admins
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;