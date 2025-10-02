import React, { useState } from 'react';
import { Target, Calendar, MapPin, Camera, X, Check, Clock, Users, Building2, User, ChevronRight, ChevronLeft } from 'lucide-react';
import { supabaseService, type ParticipantType, type ActivityType, type ParticipationType } from '../lib/supabase';

interface KilometerFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
  user: any;
}

type Step = 'type' | 'participant-info' | 'activity-details';

const KilometerForm: React.FC<KilometerFormProps> = ({ onClose, onSubmit, user }) => {
  const [currentStep, setCurrentStep] = useState<Step>('type');
  const [participantType, setParticipantType] = useState<ParticipantType>('individual');

  const [participantData, setParticipantData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    organizationName: '',
    city: ''
  });

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    activityType: 'indoor' as ActivityType,
    kilometers: '',
    duration: '',
    location: '',
    participationType: 'individual' as ParticipationType,
    participantCount: 1,
    description: '',
    photo: null as File | null,
    photoPreview: null as string | null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateParticipantInfo = () => {
    const newErrors: Record<string, string> = {};

    if (!participantData.firstName.trim()) {
      newErrors.firstName = 'Prénom requis';
    }

    if (!participantData.lastName.trim()) {
      newErrors.lastName = 'Nom requis';
    }

    if (!participantData.email.trim()) {
      newErrors.email = 'Email requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(participantData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (participantType === 'club' || participantType === 'kine_cabinet') {
      if (!participantData.organizationName.trim()) {
        newErrors.organizationName = participantType === 'club'
          ? 'Nom du club requis'
          : 'Nom du cabinet requis';
      }
      if (!participantData.city.trim()) {
        newErrors.city = 'Ville requise';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateActivityDetails = () => {
    const newErrors: Record<string, string> = {};

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

  const handleNext = () => {
    if (currentStep === 'type') {
      setCurrentStep('participant-info');
    } else if (currentStep === 'participant-info' && validateParticipantInfo()) {
      setCurrentStep('activity-details');
    }
  };

  const handleBack = () => {
    if (currentStep === 'activity-details') {
      setCurrentStep('participant-info');
    } else if (currentStep === 'participant-info') {
      setCurrentStep('type');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateActivityDetails() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      let participant = await supabaseService.getParticipantByEmail(participantData.email);

      if (!participant) {
        participant = await supabaseService.createParticipant({
          first_name: participantData.firstName,
          last_name: participantData.lastName,
          email: participantData.email,
          participant_type: participantType,
          organization_name: participantData.organizationName || undefined,
          city: participantData.city || undefined
        });
      }

      const entry = await supabaseService.createKilometerEntry({
        participant_id: participant.id,
        date: formData.date,
        activity_type: formData.activityType,
        kilometers: parseFloat(formData.kilometers),
        duration: formData.duration || undefined,
        location: formData.location || undefined,
        participation_type: formData.participationType,
        participant_count: formData.participantCount,
        description: formData.description || undefined,
        photo_url: formData.photoPreview || undefined
      });

      alert('Kilomètres enregistrés avec succès !');
      onSubmit(entry);
    } catch (error) {
      console.error('Error submitting kilometers:', error);
      alert('Erreur lors de l\'enregistrement: ' + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const updateParticipantData = (field: string, value: string) => {
    setParticipantData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, photo: 'La photo ne doit pas dépasser 5MB' }));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        updateFormData('photoPreview', e.target?.result);
      };
      reader.readAsDataURL(file);
      updateFormData('photo', file);
    }
  };

  const removePhoto = () => {
    updateFormData('photo', null);
    updateFormData('photoPreview', null);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center space-x-2 mb-6">
      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
        currentStep === 'type' ? 'bg-pink-600 text-white' : 'bg-pink-200 text-pink-600'
      }`}>
        1
      </div>
      <div className="w-12 h-1 bg-pink-200">
        <div className={`h-full bg-pink-600 transition-all ${
          currentStep !== 'type' ? 'w-full' : 'w-0'
        }`}></div>
      </div>
      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
        currentStep === 'participant-info' ? 'bg-pink-600 text-white' :
        currentStep === 'activity-details' ? 'bg-pink-200 text-pink-600' : 'bg-gray-200 text-gray-400'
      }`}>
        2
      </div>
      <div className="w-12 h-1 bg-pink-200">
        <div className={`h-full bg-pink-600 transition-all ${
          currentStep === 'activity-details' ? 'w-full' : 'w-0'
        }`}></div>
      </div>
      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
        currentStep === 'activity-details' ? 'bg-pink-600 text-white' : 'bg-gray-200 text-gray-400'
      }`}>
        3
      </div>
    </div>
  );

  const renderTypeStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Type de participation
        </h3>
        <p className="text-gray-600 mb-6">
          Participez-vous en tant qu'individu ou représentez-vous une organisation ?
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <button
          type="button"
          onClick={() => setParticipantType('individual')}
          className={`p-6 border-2 rounded-xl text-left transition-all ${
            participantType === 'individual'
              ? 'border-pink-500 bg-pink-50'
              : 'border-gray-300 hover:border-pink-300'
          }`}
        >
          <div className="flex items-start space-x-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              participantType === 'individual' ? 'bg-pink-100' : 'bg-gray-100'
            }`}>
              <User className={`w-6 h-6 ${
                participantType === 'individual' ? 'text-pink-600' : 'text-gray-600'
              }`} />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-lg mb-1">Participation individuelle</h4>
              <p className="text-sm text-gray-600">
                Je participe à titre personnel au Défi Rose
              </p>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setParticipantType('club')}
          className={`p-6 border-2 rounded-xl text-left transition-all ${
            participantType === 'club'
              ? 'border-pink-500 bg-pink-50'
              : 'border-gray-300 hover:border-pink-300'
          }`}
        >
          <div className="flex items-start space-x-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              participantType === 'club' ? 'bg-pink-100' : 'bg-gray-100'
            }`}>
              <Users className={`w-6 h-6 ${
                participantType === 'club' ? 'text-pink-600' : 'text-gray-600'
              }`} />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-lg mb-1">Club d'aviron</h4>
              <p className="text-sm text-gray-600">
                Je représente un club d'aviron et j'enregistre les kilomètres de nos membres
              </p>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setParticipantType('kine_cabinet')}
          className={`p-6 border-2 rounded-xl text-left transition-all ${
            participantType === 'kine_cabinet'
              ? 'border-pink-500 bg-pink-50'
              : 'border-gray-300 hover:border-pink-300'
          }`}
        >
          <div className="flex items-start space-x-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              participantType === 'kine_cabinet' ? 'bg-pink-100' : 'bg-gray-100'
            }`}>
              <Building2 className={`w-6 h-6 ${
                participantType === 'kine_cabinet' ? 'text-pink-600' : 'text-gray-600'
              }`} />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-lg mb-1">Cabinet de kinésithérapie</h4>
              <p className="text-sm text-gray-600">
                Je représente un cabinet de kinésithérapie participant au Défi Rose
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );

  const renderParticipantInfoStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Vos informations
        </h3>
        <p className="text-gray-600 mb-6">
          {participantType === 'individual'
            ? 'Renseignez vos coordonnées'
            : participantType === 'club'
            ? 'Renseignez les informations du club'
            : 'Renseignez les informations du cabinet'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prénom *
          </label>
          <input
            type="text"
            value={participantData.firstName}
            onChange={(e) => updateParticipantData('firstName', e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Votre prénom"
          />
          {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom *
          </label>
          <input
            type="text"
            value={participantData.lastName}
            onChange={(e) => updateParticipantData('lastName', e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
              errors.lastName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Votre nom"
          />
          {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email *
        </label>
        <input
          type="email"
          value={participantData.email}
          onChange={(e) => updateParticipantData('email', e.target.value)}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="votre.email@example.com"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      {(participantType === 'club' || participantType === 'kine_cabinet') && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {participantType === 'club' ? 'Nom du club *' : 'Nom du cabinet *'}
            </label>
            <input
              type="text"
              value={participantData.organizationName}
              onChange={(e) => updateParticipantData('organizationName', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                errors.organizationName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={participantType === 'club' ? 'Ex: Club Nautique de Paris' : 'Ex: Cabinet Kiné Santé'}
            />
            {errors.organizationName && <p className="text-red-500 text-sm mt-1">{errors.organizationName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ville *
            </label>
            <input
              type="text"
              value={participantData.city}
              onChange={(e) => updateParticipantData('city', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                errors.city ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: Paris"
            />
            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
          </div>
        </>
      )}
    </div>
  );

  const renderActivityDetailsStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Détails de l'activité
        </h3>
        <p className="text-gray-600 mb-6">
          Enregistrez vos kilomètres parcourus
        </p>
      </div>

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
            onChange={(e) => updateFormData('activityType', e.target.value as ActivityType)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="indoor">Aviron indoor (ergomètre)</option>
            <option value="outdoor">Aviron bateau</option>
            <option value="avifit">AviFit</option>
          </select>
        </div>
      </div>

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
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Ajouter mes kilomètres
                </h2>
                <p className="text-sm text-gray-600">
                  Enregistrez votre participation au Défi Rose
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

          {renderStepIndicator()}
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {currentStep === 'type' && renderTypeStep()}
          {currentStep === 'participant-info' && renderParticipantInfoStep()}
          {currentStep === 'activity-details' && renderActivityDetailsStep()}

          <div className="flex justify-between pt-6 border-t border-gray-200 mt-6">
            {currentStep !== 'type' ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium flex items-center space-x-2"
                disabled={isSubmitting}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Retour</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Annuler
              </button>
            )}

            {currentStep !== 'activity-details' ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 font-medium flex items-center space-x-2"
              >
                <span>Suivant</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 font-medium flex items-center space-x-2 disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>{isSubmitting ? 'Enregistrement...' : 'Enregistrer'}</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default KilometerForm;
