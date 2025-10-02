import { sendOTPEmail } from './email';

interface OTPData {
  code: string;
  email: string;
  expiresAt: Date;
  used: boolean;
}

// Stockage temporaire des codes OTP (en production, utiliser une base de données)
const otpStorage = new Map<string, OTPData>();

// Nettoyer les codes expirés toutes les minutes
setInterval(() => {
  const now = new Date();
  for (const [email, data] of otpStorage.entries()) {
    if (data.expiresAt < now) {
      otpStorage.delete(email);
    }
  }
}, 60000);

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTP = async (email: string): Promise<{ success: boolean; message: string }> => {
  try {
    // Vérifier si un code a déjà été envoyé récemment (limite de 1 par minute)
    const existingOTP = otpStorage.get(email);
    if (existingOTP && !existingOTP.used) {
      const timeSinceLastSend = Date.now() - (existingOTP.expiresAt.getTime() - 10 * 60 * 1000);
      if (timeSinceLastSend < 60000) { // 1 minute
        return {
          success: false,
          message: 'Un code a déjà été envoyé. Veuillez attendre 1 minute avant de redemander.'
        };
      }
    }

    // Générer un nouveau code
    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Stocker le code
    otpStorage.set(email, {
      code: otpCode,
      email,
      expiresAt,
      used: false
    });

    // Envoyer l'email
    const emailSent = await sendOTPEmail(email, otpCode);
    
    if (!emailSent) {
      otpStorage.delete(email);
      return {
        success: false,
        message: 'Erreur lors de l\'envoi de l\'email. Veuillez réessayer.'
      };
    }

    console.log(`📧 Code OTP envoyé à ${email}: ${otpCode} (expire à ${expiresAt.toLocaleTimeString()})`);
    
    return {
      success: true,
      message: 'Code envoyé avec succès !'
    };
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi du code OTP:', error);
    return {
      success: false,
      message: 'Erreur technique. Veuillez réessayer plus tard.'
    };
  }
};

export const verifyOTP = async (email: string, code: string): Promise<{ success: boolean; message: string }> => {
  try {
    const otpData = otpStorage.get(email);
    
    if (!otpData) {
      return {
        success: false,
        message: 'Aucun code trouvé pour cette adresse email.'
      };
    }

    if (otpData.used) {
      return {
        success: false,
        message: 'Ce code a déjà été utilisé.'
      };
    }

    if (otpData.expiresAt < new Date()) {
      otpStorage.delete(email);
      return {
        success: false,
        message: 'Ce code a expiré. Demandez un nouveau code.'
      };
    }

    if (otpData.code !== code) {
      return {
        success: false,
        message: 'Code incorrect.'
      };
    }

    // Marquer le code comme utilisé
    otpData.used = true;
    otpStorage.set(email, otpData);

    console.log(`✅ Code OTP vérifié avec succès pour ${email}`);
    
    return {
      success: true,
      message: 'Code vérifié avec succès !'
    };
  } catch (error) {
    console.error('❌ Erreur lors de la vérification du code OTP:', error);
    return {
      success: false,
      message: 'Erreur technique. Veuillez réessayer.'
    };
  }
};

export const cleanupExpiredOTPs = () => {
  const now = new Date();
  let cleaned = 0;
  
  for (const [email, data] of otpStorage.entries()) {
    if (data.expiresAt < now) {
      otpStorage.delete(email);
      cleaned++;
    }
  }
  
  if (cleaned > 0) {
    console.log(`🧹 ${cleaned} codes OTP expirés supprimés`);
  }
};