import React, { useState } from 'react';
import { Calendar, Users, MapPin, Camera, Plus, Target, Award, Clock } from 'lucide-react';
import InteractiveMap from '../components/InteractiveMap';
import SimpleDefiForm from '../components/SimpleDefiForm';
import StatsCounter from '../components/StatsCounter';

const DefiRose = () => {
  const [showDefiForm, setShowDefiForm] = useState(false);
  const [approvedPhotos, setApprovedPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    const fetchApprovedPhotos = async () => {
      try {
        setError(null);
        // Photos d'exemple directement dans le composant
        const demoPhotos = [
          {
            id: '1',
            url: '/avirose.JPG',
            caption: "Séance d'aviron motivante ! #OctobreRose2025",
            participant: { firstName: 'Marie', lastName: 'Dupont' }
          },
          {
            id: '2',
            url: '/avirose4.jpg',
            caption: 'En rose pour la bonne cause !',
            participant: { firstName: 'Pierre', lastName: 'Martin' }
          }
        ];
        setApprovedPhotos(demoPhotos);
      } catch (error) {
        console.error('Error fetching photos:', error);
        setError('Erreur lors du chargement des photos');
        setApprovedPhotos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedPhotos();
  }, []);

  const animations = [
    {
      title: "#TOUSconcernés",
      date: "Tous les mercredis",
      description: "Ramez en famille chaque semaine pour garder la motivation et doubler vos km",
      icon: Users,
      color: "from-pink-500 to-rose-500"
    },
    {
      title: "Tous en rose au sommet",
      date: "4 & 5 octobre",
      description: "Parcourez 200km, habillés de rose, pour atteindre le siège de l’Europe en un week-end",
      icon: Target,
      color: "from-rose-500 to-pink-600"
    },
    {
      title: "Célébration des Amazones",
      date: "13 au 19 octobre",
      description: "Embarquez pour une semaine dédiée à la solidarité et la sororité, 10km bonus à chaque participation féminine",
      icon: Award,
      color: "from-pink-600 to-rose-600"
    },
    {
      title: "Veni-Vidi-Vici",
      date: "20 au 24 octobre",
      description: "Faites découvrir l’aviron aux rameuses des cabinets de kinésithérapie",
      icon: Clock,
      color: "from-rose-600 to-pink-700"
    },
    {
      title: "City break",
      date: "24, 25 & 26 octobre",
      description: "Longez les rives du Rhin, 1000km à parcourir sur 3 jours",
      icon: MapPin,
      color: "from-pink-700 to-rose-700"
    },
    {
      title: "Bonus 27",
      date: "27 au 31 octobre",
      description: "Dépassez-vous avec le chiffre 27 pour atteindre la ligne d’arrivée",
      icon: Plus,
      color: "from-rose-700 to-pink-800"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pink-600 to-rose-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Le Défi ROSE
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto">
              Du 1er au 31 octobre 2025, cap sur 27 000 km 
            </p>
            <p className="text-base md:text-lg mb-8 max-w-4xl mx-auto text-white-600">
              Pas besoin d’inscription ! Ajoutez vos kilomètres à partir du 1er octobre.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setShowDefiForm(true)}
                className="inline-flex items-center px-8 py-4 bg-white text-pink-600 font-semibold rounded-xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Ajouter mes kilomètres
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Concept Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Le Concept
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Target className="w-4 h-4 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      27 000 kilomètres à parcourir
                    </h3>
                    <p className="text-gray-600">
                      Distance symbolique reliant tous les pays de l'Union Européenne, 
                      à la rencontre des communautés aviron santé.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Users className="w-4 h-4 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Participation collective
                    </h3>
                    <p className="text-gray-600">
                      Clubs, individuels, familles... Chacun peut contribuer avec ses kilomètres 
                      d'aviron indoor.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <MapPin className="w-4 h-4 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Suivi en temps réel
                    </h3>
                    <p className="text-gray-600">
                      Visualisez l'avancement du parcours sur la carte interactive et 
                      suivez la progression vers l'objectif commun.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Objectif 2025
                </h3>
                <div className="text-4xl font-bold text-pink-600 mb-2">
                  27 000 km
                </div>
                <p className="text-gray-600 mb-6">
                  À parcourir ensemble du 1er au 31 octobre
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white rounded-lg p-3">
                    <div className="font-semibold text-gray-900">27</div>
                    <div className="text-gray-600">Pays</div>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <div className="font-semibold text-gray-900">31</div>
                    <div className="text-gray-600">Jours</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
            <section className="py-16 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <StatsCounter />
              </div>
            </section>

      {/* Carte Interactive */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Suivez notre itinéraire à travers l'Europe
            </h2>
          </div>
          <InteractiveMap />
        </div>
      </section>

      {/* Calendrier des Animations */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Calendrier des Animations
            </h2>
            <p className="text-xl text-gray-600">
              Des temps forts tout au long du mois d'octobre
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {animations.map((animation, index) => {
              const Icon = animation.icon;
              return (
                <div
                  key={index}
                  className={`relative overflow-hidden rounded-2xl text-white transform hover:scale-105 transition-all duration-200 shadow-lg bg-gradient-to-br ${animation.color}`}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Icon className="w-8 h-8" />
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-medium">{animation.date}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-3">{animation.title}</h3>
                    <p className="text-white/90 text-sm leading-relaxed">
                      {animation.description}
                    </p>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Galerie */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Galerie des Participants
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez les moments forts partagés par nos participants
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl flex items-center justify-center animate-pulse"
                >
                  <Camera className="w-8 h-8 text-pink-400" />
                </div>
              ))
            ) : approvedPhotos.length > 0 ? (
              approvedPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="aspect-square rounded-xl overflow-hidden hover:scale-105 transition-transform duration-200 cursor-pointer relative group"
                >
                  <img
                    src={photo.url}
                    alt={photo.caption || 'Photo du défi'}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end">

                  </div>
                </div>
              ))
            ) : (
              Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl flex items-center justify-center"
                >
                  <Camera className="w-8 h-8 text-pink-400" />
                </div>
              ))
            )}
          </div>
          
          <div className="text-center">
            <button className="inline-flex items-center px-6 py-3 bg-pink-600 text-white font-semibold rounded-xl hover:bg-pink-700 transition-colors">
              <Camera className="w-5 h-5 mr-2" />
              Partager ma photo
            </button>
          </div>
        </div>
      </section>

      {/* CTA */}


      {/* Formulaire */}
      {showDefiForm && (
        <SimpleDefiForm
          onClose={() => setShowDefiForm(false)}
          onSubmit={() => setShowDefiForm(false)}
        />
      )}
    </div>
  );
};

export default DefiRose;
