import React, { useState, useEffect } from 'react';
import { Navigation, Star } from 'lucide-react';
import { kilometerAPI } from '../lib/api';

const InteractiveMap = () => {
  const [totalKilometers, setTotalKilometers] = useState(0);
  const [loading, setLoading] = useState(true);

  const TOTAL_DISTANCE = 27000;

  const ribbonPath = [
    { x: 50, y: 500 },
    { x: 80, y: 450 },
    { x: 120, y: 400 },
    { x: 150, y: 360 },
    { x: 180, y: 330 },
    { x: 210, y: 300 },
    { x: 240, y: 280 },
    { x: 270, y: 250 },
    { x: 300, y: 220 },
    { x: 330, y: 200 },
    { x: 360, y: 180 },
    { x: 390, y: 160 },
    { x: 420, y: 150 },
    { x: 450, y: 130 },
  ];

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
  const pointsToShow = Math.ceil((progressPercentage / 100) * ribbonPath.length);
  const visiblePath = ribbonPath.slice(0, Math.max(2, pointsToShow));

  const generateRibbonPath = () => {
    if (visiblePath.length < 2) return '';

    let path = `M ${visiblePath[0].x} ${visiblePath[0].y}`;

    for (let i = 1; i < visiblePath.length; i++) {
      const current = visiblePath[i];
      const previous = visiblePath[i - 1];

      const controlX1 = previous.x + (current.x - previous.x) * 0.3;
      const controlY1 = previous.y - 20;
      const controlX2 = previous.x + (current.x - previous.x) * 0.7;
      const controlY2 = current.y - 20;

      path += ` C ${controlX1} ${controlY1} ${controlX2} ${controlY2} ${current.x} ${current.y}`;
    }

    return path;
  };

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
            <span className="text-gray-600">Ruban blanc</span>
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

      <div className="relative bg-gradient-to-br from-blue-100 via-blue-50 to-sky-50 rounded-xl overflow-hidden">
        <svg
          viewBox="0 0 500 600"
          className="w-full h-full"
          style={{ minHeight: '600px' }}
        >
          <defs>
            <linearGradient id="whiteRibbonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#f8f9fa" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.95" />
            </linearGradient>

            <filter id="whiteRibbonGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <linearGradient id="ribbonShimmer" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0)" />
              <stop offset="50%" stopColor="rgba(255, 255, 255, 0.8)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
              <animateTransform
                attributeName="gradientTransform"
                type="translate"
                values="-100 0;100 0;-100 0"
                dur="3s"
                repeatCount="indefinite"
              />
            </linearGradient>
          </defs>

          <rect width="500" height="600" fill="#E0F2FE" />

          <g>
            <image
              href="/carte_rose.svg"
              x="0"
              y="0"
              width="500"
              height="600"
              opacity="0.8"
            />
          </g>

          {visiblePath.length > 1 && (
            <>
              <path
                d={generateRibbonPath()}
                stroke="rgba(0,0,0,0.15)"
                strokeWidth="18"
                fill="none"
                transform="translate(2, 2)"
                opacity="0.6"
              />

              <path
                d={generateRibbonPath()}
                stroke="url(#whiteRibbonGradient)"
                strokeWidth="16"
                fill="none"
                filter="url(#whiteRibbonGlow)"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <path
                d={generateRibbonPath()}
                stroke="#ec4899"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.5"
              />

              <path
                d={generateRibbonPath()}
                stroke="url(#ribbonShimmer)"
                strokeWidth="16"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {visiblePath.length > 0 && (
                <>
                  <circle
                    cx={visiblePath[visiblePath.length - 1].x}
                    cy={visiblePath[visiblePath.length - 1].y}
                    r="8"
                    fill="#ec4899"
                    className="animate-pulse"
                  />
                  <circle
                    cx={visiblePath[visiblePath.length - 1].x}
                    cy={visiblePath[visiblePath.length - 1].y}
                    r="12"
                    fill="none"
                    stroke="#ec4899"
                    strokeWidth="2"
                    opacity="0.6"
                    className="animate-ping"
                  />
                </>
              )}
            </>
          )}

          <g>
            <circle
              cx={ribbonPath[0].x}
              cy={ribbonPath[0].y}
              r="6"
              fill="#10b981"
              stroke="#047857"
              strokeWidth="2"
            />
            <text
              x={ribbonPath[0].x}
              y={ribbonPath[0].y + 25}
              textAnchor="middle"
              className="text-xs font-bold fill-gray-900"
              fontSize="11"
              style={{ textShadow: '0 0 3px rgba(255,255,255,0.9)' }}
            >
              Départ
            </text>

            <circle
              cx={ribbonPath[ribbonPath.length - 1].x}
              cy={ribbonPath[ribbonPath.length - 1].y}
              r="6"
              fill="#ef4444"
              stroke="#dc2626"
              strokeWidth="2"
            />
            <text
              x={ribbonPath[ribbonPath.length - 1].x}
              y={ribbonPath[ribbonPath.length - 1].y - 15}
              textAnchor="middle"
              className="text-xs font-bold fill-gray-900"
              fontSize="11"
              style={{ textShadow: '0 0 3px rgba(255,255,255,0.9)' }}
            >
              Arrivée
            </text>
          </g>
        </svg>

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
