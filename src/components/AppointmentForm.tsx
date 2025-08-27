import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Building2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface AppointmentFormProps {
  appointment?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AppointmentForm({ appointment, onClose, onSuccess }: AppointmentFormProps) {
  const { user } = useAuth();
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [patient, setPatient] = useState<any>(null);
  const [selectedHospital, setSelectedHospital] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [status, setStatus] = useState('scheduled');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInitialData();
    if (appointment) {
      setSelectedDoctor(appointment.doctor_id);
      setDate(appointment.date);
      setTime(appointment.time);
      setStatus(appointment.status);
    }
  }, [appointment]);

  useEffect(() => {
    if (selectedHospital) {
      fetchDoctors(selectedHospital);
    }
  }, [selectedHospital]);

  const fetchInitialData = async () => {
    try {
      // Fetch hospitals
      const { data: hospitalsData } = await supabase
        .from('hospitals')
        .select('*')
        .order('name');

      setHospitals(hospitalsData || []);

      // Get or create patient record
      const { data: patientData } = await supabase
        .from('patients')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (!patientData) {
        // Create patient record if it doesn't exist
        const { data: newPatient, error } = await supabase
          .from('patients')
          .insert({
            user_id: user?.id,
            name: user?.email?.split('@')[0] || 'Patient',
            contact_info: user?.email || '',
            medical_history: ''
          })
          .select()
          .single();

        if (error) throw error;
        setPatient(newPatient);
      } else {
        setPatient(patientData);
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  const fetchDoctors = async (hospitalId: string) => {
    try {
      const { data } = await supabase
        .from('doctors')
        .select('*')
        .eq('hospital_id', hospitalId)
        .order('name');

      setDoctors(data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!patient) {
      setError('Patient information not found');
      setLoading(false);
      return;
    }

    try {
      const appointmentData = {
        patient_id: patient.id,
        doctor_id: selectedDoctor,
        date,
        time,
        status
      };

      if (appointment) {
        // Update existing appointment
        const { error } = await supabase
          .from('appointments')
          .update(appointmentData)
          .eq('id', appointment.id);

        if (error) throw error;
      } else {
        // Create new appointment
        const { error } = await supabase
          .from('appointments')
          .insert(appointmentData);

        if (error) throw error;
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to save appointment');
    } finally {
      setLoading(false);
    }
  };

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {appointment ? 'Edit Appointment' : 'Book New Appointment'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Building2 className="h-4 w-4 inline mr-1" />
              Hospital
            </label>
            <select
              value={selectedHospital}
              onChange={(e) => {
                setSelectedHospital(e.target.value);
                setSelectedDoctor(''); // Reset doctor when hospital changes
              }}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a hospital</option>
              {hospitals.map((hospital) => (
                <option key={hospital.id} value={hospital.id}>
                  {hospital.name} - {hospital.location}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="h-4 w-4 inline mr-1" />
              Doctor
            </label>
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              required
              disabled={!selectedHospital}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select a doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  Dr. {doctor.name} - {doctor.specialization}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="h-4 w-4 inline mr-1" />
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={today}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="h-4 w-4 inline mr-1" />
              Time
            </label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a time</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          {appointment && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="scheduled">Scheduled</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Saving...' : appointment ? 'Update' : 'Book Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}