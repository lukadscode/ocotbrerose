import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, User, Plus, BarChart3, Trophy, Target, Calendar } from 'lucide-react';
import { authService } from '../lib/api';
import KilometerForm from '../components/KilometerForm';

const ParticipantSpace = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [showKilometerForm, setShowKilometerForm] = useState(false);
  const [participantData, setParticipantData] = useState(null);

  const logout = () => {
    setUser(null);
    setParticipantData(null);
    setEmail('');
    setOtpCode('');
    setShowOtpInput(false);
  };

  const fetchParticipantData = (participantId) => {
    try {
      kilometerAPI.getByParticipant(participantId).then(entries => {
        const totalKm = entries.reduce((sum, entry) => sum + entry.kilometers, 0);
        setParticipantData({
          entries,
          totalKm,
          sessionCount: entries.length
        });
      }).catch(error => {
        console.error('Error fetching participant data:', error);
        setParticipantData({
          entries: [],
          totalKm: 0,
          sessionCount: 0
        });
      });
    } catch (error) {
      console.error('Error fetching participant data:', error);
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      alert('❌ Veuillez saisir une adresse email valide.');
      return;
    }
    
    setIsLoading(true);
    
    authService.sendOTP(email).then(success => {
      if (success) {
        setShowOtpInput(true);
        alert(`✅ Code OTP simulé envoyé à ${email} !\n\n🔑 Regardez la console (F12) pour voir le code de test.\n⏰ Le code expire dans 10 minutes.\n\n💡 En production, configurez un serveur backend pour l'envoi réel.`);
      } else {
        alert(`❌ Erreur lors de la simulation d'envoi\n\n🔍 Vérifiez la console (F12) pour plus de détails.`);
      }
    }).catch(error => {
      console.error('Error sending OTP:', error);
      alert(`❌ Erreur technique\n\n🔍 Détails dans la console (F12)\n💡 Erreur: ${error.message || 'Inconnue'}`);
    }).finally(() => {
      setIsLoading(false);
    });
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otpCode.trim() || otpCode.length !== 6) {
      alert('❌ Veuillez saisir un code à 6 chiffres.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await authService.verifyOTP(email, otpCode);
      if (result.success) {
        setUser(result.participant);
        fetchParticipantData(result.participant.id);
        alert(`✅ Connexion réussie ! Bienvenue ${result.participant.firstName} dans votre espace participant.`);
      } else {
        const message = result.message || 'Code invalide ou expiré';
        alert(`❌ ${message}`);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert('❌ Erreur technique lors de la vérification. Réessayez.');
    }
    
    setIsLoading(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {t('participant.title')}
            </h2>
            <p className="text-gray-600">
              {t('participant.subtitle')}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            {!showOtpInput ? (
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                   {t('participant.email')}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold py-3 rounded-xl hover:from-pink-700 hover:to-rose-700 transform hover:scale-105 transition-all duration-200"
                >
                  {isLoading ? t('participant.sending') : t('participant.receiveCode')}
                </button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Mail className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-600">
                    {t('participant.codeSent')}<br />
                    <strong>{email}</strong>
                  </p>
                </div>

                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('participant.accessCode')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="otp"
                      type="text"
                      required
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-center text-lg font-mono"
                      placeholder="123456"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold py-3 rounded-xl hover:from-pink-700 hover:to-rose-700 transform hover:scale-105 transition-all duration-200"
                >
                  {isLoading ? t('participant.connecting') : t('participant.connect')}
                </button>

                <button
                  type="button"
                  onClick={() => setShowOtpInput(false)}
                  className="w-full text-gray-600 hover:text-pink-600 font-medium py-2"
                >
                  {t('participant.changeEmail')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de l'espace participant */}
      <section className="bg-gradient-to-r from-pink-600 to-rose-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <button
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
              onClick={logout}
            >
              {t('participant.disconnect')}
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            {/* Actions rapides */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t('participant.quickActions')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={() => setShowKilometerForm(true)}
                  className="flex items-center space-x-3 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl hover:from-pink-100 hover:to-rose-100 transition-all duration-200"
                >
                  <Plus className="w-6 h-6 text-pink-600" />
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">{t('participant.addKm')}</div>
                    <div className="text-sm text-gray-600">{t('participant.recordSession')}</div>
                  </div>
                </button>
                
                <button 
                  onClick={() => window.open('/rowing-care-cup', '_blank')}
                  className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-200"
                >
                  <Trophy className="w-6 h-6 text-blue-600" />
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">{t('rowingCareCup.title')}</div>
                    <div className="text-sm text-gray-600">{t('participant.registerEvent')}</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Historique des activités */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t('participant.recentActivities')}
              </h2>
              <div className="space-y-4">
                {participantData?.entries?.slice(0, 4).map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {entry.activityType === 'indoor' ? 'Aviron indoor' :
                           entry.activityType === 'outdoor' ? t('participant.outdoor') : 'AviFit'}
                        </div>
                        <div className="text-sm text-gray-600">{entry.location || 'Non spécifié'}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-pink-600">{entry.kilometers} km</div>
                      <div className="text-sm text-gray-600">
                        {new Date(entry.date).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-8 text-gray-500">
                    <Target className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>{t('participant.noActivity')}</p>
                    <p className="text-sm">{t('participant.addFirstKm')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Mes statistiques */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-pink-600" />
                {t('participant.myStats')}
              </h3>
              <div className="space-y-4">
                <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl">
                  <div className="text-3xl font-bold text-pink-600 mb-1">
                    {participantData?.totalKm?.toFixed(1) || '0.0'}
                  </div>
                  <div className="text-sm text-gray-600">{t('participant.kmCompleted')}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">
                      {participantData?.sessionCount || 0}
                    </div>
                    <div className="text-xs text-gray-600">{t('participant.sessions')}</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-xl font-bold text-green-600">-</div>
                    <div className="text-xs text-gray-600">{t('participant.ranking')}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mon club */}
            {user?.club && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {t('participant.myClub')}
              </h3>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="font-semibold text-gray-900 mb-1">
                  {user.club}
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  {t('participant.activeMember')}
                </div>
                <div className="text-xs text-gray-500">
                  {t('participant.memberSince', { date: new Date(user.createdAt).toLocaleDateString('fr-FR') })}
                </div>
              </div>
              </div>
            )}

            {/* Prochains événements */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                {t('participant.upcoming')}
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                  <div className="font-semibold text-gray-900 text-sm">
                    {t('rowingCareCup.title')}
                  </div>
                  <div className="text-xs text-gray-600">{t('rowingCareCup.date')}</div>
                </div>
                <div className="p-3 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg">
                  <div className="font-semibold text-gray-900 text-sm">
                    Mission Veni-Vidi-Vinci
                  </div>
                  <div className="text-xs text-gray-600">20-24 octobre</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire d'ajout de kilomètres */}
      {showKilometerForm && (
        <KilometerForm
          user={user}
          onClose={() => setShowKilometerForm(false)}
          onSubmit={() => {
            setShowKilometerForm(false);
            if (user) {
              fetchParticipantData(user.id);
            }
          }}
        />
      )}

    </div>
  );
};

export default ParticipantSpace;