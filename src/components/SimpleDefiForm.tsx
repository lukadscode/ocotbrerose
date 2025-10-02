import React, { useState } from 'react';
import { User, Mail, Camera, Target, MapPin, Clock, X, Check, Upload, Users } from 'lucide-react';

const SimpleDefiForm = ({ onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    typeParticipant: '', // "individual" ou "structure"

    // Identité individu
    firstName: '',
    lastName: '',
    email: '',
    pays: '',

    // Identité structure
    structureName: '',
    structureEmail: '',
    pays: '',

    // Activité
    kilometers: '',
    date: new Date().toISOString().split('T')[0],
    activityType: 'indoor',
    duration: '',
    location: '',
    description: '',

    // Photo
    photo: null,
    photoPreview: null,

    // Consentements
    dataConsent: false,

    // Structure spécifique
    participantCount: 1
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const validateStep = () => {
    const newErrors = {};
    if (step === 1 && !formData.typeParticipant) {
      newErrors.typeParticipant = "Choix requis";
    }
    if (step === 2) {
      if (formData.typeParticipant === 'individual') {
        if (!formData.firstName.trim()) newErrors.firstName = 'Prénom requis';
        if (!formData.lastName.trim()) newErrors.lastName = 'Nom requis';
        if (!formData.email.trim()) newErrors.email = 'Email requis';
      } else if (formData.typeParticipant === 'structure') {
        if (!formData.structureName.trim()) newErrors.structureName = 'Nom de la structure requis';
        if (!formData.structureEmail.trim()) newErrors.structureEmail = 'Email requis';
      }
    }
    if (step === 3) {
      if (!formData.kilometers || parseFloat(formData.kilometers) <= 0) {
        newErrors.kilometers = 'Distance requise';
      }
      if (!formData.date) newErrors.date = 'Date requise';
      if (!formData.dataConsent) newErrors.dataConsent = 'Consentement requis';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) nextStep();
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => updateFormData('photoPreview', e.target.result);
      reader.readAsDataURL(file);
      updateFormData('photo', file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        const baseKm = parseFloat(formData.kilometers);
        const totalKm =
          formData.typeParticipant === 'structure'
            ? baseKm * formData.participantCount
            : baseKm;

        const result = {
          id: Date.now().toString(),
          typeParticipant: formData.typeParticipant,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.typeParticipant === 'individual' ? formData.email : formData.structureEmail,
          structureName: formData.structureName,
          kilometers: totalKm,
          date: formData.date,
          activityType: formData.activityType,
          participantCount: formData.typeParticipant === 'structure' ? formData.participantCount : 1,
          duration: formData.duration,
          location: formData.location,
          description: formData.description,
          photoUrl: formData.photoPreview,
          createdAt: new Date()
        };

        alert(`Merci ! ${totalKm} km ont été enregistrés 🎀`);
        onSubmit(result);
      } catch (error) {
        console.error(error);
        alert('Erreur lors de la soumission');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-pink-50 to-rose-50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Défi ROSE – Étape {step}/3</h2>
          <button onClick={onClose}><X /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {step === 1 && (
            <div>
              <h3 className="text-lg font-semibold">Vous êtes...</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => updateFormData('typeParticipant', 'individual')}
                  className={`p-4 border rounded-xl ${formData.typeParticipant === 'individual' ? 'border-pink-500 bg-pink-50' : 'border-gray-300'}`}
                >
                  Un participant individuel
                </button>
                <button
                  type="button"
                  onClick={() => updateFormData('typeParticipant', 'structure')}
                  className={`p-4 border rounded-xl ${formData.typeParticipant === 'structure' ? 'border-pink-500 bg-pink-50' : 'border-gray-300'}`}
                >
                  Un club / un cabinet de kinésithérapie
                </button>
              </div>
              {errors.typeParticipant && <p className="text-red-500">{errors.typeParticipant}</p>}
            </div>
          )}

          {step === 2 && (
            <div>
              {formData.typeParticipant === 'individual' ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Prénom"
                    value={formData.firstName}
                    onChange={(e) => updateFormData('firstName', e.target.value)}
                    className="w-full border rounded p-2"
                  />
                  <input
                    type="text"
                    placeholder="Nom"
                    value={formData.lastName}
                    onChange={(e) => updateFormData('lastName', e.target.value)}
                    className="w-full border rounded p-2"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    className="w-full border rounded p-2"
                  />
                  <input
                    type="pays"
                    placeholder="Pays"
                    value={formData.email}
                    onChange={(e) => updateFormData('pays', e.target.value)}
                    className="w-full border rounded p-2"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Nom de la structure"
                    value={formData.structureName}
                    onChange={(e) => updateFormData('structureName', e.target.value)}
                    className="w-full border rounded p-2"
                  />
                  <input
                    type="email"
                    placeholder="Email de contact"
                    value={formData.structureEmail}
                    onChange={(e) => updateFormData('structureEmail', e.target.value)}
                    className="w-full border rounded p-2"
                  />
                  <input
                    type="number"
                    placeholder="Nombre de participants"
                    value={formData.participantCount}
                    onChange={(e) => updateFormData('participantCount', parseInt(e.target.value))}
                    className="w-full border rounded p-2"
                  />
                  <input
                    type="pays"
                    placeholder="Pays"
                    value={formData.email}
                    onChange={(e) => updateFormData('pays', e.target.value)}
                    className="w-full border rounded p-2"
                  />
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <input
                type="number"
                placeholder="Kilomètres"
                value={formData.kilometers}
                onChange={(e) => updateFormData('kilometers', e.target.value)}
                className="w-full border rounded p-2"
              />
              <input
                type="date"
                value={formData.date}
                onChange={(e) => updateFormData('date', e.target.value)}
                className="w-full border rounded p-2"
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                className="w-full border rounded p-2"
              />
              <div>
                <input type="checkbox" id="consent" checked={formData.dataConsent} onChange={(e) => updateFormData('dataConsent', e.target.checked)} />
                <label htmlFor="consent" className="ml-2">J'accepte le traitement des données *</label>
              </div>
            </div>
          )}

          <div className="flex justify-between">
            {step > 1 && <button type="button" onClick={prevStep} className="px-4 py-2 border rounded">Précédent</button>}
            {step < 3 && <button type="button" onClick={handleNext} className="px-4 py-2 bg-pink-500 text-white rounded">Suivant</button>}
            {step === 3 && (
              <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-pink-600 text-white rounded">
                {isSubmitting ? 'Envoi...' : 'Valider'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SimpleDefiForm;
