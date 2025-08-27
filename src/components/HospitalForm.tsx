import React, { useState, useEffect } from 'react';
import { X, Building2, MapPin, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface HospitalFormProps {
  hospital?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function HospitalForm({ hospital, onClose, onSuccess }: HospitalFormProps) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [departments, setDepartments] = useState<string[]>([]);
  const [newDepartment, setNewDepartment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const commonDepartments = [
    'Emergency', 'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 
    'Dermatology', 'Gynecology', 'Radiology', 'Surgery', 'Internal Medicine'
  ];

  useEffect(() => {
    if (hospital) {
      setName(hospital.name);
      setLocation(hospital.location);
      setDepartments(hospital.departments || []);
    }
  }, [hospital]);

  const addDepartment = (dept: string) => {
    if (dept && !departments.includes(dept)) {
      setDepartments([...departments, dept]);
      setNewDepartment('');
    }
  };

  const removeDepartment = (index: number) => {
    setDepartments(departments.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const hospitalData = {
        name,
        location,
        departments
      };

      if (hospital) {
        const { error } = await supabase
          .from('hospitals')
          .update(hospitalData)
          .eq('id', hospital.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('hospitals')
          .insert(hospitalData);

        if (error) throw error;
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to save hospital');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {hospital ? 'Edit Hospital' : 'Add New Hospital'}
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
              Hospital Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter hospital name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="h-4 w-4 inline mr-1" />
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter hospital location"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Departments
            </label>
            
            {/* Quick add common departments */}
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-2">Quick add:</p>
              <div className="flex flex-wrap gap-1">
                {commonDepartments.map((dept) => (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => addDepartment(dept)}
                    disabled={departments.includes(dept)}
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom department input */}
            <div className="flex space-x-2 mb-3">
              <input
                type="text"
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
                placeholder="Add custom department"
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addDepartment(newDepartment);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => addDepartment(newDepartment)}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Selected departments */}
            <div className="space-y-2">
              {departments.map((dept, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                  <span className="text-sm text-gray-900">{dept}</span>
                  <button
                    type="button"
                    onClick={() => removeDepartment(index)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
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
              disabled={loading}
              className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Saving...' : hospital ? 'Update' : 'Add Hospital'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}