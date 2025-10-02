import { useState, useEffect } from 'react';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export const useAdminAuth = () => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp > Date.now() / 1000) {
          setAdmin(payload);
        } else {
          localStorage.removeItem('admin_token');
        }
      } catch {
        localStorage.removeItem('admin_token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Vérification des identifiants par défaut
      if (email === 'admin@octobrerose2025.fr' && password === 'admin123') {
        const adminUser = {
          id: '1',
          email: 'admin@octobrerose2025.fr',
          name: 'Administrateur Principal',
          role: 'SUPER_ADMIN',
          exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24h
        };
        
        setAdmin(adminUser);
        
        // Créer un token JWT simple pour la session
        const token = btoa(JSON.stringify(adminUser));
        localStorage.setItem('admin_token', token);
        
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Admin login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setAdmin(null);
  };

  return {
    admin,
    login,
    logout,
    isLoading
  };
};