import React, { useState } from 'react';
import { Calendar, Clock, Users, Target, MapPin, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

const EventCalendar = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(0);

  const events = [
    {
      id: 1,
      title: "#TOUSconcernés",
      date: "Tous les mercredis",
      dateRange: "2, 9, 16, 23, 30 octobre",
      time: "Toute la journée",
      description: "Mobilisation hebdomadaire de sensibilisation avec des actions spécifiques dans chaque club. Portez du rose, partagez vos séances et sensibilisez votre entourage.",
      type: "recurring",
      color: "from-pink-500 to-rose-500",
      icon: Users,
      activities: [
        "Porter du rose pendant l'entraînement",
        "Partager ses séances sur les réseaux sociaux",
        "Organiser des mini-conférences de sensibilisation",
        "Distribuer des flyers informatifs"
      ],
      status: "active"
    },
    {
      id: 2,
      title: "Tous en rose au sommet",
      date: "4 & 5 octobre",
      dateRange: "Week-end de lancement",
      time: "Samedi 9h - Dimanche 18h",
      description: "Week-end de lancement officiel avec des événements dans toute l'Europe. Grandes séances collectives et animations festives.",
      type: "weekend",
      color: "from-rose-500 to-pink-600",
      icon: Target,
      activities: [
        "Séances collectives en rose",
        "Petit-déjeuner solidaire",
        "Animations pour les familles",
        "Lancement officiel du défi"
      ],
      status: "completed"
    },
    {
      id: 3,
      title: "Célébration des Amazones",
      date: "13 au 19 octobre",
      dateRange: "Semaine spéciale",
      time: "7 jours d'hommage",
      description: "Semaine dédiée aux témoignages et à l'hommage aux femmes courageuses qui luttent contre le cancer du sein.",
      type: "week",
      color: "from-pink-600 to-rose-600",
      icon: Users,
      activities: [
        "Témoignages de femmes courageuses",
        "Séances dédiées aux Amazones",
        "Collecte de fonds spéciale",
        "Mur des messages de soutien"
      ],
      status: "upcoming"
    },
    {
      id: 4,
      title: "Rowing Care Cup",
      date: "18 octobre",
      dateRange: "Événement phare",
      time: "Toute la journée",
      description: "Événement connecté national avec courses individuelles et relais. Participation depuis votre club ou chez vous.",
      type: "special",
      color: "from-blue-600 to-indigo-600",
      icon: Target,
      activities: [
        "Courses individuelles 250m/500m",
        "Relais d'équipe 4x500m/8x250m",
        "Classements en temps réel",
        "Remise des prix virtuelle"
      ],
      status: "featured",
      featured: true
    },
    {
      id: 5,
      title: "Veni-Vidi-Vici",
      date: "20 au 24 octobre",
      dateRange: "Sprint final",
      time: "5 jours intensifs",
      description: "Sprint final avec des défis quotidiens pour booster la progression vers l'objectif des 27 000 km.",
      type: "challenge",
      color: "from-rose-600 to-pink-700",
      icon: Plus,
      activities: [
        "Défis quotidiens par équipe",
        "Bonus kilomètres",
        "Challenges inter-clubs",
        "Motivation collective"
      ],
      status: "upcoming"
    },
    {
      id: 6,
      title: "City break & Bonus 27",
      date: "24 au 31 octobre",
      dateRange: "Dernière ligne droite",
      time: "8 jours de clôture",
      description: "Week-end urbain avec des événements dans les grandes villes européennes, suivi des derniers jours avec bonus spéciaux.",
      type: "finale",
      color: "from-pink-700 to-rose-800",
      icon: MapPin,
      activities: [
        "Événements dans les capitales",
        "Bonus kilomètres x2",
        "Célébrations de clôture",
        "Bilan final du défi"
      ],
      status: "upcoming"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'featured': return 'bg-yellow-100 text-yellow-800';
      case 'upcoming': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Terminé';
      case 'active': return 'En cours';
      case 'featured': return 'À venir';
      case 'upcoming': return 'Bientôt';
      default: return 'Programmé';
    }
  };

  return (
    <div className="space-y-8">
      {/* Vue calendrier */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => {
          const Icon = event.icon;
          return (
            <div
              key={event.id}
              className={`relative overflow-hidden rounded-2xl text-white transform hover:scale-105 transition-all duration-200 shadow-lg cursor-pointer ${
                event.featured ? 'md:col-span-2 lg:col-span-1 ring-4 ring-yellow-400' : ''
              }`}
              style={{
                background: `linear-gradient(135deg, ${event.color.split(' ')[1]}, ${event.color.split(' ')[3]})`
              }}
              onClick={() => setSelectedEvent(event)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Icon className="w-8 h-8" />
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                      {getStatusText(event.status)}
                    </span>
                    {event.featured && (
                      <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                        <span className="text-yellow-900 text-xs font-bold">★</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-white/90">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">{event.date}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-white/90">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{event.time}</span>
                  </div>
                </div>
                
                <p className="text-white/90 text-sm leading-relaxed mb-4">
                  {event.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/70 font-medium">
                    {event.activities.length} activités
                  </span>
                  <button className="text-white/90 hover:text-white text-sm font-medium">
                    Voir détails →
                  </button>
                </div>
              </div>
              
              {/* Effet décoratif */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
            </div>
          );
        })}
      </div>

      {/* Modal de détail d'événement */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div 
              className="p-6 text-white rounded-t-2xl"
              style={{
                background: `linear-gradient(135deg, ${selectedEvent.color.split(' ')[1]}, ${selectedEvent.color.split(' ')[3]})`
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <selectedEvent.icon className="w-8 h-8" />
                  <div>
                    <h2 className="text-2xl font-bold">{selectedEvent.title}</h2>
                    <p className="text-white/90">{selectedEvent.dateRange}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{selectedEvent.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{selectedEvent.time}</span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">{selectedEvent.description}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Activités prévues</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedEvent.activities.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                      <span className="text-gray-700 text-sm">{activity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Fermer
                </button>
                {selectedEvent.status !== 'completed' && (
                  <button className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 font-medium">
                    {selectedEvent.id === 4 ? 'S\'inscrire' : 'Participer'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Timeline view */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Timeline des événements</h3>
        <div className="relative">
          {/* Ligne de temps */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-pink-500 to-rose-600"></div>
          
          <div className="space-y-6">
            {events.map((event, index) => {
              const Icon = event.icon;
              return (
                <div key={event.id} className="relative flex items-start space-x-4">
                  {/* Point sur la timeline */}
                  <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                    event.status === 'completed' ? 'bg-green-500' :
                    event.status === 'active' ? 'bg-blue-500' :
                    event.status === 'featured' ? 'bg-yellow-500' :
                    'bg-gray-400'
                  }`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  
                  {/* Contenu */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">{event.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                        {getStatusText(event.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{event.date} • {event.time}</p>
                    <p className="text-gray-700 text-sm">{event.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCalendar;