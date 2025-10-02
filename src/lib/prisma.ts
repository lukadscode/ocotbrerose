// Client-side database simulation
// Data is stored in memory for demo purposes

export interface InMemoryData {
  participants: any[];
  kilometerEntries: any[];
  events: any[];
  clubs: any[];
  photos: any[];
  rowingCareCupRegistrations: any[];
  otpCodes: any[];
  admins: any[];
}

// Simulated in-memory data
export const inMemoryDB: InMemoryData = {
  participants: [],
  kilometerEntries: [],
  events: [
    {
      id: '1',
      title: 'Défi Rose 2024',
      description: 'Le grand défi solidaire de l\'aviron français',
      dateStart: new Date('2024-10-01'),
      dateEnd: new Date('2024-10-31'),
      timeInfo: 'Tout le mois d\'octobre',
      eventType: 'challenge',
      color: '#ec4899',
      activities: ['indoor', 'outdoor', 'avifit'],
      status: 'ACTIVE',
      createdAt: new Date()
    }
  ],
  clubs: [
    { id: '1', name: 'Club Nautique de Paris', totalKm: 0, createdAt: new Date() },
    { id: '2', name: 'Aviron Bayonnais', totalKm: 0, createdAt: new Date() },
    { id: '3', name: 'Société Nautique de Genève', totalKm: 0, createdAt: new Date() }
  ],
  photos: [],
  rowingCareCupRegistrations: [],
  otpCodes: [],
  admins: [
    {
      id: '1',
      email: 'admin@defirose.fr',
      name: 'Admin Défi Rose',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
      role: 'admin',
      createdAt: new Date()
    }
  ]
};

// Add demo photos at startup
inMemoryDB.photos = [
  {
    id: '1',
    participantId: 'demo-participant-1',
    url: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg',
    caption: 'Séance d\'aviron motivante ! #OctobreRose2025',
    approved: true,
    createdAt: new Date('2025-01-15T10:00:00Z')
  },
  {
    id: '2',
    participantId: 'demo-participant-2',
    url: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg',
    caption: 'En rose pour la bonne cause !',
    approved: true,
    createdAt: new Date('2025-01-15T11:00:00Z')
  },
  {
    id: '3',
    participantId: 'demo-participant-3',
    url: 'https://images.pexels.com/photos/1263349/pexels-photo-1263349.jpeg',
    caption: 'Équipe solidaire au complet',
    approved: true,
    createdAt: new Date('2025-01-15T12:00:00Z')
  },
  {
    id: '4',
    participantId: 'demo-participant-4',
    url: 'https://images.pexels.com/photos/2294361/pexels-photo-2294361.jpeg',
    caption: 'Entraînement du matin sur l\'eau',
    approved: true,
    createdAt: new Date('2025-01-15T13:00:00Z')
  },
  {
    id: '5',
    participantId: 'demo-participant-5',
    url: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg',
    caption: 'Concentration maximale !',
    approved: true,
    createdAt: new Date('2025-01-15T14:00:00Z')
  },
  {
    id: '6',
    participantId: 'demo-participant-6',
    url: 'https://images.pexels.com/photos/1263348/pexels-photo-1263348.jpeg',
    caption: 'Aviron indoor intense',
    approved: true,
    createdAt: new Date('2025-01-15T15:00:00Z')
  },
  {
    id: '7',
    participantId: 'demo-participant-7',
    url: 'https://images.pexels.com/photos/2294362/pexels-photo-2294362.jpeg',
    caption: 'Lever de soleil sur la rivière',
    approved: true,
    createdAt: new Date('2025-01-15T16:00:00Z')
  },
  {
    id: '8',
    participantId: 'demo-participant-8',
    url: 'https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg',
    caption: 'Défi relevé avec succès !',
    approved: true,
    createdAt: new Date('2025-01-15T17:00:00Z')
  }
];

