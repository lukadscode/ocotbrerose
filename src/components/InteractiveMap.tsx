import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Flag, Star, Play, Pause } from 'lucide-react';

const InteractiveMap = () => {
  const [currentStep, setCurrentStep] = useState(5);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  // Capitales européennes avec leurs coordonnées précises basées sur l'image fournie
  const capitals = [
    { name: 'Lisbonne', country: 'Portugal', x: 0, y: 0, distance: 0, completed: false },
    { name: 'Lisbonne', country: 'Portugal', x: 0, y: 0, distance: 0, completed: false },
    { name: 'Lisbonne', country: 'Portugal', x: 0, y: 0, distance: 0, completed: false },
    { name: 'Lisbonne', country: 'Portugal', x: 0, y: 0, distance: 0, completed: false },
    { name: 'Lisbonne', country: 'Portugal', x: 0, y: 0, distance: 0, completed: false },
    { name: 'Lisbonne', country: 'Portugal', x: 0, y: 0, distance: 0, completed: false },
    { name: 'Lisbonne', country: 'Portugal', x: 0, y: 0, distance: 0, completed: false },
    { name: 'Lisbonne', country: 'Portugal', x: 0, y: 0, distance: 0, completed: false },
    { name: 'Lisbonne', country: 'Portugal', x: 0, y: 0, distance: 0, completed: false },
    { name: 'Lisbonne', country: 'Portugal', x: 0, y: 0, distance: 0, completed: false },
    { name: 'Lisbonne', country: 'Portugal', x: 0, y: 0, distance: 0, completed: false },
    { name: 'Lisbonne', country: 'Portugal', x: 0, y: 0, distance: 0, completed: false },
    { name: 'Lisbonne', country: 'Portugal', x: 0, y: 0, distance: 0, completed: false },
    { name: 'Lisbonne', country: 'Portugal', x: 0, y: 0, distance: 0, completed: false },
    { name: 'Lisbonne', country: 'Portugal', x: 0, y: 0, distance: 0, completed: false },
    { name: 'Lisbonne', country: 'Portugal', x: 0, y: 0, distance: 0, completed: false },
    { name: 'Lisbonne', country: 'Portugal', x: 0, y: 0, distance: 0, completed: false },
    { name: 'Lisbonne', country: 'Portugal', x: 0, y: 0, distance: 0, completed: false },
    { name: 'Lisbonne', country: 'Portugal', x: 0, y: 0, distance: 0, completed: false },
    { name: 'Lisbonne', country: 'Portugal', x: 0, y: 0, distance: 0, completed: false },
    { name: 'Lisbonne', country: 'Portugal', x: 0, y: 0, distance: 0, completed: false },
    { name: 'Lisbonne', country: 'Portugal', x: 0, y: 0, distance: 0, completed: false },
    { name: 'Lisbonne', country: 'Portugal', x: 0, y: 0, distance: 0, completed: false },
    { name: 'Lisbonne', country: 'Portugal', x: 0, y: 0, distance: 0, completed: false },
    { name: 'Lisbonne', country: 'Portugal', x: 0, y: 0, distance: 0, completed: false },
    { name: 'Lisbonne', country: 'Portugal', x: 0, y: 0, distance: 0, completed: false },
    { name: 'Lisbonne', country: 'Portugal', x: 0, y: 0, distance: 0, completed: false },
  ];

  // Animation du ruban rose
  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setAnimationProgress(prev => (prev + 0.5) % 100);
    }, 50);

    return () => clearInterval(interval);
  }, [isAnimating]);

  // Simulation de progression
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentStep < capitals.length - 1) {
        setCurrentStep(prev => prev + 1);
        capitals[currentStep + 1].completed = true;
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentStep]);

  const completedCapitals = capitals.filter(c => c.completed);
  const nextCapital = capitals.find(c => !c.completed);
  const totalDistance = capitals.reduce((sum, capital) => sum + capital.distance, 0);
  const completedDistance = completedCapitals.reduce((sum, capital) => sum + capital.distance, 0);

  // Génération du chemin SVG pour le ruban rose large
  const generateRibbonPath = () => {
    if (completedCapitals.length < 2) return '';
    
    let path = `M ${completedCapitals[0].x} ${completedCapitals[0].y}`;
    
    for (let i = 1; i < completedCapitals.length; i++) {
      const current = completedCapitals[i];
      const previous = completedCapitals[i - 1];
      
      // Courbe de Bézier pour un tracé plus fluide et réaliste
      const controlX1 = previous.x + (current.x - previous.x) * 0.3;
      const controlY1 = previous.y - 30;
      const controlX2 = previous.x + (current.x - previous.x) * 0.7;
      const controlY2 = current.y - 30;
      
      path += ` C ${controlX1} ${controlY1} ${controlX2} ${controlY2} ${current.x} ${current.y}`;
    }
    
    return path;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          
          <button
            onClick={() => setIsAnimating(!isAnimating)}
            className="flex items-center space-x-2 px-4 py-2 bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 transition-colors"
          >
            {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isAnimating ? 'Pause' : 'Play'}</span>
          </button>
        </div>
        
        <div className="flex justify-center items-center space-x-8 text-sm mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-pink-500 rounded-full animate-pulse"></div>
            <span className="text-gray-600">Étapes accomplies</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
            <span className="text-gray-600">Étapes à venir</span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-yellow-500 animate-bounce" />
            <span className="text-gray-600">Prochaine étape</span>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="bg-gray-200 rounded-full h-3 mb-2">
          <div
            className="bg-gradient-to-r from-pink-500 to-rose-600 h-3 rounded-full transition-all duration-1000 relative overflow-hidden"
            style={{ width: `${(completedDistance / totalDistance) * 100}%` }}
          >
            <div className="absolute inset-0 bg-white/30 h-full animate-pulse"></div>
          </div>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>{completedDistance.toLocaleString()} km</span>
          <span className="font-semibold text-pink-600">
            {Math.round((completedDistance / totalDistance) * 100)}% accompli
          </span>
          <span>{totalDistance.toLocaleString()} km</span>
        </div>
      </div>

      {/* Carte d'Europe colorée avec ruban rose */}
      <div className="relative bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-50 rounded-xl overflow-hidden">
        <svg
          viewBox="0 0 500 600"
          className="w-full h-full"
          style={{ minHeight: '600px' }}
        >
          {/* Définitions pour les gradients et effets */}
          <defs>
            <linearGradient id="ribbonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#f43f5e" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#be185d" stopOpacity="0.9" />
            </linearGradient>
            
            <filter id="ribbonGlow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <linearGradient id="ribbonShimmer" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0)" />
              <stop offset="50%" stopColor="rgba(255, 255, 255, 0.6)" />
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

          {/* Mer/Océan */}
          <rect width="500" height="600" fill="#E0F2FE" />

          {/* Pays européens colorés comme dans l'image */}
          <g>
            {/* Utilisation de la carte SVG fournie */}
            <image 
              href="/carte_rose.svg" 
              x="0" 
              y="0" 
              width="500" 
              height="600" 
              opacity="0.8"
            />
          </g>

          {/* Ruban rose large et réaliste */}
          {completedCapitals.length > 1 && (
            <>
              {/* Ombre du ruban */}
              <path
                d={generateRibbonPath()}
                stroke="rgba(0,0,0,0.3)"
                strokeWidth="25"
                fill="none"
                transform="translate(3, 3)"
                opacity="0.5"
              />
              
              {/* Ruban principal large */}
              <path
                d={generateRibbonPath()}
                stroke="url(#ribbonGradient)"
                strokeWidth="20"
                fill="none"
                filter="url(#ribbonGlow)"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Effet shimmer sur le ruban */}
              <path
                d={generateRibbonPath()}
                stroke="url(#ribbonShimmer)"
                strokeWidth="20"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          )}

          {/* Points des capitales */}
          {capitals.map((capital, index) => (
            <g key={capital.name}>
              {/* Cercle de base */}
              <circle
                cx={capital.x}
                cy={capital.y}
                r={capital.completed ? "6" : "4"}
                fill={capital.completed ? "#ec4899" : "#6b7280"}
                stroke={capital.completed ? "#be185d" : "#374151"}
                strokeWidth="2"
                className={capital.completed ? "animate-pulse" : ""}
              />
              
              {/* Effet de rayonnement pour les capitales accomplies */}
              {capital.completed && (
                <circle
                  cx={capital.x}
                  cy={capital.y}
                  r="10"
                  fill="none"
                  stroke="#ec4899"
                  strokeWidth="1"
                  opacity="0.4"
                  className="animate-ping"
                />
              )}
              
              {/* Indicateur spécial pour la prochaine étape */}
              {capital === nextCapital && (
                <>
                  <circle
                    cx={capital.x}
                    cy={capital.y}
                    r="12"
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="2"
                    className="animate-ping"
                  />
                  <circle
                    cx={capital.x}
                    cy={capital.y}
                    r="6"
                    fill="#fbbf24"
                    className="animate-pulse"
                  />
                </>
              )}

              {/* Nom de la capitale */}
              <text
                x={capital.x}
                y={capital.y - 15}
                textAnchor="middle"
                className="text-xs font-bold fill-gray-900"
                fontSize="11"
                style={{ textShadow: '0 0 3px rgba(255,255,255,0.9)' }}
              >
                {capital.name}
              </text>
              
              {/* Pays */}
              <text
                x={capital.x}
                y={capital.y - 5}
                textAnchor="middle"
                className="text-xs fill-gray-700"
                fontSize="9"
                style={{ textShadow: '0 0 2px rgba(255,255,255,0.9)' }}
              >
                {capital.country}
              </text>
            </g>
          ))}
        </svg>

        {/* Légende animée */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-pink-100">
          <div className="flex items-center space-x-2 mb-3">
            <Navigation className="w-5 h-5 text-pink-500" />
            <span className="font-semibold text-gray-800">Progression en temps réel</span>
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <div className="flex items-center space-x-2">
              <Flag className="w-4 h-4 text-green-500" />
              <span>{completedCapitals.length} Pays atteints</span>
            </div>
            {nextCapital && (
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>Prochaine: {nextCapital.name}</span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-pink-500 rounded-full animate-pulse"></div>
              <span>{completedDistance.toLocaleString()} km parcourus</span>
            </div>
          </div>
        </div>

        {/* Indicateur de vitesse */}
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-pink-100">
          <div className="text-center">
            <div className="text-lg font-bold text-pink-600">
              {Math.round((completedDistance / totalDistance) * 100)}%
            </div>
            <div className="text-xs text-gray-600">Objectif atteint</div>
          </div>
        </div>
      </div>

      {/* Statistiques de progression */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl">
          <div className="text-2xl font-bold text-pink-600 mb-1">
            {completedCapitals.length}
          </div>
          <div className="text-sm text-gray-600">Pays atteints</div>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {capitals.length - completedCapitals.length}
          </div>
          <div className="text-sm text-gray-600">Pays restants</div>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {completedDistance.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Kilomètres parcourus</div>
        </div>

        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl">
          <div className="text-2xl font-bold text-purple-600 mb-1">
            {(totalDistance - completedDistance).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Kilomètres restants</div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;