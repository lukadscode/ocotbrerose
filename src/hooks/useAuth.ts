import { useState, useEffect } from 'react';
import { authService } from '../lib/api';

interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export const useAuthProvider = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp > Date.now() / 1000) {
          setUser(payload);
        } else {
          localStorage.removeItem('auth_token');
        }
      } catch {
        localStorage.removeItem('auth_token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, otp: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const result = await authService.verifyOTP(email, otp);
      if (result.success) {
        setUser(result.participant);
        // Créer un token JWT simple pour la session
        const token = btoa(JSON.stringify({
          ...result.participant,
          exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24h
        }));
        localStorage.setItem('auth_token', token);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  const sendOTP = async (email: string): Promise<boolean> => {
    try {
      return await authService.sendOTP(email);
    } catch (error) {
      console.error('Send OTP error:', error);
      return false;
    }
  };

  return {
    user,
    login,
    logout,
    sendOTP,
    isLoading
  };
};