// Add corresponding participants
inMemoryDB.participants = [
  { id: 'demo-participant-1', firstName: 'Marie', lastName: 'Dupont', email: 'marie.dupont@email.com', club: 'Club Nautique de Paris', createdAt: new Date() },
  { id: 'demo-participant-2', firstName: 'Pierre', lastName: 'Martin', email: 'pierre.martin@email.com', club: 'Aviron Bayonnais', createdAt: new Date() },
  { id: 'demo-participant-3', firstName: 'Sophie', lastName: 'Bernard', email: 'sophie.bernard@email.com', club: 'Club Nautique de Paris', createdAt: new Date() },
  { id: 'demo-participant-4', firstName: 'Lucas', lastName: 'Moreau', email: 'lucas.moreau@email.com', club: 'Rowing Club Amsterdam', createdAt: new Date() },
  { id: 'demo-participant-5', firstName: 'Emma', lastName: 'Leroy', email: 'emma.leroy@email.com', club: 'Berlin Ruder Club', createdAt: new Date() },
  { id: 'demo-participant-6', firstName: 'Thomas', lastName: 'Dubois', email: 'thomas.dubois@email.com', club: 'Club Nautique de Paris', createdAt: new Date() },
  { id: 'demo-participant-7', firstName: 'Camille', lastName: 'Rousseau', email: 'camille.rousseau@email.com', club: 'Aviron Bayonnais', createdAt: new Date() },
  { id: 'demo-participant-8', firstName: 'Antoine', lastName: 'Petit', email: 'antoine.petit@email.com', club: 'Roma Canottieri', createdAt: new Date() }
];

// Utilities for generating IDs
export const generateId = () => Math.random().toString(36).substr(2, 9);

