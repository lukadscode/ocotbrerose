import React, { useState, useEffect } from 'react';
import { Navigation, Star } from 'lucide-react';
import { kilometerAPI } from '../lib/api';

const InteractiveMap = () => {
  const [totalKilometers, setTotalKilometers] = useState(0);
  const [loading, setLoading] = useState(true);

  const TOTAL_DISTANCE = 27000;

  const fetchKilometers = async () => {
    try {
      const kilometerEntries = await kilometerAPI.getValidated();
      const total = kilometerEntries.reduce((sum: number, entry: any) => sum + entry.kilometers, 0);
      setTotalKilometers(total);
    } catch (error) {
      console.error('Error fetching kilometers:', error);
      setTotalKilometers(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKilometers();
    const interval = setInterval(fetchKilometers, 30000);
    return () => clearInterval(interval);
  }, []);

  const progressPercentage = Math.min((totalKilometers / TOTAL_DISTANCE) * 100, 100);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-gray-900">Parcours Octobre Rose 2025</h3>
          <span className="text-3xl font-bold text-pink-600">
            {totalKilometers.toLocaleString('fr-FR')} km
          </span>
        </div>

        <div className="flex justify-center items-center space-x-8 text-sm mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-white border-2 border-pink-500 rounded-full animate-pulse"></div>
            <span className="text-gray-600">Ruban blanc progressif</span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-pink-500" />
            <span className="text-gray-600">Progression en temps réel</span>
          </div>
        </div>

        <div className="bg-gray-200 rounded-full h-3 mb-2">
          <div
            className="bg-gradient-to-r from-pink-500 to-rose-600 h-3 rounded-full transition-all duration-1000 relative overflow-hidden"
            style={{ width: `${progressPercentage}%` }}
          >
            <div className="absolute inset-0 bg-white/30 h-full animate-pulse"></div>
          </div>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>{totalKilometers.toLocaleString('fr-FR')} km</span>
          <span className="font-semibold text-pink-600">
            {progressPercentage.toFixed(1)}% accompli
          </span>
          <span>{TOTAL_DISTANCE.toLocaleString('fr-FR')} km</span>
        </div>
      </div>

      <div className="relative bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100 rounded-xl overflow-hidden">
        <div className="relative w-full" style={{ paddingBottom: '100%' }}>
          <div className="absolute inset-0">
            <img
              src="/Carte Europe Octobre Rose (1).svg"
              alt="Carte d'Europe"
              className="w-full h-full object-contain"
              style={{
                clipPath: `inset(0 ${100 - progressPercentage}% 0 0)`,
                transition: 'clip-path 1s ease-in-out'
              }}
            />
            <img
              src="/Carte Europe Octobre Rose (1).svg"
              alt="Carte d'Europe (grisée)"
              className="absolute inset-0 w-full h-full object-contain opacity-30"
              style={{ filter: 'grayscale(100%)' }}
            />
          </div>
        </div>

        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-pink-100">
          <div className="flex items-center space-x-2 mb-3">
            <Navigation className="w-5 h-5 text-pink-500" />
            <span className="font-semibold text-gray-800">Parcours Octobre Rose</span>
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-white border-2 border-pink-500 rounded-full"></div>
              <span>Ruban blanc symbolique</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-pink-500 rounded-full animate-pulse"></div>
              <span>{totalKilometers.toLocaleString('fr-FR')} km parcourus</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-pink-500" />
              <span>{progressPercentage.toFixed(1)}% accompli</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-pink-100">
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-600">
              {progressPercentage.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-600">Objectif</div>
            <div className="text-xs font-semibold text-gray-800 mt-1">
              {(TOTAL_DISTANCE - totalKilometers).toLocaleString('fr-FR')} km restants
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 bg-gradient-to-r from-pink-100 to-rose-100 rounded-xl text-center">
        {totalKilometers > 0 ? (
          <>
            <p className="text-lg font-semibold text-gray-800 mb-2">
              Le ruban blanc avance grâce à vous ! Plus que <span className="text-pink-600 font-bold">
                {(TOTAL_DISTANCE - totalKilometers).toLocaleString('fr-FR')} km
              </span> pour atteindre l'objectif.
            </p>
            <p className="text-gray-600">
              Chaque kilomètre parcouru est un pas de plus dans la lutte contre le cancer du sein.
            </p>
          </>
        ) : (
          <>
            <p className="text-lg font-semibold text-gray-800 mb-2">
              Le ruban blanc n'attend que vous pour commencer son parcours !
            </p>
            <p className="text-gray-600">
              Ajoutez vos kilomètres pour faire avancer le ruban sur la carte.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default InteractiveMap;
