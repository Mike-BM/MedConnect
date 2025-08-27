/*
  # MediConnect Database Schema

  This migration creates the complete database schema for the MediConnect health application.

  ## Tables Created

  1. **hospitals**
     - `id` (uuid, primary key)
     - `name` (text, hospital name)
     - `location` (text, hospital address/location)
     - `departments` (text[], array of department names)
     - `created_at` (timestamp)

  2. **doctors** 
     - `id` (uuid, primary key)
     - `hospital_id` (uuid, foreign key to hospitals)
     - `name` (text, doctor's full name)
     - `specialization` (text, medical specialization)
     - `availability` (text[], array of available time slots)
     - `created_at` (timestamp)

  3. **patients**
     - `id` (uuid, primary key) 
     - `user_id` (uuid, foreign key to auth.users)
     - `name` (text, patient's full name)
     - `contact_info` (text, phone/email contact)
     - `medical_history` (text, patient's medical history)
     - `created_at` (timestamp)

  4. **appointments**
     - `id` (uuid, primary key)
     - `patient_id` (uuid, foreign key to patients)
     - `doctor_id` (uuid, foreign key to doctors)
     - `date` (date, appointment date)
     - `time` (time, appointment time)
     - `status` (text, appointment status: scheduled/confirmed/completed/cancelled)
     - `created_at` (timestamp)

  ## Security

  - Enable RLS (Row Level Security) on all tables
  - Add policies for authenticated users to manage their own data
  - Patients can only access their own appointments and profile
  - Healthcare providers can manage appointments and view patient data as needed

  ## Relationships

  - hospitals (1) -> doctors (many)
  - doctors (1) -> appointments (many) 
  - patients (1) -> appointments (many)
  - auth.users (1) -> patients (1)
*/

-- Create hospitals table
CREATE TABLE IF NOT EXISTS hospitals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  departments text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id uuid REFERENCES hospitals(id) ON DELETE CASCADE,
  name text NOT NULL,
  specialization text NOT NULL,
  availability text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  contact_info text NOT NULL,
  medical_history text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE,
  date date NOT NULL,
  time time NOT NULL,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for hospitals (public read, authenticated write)
CREATE POLICY "Anyone can view hospitals"
  ON hospitals
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage hospitals"
  ON hospitals
  FOR ALL
  TO authenticated
  USING (true);

-- RLS Policies for doctors (public read, authenticated write)
CREATE POLICY "Anyone can view doctors"
  ON doctors
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage doctors"
  ON doctors
  FOR ALL
  TO authenticated
  USING (true);

-- RLS Policies for patients (users can only access their own data)
CREATE POLICY "Users can view their own patient data"
  ON patients
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own patient data"
  ON patients
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own patient data"
  ON patients
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for appointments (patients can access their appointments)
CREATE POLICY "Users can view their own appointments"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM patients 
      WHERE patients.id = appointments.patient_id 
      AND patients.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create appointments for themselves"
  ON appointments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM patients 
      WHERE patients.id = appointments.patient_id 
      AND patients.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own appointments"
  ON appointments
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM patients 
      WHERE patients.id = appointments.patient_id 
      AND patients.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own appointments"
  ON appointments
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM patients 
      WHERE patients.id = appointments.patient_id 
      AND patients.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_doctors_hospital_id ON doctors(hospital_id);
CREATE INDEX IF NOT EXISTS idx_patients_user_id ON patients(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);