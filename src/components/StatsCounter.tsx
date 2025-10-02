import React, { useState, useEffect } from 'react';
import { Target, Users, MapPin, Euro, TrendingUp } from 'lucide-react';
import { participantAPI, kilometerAPI, clubAPI } from '../lib/api';

const StatsCounter = () => {
  const [stats, setStats] = useState({
    kmParcourus: 0,
    participants: 0,
    clubs: 0,
    montantRecolte: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setError(null);
        
        // Récupérer les vraies statistiques depuis la base de données
        const [participantStats, kilometerEntries, clubs] = await Promise.all([
          participantAPI.getStats(),
          kilometerAPI.getValidated(),
          clubAPI.getAll()
        ]);

        // Calculer les kilomètres totaux
        const totalKilometers = kilometerEntries.reduce((sum, entry) => sum + entry.kilometers, 0);
        
        // Calculer le montant récolté (estimation basée sur les participants)
        const estimatedAmount = participantStats.totalParticipants * 15; // Moyenne 15€ par participant

        setStats({
          kmParcourus: Math.round(totalKilometers * 10) / 10, // Arrondi à 1 décimale
          participants: participantStats.totalParticipants,
          clubs: clubs.length,
          montantRecolte: estimatedAmount
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setError('Erreur lors du chargement des statistiques');
        // Valeurs par défaut en cas d'erreur
        setStats({
          kmParcourus: 0,
          participants: 0,
          clubs: 0,
          montantRecolte: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    
    // Actualiser les stats toutes les 30 secondes
    const interval = setInterval(fetchStats, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const progressPercentage = (stats.kmParcourus / 27000) * 100;

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center py-12">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 max-w-md mx-auto">
            <div className="text-yellow-600 mb-2">⚠️ Erreur de connexion</div>
            <p className="text-sm text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      {/* Barre de progression principale */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-gray-900">Progression du Défi</h3>
          <span className="text-3xl font-bold text-pink-600">
            {stats.kmParcourus.toLocaleString()} km
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-6 mb-2">
          <div
            className="bg-gradient-to-r from-pink-500 to-rose-600 h-6 rounded-full transition-all duration-1000 relative overflow-hidden"
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          >
            {progressPercentage > 0 && (
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            )}
          </div>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>0 km</span>
          <span className="font-semibold text-pink-600">
            {progressPercentage.toFixed(1)}% accompli
          </span>
          <span>27 000 km</span>
        </div>
      </div>

      {/* Statistiques détaillées */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {stats.kmParcourus.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 font-medium">Kilomètres parcourus</div>
          {stats.kmParcourus > 0 && (
            <div className="flex items-center justify-center mt-2 text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-xs">En progression</span>
            </div>
          )}
        </div>

        <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {stats.participants.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 font-medium">Participants</div>
          {stats.participants > 0 && (
            <div className="flex items-center justify-center mt-2 text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-xs">Inscrits</span>
            </div>
          )}
        </div>

        <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {stats.clubs}
          </div>
          <div className="text-sm text-gray-600 font-medium">Clubs participants</div>
          {stats.clubs > 0 && (
            <div className="flex items-center justify-center mt-2 text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-xs">Actifs</span>
            </div>
          )}
        </div>

        <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Euro className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {stats.montantRecolte.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 font-medium">Pays Participants</div>
          <div className="flex items-center justify-center mt-2 text-blue-600">
            <TrendingUp className="w-4 h-4 mr-1" />
          </div>
        </div>
      </div>

      {/* Message motivationnel */}
      <div className="mt-8 p-6 bg-gradient-to-r from-pink-100 to-rose-100 rounded-xl text-center">
        {stats.kmParcourus > 0 ? (
          <>
            <p className="text-lg font-semibold text-gray-800 mb-2">
              🎯 Plus que <span className="text-pink-600 font-bold">
                {(27000 - stats.kmParcourus).toLocaleString()} km
              </span> pour atteindre notre objectif !
            </p>
            <p className="text-gray-600">
              Ensemble, nous pouvons faire la différence dans la lutte contre le cancer du sein.
            </p>
          </>
        ) : (
          <>
            <p className="text-lg font-semibold text-gray-800 mb-2">
              🎯 <span className="text-pink-600 font-bold">27 000 km</span> à parcourir ensemble !
            </p>
            <p className="text-gray-600">
              Le défi commence maintenant. Chaque kilomètre compte dans cette aventure solidaire.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default StatsCounter;