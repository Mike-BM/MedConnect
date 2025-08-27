import React, { useState, useEffect } from 'react';
import { Building2, Plus, Edit, Trash2, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import HospitalForm from '../components/HospitalForm';

export default function HospitalManagement() {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingHospital, setEditingHospital] = useState<any>(null);

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const { data, error } = await supabase
        .from('hospitals')
        .select('*')
        .order('name');

      if (error) throw error;
      setHospitals(data || []);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (hospitalId: string) => {
    if (!confirm('Are you sure you want to delete this hospital?')) return;

    try {
      const { error } = await supabase
        .from('hospitals')
        .delete()
        .eq('id', hospitalId);

      if (error) throw error;
      fetchHospitals();
    } catch (error) {
      console.error('Error deleting hospital:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-48"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Hospital Management</h1>
            <p className="mt-2 text-gray-600">Manage healthcare facilities and departments</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            <span>Add Hospital</span>
          </button>
        </div>

        {hospitals.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hospitals yet</h3>
            <p className="text-gray-600 mb-6">Get started by adding your first hospital</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
            >
              Add Your First Hospital
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hospitals.map((hospital) => (
              <div
                key={hospital.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{hospital.name}</h3>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => {
                        setEditingHospital(hospital);
                        setShowForm(true);
                      }}
                      className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(hospital.id)}
                      className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-gray-600 mb-4">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{hospital.location}</span>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Departments:</h4>
                  <div className="flex flex-wrap gap-1">
                    {hospital.departments?.map((dept: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                      >
                        {dept}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <HospitalForm
            hospital={editingHospital}
            onClose={() => {
              setShowForm(false);
              setEditingHospital(null);
            }}
            onSuccess={() => {
              fetchHospitals();
              setShowForm(false);
              setEditingHospital(null);
            }}
          />
        )}
      </div>
    </div>
  );
}