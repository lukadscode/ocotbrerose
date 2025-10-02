import { 
  participantService, 
  kilometerService, 
  eventService, 
  photoService, 
  rowingCareCupService,
  adminService,
  clubService
} from './database';
import { sendOTP, verifyOTP } from './otp';
import { sendRegistrationEmail } from './email';

// Simulation d'API pour l'authentification
export const authService = {
  async sendOTP(email: string): Promise<boolean> {
    try {
      const result = await sendOTP(email);
      return result.success;
    } catch (error) {
      console.error('Error sending OTP:', error);
      return false;
    }
  },

  async verifyOTP(email: string, code: string): Promise<{ success: boolean; participant?: any }> {
    try {
      const otpResult = await verifyOTP(email, code);
      
      if (otpResult.success) {
        let participant = await participantService.findByEmail(email);
        
        if (!participant) {
          // Créer un nouveau participant
          participant = await participantService.create({
            firstName: email.split('@')[0], // Utiliser la partie avant @ comme prénom temporaire
            lastName: 'Participant',
            email,
            club: 'Club Nautique de Paris'
          });
          
          // Envoyer l'email de bienvenue
          await sendRegistrationEmail(email, participant.firstName, participant.lastName);
        }
        
        return { success: true, participant };
      } else {
        return { success: false, message: otpResult.message };
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return { success: false };
    }
  }
};

export const adminAuthService = {
  async login(email: string, password: string): Promise<{ success: boolean; admin?: any }> {
    try {
      const admin = await adminService.findByEmail(email);
      if (!admin) {
        return { success: false };
      }
      
      const isValidPassword = await adminService.verifyPassword(password, admin.password);
      if (!isValidPassword) {
        return { success: false };
      }
      
      return { 
        success: true, 
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role
        }
      };
    } catch (error) {
      console.error('Error during admin login:', error);
      return { success: false };
    }
  }
};

// API pour les participants
export const participantAPI = {
  async create(data: {
    firstName: string;
    lastName: string;
    email: string;
    club?: string;
  }) {
    return await participantService.create(data);
  },

  async getStats() {
    return await participantService.getStats();
  },

  async getAll() {
    return await participantService.getAll();
  }
};

// API pour les kilomètres
export const kilometerAPI = {
  async create(data: {
    participantId: string;
    date: Date;
    activityType: 'INDOOR' | 'OUTDOOR' | 'AVIFIT';
    kilometers: number;
    duration?: string;
    location?: string;
    participationType: 'INDIVIDUAL' | 'COLLECTIVE';
    participantCount: number;
    description?: string;
    photoUrl?: string;
  }) {
    const entry = await kilometerService.create(data);
    
    // Mettre à jour les stats du club
    if (data.location) {
      await clubService.updateStats(data.location, data.kilometers);
    }
    
    return entry;
  },

  async getByParticipant(participantId: string) {
    return await kilometerService.getByParticipant(participantId);
  },

  async getAll() {
    return await kilometerService.getAll();
  },

  async getValidated() {
    return await kilometerService.getValidated();
  }
};

// API pour les événements
export const eventAPI = {
  async getAll() {
    return await eventService.getAll();
  },

  async create(data: {
    title: string;
    description: string;
    dateStart: Date;
    dateEnd?: Date;
    timeInfo?: string;
    eventType: string;
    color?: string;
    activities?: string[];
    status?: 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'FEATURED';
  }) {
    return await eventService.create(data);
  }
};

// API pour les photos
export const photoAPI = {
  async getApproved() {
    return await photoService.getApproved();
  },

  async create(data: {
    participantId: string;
    url: string;
    caption?: string;
  }) {
    return await photoService.create(data);
  }
};

// API pour Rowing Care Cup
export const rowingCareCupAPI = {
  async register(data: {
    participantId: string;
    category: string;
    distance: string;
    gender?: string;
    teamType?: string;
    price: number;
  }) {
    return await rowingCareCupService.create(data);
  },

  async getStats() {
    return await rowingCareCupService.getStats();
  }
};

// API pour les clubs
export const clubAPI = {
  async getAll() {
    return await clubService.getAll();
  }
};

// API pour l'admin
export const adminAPI = {
  async getDashboardStats() {
    const [participants, kilometers, clubs, events, photos, entries, registrations] = await Promise.all([
      participantService.getAll(),
      kilometerService.getValidated(),
      clubService.getAll(),
      eventService.getAll(),
      photoService.getApproved(),
      kilometerService.getAll(),
      rowingCareCupService.getStats()
    ]);

    const totalKilometers = kilometers.reduce((sum: number, entry: any) => sum + entry.kilometers, 0);
    const pendingEntries = entries.filter((e: any) => !e.validated).length;
    const allPhotos = await photoService.getAll();
    const pendingPhotos = allPhotos.filter((p: any) => !p.approved).length;

    return {
      totalParticipants: participants.length,
      totalKilometers,
      totalClubs: clubs.length,
      totalEvents: events.length,
      pendingPhotos,
      pendingEntries,
      rowingRegistrations: registrations.total || 0
    };
  }
};