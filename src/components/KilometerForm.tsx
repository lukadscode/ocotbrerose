import React, { useState } from 'react';
import { Target, Calendar, MapPin, Camera, Upload, X, Check, Clock, Users } from 'lucide-react';

const KilometerForm = ({ onClose, onSubmit, user }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    activityType: 'indoor',
    kilometers: '',
    duration: '',
    location: '',
    participationType: 'individual',
    participantCount: 1,
    description: '',
    photo: null,
    photoPreview: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.kilometers || parseFloat(formData.kilometers) <= 0) {
      newErrors.kilometers = 'Distance requise et supérieure à 0';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date requise';
    }
    
    if (formData.participationType === 'collective' && formData.participantCount < 2) {
      newErrors.participantCount = 'Minimum 2 participants pour une séance collective';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await handleKilometerSubmission();
      } catch (error) {
        console.error('Kilometer submission error:', error);
        alert('Erreur lors de l\'enregistrement: ' + error.message);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleKilometerSubmission = async () => {
    try {
      let photoUrl = null;
      
      // Pour la démo, simuler l'upload de photo
      if (formData.photo) {
        photoUrl = formData.photoPreview;
      }

      // Pour la démo, créer un objet de résultat
      const entry = {
        id: Date.now().toString(),
        participantId: user.id,
        date: formData.date,
        activityType: formData.activityType,
        kilometers: parseFloat(formData.kilometers),
        duration: formData.duration,
        location: formData.location,
        participationType: formData.participationType,
        participantCount: formData.participantCount,
        description: formData.description,
        photoUrl: photoUrl,
        validated: true,
        createdAt: new Date()
      };

      const result = {
        ...entry,
        date: formData.date,
        activityType: formData.activityType,
        kilometers: parseFloat(formData.kilometers),
        duration: formData.duration,
        location: formData.location,
        participationType: formData.participationType,
        participantCount: formData.participantCount,
        description: formData.description,
        photoUrl: photoUrl
      };

      alert('Kilomètres enregistrés avec succès !');
      onSubmit(result);
    } catch (error) {
      console.error('Error submitting kilometers:', error);
      throw error;
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, photo: 'La photo ne doit pas dépasser 5MB' }));
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        updateFormData('photoPreview', e.target.result);
      };
      reader.readAsDataURL(file);
      updateFormData('photo', file);
    }
  };

  const removePhoto = () => {
    updateFormData('photo', null);
    updateFormData('photoPreview', null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Ajouter mes kilomètres
                </h2>
                <p className="text-sm text-gray-600">
                  Enregistrez votre séance d'aviron
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Date et type d'activité */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de la séance *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => updateFormData('date', e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type d'activité *
              </label>
              <select
                value={formData.activityType}
                onChange={(e) => updateFormData('activityType', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="indoor">Aviron indoor (ergomètre)</option>
                <option value="outdoor">Aviron bateau</option>
                <option value="avifit">AviFit</option>
              </select>
            </div>
          </div>

          {/* Distance et durée */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Distance parcourue (km) *
              </label>
              <div className="relative">
                <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.kilometers}
                  onChange={(e) => updateFormData('kilometers', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                    errors.kilometers ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: 5.2"
                />
              </div>
              {errors.kilometers && <p className="text-red-500 text-sm mt-1">{errors.kilometers}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durée (optionnel)
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => updateFormData('duration', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Ex: 45 min ou 1h30"
                />
              </div>
            </div>
          </div>

          {/* Lieu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lieu de la séance
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.location}
                onChange={(e) => updateFormData('location', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Ex: Club Nautique de Paris, À domicile, Seine - Boulogne"
              />
            </div>
          </div>

          {/* Type de participation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Type de participation
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => updateFormData('participationType', 'individual')}
                className={`p-4 border rounded-xl text-left transition-all ${
                  formData.participationType === 'individual'
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-300 hover:border-pink-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Target className="w-5 h-5 text-pink-600" />
                  <div>
                    <h4 className="font-medium">Individuelle</h4>
                    <p className="text-sm text-gray-600">Séance personnelle</p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => updateFormData('participationType', 'collective')}
                className={`p-4 border rounded-xl text-left transition-all ${
                  formData.participationType === 'collective'
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-300 hover:border-pink-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-pink-600" />
                  <div>
                    <h4 className="font-medium">Collective</h4>
                    <p className="text-sm text-gray-600">Séance en groupe</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Nombre de participants si collectif */}
          {formData.participationType === 'collective' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de participants *
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  min="2"
                  value={formData.participantCount}
                  onChange={(e) => updateFormData('participantCount', parseInt(e.target.value))}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                    errors.participantCount ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nombre de personnes"
                />
              </div>
              {errors.participantCount && <p className="text-red-500 text-sm mt-1">{errors.participantCount}</p>}
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (optionnel)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => updateFormData('description', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
              placeholder="Décrivez votre séance, vos sensations, un message de motivation..."
            />
          </div>

          {/* Upload photo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photo de la séance (optionnel)
            </label>
            
            {!formData.photoPreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-pink-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-2">Cliquez pour ajouter une photo</p>
                  <p className="text-sm text-gray-500">PNG, JPG jusqu'à 5MB</p>
                </label>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={formData.photoPreview}
                  alt="Aperçu"
                  className="w-full h-48 object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            
            {errors.photo && <p className="text-red-500 text-sm mt-1">{errors.photo}</p>}
          </div>

          {/* Récapitulatif */}
          <div className="bg-pink-50 rounded-xl p-4">
            <h4 className="font-semibold text-pink-900 mb-2">Récapitulatif</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-pink-700">Distance :</span>
                <span className="ml-2 font-medium">{formData.kilometers || '0'} km</span>
              </div>
              <div>
                <span className="text-pink-700">Type :</span>
                <span className="ml-2 font-medium">
                  {formData.activityType === 'indoor' ? 'Indoor' : 
                   formData.activityType === 'outdoor' ? 'Bateau' : 'AviFit'}
                </span>
              </div>
              <div>
                <span className="text-pink-700">Participation :</span>
                <span className="ml-2 font-medium">
                  {formData.participationType === 'individual' ? 'Individuelle' : 
                   `Collective (${formData.participantCount} pers.)`}
                </span>
              </div>
              <div>
                <span className="text-pink-700">Date :</span>
                <span className="ml-2 font-medium">
                  {formData.date ? new Date(formData.date).toLocaleDateString('fr-FR') : '-'}
                </span>
              </div>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex justify-between pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium"
              disabled={isSubmitting}
            >
              Annuler
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 font-medium flex items-center space-x-2 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'Enregistrement...' : 'Enregistrer mes kilomètres'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KilometerForm;