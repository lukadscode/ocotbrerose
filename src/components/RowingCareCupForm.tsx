import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Users, Trophy, X, Check, CreditCard } from 'lucide-react';
import { participantAPI, rowingCareCupAPI } from '../lib/api';

const RowingCareCupForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    // Informations personnelles
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    club: '',
    
    // Catégorie sélectionnée
    category: 'individual',
    distance: '',
    gender: '',
    teamType: '',
    
    // Informations équipe (si relais)
    teamName: '',
    teamMembers: [],
    
    // Consentements
    dataConsent: false,
    newsletter: true
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const individualCategories = [
    { id: '500m-femmes', label: '500m Femmes', price: 5 },
    { id: '500m-hommes', label: '500m Hommes', price: 5 },
    { id: '500m-femmes-cancer', label: '500m Femmes atteintes d\'un cancer', price: 5 }
  ];

  const teamCategories = [
    { id: '4x500-femmes', label: '4x500m Relais Féminin (dont 2 femmes atteintes d\'un cancer)', price: 16 },
    { id: '4x500-mixte', label: '4x500m Relais Mixte (dont 2 femmes atteintes d\'un cancer)', price: 16 }
  ];

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'Prénom requis';
    if (!formData.lastName.trim()) newErrors.lastName = 'Nom requis';
    if (!formData.email.trim()) newErrors.email = 'Email requis';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email invalide';
    if (!formData.phone.trim()) newErrors.phone = 'Téléphone requis';
    if (!formData.distance) newErrors.distance = 'Catégorie requise';
    if (!formData.dataConsent) newErrors.dataConsent = 'Consentement requis';
    
    if (formData.category === 'team') {
      if (!formData.teamName.trim()) newErrors.teamName = 'Nom d\'équipe requis';
      if (formData.teamMembers.length < 3) newErrors.teamMembers = '3 coéquipiers requis (4 au total)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        // 1. Créer ou récupérer le participant
        let participant = await participantAPI.create({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          club: formData.club
        });

        // 2. Enregistrer l'inscription Rowing Care Cup
        const selectedCategory = formData.category === 'individual' 
          ? individualCategories.find(cat => cat.id === formData.distance)
          : teamCategories.find(cat => cat.id === formData.distance);

        const registrationData = {
          participantId: participant.id,
          category: formData.category,
          distance: formData.distance,
          gender: formData.category === 'individual' ? selectedCategory.label : undefined,
          teamType: formData.category === 'team' ? selectedCategory.label : undefined,
          price: selectedCategory.price
        };

        await rowingCareCupAPI.register(registrationData);

        alert(`Inscription enregistrée avec succès ! Vous allez être redirigé vers le paiement (${selectedCategory.price}€)`);
        
        // Redirection vers HelloAsso pour le paiement
        const helloAssoUrl = `${import.meta.env.VITE_HELLOASSO_URL || 'https://www.helloasso.com'}/associations/rowing-care-cup-2025`;
        window.open(helloAssoUrl, '_blank');
        
        onSubmit(registrationData);
      } catch (error) {
        console.error('Error submitting registration:', error);
        alert('Erreur lors de l\'inscription. Veuillez réessayer.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const getSelectedPrice = () => {
    if (formData.category === 'individual') {
      return individualCategories.find(cat => cat.id === formData.distance)?.price || 5;
    } else {
      return teamCategories.find(cat => cat.id === formData.distance)?.price || 16;
    }
  };

  const addTeamMember = () => {
    if (formData.teamMembers.length < 3) {
      updateFormData('teamMembers', [...formData.teamMembers, { name: '', email: '', phone: '' }]);
    }
  };

  const updateTeamMember = (index, field, value) => {
    const updatedMembers = formData.teamMembers.map((member, i) => 
      i === index ? { ...member, [field]: value } : member
    );
    updateFormData('teamMembers', updatedMembers);
  };

  const removeTeamMember = (index) => {
    updateFormData('teamMembers', formData.teamMembers.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Inscription Rowing Care Cup
                </h2>
                <p className="text-sm text-gray-600">
                  18 octobre 2025 - Événement connecté national
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
          {/* Informations personnelles */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Informations personnelles
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => updateFormData('firstName', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
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
                  value={formData.lastName}
                  onChange={(e) => updateFormData('lastName', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Votre nom"
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="votre@email.com"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="06 12 34 56 78"
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Club / Structure
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.club}
                  onChange={(e) => updateFormData('club', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nom de votre club ou structure"
                />
              </div>
            </div>
          </div>

          {/* Sélection catégorie */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-blue-600" />
              Catégorie de course
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <button
                type="button"
                onClick={() => updateFormData('category', 'individual')}
                className={`p-4 border rounded-xl text-left transition-all ${
                  formData.category === 'individual'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <User className="w-6 h-6 text-blue-600" />
                  <div>
                    <h4 className="font-semibold">Course Individuelle</h4>
                    <p className="text-sm text-gray-600">500m - 5€</p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => updateFormData('category', 'team')}
                className={`p-4 border rounded-xl text-left transition-all ${
                  formData.category === 'team'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Users className="w-6 h-6 text-blue-600" />
                  <div>
                    <h4 className="font-semibold">Relais d'Équipe</h4>
                    <p className="text-sm text-gray-600">4x500m - 16€</p>
                  </div>
                </div>
              </button>
            </div>

            {/* Sélection distance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Distance spécifique *
              </label>
              <div className="space-y-3">
                {(formData.category === 'individual' ? individualCategories : teamCategories).map((cat) => (
                  <label key={cat.id} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="distance"
                      value={cat.id}
                      checked={formData.distance === cat.id}
                      onChange={(e) => updateFormData('distance', e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">{cat.label}</span>
                        <span className="text-blue-600 font-bold">{cat.price}€</span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.distance && <p className="text-red-500 text-sm mt-1">{errors.distance}</p>}
            </div>
          </div>

          {/* Informations équipe */}
          {formData.category === 'team' && (
            <div className="space-y-4 p-4 bg-blue-50 rounded-xl">
              <h4 className="font-semibold text-gray-900">Informations de l'équipe</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de l'équipe *
                </label>
                <input
                  type="text"
                  value={formData.teamName}
                  onChange={(e) => updateFormData('teamName', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.teamName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: Les Rameurs Roses"
                />
                {errors.teamName && <p className="text-red-500 text-sm mt-1">{errors.teamName}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Coéquipiers (3 requis)
                  </label>
                  <button
                    type="button"
                    onClick={addTeamMember}
                    disabled={formData.teamMembers.length >= 3}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
                  >
                    + Ajouter un coéquipier
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.teamMembers.map((member, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-white rounded-lg">
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nom complet"
                      />
                      <input
                        type="email"
                        value={member.email}
                        onChange={(e) => updateTeamMember(index, 'email', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Email"
                      />
                      <div className="flex items-center space-x-2">
                        <input
                          type="tel"
                          value={member.phone}
                          onChange={(e) => updateTeamMember(index, 'phone', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Téléphone"
                        />
                        <button
                          type="button"
                          onClick={() => removeTeamMember(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {formData.teamMembers.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Aucun coéquipier ajouté. Cliquez sur "Ajouter un coéquipier" pour commencer.
                  </p>
                )}

                {errors.teamMembers && <p className="text-red-500 text-sm mt-1">{errors.teamMembers}</p>}
              </div>
            </div>
          )}

          {/* Récapitulatif */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
            <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
              <Check className="w-5 h-5 mr-2" />
              Récapitulatif de l'inscription
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-700">Participant :</span>
                <span className="ml-2 font-medium">{formData.firstName} {formData.lastName}</span>
              </div>
              <div>
                <span className="text-blue-700">Email :</span>
                <span className="ml-2 font-medium">{formData.email}</span>
              </div>
              <div>
                <span className="text-blue-700">Catégorie :</span>
                <span className="ml-2 font-medium">
                  {formData.category === 'individual' ? 'Individuelle' : 'Relais d\'équipe'}
                </span>
              </div>
              <div>
                <span className="text-blue-700">Prix :</span>
                <span className="ml-2 font-medium text-blue-600">{getSelectedPrice()}€</span>
              </div>
            </div>
            {formData.category === 'team' && formData.teamName && (
              <div className="mt-3 pt-3 border-t border-blue-200">
                <span className="text-blue-700 text-sm">Équipe :</span>
                <span className="ml-2 font-medium">{formData.teamName}</span>
                {formData.teamMembers.length > 0 && (
                  <div className="mt-1">
                    <span className="text-blue-700 text-sm">Coéquipiers :</span>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {formData.teamMembers.map((member, index) => (
                        <span key={index} className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
                          {member.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Consentements */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="newsletter"
                checked={formData.newsletter}
                onChange={(e) => updateFormData('newsletter', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
              />
              <label htmlFor="newsletter" className="text-sm text-gray-700">
                Je souhaite recevoir les actualités de la Rowing Care Cup et des événements FFAviron
              </label>
            </div>

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="dataConsent"
                checked={formData.dataConsent}
                onChange={(e) => updateFormData('dataConsent', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
              />
              <label htmlFor="dataConsent" className="text-sm text-gray-700">
                J'accepte que mes données soient utilisées dans le cadre de la Rowing Care Cup 2025 *
              </label>
            </div>
            {errors.dataConsent && <p className="text-red-500 text-sm">{errors.dataConsent}</p>}
          </div>

          {/* Boutons */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium"
              disabled={isSubmitting}
            >
              Annuler
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-medium flex items-center space-x-2 disabled:opacity-50 transform hover:scale-105 transition-all duration-200"
            >
              <CreditCard className="w-5 h-5" />
              <span>{isSubmitting ? 'Inscription...' : `S'inscrire (${getSelectedPrice()}€)`}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RowingCareCupForm;