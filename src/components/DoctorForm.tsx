import React, { useState, useEffect } from 'react';
import { X, User, Stethoscope, Building2, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface DoctorFormProps {
  doctor?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DoctorForm({ doctor, onClose, onSuccess }: DoctorFormProps) {
  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [hospitalId, setHospitalId] = useState('');
  const [availability, setAvailability] = useState<string[]>([]);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const specializations = [
    'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology',
    'Gynecology', 'Radiology', 'Surgery', 'Internal Medicine', 'Emergency Medicine',
    'Psychiatry', 'Oncology', 'Ophthalmology', 'ENT', 'Anesthesiology'
  ];

  const timeSlots = [
    'Monday 9:00-17:00', 'Tuesday 9:00-17:00', 'Wednesday 9:00-17:00',
    'Thursday 9:00-17:00', 'Friday 9:00-17:00', 'Saturday 9:00-13:00'
  ];

  useEffect(() => {
    fetchHospitals();
    if (doctor) {
      setName(doctor.name);
      setSpecialization(doctor.specialization);
      setHospitalId(doctor.hospital_id);
      setAvailability(doctor.availability || []);
    }
  }, [doctor]);

  const fetchHospitals = async () => {
    try {
      const { data, error } = await supabase
        .from('hospitals')
        .select('id, name, location')
        .order('name');

      if (error) throw error;
      setHospitals(data || []);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
    }
  };

  const toggleAvailability = (slot: string) => {
    if (availability.includes(slot)) {
      setAvailability(availability.filter(s => s !== slot));
    } else {
      setAvailability([...availability, slot]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const doctorData = {
        name,
        specialization,
        hospital_id: hospitalId,
        availability
      };

      if (doctor) {
        const { error } = await supabase
          .from('doctors')
          .update(doctorData)
          .eq('id', doctor.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('doctors')
          .insert(doctorData);

        if (error) throw error;
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to save doctor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {doctor ? 'Edit Doctor' : 'Add New Doctor'}
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
              <User className="h-4 w-4 inline mr-1" />
              Doctor Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter doctor's full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Stethoscope className="h-4 w-4 inline mr-1" />
              Specialization
            </label>
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select specialization</option>
              {specializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Building2 className="h-4 w-4 inline mr-1" />
              Hospital
            </label>
            <select
              value={hospitalId}
              onChange={(e) => setHospitalId(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select hospital</option>
              {hospitals.map((hospital) => (
                <option key={hospital.id} value={hospital.id}>
                  {hospital.name} - {hospital.location}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="h-4 w-4 inline mr-1" />
              Availability
            </label>
            <div className="space-y-2">
              {timeSlots.map((slot) => (
                <label key={slot} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={availability.includes(slot)}
                    onChange={() => toggleAvailability(slot)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{slot}</span>
                </label>
              ))}
            </div>
          </div>

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
              disabled={loading || !hospitalId}
              className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Saving...' : doctor ? 'Update' : 'Add Doctor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}