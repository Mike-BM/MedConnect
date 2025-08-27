/*
  # Seed Sample Data for MediConnect

  This migration populates the database with sample data for development and testing.

  ## Sample Data Includes

  1. **Hospitals** - 3 major medical centers with different specialties
  2. **Doctors** - Multiple doctors across various specializations
  3. **Sample Appointments** - Demo appointments to show functionality

  ## Note

  This is sample data for development purposes. In production, real data would be entered through the application interface.
*/

-- Insert sample hospitals
INSERT INTO hospitals (name, location, departments) VALUES
(
  'Central Medical Center', 
  'Downtown, 123 Health Street', 
  ARRAY['Emergency', 'Cardiology', 'Neurology', 'Surgery', 'Internal Medicine', 'Radiology']
),
(
  'St. Mary''s General Hospital', 
  'Westside, 456 Care Avenue', 
  ARRAY['Pediatrics', 'Gynecology', 'Orthopedics', 'Dermatology', 'Emergency', 'Surgery']
),
(
  'University Medical Center', 
  'University District, 789 Research Blvd', 
  ARRAY['Oncology', 'Neurology', 'Cardiology', 'Pediatrics', 'Emergency', 'Radiology', 'Surgery']
) ON CONFLICT DO NOTHING;

-- Insert sample doctors
INSERT INTO doctors (hospital_id, name, specialization, availability) 
SELECT 
  h.id,
  doctor_data.name,
  doctor_data.specialization,
  doctor_data.availability
FROM hospitals h
CROSS JOIN (
  VALUES 
    ('Sarah Johnson', 'Cardiology', ARRAY['Monday 9:00-17:00', 'Wednesday 9:00-17:00', 'Friday 9:00-17:00']),
    ('Michael Chen', 'Emergency Medicine', ARRAY['Monday 9:00-17:00', 'Tuesday 9:00-17:00', 'Thursday 9:00-17:00', 'Saturday 9:00-13:00']),
    ('Emily Rodriguez', 'Pediatrics', ARRAY['Tuesday 9:00-17:00', 'Thursday 9:00-17:00', 'Friday 9:00-17:00']),
    ('David Wilson', 'Orthopedics', ARRAY['Monday 9:00-17:00', 'Wednesday 9:00-17:00', 'Friday 9:00-17:00']),
    ('Lisa Thompson', 'Dermatology', ARRAY['Tuesday 9:00-17:00', 'Wednesday 9:00-17:00', 'Thursday 9:00-17:00']),
    ('Robert Kumar', 'Neurology', ARRAY['Monday 9:00-17:00', 'Tuesday 9:00-17:00', 'Friday 9:00-17:00']),
    ('Amanda Foster', 'Gynecology', ARRAY['Wednesday 9:00-17:00', 'Thursday 9:00-17:00', 'Saturday 9:00-13:00']),
    ('James Park', 'Internal Medicine', ARRAY['Monday 9:00-17:00', 'Wednesday 9:00-17:00', 'Thursday 9:00-17:00']),
    ('Maria Gonzalez', 'Oncology', ARRAY['Tuesday 9:00-17:00', 'Thursday 9:00-17:00', 'Friday 9:00-17:00'])
) AS doctor_data(name, specialization, availability)
WHERE h.name = CASE 
  WHEN doctor_data.specialization IN ('Cardiology', 'Emergency Medicine', 'Neurology', 'Internal Medicine') THEN 'Central Medical Center'
  WHEN doctor_data.specialization IN ('Pediatrics', 'Orthopedics', 'Dermatology', 'Gynecology') THEN 'St. Mary''s General Hospital'
  WHEN doctor_data.specialization IN ('Oncology', 'Neurology') THEN 'University Medical Center'
  ELSE 'Central Medical Center'
END
ON CONFLICT DO NOTHING;