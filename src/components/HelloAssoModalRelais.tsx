import React from 'react';
import { X, Trophy } from 'lucide-react';

interface HelloAssoModalProps {
  onClose: () => void;
}

const HelloAssoModal: React.FC<HelloAssoModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      {/* conteneur avec scroll */}
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header (fixe) */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Inscription Rowing Care Cup
                </h2>
                <p className="text-sm text-gray-600">
                  18 octobre 2025 - Événement connecté national
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Contenu scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-600 text-center">
              🔒 Paiement sécurisé via HelloAsso - Plateforme officielle de la FFAviron
            </p>
          </div>
          
          <div className="bg-white rounded-lg overflow-hidden">
            <iframe 
              id="haWidget" 
              allowTransparency={true}
              src="https://www.helloasso.com/associations/federation-francaise-d-aviron/evenements/rowing-care-cup-courses-relais/widget" 
              style={{ 
                width: '100%', 
                border: 'none',
                minHeight: '500px'
              }}
              onLoad={() => {
                window.addEventListener('message', (e) => {
                  const dataHeight = e.data.height;
                  const haWidgetElement = document.getElementById('haWidget') as HTMLIFrameElement;
                  if (haWidgetElement && dataHeight) {
                    haWidgetElement.style.height = dataHeight + 'px';
                  }
                });
              }}
            />
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="text-blue-600">ℹ️</div>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Informations importantes :</p>
                <ul className="space-y-1 text-xs">
                  <li>• Une partie des inscriptions est reversée à la lutte contre le cancer</li>
                  <li>• Vous recevrez un email de confirmation après paiement</li>
                  <li>• L'événement se déroule le 18 octobre 2025 en mode connecté</li>
                  <li>• Support technique : aviron-sante@ffaviron.fr</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelloAssoModal;
