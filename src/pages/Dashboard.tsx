import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Stethoscope, 
  Building2, 
  Users, 
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import AppointmentStats from '../components/AppointmentStats';
import RecentActivity from '../components/RecentActivity';
import HealthTips from '../components/HealthTips';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalAppointments: 0,
    upcomingAppointments: 0,
    totalHospitals: 0,
    totalDoctors: 0
  });
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch appointments count
      const { count: appointmentsCount } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true });

      // Fetch upcoming appointments count
      const today = new Date().toISOString().split('T')[0];
      const { count: upcomingCount } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .gte('date', today)
        .eq('status', 'scheduled');

      // Fetch hospitals count
      const { count: hospitalsCount } = await supabase
        .from('hospitals')
        .select('*', { count: 'exact', head: true });

      // Fetch doctors count
      const { count: doctorsCount } = await supabase
        .from('doctors')
        .select('*', { count: 'exact', head: true });

      // Fetch recent appointments with doctor and hospital info
      const { data: appointments } = await supabase
        .from('appointments')
        .select(`
          *,
          doctors (
            name,
            specialization,
            hospitals (name)
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        totalAppointments: appointmentsCount || 0,
        upcomingAppointments: upcomingCount || 0,
        totalHospitals: hospitalsCount || 0,
        totalDoctors: doctorsCount || 0
      });

      setRecentAppointments(appointments || []);

      // Generate recent activity from appointments
      const activities = appointments?.slice(0, 5).map((apt: any) => ({
        id: apt.id,
        type: 'appointment_created',
        description: `Appointment scheduled with Dr. ${apt.doctors?.name} at ${apt.doctors?.hospitals?.name}`,
        timestamp: apt.created_at
      })) || [];

      setRecentActivity(activities);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'scheduled':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'cancelled':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back! Here's your healthcare overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8">
          <AppointmentStats 
            stats={{
              total: stats.totalAppointments,
              scheduled: stats.upcomingAppointments,
              confirmed: 0,
              completed: 0,
              cancelled: 0
            }}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/appointments"
                className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
              >
                <Calendar className="h-8 w-8 text-blue-600 group-hover:text-blue-700 mb-2" />
                <span className="text-sm font-medium text-gray-900">Book Appointment</span>
              </Link>

              <Link
                to="/symptom-checker"
                className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group"
              >
                <Stethoscope className="h-8 w-8 text-green-600 group-hover:text-green-700 mb-2" />
                <span className="text-sm font-medium text-gray-900">Check Symptoms</span>
              </Link>
            </div>
          </div>

          <RecentActivity activities={recentActivity} />

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">System Stats</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4 text-purple-600" />
                  <span className="text-sm text-gray-600">Hospitals</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">{stats.totalHospitals}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-orange-600" />
                  <span className="text-sm text-gray-600">Doctors</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">{stats.totalDoctors}</span>
              </div>
            </div>
          </div>
        </div>

        <HealthTips />
      </div>
    </div>
  );
}