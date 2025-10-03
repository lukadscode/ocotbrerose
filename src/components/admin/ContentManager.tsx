import React, { useState, useEffect } from 'react';
import { FileText, Plus, CreditCard as Edit2, Save, X, Settings } from 'lucide-react';

interface SiteContent {
  id: string;
  key: string;
  value: string;
  type: 'TEXT' | 'NUMBER' | 'HTML' | 'JSON' | 'IMAGE_URL';
  category: string;
  label: string;
  description?: string;
}

const ContentManager = () => {
  const [contents, setContents] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContent, setNewContent] = useState({
    key: '',
    value: '',
    type: 'TEXT' as 'TEXT' | 'NUMBER' | 'HTML' | 'JSON' | 'IMAGE_URL',
    category: 'general',
    label: '',
    description: ''
  });

  useEffect(() => {
    fetchContents();
  }, [categoryFilter]);

  const fetchContents = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/site-content');
      const data = await response.json();
      setContents(data);
    } catch (error) {
      console.error('Error fetching contents:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'all', label: 'Toutes les catégories' },
    { value: 'general', label: 'Général' },
    { value: 'home', label: 'Page d\'accueil' },
    { value: 'defi_rose', label: 'Défi Rose' },
    { value: 'rowing_care_cup', label: 'Rowing Care Cup' },
    { value: 'footer', label: 'Pied de page' }
  ];

  const handleEdit = (content: SiteContent) => {
    setEditingId(content.id);
    setEditValue(content.value);
  };

  const handleSave = async (content: SiteContent) => {
    try {
      const response = await fetch(`/api/site-content/${content.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: editValue })
      });

      if (!response.ok) throw new Error('Erreur lors de la mise à jour');

      setEditingId(null);
      fetchContents();
    } catch (error) {
      console.error('Error updating content:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/site-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContent)
      });

      if (!response.ok) throw new Error('Erreur lors de la création');

      setShowAddForm(false);
      setNewContent({
        key: '',
        value: '',
        type: 'TEXT',
        category: 'general',
        label: '',
        description: ''
      });
      fetchContents();
    } catch (error) {
      console.error('Error creating content:', error);
      alert('Erreur lors de la création');
    }
  };

  const filteredContents = categoryFilter === 'all'
    ? contents
    : contents.filter(c => c.category === categoryFilter);

  if (loading) {
    return <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gestion du Contenu</h2>
        <div className="flex items-center space-x-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
          >
            <Plus className="w-5 h-5" />
            <span>Nouveau contenu</span>
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Nouveau contenu</h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Clé</label>
                <input
                  type="text"
                  value={newContent.key}
                  onChange={(e) => setNewContent({ ...newContent, key: e.target.value })}
                  placeholder="ex: home_title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Label</label>
                <input
                  type="text"
                  value={newContent.label}
                  onChange={(e) => setNewContent({ ...newContent, label: e.target.value })}
                  placeholder="ex: Titre de la page d'accueil"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                <select
                  value={newContent.category}
                  onChange={(e) => setNewContent({ ...newContent, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                >
                  {categories.filter(c => c.value !== 'all').map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={newContent.type}
                  onChange={(e) => setNewContent({ ...newContent, type: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                >
                  <option value="TEXT">Texte</option>
                  <option value="NUMBER">Nombre</option>
                  <option value="HTML">HTML</option>
                  <option value="JSON">JSON</option>
                  <option value="IMAGE_URL">URL Image</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Valeur</label>
              {newContent.type === 'HTML' ? (
                <textarea
                  value={newContent.value}
                  onChange={(e) => setNewContent({ ...newContent, value: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  required
                />
              ) : (
                <input
                  type={newContent.type === 'NUMBER' ? 'number' : 'text'}
                  value={newContent.value}
                  onChange={(e) => setNewContent({ ...newContent, value: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  required
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description (optionnel)</label>
              <textarea
                value={newContent.description}
                onChange={(e) => setNewContent({ ...newContent, description: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
              >
                Créer
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="divide-y divide-gray-200">
          {filteredContents.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900">Aucun contenu trouvé</p>
            </div>
          ) : (
            filteredContents.map((content) => (
              <div key={content.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{content.label}</h3>
                      <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                        {content.category}
                      </span>
                      <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">
                        {content.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Clé: <code className="bg-gray-100 px-2 py-1 rounded text-xs">{content.key}</code>
                    </p>
                    {content.description && (
                      <p className="text-sm text-gray-500 mb-3">{content.description}</p>
                    )}
                    {editingId === content.id ? (
                      <div className="space-y-3">
                        {content.type === 'HTML' ? (
                          <textarea
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                          />
                        ) : (
                          <input
                            type={content.type === 'NUMBER' ? 'number' : 'text'}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                          />
                        )}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleSave(content)}
                            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            <Save className="w-4 h-4" />
                            <span>Sauvegarder</span>
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm font-mono text-gray-900 whitespace-pre-wrap break-words">
                          {content.value}
                        </p>
                      </div>
                    )}
                  </div>
                  {editingId !== content.id && (
                    <button
                      onClick={() => handleEdit(content)}
                      className="ml-4 p-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentManager;
