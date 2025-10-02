import React, { useState } from 'react';
import { User, Mail, Building2, Globe, Calendar, Activity, MapPin, FileText, Image as ImageIcon, CheckCircle2, ArrowRight, ArrowLeft, X } from 'lucide-react';

interface SimpleDefiFormProps {
  onClose: () => void;
  onSubmit: () => void;
}

const SimpleDefiForm: React.FC<SimpleDefiFormProps> = ({ onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    typeParticipant: '',
    firstName: '',
    lastName: '',
    email: '',
    pays: '',
    structureName: '',
    structureEmail: '',
    kilometers: '',
    date: new Date().toISOString().split('T')[0],
    activityType: 'indoor',
    duration: '',
    location: '',
    description: '',
    photoUrl: '',
    participantCount: 1
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.typeParticipant) {
        newErrors.typeParticipant = "Veuillez choisir un type de participant";
      }
    }

    if (step === 2) {
      if (formData.typeParticipant === 'individual') {
        if (!formData.firstName.trim()) newErrors.firstName = 'Prénom requis';
        if (!formData.lastName.trim()) newErrors.lastName = 'Nom requis';
        if (!formData.email.trim()) newErrors.email = 'Email requis';
        if (!formData.pays.trim()) newErrors.pays = 'Pays requis';
      } else if (formData.typeParticipant === 'structure') {
        if (!formData.structureName.trim()) newErrors.structureName = 'Nom de la structure requis';
        if (!formData.structureEmail.trim()) newErrors.structureEmail = 'Email requis';
        if (!formData.pays.trim()) newErrors.pays = 'Pays requis';
        if (!formData.participantCount || formData.participantCount < 1) {
          newErrors.participantCount = 'Nombre de participants requis (min. 1)';
        }
      }
    }

    if (step === 3) {
      if (!formData.kilometers || parseFloat(formData.kilometers as string) <= 0) {
        newErrors.kilometers = 'Distance requise (supérieure à 0)';
      }
      if (!formData.date) newErrors.date = 'Date requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/defi-rose/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de la soumission');
      }

      const totalKm = formData.typeParticipant === 'structure'
        ? parseFloat(formData.kilometers as string) * formData.participantCount
        : parseFloat(formData.kilometers as string);

      alert(`🎀 Merci ! ${totalKm} km ont été enregistrés avec succès !`);
      onSubmit();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la soumission. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 px-8 py-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Défi ROSE 2025</h2>
            <p className="text-pink-100 text-sm mt-1">Étape {step} sur 3</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-8 py-2">
          <div className="flex items-center justify-between mb-6">
            {[1, 2, 3].map((i) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      step >= i
                        ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg scale-110'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {step > i ? <CheckCircle2 className="w-5 h-5" /> : i}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${step >= i ? 'text-pink-600' : 'text-gray-400'}`}>
                    {i === 1 ? 'Type' : i === 2 ? 'Identité' : 'Activité'}
                  </span>
                </div>
                {i < 3 && (
                  <div className={`flex-1 h-1 mx-2 rounded ${step > i ? 'bg-gradient-to-r from-pink-500 to-rose-500' : 'bg-gray-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-8 overflow-y-auto max-h-[calc(90vh-200px)]">
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Vous participez en tant que...</h3>
                <p className="text-gray-600 text-sm mb-6">Choisissez votre type de participation</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => updateFormData('typeParticipant', 'individual')}
                  className={`group relative overflow-hidden p-6 border-2 rounded-2xl transition-all duration-200 ${
                    formData.typeParticipant === 'individual'
                      ? 'border-pink-500 bg-gradient-to-br from-pink-50 to-rose-50 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-pink-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      formData.typeParticipant === 'individual'
                        ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white'
                        : 'bg-gray-100 text-gray-400 group-hover:bg-pink-100 group-hover:text-pink-500'
                    } transition-colors`}>
                      <User className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Participant individuel</div>
                      <div className="text-sm text-gray-500 mt-1">Je participe seul(e)</div>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => updateFormData('typeParticipant', 'structure')}
                  className={`group relative overflow-hidden p-6 border-2 rounded-2xl transition-all duration-200 ${
                    formData.typeParticipant === 'structure'
                      ? 'border-pink-500 bg-gradient-to-br from-pink-50 to-rose-50 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-pink-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      formData.typeParticipant === 'structure'
                        ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white'
                        : 'bg-gray-100 text-gray-400 group-hover:bg-pink-100 group-hover:text-pink-500'
                    } transition-colors`}>
                      <Building2 className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Club / Structure</div>
                      <div className="text-sm text-gray-500 mt-1">Cabinet kiné ou club</div>
                    </div>
                  </div>
                </button>
              </div>

              {errors.typeParticipant && (
                <p className="text-red-500 text-sm flex items-center mt-2">
                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                  {errors.typeParticipant}
                </p>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Vos informations</h3>
                <p className="text-gray-600 text-sm mb-6">
                  {formData.typeParticipant === 'individual'
                    ? 'Complétez vos coordonnées personnelles'
                    : 'Informations de votre structure'}
                </p>
              </div>

              {formData.typeParticipant === 'individual' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      Prénom *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => updateFormData('firstName', e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all ${
                        errors.firstName ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="Votre prénom"
                    />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      Nom *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => updateFormData('lastName', e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all ${
                        errors.lastName ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="Votre nom"
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all ${
                        errors.email ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="votre@email.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Globe className="w-4 h-4 inline mr-2" />
                      Pays *
                    </label>
                    <input
                      type="text"
                      value={formData.pays}
                      onChange={(e) => updateFormData('pays', e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all ${
                        errors.pays ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="France, Belgique, etc."
                    />
                    {errors.pays && <p className="text-red-500 text-sm mt-1">{errors.pays}</p>}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Building2 className="w-4 h-4 inline mr-2" />
                      Nom de la structure *
                    </label>
                    <input
                      type="text"
                      value={formData.structureName}
                      onChange={(e) => updateFormData('structureName', e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all ${
                        errors.structureName ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="Nom du club ou cabinet"
                    />
                    {errors.structureName && <p className="text-red-500 text-sm mt-1">{errors.structureName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email de contact *
                    </label>
                    <input
                      type="email"
                      value={formData.structureEmail}
                      onChange={(e) => updateFormData('structureEmail', e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all ${
                        errors.structureEmail ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="contact@structure.com"
                    />
                    {errors.structureEmail && <p className="text-red-500 text-sm mt-1">{errors.structureEmail}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Globe className="w-4 h-4 inline mr-2" />
                      Pays *
                    </label>
                    <input
                      type="text"
                      value={formData.pays}
                      onChange={(e) => updateFormData('pays', e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all ${
                        errors.pays ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="France, Belgique, etc."
                    />
                    {errors.pays && <p className="text-red-500 text-sm mt-1">{errors.pays}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      Nombre de participants *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.participantCount}
                      onChange={(e) => updateFormData('participantCount', parseInt(e.target.value) || 1)}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all ${
                        errors.participantCount ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="Nombre de personnes"
                    />
                    {errors.participantCount && <p className="text-red-500 text-sm mt-1">{errors.participantCount}</p>}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Votre activité</h3>
                <p className="text-gray-600 text-sm mb-6">Détails de votre participation</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Activity className="w-4 h-4 inline mr-2" />
                    Kilomètres parcourus *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.kilometers}
                    onChange={(e) => updateFormData('kilometers', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all ${
                      errors.kilometers ? 'border-red-300' : 'border-gray-200'
                    }`}
                    placeholder="Ex: 10.5"
                  />
                  {errors.kilometers && <p className="text-red-500 text-sm mt-1">{errors.kilometers}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => updateFormData('date', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all ${
                      errors.date ? 'border-red-300' : 'border-gray-200'
                    }`}
                  />
                  {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Activity className="w-4 h-4 inline mr-2" />
                  Type d'activité
                </label>
                <select
                  value={formData.activityType}
                  onChange={(e) => updateFormData('activityType', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                >
                  <option value="indoor">Indoor (Ergomètre)</option>
                  <option value="outdoor">Outdoor (Bateau)</option>
                  <option value="avifit">AviFit</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Lieu (optionnel)
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => updateFormData('location', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                  placeholder="Ville ou club"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Description (optionnel)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all resize-none"
                  placeholder="Partagez votre expérience..."
                />
              </div>

              {formData.typeParticipant === 'structure' && (
                <div className="bg-pink-50 border-2 border-pink-200 rounded-xl p-4">
                  <p className="text-sm text-pink-800">
                    <strong>Total calculé :</strong> {parseFloat(formData.kilometers || '0') * formData.participantCount} km
                    <br />
                    <span className="text-xs">({formData.kilometers} km × {formData.participantCount} participants)</span>
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handlePrev}
              disabled={step === 1}
              className={`inline-flex items-center px-6 py-3 rounded-xl font-semibold transition-all ${
                step === 1
                  ? 'opacity-0 pointer-events-none'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Précédent
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Suivant
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Valider ma participation
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SimpleDefiForm;