// Mock Prisma client for compatibility
export const prisma = {
  participant: {
    create: async (options: any) => {
      const participant = {
        id: generateId(),
        ...options.data,
        createdAt: new Date()
      };
      inMemoryDB.participants.push(participant);
      return participant;
    },
    findUnique: async (options: any) => {
      return inMemoryDB.participants.find(p => 
        options.where.email ? p.email === options.where.email :
        options.where.id ? p.id === options.where.id : false
      ) || null;
    },
    findMany: async (options: any) => {
      return inMemoryDB.participants.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },
    count: async () => inMemoryDB.participants.length
  },
  kilometerEntry: {
    create: async (options: any) => {
      const entry = {
        id: generateId(),
        ...options.data,
        createdAt: new Date()
      };
      inMemoryDB.kilometerEntries.push(entry);
      
      if (options.include?.participant) {
        entry.participant = inMemoryDB.participants.find(p => p.id === entry.participantId);
      }
      
      return entry;
    },
    findMany: async (options: any) => {
      let entries = [...inMemoryDB.kilometerEntries];
      
      if (options.where?.participantId) {
        entries = entries.filter(e => e.participantId === options.where.participantId);
      }
      if (options.where?.validated !== undefined) {
        entries = entries.filter(e => e.validated === options.where.validated);
      }
      
      if (options.include?.participant) {
        entries = entries.map(e => ({
          ...e,
          participant: inMemoryDB.participants.find(p => p.id === e.participantId)
        }));
      }
      
      return entries.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },
    aggregate: async (options: any) => {
      let entries = inMemoryDB.kilometerEntries;
      if (options.where?.validated) {
        entries = entries.filter(e => e.validated);
      }
      const sum = entries.reduce((total, entry) => total + (entry.kilometers || 0), 0);
      return { _sum: { kilometers: sum } };
    },
    count: async (options: any) => {
      let entries = inMemoryDB.kilometerEntries;
      if (options.where?.createdAt?.gte) {
        entries = entries.filter(e => new Date(e.createdAt) >= options.where.createdAt.gte);
      }
      return entries.length;
    },
    update: async (options: any) => {
      const index = inMemoryDB.kilometerEntries.findIndex(e => e.id === options.where.id);
      if (index !== -1) {
        inMemoryDB.kilometerEntries[index] = { ...inMemoryDB.kilometerEntries[index], ...options.data };
        if (options.include?.participant) {
          inMemoryDB.kilometerEntries[index].participant = inMemoryDB.participants.find(p => p.id === inMemoryDB.kilometerEntries[index].participantId);
        }
        return inMemoryDB.kilometerEntries[index];
      }
      throw new Error('Entry not found');
    }
  },
  event: {
    findMany: async () => inMemoryDB.events,
    create: async (options: any) => {
      const event = {
        id: generateId(),
        ...options.data,
        createdAt: new Date()
      };
      inMemoryDB.events.push(event);
      return event;
    },
    count: async () => inMemoryDB.events.length
  },
  club: {
    findMany: async () => inMemoryDB.clubs.sort((a, b) => b.totalKm - a.totalKm),
    findFirst: async (options: any) => {
      return inMemoryDB.clubs.find(c => c.name === options.where.name) || null;
    },
    update: async (options: any) => {
      const index = inMemoryDB.clubs.findIndex(c => c.id === options.where.id);
      if (index !== -1) {
        inMemoryDB.clubs[index] = { ...inMemoryDB.clubs[index], ...options.data };
        return inMemoryDB.clubs[index];
      }
      throw new Error('Club not found');
    },
    count: async () => inMemoryDB.clubs.length
  },
  photo: {
    findMany: async (options: any) => {
      let photos = inMemoryDB.photos;
      if (options.where?.approved !== undefined) {
        photos = photos.filter(p => p.approved === options.where.approved);
      }
      
      if (options.include?.participant) {
        photos = photos.map(p => ({
          ...p,
          participant: {
            firstName: inMemoryDB.participants.find(part => part.id === p.participantId)?.firstName || 'Demo',
            lastName: inMemoryDB.participants.find(part => part.id === p.participantId)?.lastName || 'User'
          }
        }));
      }
      
      return photos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    create: async (options: any) => {
      const photo = {
        id: generateId(),
        ...options.data,
        createdAt: new Date()
      };
      inMemoryDB.photos.push(photo);
      return photo;
    },
    count: async (options: any) => {
      if (options.where?.approved === false) {
        return inMemoryDB.photos.filter(p => !p.approved).length;
      }
      return inMemoryDB.photos.length;
    }
  },
  rowingCareCupRegistration: {
    create: async (options: any) => {
      const registration = {
        id: generateId(),
        ...options.data,
        paid: true,
        createdAt: new Date()
      };
      inMemoryDB.rowingCareCupRegistrations.push(registration);
      return registration;
    },
    count: async () => inMemoryDB.rowingCareCupRegistrations.length,
    aggregate: async (options: any) => {
      let registrations = inMemoryDB.rowingCareCupRegistrations;
      if (options.where?.paid) {
        registrations = registrations.filter(r => r.paid);
      }
      const sum = registrations.reduce((total, reg) => total + (reg.price || 0), 0);
      return { _sum: { price: sum } };
    }
  },
  otpCode: {
    deleteMany: async (options: any) => {
      inMemoryDB.otpCodes = inMemoryDB.otpCodes.filter(otp => otp.email !== options.where.email);
    },
    create: async (options: any) => {
      const otpCode = {
        id: generateId(),
        ...options.data,
        used: false,
        createdAt: new Date()
      };
      inMemoryDB.otpCodes.push(otpCode);
      return otpCode;
    },
    findFirst: async (options: any) => {
      return inMemoryDB.otpCodes.find(otp => 
        otp.email === options.where.email &&
        otp.code === options.where.code &&
        !otp.used &&
        new Date(otp.expiresAt) > new Date()
      ) || null;
    },
    update: async (options: any) => {
      const index = inMemoryDB.otpCodes.findIndex(otp => otp.id === options.where.id);
      if (index !== -1) {
        inMemoryDB.otpCodes[index] = { ...inMemoryDB.otpCodes[index], ...options.data };
        return inMemoryDB.otpCodes[index];
      }
      throw new Error('OTP not found');
    }
  },
  admin: {
    findUnique: async (options: any) => {
      return inMemoryDB.admins.find(a => a.email === options.where.email) || null;
    }
  }
};