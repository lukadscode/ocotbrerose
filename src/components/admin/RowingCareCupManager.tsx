import React, { useState, useEffect } from 'react';
import { Trophy, CheckCircle, Download, CreditCard as Edit2, Save, X } from 'lucide-react';

const RowingCareCupManager = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [manualCount, setManualCount] = useState<number>(0);
  const [isEditingCount, setIsEditingCount] = useState(false);
  const [editCountValue, setEditCountValue] = useState('');
  const [manualAmount, setManualAmount] = useState<number>(0);
  const [isEditingAmount, setIsEditingAmount] = useState(false);
  const [editAmountValue, setEditAmountValue] = useState('');

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/rowing-care-cup');
      const data = await response.json();
      setRegistrations(data);

      const [countResponse, amountResponse] = await Promise.all([
        fetch('/api/site-content/rowing_care_cup_manual_count'),
        fetch('/api/site-content/rowing_care_cup_manual_amount')
      ]);

      if (countResponse.ok) {
        const content = await countResponse.json();
        setManualCount(parseInt(content.value) || 0);
      }

      if (amountResponse.ok) {
        const content = await amountResponse.json();
        setManualAmount(parseFloat(content.value) || 0);
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsPaid = async (id: string) => {
    try {
      const response = await fetch(`/api/rowing-care-cup/${id}/mark-paid`, {
        method: 'POST'
      });

      if (!response.ok) throw new Error('Erreur lors de la mise à jour');

      fetchRegistrations();
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  const handleEditCount = () => {
    setIsEditingCount(true);
    setEditCountValue(manualCount.toString());
  };

  const handleSaveCount = async () => {
    try {
      const value = parseInt(editCountValue) || 0;

      const checkResponse = await fetch('/api/site-content/rowing_care_cup_manual_count');

      if (checkResponse.ok) {
        const response = await fetch('/api/site-content/rowing_care_cup_manual_count', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value: value.toString() })
        });

        if (!response.ok) throw new Error('Erreur lors de la mise à jour');
      } else {
        const response = await fetch('/api/site-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            key: 'rowing_care_cup_manual_count',
            value: value.toString(),
            type: 'NUMBER',
            category: 'rowing_care_cup',
            label: 'Nombre d\'inscrits manuel Rowing Care Cup',
            description: 'Nombre d\'inscrits saisi manuellement pour la Rowing Care Cup'
          })
        });

        if (!response.ok) throw new Error('Erreur lors de la création');
      }

      setManualCount(value);
      setIsEditingCount(false);
    } catch (error) {
      console.error('Error updating manual count:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleEditAmount = () => {
    setIsEditingAmount(true);
    setEditAmountValue(manualAmount.toString());
  };

  const handleSaveAmount = async () => {
    try {
      const value = parseFloat(editAmountValue) || 0;

      const checkResponse = await fetch('/api/site-content/rowing_care_cup_manual_amount');

      if (checkResponse.ok) {
        const response = await fetch('/api/site-content/rowing_care_cup_manual_amount', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value: value.toString() })
        });

        if (!response.ok) throw new Error('Erreur lors de la mise à jour');
      } else {
        const response = await fetch('/api/site-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            key: 'rowing_care_cup_manual_amount',
            value: value.toString(),
            type: 'NUMBER',
            category: 'rowing_care_cup',
            label: 'Montant manuel Rowing Care Cup',
            description: 'Montant saisi manuellement pour les inscriptions hors ligne'
          })
        });

        if (!response.ok) throw new Error('Erreur lors de la création');
      }

      setManualAmount(value);
      setIsEditingAmount(false);
    } catch (error) {
      console.error('Error updating manual amount:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
    </div>;
  }

  const totalCount = registrations.length + manualCount;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Rowing Care Cup - Inscriptions</h2>
          <p className="text-sm text-gray-600 mt-1">
            {registrations.length} inscription(s) en ligne + {manualCount} inscription(s) manuelle(s) = <span className="font-semibold">{totalCount} total</span>
          </p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          <Download className="w-5 h-5" />
          <span>Exporter CSV</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Inscriptions manuelles</h3>
              <p className="text-sm text-gray-600 mt-1">Nombre d'inscrits hors ligne</p>
            </div>
            <div className="flex items-center space-x-3">
              {isEditingCount ? (
                <>
                  <input
                    type="number"
                    value={editCountValue}
                    onChange={(e) => setEditCountValue(e.target.value)}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    min="0"
                  />
                  <button
                    onClick={handleSaveCount}
                    className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Save className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setIsEditingCount(false)}
                    className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <>
                  <span className="text-2xl font-bold text-pink-600">{manualCount}</span>
                  <button
                    onClick={handleEditCount}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Montant manuel</h3>
              <p className="text-sm text-gray-600 mt-1">Montant collecté hors ligne</p>
            </div>
            <div className="flex items-center space-x-3">
              {isEditingAmount ? (
                <>
                  <input
                    type="number"
                    value={editAmountValue}
                    onChange={(e) => setEditAmountValue(e.target.value)}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    min="0"
                    step="0.01"
                  />
                  <button
                    onClick={handleSaveAmount}
                    className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Save className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setIsEditingAmount(false)}
                    className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <>
                  <span className="text-2xl font-bold text-green-600">{manualAmount}€</span>
                  <button
                    onClick={handleEditAmount}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {registrations.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900">Aucune inscription</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Participant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Distance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* Rows will be populated dynamically */}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RowingCareCupManager;