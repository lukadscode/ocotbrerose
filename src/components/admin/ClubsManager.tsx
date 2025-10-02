import React, { useState, useEffect } from 'react';
import { MapPin, Plus, CreditCard as Edit2, Trash2, X } from 'lucide-react';

interface Club {
  id: string;
  name: string;
  city: string;
  country: string;
  totalKm: number;
  memberCount: number;
}

const ClubsManager = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingClub, setEditingClub] = useState<Club | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    country: 'France',
    totalKm: 0,
    memberCount: 0
  });

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    setLoading(true);
    try {
      setClubs([]);
    } catch (error) {
      console.error('Error fetching clubs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingClub) {
        console.log('Updating club:', editingClub.id, formData);
      } else {
        console.log('Creating club:', formData);
      }
      setShowForm(false);
      setEditingClub(null);
      resetForm();
      fetchClubs();
    } catch (error) {
      console.error('Error saving club:', error);
      alert('Erreur lors de l\'enregistrement');
    }
  };

  const handleEdit = (club: Club) => {
    setEditingClub(club);
    setFormData({
      name: club.name,
      city: club.city,
      country: club.country,
      totalKm: club.totalKm,
      memberCount: club.memberCount
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Supprimer le club "${name}" ?`)) return;
    try {
      console.log('Deleting club:', id);
      fetchClubs();
    } catch (error) {
      console.error('Error deleting club:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      city: '',
      country: 'France',
      totalKm: 0,
      memberCount: 0
    });
  };

  if (loading) {
    return <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Clubs</h2>
        <button
          onClick={() => {
            setEditingClub(null);
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
        >
          <Plus className="w-5 h-5" />
          <span>Nouveau club</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {editingClub ? 'Modifier le club' : 'Nouveau club'}
            </h3>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingClub(null);
                resetForm();
              }}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom du club</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pays</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de membres</label>
                <input
                  type="number"
                  value={formData.memberCount}
                  onChange={(e) => setFormData({ ...formData, memberCount: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingClub(null);
                  resetForm();
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
              >
                {editingClub ? 'Mettre à jour' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubs.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-lg shadow">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900">Aucun club</p>
          </div>
        ) : (
          clubs.map((club) => (
            <div key={club.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-amber-600" />
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(club)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(club.id, club.name)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{club.name}</h3>
              <p className="text-sm text-gray-600 mb-4">
                📍 {club.city}, {club.country}
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Kilomètres</span>
                  <span className="font-semibold text-pink-600">{club.totalKm.toFixed(1)} km</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Membres</span>
                  <span className="font-semibold text-gray-900">{club.memberCount}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ClubsManager;
