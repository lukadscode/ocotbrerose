import React, { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit2, Trash2, Calendar, X } from 'lucide-react';
import { format } from 'date-fns';

interface Event {
  id: string;
  title: string;
  description: string;
  dateStart: Date;
  dateEnd?: Date;
  timeInfo?: string;
  eventType: string;
  color: string;
  status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'FEATURED';
}

const EventsManager = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dateStart: '',
    dateEnd: '',
    timeInfo: '',
    eventType: 'CHALLENGE',
    color: 'from-pink-500 to-rose-500',
    status: 'UPCOMING' as 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'FEATURED'
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      setEvents([]);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        console.log('Updating event:', editingEvent.id, formData);
      } else {
        console.log('Creating event:', formData);
      }
      setShowForm(false);
      setEditingEvent(null);
      resetForm();
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Erreur lors de l\'enregistrement');
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      dateStart: format(new Date(event.dateStart), 'yyyy-MM-dd'),
      dateEnd: event.dateEnd ? format(new Date(event.dateEnd), 'yyyy-MM-dd') : '',
      timeInfo: event.timeInfo || '',
      eventType: event.eventType,
      color: event.color,
      status: event.status
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Supprimer l'événement "${title}" ?`)) return;
    try {
      console.log('Deleting event:', id);
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      dateStart: '',
      dateEnd: '',
      timeInfo: '',
      eventType: 'CHALLENGE',
      color: 'from-pink-500 to-rose-500',
      status: 'UPCOMING'
    });
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
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Événements</h2>
        <button
          onClick={() => {
            setEditingEvent(null);
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
        >
          <Plus className="w-5 h-5" />
          <span>Nouvel événement</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {editingEvent ? 'Modifier l\'événement' : 'Nouvel événement'}
            </h3>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingEvent(null);
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={formData.eventType}
                  onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                >
                  <option value="CHALLENGE">Défi</option>
                  <option value="ROWING_CARE_CUP">Rowing Care Cup</option>
                  <option value="WORKSHOP">Atelier</option>
                  <option value="CONFERENCE">Conférence</option>
                  <option value="OTHER">Autre</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de début
                </label>
                <input
                  type="date"
                  value={formData.dateStart}
                  onChange={(e) => setFormData({ ...formData, dateStart: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de fin (optionnel)
                </label>
                <input
                  type="date"
                  value={formData.dateEnd}
                  onChange={(e) => setFormData({ ...formData, dateEnd: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horaire (optionnel)
                </label>
                <input
                  type="text"
                  value={formData.timeInfo}
                  onChange={(e) => setFormData({ ...formData, timeInfo: e.target.value })}
                  placeholder="ex: 14h00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                >
                  <option value="UPCOMING">À venir</option>
                  <option value="ACTIVE">En cours</option>
                  <option value="COMPLETED">Terminé</option>
                  <option value="FEATURED">À la une</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Couleur
                </label>
                <select
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                >
                  <option value="from-pink-500 to-rose-500">Rose</option>
                  <option value="from-blue-500 to-sky-500">Bleu</option>
                  <option value="from-green-500 to-emerald-500">Vert</option>
                  <option value="from-amber-500 to-orange-500">Orange</option>
                  <option value="from-purple-500 to-violet-500">Violet</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingEvent(null);
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
                {editingEvent ? 'Mettre à jour' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900">Aucun événement</p>
            <p className="text-gray-600">Créez votre premier événement</p>
          </div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className={`h-32 bg-gradient-to-r ${event.color} flex items-center justify-center`}>
                <Calendar className="w-12 h-12 text-white" />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    event.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                    event.status === 'FEATURED' ? 'bg-purple-100 text-purple-800' :
                    event.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {event.status === 'ACTIVE' ? 'En cours' :
                     event.status === 'FEATURED' ? 'À la une' :
                     event.status === 'COMPLETED' ? 'Terminé' : 'À venir'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{event.description}</p>
                <div className="text-sm text-gray-500 mb-4">
                  <p>📅 {format(new Date(event.dateStart), 'dd/MM/yyyy')}</p>
                  {event.timeInfo && <p>🕒 {event.timeInfo}</p>}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(event)}
                    className="flex-1 px-4 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                  >
                    <Edit2 className="w-4 h-4 inline mr-1" />
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(event.id, event.title)}
                    className="px-4 py-2 bg-red-50 text-red-700 rounded hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventsManager;
