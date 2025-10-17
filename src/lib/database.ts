import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

// Types
export interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  club?: string;
  createdAt: Date;
}

export interface KilometerEntry {
  id: string;
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
  validated: boolean;
  createdAt: Date;
  participant?: Participant;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  dateStart: Date;
  dateEnd?: Date;
  timeInfo?: string;
  eventType: string;
  color: string;
  activities?: string[];
  status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'FEATURED';
  createdAt: Date;
}

// Services de base de données
export const participantService = {
  async create(data: {
    firstName: string;
    lastName: string;
    email: string;
    club?: string;
  }): Promise<Participant> {
    return await prisma.participant.create({
      data
    });
  },

  async findByEmail(email: string): Promise<Participant | null> {
    return await prisma.participant.findUnique({
      where: { email }
    });
  },

  async findById(id: string): Promise<Participant | null> {
    return await prisma.participant.findUnique({
      where: { id }
    });
  },

  async getAll(): Promise<Participant[]> {
    return await prisma.participant.findMany({
      orderBy: { createdAt: 'desc' }
    });
  },

  async getStats() {
    const totalParticipants = await prisma.participant.count();
    const totalKilometers = await prisma.kilometerEntry.aggregate({
      _sum: { kilometers: true },
      where: { validated: true }
    });
    const totalClubs = await prisma.club.count();
    
    return {
      totalParticipants,
      totalKilometers: totalKilometers._sum.kilometers || 0,
      totalClubs
    };
  }
};

export const kilometerService = {
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
  }): Promise<KilometerEntry> {
    return await prisma.kilometerEntry.create({
      data: {
        ...data,
        validated: true // Auto-validation pour la démo
      },
      include: {
        participant: true
      }
    });
  },

  async getByParticipant(participantId: string): Promise<KilometerEntry[]> {
    return await prisma.kilometerEntry.findMany({
      where: { participantId },
      include: { participant: true },
      orderBy: { date: 'desc' }
    });
  },

  async getAll(): Promise<KilometerEntry[]> {
    return await prisma.kilometerEntry.findMany({
      include: { participant: true },
      orderBy: { createdAt: 'desc' }
    });
  },

  async getValidated(): Promise<KilometerEntry[]> {
    return await prisma.kilometerEntry.findMany({
      where: { validated: true },
      include: { participant: true },
      orderBy: { date: 'desc' }
    });
  },

  async validate(id: string): Promise<KilometerEntry> {
    return await prisma.kilometerEntry.update({
      where: { id },
      data: { validated: true },
      include: { participant: true }
    });
  }
};

export const eventService = {
  async getAll(): Promise<Event[]> {
    const events = await prisma.event.findMany({
      orderBy: { dateStart: 'asc' }
    });
    
    return events.map(event => ({
      ...event,
      activities: event.activities ? JSON.parse(event.activities as string) : []
    }));
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
  }): Promise<Event> {
    const event = await prisma.event.create({
      data: {
        ...data,
        activities: data.activities ? JSON.stringify(data.activities) : null
      }
    });
    
    return {
      ...event,
      activities: event.activities ? JSON.parse(event.activities as string) : []
    };
  }
};

export const clubService = {
  async getAll() {
    return await prisma.club.findMany({
      orderBy: { totalKm: 'desc' }
    });
  },

  async updateStats(clubName: string, additionalKm: number) {
    const club = await prisma.club.findFirst({
      where: { name: clubName }
    });
    
    if (club) {
      return await prisma.club.update({
        where: { id: club.id },
        data: {
          totalKm: club.totalKm + additionalKm
        }
      });
    }
  }
};

export const photoService = {
  async getAll() {
    return await prisma.photo.findMany({
      orderBy: { createdAt: 'desc' }
    });
  },

  async getApproved() {
    return await prisma.photo.findMany({
      where: { approved: true },
      orderBy: { createdAt: 'desc' }
    });
  },

  async create(data: {
    participantId: string;
    url: string;
    caption?: string;
  }) {
    return await prisma.photo.create({
      data: {
        ...data,
        approved: false
      }
    });
  }
};

export const rowingCareCupService = {
  async create(data: {
    participantId: string;
    category: string;
    distance: string;
    gender?: string;
    teamType?: string;
    price: number;
  }) {
    return await prisma.rowingCareCupRegistration.create({
      data
    });
  },

  async getStats() {
    const totalRegistrations = await prisma.rowingCareCupRegistration.count();
    const totalAmount = await prisma.rowingCareCupRegistration.aggregate({
      _sum: { price: true },
      where: { paid: true }
    });

    return {
      total: totalRegistrations,
      totalRegistrations,
      totalAmount: totalAmount._sum.price || 0
    };
  }
};

export const otpService = {
  async create(email: string, code: string) {
    // Supprimer les anciens codes
    await prisma.otpCode.deleteMany({
      where: { email }
    });
    
    return await prisma.otpCode.create({
      data: {
        email,
        code,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
      }
    });
  },

  async verify(email: string, code: string): Promise<boolean> {
    const otpCode = await prisma.otpCode.findFirst({
      where: {
        email,
        code,
        used: false,
        expiresAt: { gt: new Date() }
      }
    });

    if (otpCode) {
      await prisma.otpCode.update({
        where: { id: otpCode.id },
        data: { used: true }
      });
      return true;
    }

    return false;
  }
};

export const adminService = {
  async findByEmail(email: string) {
    return await prisma.admin.findUnique({
      where: { email }
    });
  },

  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  },

  async getDashboardStats() {
    const [
      totalParticipants,
      totalKilometers,
      totalClubs,
      totalEvents,
      pendingPhotos,
      pendingEntries,
      pendingKilometers,
      rowingRegistrations
    ] = await Promise.all([
      prisma.participant.count(),
      prisma.kilometerEntry.aggregate({
        _sum: { kilometers: true },
        where: { validated: true }
      }),
      prisma.club.count(),
      prisma.event.count(),
      prisma.photo.count({ where: { approved: false } }),
      prisma.kilometerEntry.count({ where: { validated: false } }),
      prisma.kilometerEntry.aggregate({
        _sum: { kilometers: true },
        where: { validated: false }
      }),
      prisma.rowingCareCupRegistration.count()
    ]);

    return {
      totalParticipants,
      totalKilometers: totalKilometers._sum.kilometers || 0,
      totalClubs,
      totalEvents,
      pendingPhotos,
      pendingEntries,
      pendingKilometers: pendingKilometers._sum.kilometers || 0,
      rowingRegistrations
    };
  }
};