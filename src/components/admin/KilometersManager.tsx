import React, { useState, useEffect } from 'react';
import { Search, CreditCard as Edit2, Trash2, CheckCircle, XCircle, ChevronLeft, ChevronRight, Filter, Target, Download } from 'lucide-react';
import { format } from 'date-fns';

interface KilometerEntry {
  id: string;
  participant: {
    firstName: string;
    lastName: string;
    email: string;
    club?: string;
  };
  date: Date;
  activityType: string;
  kilometers: number;
  duration?: string;
  location?: string;
  participationType: string;
  participantCount: number;
  description?: string;
  validated: boolean;
  createdAt: Date;
}

const KilometersManager = () => {
  const [entries, setEntries] = useState<KilometerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState<'all' | 'validated' | 'pending'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    kilometers: 0,
    validated: false
  });

  useEffect(() => {
    fetchEntries();
  }, [page, filter]);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/kilometers');
      const data = await response.json();

      let filtered = data;
      if (filter === 'validated') {
        filtered = data.filter((e: KilometerEntry) => e.validated);
      } else if (filter === 'pending') {
        filtered = data.filter((e: KilometerEntry) => !e.validated);
      }

      setEntries(filtered);
      setTotalPages(Math.ceil(filtered.length / 20));
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async (id: string) => {
    try {
      const response = await fetch(`/api/kilometers/${id}/validate`, {
        method: 'POST'
      });

      if (!response.ok) throw new Error('Erreur lors de la validation');

      fetchEntries();
    } catch (error) {
      console.error('Error validating entry:', error);
      alert('Erreur lors de la validation');
    }
  };

  const handleValidateMultiple = async () => {
    const pendingEntries = entries.filter(e => !e.validated);
    if (pendingEntries.length === 0) {
      alert('Aucune entrée en attente de validation');
      return;
    }

    if (!confirm(`Valider ${pendingEntries.length} entrées ?`)) {
      return;
    }

    try {
      const response = await fetch('/api/kilometers/validate-all', {
        method: 'POST'
      });

      if (!response.ok) throw new Error('Erreur lors de la validation');

      fetchEntries();
    } catch (error) {
      console.error('Error validating entries:', error);
      alert('Erreur lors de la validation');
    }
  };

  const handleEdit = (entry: KilometerEntry) => {
    setEditingId(entry.id);
    setEditForm({
      kilometers: entry.kilometers,
      validated: entry.validated
    });
  };

  const handleSave = async (id: string) => {
    try {
      const response = await fetch(`/api/kilometers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });

      if (!response.ok) throw new Error('Erreur lors de la mise à jour');

      setEditingId(null);
      fetchEntries();
    } catch (error) {
      console.error('Error updating entry:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette entrée ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/kilometers/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression');

      fetchEntries();
    } catch (error) {
      console.error('Error deleting entry:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const getActivityTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      INDOOR: 'Indoor',
      OUTDOOR: 'Outdoor',
      AVIFIT: 'AviFit'
    };
    return labels[type] || type;
  };

  const getActivityTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      INDOOR: 'bg-blue-100 text-blue-800',
      OUTDOOR: 'bg-green-100 text-green-800',
      AVIFIT: 'bg-purple-100 text-purple-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const exportToCSV = () => {
    const headers = [
      'Participant',
      'Email',
      'Club',
      'Date',
      'Type Activité',
      'Kilomètres',
      'Type Participation',
      'Nombre Participants',
      'Durée',
      'Lieu',
      'Description',
      'Statut',
      'Date Création'
    ];

    const rows = entries.map(e => [
      `${e.participant.firstName} ${e.participant.lastName}`,
      e.participant.email,
      e.participant.club || '',
      format(new Date(e.date), 'dd/MM/yyyy'),
      getActivityTypeLabel(e.activityType),
      e.kilometers.toFixed(1),
      e.participationType === 'COLLECTIVE' ? 'Collectif' : 'Individuel',
      e.participantCount.toString(),
      e.duration || '',
      e.location || '',
      e.description || '',
      e.validated ? 'Validé' : 'En attente',
      format(new Date(e.createdAt), 'dd/MM/yyyy HH:mm')
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `kilometres_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Kilomètres</h2>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-300 p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-pink-100 text-pink-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setFilter('validated')}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                filter === 'validated'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Validés
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                filter === 'pending'
                  ? 'bg-orange-100 text-orange-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              En attente
            </button>
          </div>
          <button
            onClick={exportToCSV}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            title="Exporter en CSV"
          >
            <Download className="w-4 h-4" />
            <span>Exporter CSV</span>
          </button>
          <button
            onClick={handleValidateMultiple}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Valider tout
          </button>
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
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kilomètres
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">Aucune entrée trouvée</p>
                    <p className="text-sm">Les kilomètres enregistrés apparaîtront ici</p>
                  </td>
                </tr>
              ) : (
                entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    {editingId === entry.id ? (
                      <>
                        <td className="px-6 py-4" colSpan={3}>
                          <div className="text-sm font-medium text-gray-900">
                            {entry.participant.firstName} {entry.participant.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{entry.participant.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            step="0.1"
                            value={editForm.kilometers}
                            onChange={(e) => setEditForm({ ...editForm, kilometers: parseFloat(e.target.value) })}
                            className="w-24 px-3 py-1 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-6 py-4" colSpan={2}>
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={editForm.validated}
                              onChange={(e) => setEditForm({ ...editForm, validated: e.target.checked })}
                              className="rounded text-green-600"
                            />
                            <span className="text-sm">Validé</span>
                          </label>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleSave(entry.id)}
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
                          <div className="text-sm font-medium text-gray-900">
                            {entry.participant.firstName} {entry.participant.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{entry.participant.email}</div>
                          {entry.participant.club && (
                            <div className="text-sm text-gray-500">{entry.participant.club}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {format(new Date(entry.date), 'dd/MM/yyyy')}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActivityTypeColor(entry.activityType)}`}>
                            {getActivityTypeLabel(entry.activityType)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-pink-600">
                            {entry.kilometers.toFixed(1)} km
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {entry.participationType === 'COLLECTIVE' ? 'Collectif' : 'Individuel'}
                          </div>
                          {entry.participationType === 'COLLECTIVE' && (
                            <div className="text-sm text-gray-500">
                              {entry.participantCount} personnes
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {entry.validated ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Validé
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              <XCircle className="w-3 h-3 mr-1" />
                              En attente
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            {!entry.validated && (
                              <button
                                onClick={() => handleValidate(entry.id)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded"
                                title="Valider"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleEdit(entry)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                              title="Modifier"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(entry.id)}
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
                ))
              )}
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

export default KilometersManager;
