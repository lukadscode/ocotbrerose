import React, { useState, useEffect } from 'react';
import { useAdminAuthContext } from '../components/AdminAuthProvider';
import {
  Users,
  Target,
  MapPin,
  Settings,
  LogOut,
  BarChart3,
  FileText,
  Calendar,
  Camera,
  Trophy
} from 'lucide-react';
import ParticipantsManager from '../components/admin/ParticipantsManager';
import KilometersManager from '../components/admin/KilometersManager';
import EventsManager from '../components/admin/EventsManager';
import RowingCareCupManager from '../components/admin/RowingCareCupManager';
import PhotosManager from '../components/admin/PhotosManager';
import ClubsManager from '../components/admin/ClubsManager';
import ContentManager from '../components/admin/ContentManager';
import { adminAPI } from '../lib/api';

type Tab = 'dashboard' | 'participants' | 'kilometers' | 'events' | 'rowing-care-cup' | 'photos' | 'clubs' | 'content';

const AdminDashboard = () => {
  const { admin, logout } = useAdminAuthContext();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [stats, setStats] = useState({
    totalParticipants: 0,
    totalKilometers: 0,
    totalClubs: 0,
    totalEvents: 0,
    pendingPhotos: 0,
    pendingEntries: 0,
    pendingKilometers: 0,
    rowingRegistrations: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await adminAPI.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'dashboard' as Tab, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'participants' as Tab, label: 'Participants', icon: Users },
    { id: 'kilometers' as Tab, label: 'Kilomètres', icon: Target },
    { id: 'events' as Tab, label: 'Événements', icon: Calendar },
    { id: 'rowing-care-cup' as Tab, label: 'Rowing Care Cup', icon: Trophy },
    { id: 'photos' as Tab, label: 'Photos', icon: Camera },
    { id: 'clubs' as Tab, label: 'Clubs', icon: MapPin },
    { id: 'content' as Tab, label: 'Contenu du site', icon: FileText }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Dashboard Admin</h1>
                <p className="text-sm text-gray-600">Octobre Rose 2025 x FFAviron</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{admin?.name}</p>
                <p className="text-xs text-gray-600">{admin?.role}</p>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                      ${activeTab === tab.id
                        ? 'border-pink-500 text-pink-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{stats.totalParticipants}</h3>
                <p className="text-sm text-gray-600">Participants</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-pink-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{stats.totalKilometers.toFixed(1)}</h3>
                <p className="text-sm text-gray-600">Kilomètres validés</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{stats.totalClubs}</h3>
                <p className="text-sm text-gray-600">Clubs</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{stats.rowingRegistrations}</h3>
                <p className="text-sm text-gray-600">Inscriptions Rowing Care Cup</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">En attente de validation</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Entrées</span>
                    <span className="text-2xl font-bold text-orange-600">{stats.pendingEntries}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Kilomètres</span>
                    <span className="text-xl font-bold text-orange-600">{stats.pendingKilometers.toFixed(1)} km</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <span className="text-gray-600">Photos</span>
                    <span className="text-2xl font-bold text-orange-600">{stats.pendingPhotos}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Événements</h3>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total</span>
                  <span className="text-2xl font-bold text-gray-900">{stats.totalEvents}</span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Progression</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Objectif: 27 000 km</span>
                    <span className="font-semibold text-pink-600">
                      {((stats.totalKilometers / 27000) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-pink-500 to-rose-600 h-3 rounded-full"
                      style={{ width: `${Math.min((stats.totalKilometers / 27000) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'participants' && <ParticipantsManager />}
        {activeTab === 'kilometers' && <KilometersManager />}
        {activeTab === 'events' && <EventsManager />}
        {activeTab === 'rowing-care-cup' && <RowingCareCupManager />}
        {activeTab === 'photos' && <PhotosManager />}
        {activeTab === 'clubs' && <ClubsManager />}
        {activeTab === 'content' && <ContentManager />}
      </div>
    </div>
  );
};

export default AdminDashboard;
