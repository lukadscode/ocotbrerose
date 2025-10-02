import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Target, Heart, MapPin, Trophy, Euro, Calendar } from 'lucide-react';
import InteractiveMap from '../components/InteractiveMap';


const HomePage = () => {
  const [events, setEvents] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchEvents = async () => {
      try {
        setError(null);
        // Données d'exemple directement dans le composant
        const demoEvents = [
          {
            id: '1',
            title: '#TOUSconcernés',
            description: 'Mobilisation hebdomadaire de sensibilisation avec des actions spécifiques dans chaque club.',
            dateStart: new Date('2025-10-01'),
            dateEnd: new Date('2025-10-29'),
            timeInfo: 'Tous les mercredis',
            eventType: 'recurring',
            color: 'from-pink-500 to-rose-500',
            activities: ['Porter du rose pendant l\'entraînement', 'Partager ses séances sur les réseaux sociaux'],
            status: 'active'
          },
          {
            id: '2',
            title: 'Tous en rose au sommet',
            description: 'Week-end de lancement officiel avec des événements dans toute l\'Europe.',
            dateStart: new Date('2025-10-04'),
            dateEnd: new Date('2025-10-05'),
            timeInfo: 'Samedi 9h - Dimanche 18h',
            eventType: 'weekend',
            color: 'from-rose-500 to-pink-600',
            activities: ['Séances collectives en rose', 'Petit-déjeuner solidaire'],
            status: 'completed'
          },
          {
            id: '3',
            title: 'Rowing Care Cup',
            description: 'Événement connecté national avec courses individuelles et relais.',
            dateStart: new Date('2025-10-18'),
            timeInfo: 'Toute la journée',
            eventType: 'special',
            color: 'from-blue-600 to-indigo-600',
            activities: ['Courses individuelles 250m/500m', 'Relais d\'équipe'],
            status: 'featured'
          }
        ];
        setEvents(demoEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Erreur lors du chargement des événements');
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pink-50 via-rose-50 to-white py-20">
        <div className="absolute inset-0 bg-[url('/avirose2.jpg')] bg-cover bg-center opacity-30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center shadow-xl">
                <Heart className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="text-pink-600">Octobre Rose</span> 2025
              <br />
              <span className="text-3xl md:text-4xl text-gray-700">x FFAviron</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Ensemble contre le cancer du sein - Rejoignez le mouvement
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/defi-rose"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold rounded-xl hover:from-pink-700 hover:to-rose-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Le défi ROSE
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                to="/rowing-care-cup"
                className="inline-flex items-center px-8 py-4 bg-white text-pink-600 font-semibold rounded-xl border-2 border-pink-600 hover:bg-pink-50 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                <Trophy className="w-5 h-5 mr-2" />
                La Rowing Care Cup
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
};

export default HomePage;