// Service d'email avec Resend - Version simple et directe
import { Resend } from 'resend';

const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

export const sendOTPEmail = async (email: string, otpCode: string): Promise<boolean> => {
  try {
    console.log('📧 Envoi OTP via endpoint Node.js...');
    
    const response = await fetch('/api/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        otpCode
      })
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      console.error('❌ Erreur API:', result);
      throw new Error(result.error || 'Erreur lors de l\'envoi');
    }

    console.log('✅ Email OTP envoyé avec succès:', result);
    return true;

  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
    return false;
  }
};

export const sendRegistrationEmail = async (
  email: string, 
  firstName: string, 
  lastName: string
): Promise<boolean> => {
  try {
    // Appel à l'endpoint PHP
    const response = await fetch('/api/send-otp.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        otpCode
      })
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      console.error('❌ Erreur API:', result);
      throw new Error(result.error || 'Erreur lors de l\'envoi');
    }

    console.log('✅ Email OTP envoyé avec succès via PHP:', result);
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email de bienvenue:', error);
    console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
    throw new Error('Erreur lors de l\'envoi de l\'email. Réessayez.');
  }
};