import React from 'react';
import { User } from 'lucide-react';
import PatientProfile from '../components/PatientProfile';

export default function Profile() {
  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-lg">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600">Manage your personal and medical information</p>
            </div>
          </div>
        </div>

        <PatientProfile />
      </div>
    </div>
  );
}