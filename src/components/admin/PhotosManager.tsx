import React, { useState, useEffect } from 'react';
import { Camera, CheckCircle, XCircle, Trash2 } from 'lucide-react';

const PhotosManager = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all');

  useEffect(() => {
    fetchPhotos();
  }, [filter]);

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/photos');
      const data = await response.json();

      let filtered = data;
      if (filter === 'approved') {
        filtered = data.filter((p: any) => p.approved);
      } else if (filter === 'pending') {
        filtered = data.filter((p: any) => !p.approved);
      }

      setPhotos(filtered);
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`/api/photos/${id}/approve`, {
        method: 'POST'
      });

      if (!response.ok) throw new Error('Erreur lors de l\'approbation');

      fetchPhotos();
    } catch (error) {
      console.error('Error approving photo:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette photo ?')) return;
    try {
      const response = await fetch(`/api/photos/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression');

      fetchPhotos();
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Galerie Photos</h2>
        <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-300 p-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded text-sm font-medium ${filter === 'all' ? 'bg-pink-100 text-pink-700' : 'text-gray-600'}`}
          >
            Toutes
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded text-sm font-medium ${filter === 'approved' ? 'bg-green-100 text-green-700' : 'text-gray-600'}`}
          >
            Approuvées
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded text-sm font-medium ${filter === 'pending' ? 'bg-orange-100 text-orange-700' : 'text-gray-600'}`}
          >
            En attente
          </button>
        </div>
      </div>

      {photos.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900">Aucune photo</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Photos grid will be populated dynamically */}
        </div>
      )}
    </div>
  );
};

export default PhotosManager;
