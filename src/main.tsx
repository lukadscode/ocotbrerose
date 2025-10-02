import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Import et initialisation i18n
import i18n from './i18n';

// S'assurer que i18n est initialisé avant le rendu
i18n.init().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}).catch((error) => {
  console.error('Erreur d\'initialisation i18n:', error);
  // Rendu de fallback même en cas d'erreur i18n
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
