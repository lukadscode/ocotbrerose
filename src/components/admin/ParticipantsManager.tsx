import React, { useState, useEffect } from 'react';
import { Search, CreditCard as Edit2, Trash2, ChevronLeft, ChevronRight, Mail, User } from 'lucide-react';

interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  club?: string;
  totalKm: number;
  entriesCount: number;
  registrationsCount: number;
  createdAt: Date;
}

const ParticipantsManager = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    club: ''
  });

  useEffect(() => {
    fetchParticipants();
  }, [page, search]);

  const fetchParticipants = async () => {
    setLoading(true);
    try {
      setParticipants([
        {
          id: '1',
          firstName: 'Marie',
          lastName: 'Dupont',
          email: 'marie.dupont@example.com',
          club: 'Club Nautique Paris',
          totalKm: 125.5,
          entriesCount: 15,
          registrationsCount: 1,
          createdAt: new Date()
        }
      ]);
      setTotalPages(1);
    } catch (error) {
      console.error('Error fetching participants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (participant: Participant) => {
    setEditingId(participant.id);
    setEditForm({
      firstName: participant.firstName,
      lastName: participant.lastName,
      email: participant.email,
      club: participant.club || ''
    });
  };

  const handleSave = async (id: string) => {
    try {
      console.log('Updating participant:', id, editForm);
      setEditingId(null);
      fetchParticipants();
    } catch (error) {
      console.error('Error updating participant:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${name} ? Cette action est irréversible.`)) {
      return;
    }

    try {
      console.log('Deleting participant:', id);
      fetchParticipants();
    } catch (error) {
      console.error('Error deleting participant:', error);
      alert('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Participants</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher par nom, email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Club
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kilomètres
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activités
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {participants.map((participant) => (
                <tr key={participant.id} className="hover:bg-gray-50">
                  {editingId === participant.id ? (
                    <>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editForm.firstName}
                            onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                            className="w-full px-3 py-1 border border-gray-300 rounded"
                            placeholder="Prénom"
                          />
                          <input
                            type="text"
                            value={editForm.lastName}
                            onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                            className="w-full px-3 py-1 border border-gray-300 rounded"
                            placeholder="Nom"
                          />
                          <input
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            className="w-full px-3 py-1 border border-gray-300 rounded"
                            placeholder="Email"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={editForm.club}
                          onChange={(e) => setEditForm({ ...editForm, club: e.target.value })}
                          className="w-full px-3 py-1 border border-gray-300 rounded"
                          placeholder="Club"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {participant.totalKm.toFixed(1)} km
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {participant.entriesCount} entrées
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleSave(participant.id)}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            Sauver
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                          >
                            Annuler
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center mr-3">
                            <User className="w-5 h-5 text-pink-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {participant.firstName} {participant.lastName}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail className="w-3 h-3 mr-1" />
                              {participant.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {participant.club || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-pink-600">
                          {participant.totalKm.toFixed(1)} km
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {participant.entriesCount} entrées
                        </div>
                        <div className="text-sm text-gray-500">
                          {participant.registrationsCount} inscription(s) RCC
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(participant)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                            title="Modifier"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(participant.id, `${participant.firstName} ${participant.lastName}`)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Page {page} sur {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipantsManager;
