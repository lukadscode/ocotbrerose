import React, { useState } from 'react';
import { Trophy, Users, Clock, Zap, Medal, Target, Calendar, MapPin, Play } from 'lucide-react';
import HelloAssoModalIndiv from '../components/HelloAssoModalIndiv';
import HelloAssoModalRelais from '../components/HelloAssoModalRelais';

const RowingCareCup = () => {
  const [selectedCategory, setSelectedCategory] = useState<'individual' | 'team'>('individual');
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [showIndivModal, setShowIndivModal] = useState(false);
  const [showRelaisModal, setShowRelaisModal] = useState(false);
  const [stats, setStats] = useState({ totalRegistrations: 0, totalAmount: 0 });
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        // Données d'exemple directement dans le composant
        setStats({ totalRegistrations: 1, totalAmount: 5 });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats({ totalRegistrations: 1, totalAmount: 5 });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const categories = {
    individual: [
      { distance: '500m', gender: 'Femmes', price: '5€', icon: Target },
      { distance: '500m', gender: 'Hommes', price: '5€', icon: Target },
      { distance: '500m', gender: 'Avirose', price: '5€', icon: Target }
    ],
    team: [
      { distance: '8x250m', type: 'Relais Féminin', price: '16€', icon: Users },
      { distance: '8x250m', type: 'Relais Mixte (dont au minimum 1 homme et 2 femmes)', price: '16€', icon: Users },
      { distance: '8x250m', type: "Relais Avirose (dont 2 femmes atteintes d'un cancer)", price: '16€', icon: Users },
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <img 
                src="/rowingcarecup.jpg" 
                alt="Rowing Care Cup 2025" 
                className="w-32 h-32 object-contain rounded-2xl bg-white/10 backdrop-blur-sm p-4 shadow-2xl"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Rowing Care Cup
            </h1>
            <p className="text-xl md:text-2xl mb-4 max-w-4xl mx-auto">
              Événement connecté national - Samedi 18 octobre 2025
            </p>
            <div className="flex items-center justify-center space-x-6 text-lg mb-8">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Retransmis en direct</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Matin</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>100% connecté</span>
              </div>
            </div>
            
            {/* Statistiques en temps réel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-md mx-auto mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold text-white">
                  {loading ? '...' : stats.totalRegistrations}
                </div>
                <div className="text-sm text-blue-100">Inscrits</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold text-white">
                  {loading ? '...' : `${stats.totalAmount}€`}
                </div>
                <div className="text-sm text-blue-100">Collectés</div>
              </div>
            </div>
            
            <button 
              onClick={() => setShowChoiceModal(true)}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-xl hover:from-yellow-500 hover:to-orange-600 transform hover:scale-105 transition-all duration-200 shadow-lg">
              <Trophy className="w-5 h-5 mr-2" />
              <span>Je m'inscris maintenant</span>
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Le Challenge Indoor Connecté
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Zap className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Participation flexible
                    </h3>
                    <p className="text-gray-600">
                      Participez depuis votre club, chez votre kinésithérapeute, 
                      ou même depuis chez vous avec votre ergomètre.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Play className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Technologie Time Team
                    </h3>
                    <p className="text-gray-600">
                      Système de chronométrage connecté pour une compétition 
                      équitable et des résultats en temps réel.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Medal className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Suivi des courses en live
                    </h3>
                    <p className="text-gray-600">
                      Suivez les performances en temps réel et découvrez 
                      les résultats individuels et par équipe instantanément.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8">
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <img 
                    src="/rowingcarecup.jpg" 
                    alt="Rowing Care Cup" 
                    className="w-20 h-20 object-contain rounded-xl bg-white p-2 shadow-lg"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Tarifs Solidaires
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600 mb-1">5€</div>
                    <div className="text-sm text-gray-600">Individuel</div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600 mb-1">16€</div>
                    <div className="text-sm text-gray-600">Équipe</div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  La totalité des bénéfices est reversée à la lutte contre le cancer
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catégories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Catégories de Course
            </h2>
          </div>

          {/* Sélecteur de catégorie */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 rounded-lg p-1 flex space-x-1">
              <button
                onClick={() => setSelectedCategory('individual')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  selectedCategory === 'individual'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Courses Individuelles
              </button>
              <button
                onClick={() => setSelectedCategory('team')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  selectedCategory === 'team'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Relais d'Équipe
              </button>
            </div>
          </div>

          {/* Grille des catégories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories[selectedCategory].map((category, index) => {
              const Icon = category.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {category.distance}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {category.gender || category.type}
                    </p>
                    <div className="text-2xl font-bold text-blue-600 mb-4">
                      {category.price}
                    </div>
                    <button 
                      onClick={() => selectedCategory === 'individual' ? setShowIndivModal(true) : setShowRelaisModal(true)}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                    >
                      S'inscrire
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modalités */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Modalités de Participation
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Où participer ?
              </h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Dans votre club d'aviron</li>
                <li>• Chez votre kinésithérapeute</li>
                <li>• À domicile avec votre ergomètre</li>
                <li>• Dans un centre de fitness partenaire</li>
              </ul>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <img 
                  src="/rowingcarecup.jpg" 
                  alt="Rowing Care Cup" 
                  className="w-12 h-12 object-contain rounded-lg"
                  style={{
                    filter: 'brightness(0) invert(1)'
                  }}
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Comment ça marche ?
              </h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Inscription via HelloAsso</li>
                <li>• Connexion Time Team</li>
                <li>• Course chronométrée</li>
                <li>• Résultats automatiques</li>
              </ul>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <img 
                  src="/rowingcarecup.jpg" 
                  alt="Rowing Care Cup" 
                  className="w-10 h-10 object-contain rounded-lg"
                  style={{
                    filter: 'brightness(0) invert(1)'
                  }}
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Récompenses
              </h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Classements individuels</li>
                <li>• Classements par équipe</li>
                <li>• Diplômes personnalisés</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Choix depuis le header */}
      {showChoiceModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
            <h3 className="text-2xl font-bold mb-6">Choisissez votre type de course</h3>
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => { setShowChoiceModal(false); setShowIndivModal(true); }}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
              >
                Course Individuelle
              </button>
              <button 
                onClick={() => { setShowChoiceModal(false); setShowRelaisModal(true); }}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
              >
                Relais d'Équipe
              </button>
              <button 
                onClick={() => setShowChoiceModal(false)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals HelloAsso */}
      {showIndivModal && (
        <HelloAssoModalIndiv
          onClose={() => setShowIndivModal(false)}
          onSubmit={(data: { price: number }) => {
            setShowIndivModal(false);
            setStats(prev => ({
              totalRegistrations: prev.totalRegistrations + 1,
              totalAmount: prev.totalAmount + data.price
            }));
          }}
        />
      )}
      {showRelaisModal && (
        <HelloAssoModalRelais
          onClose={() => setShowRelaisModal(false)}
          onSubmit={(data: { price: number }) => {
            setShowRelaisModal(false);
            setStats(prev => ({
              totalRegistrations: prev.totalRegistrations + 1,
              totalAmount: prev.totalAmount + data.price
            }));
          }}
        />
      )}
    </div>
  );
};

export default RowingCareCup;
