import { prisma } from './prisma';

export const adminParticipantService = {
  async getAll(page = 1, limit = 20, search = '') {
    const skip = (page - 1) * limit;

    const where = search ? {
      OR: [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
        { club: { contains: search } }
      ]
    } : {};

    const [participants, total] = await Promise.all([
      prisma.participant.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          kilometerEntries: {
            select: {
              kilometers: true,
              validated: true
            }
          },
          rowingCareCupRegs: true
        }
      }),
      prisma.participant.count({ where })
    ]);

    return {
      participants: participants.map(p => ({
        ...p,
        totalKm: p.kilometerEntries
          .filter(e => e.validated)
          .reduce((sum, e) => sum + e.kilometers, 0),
        entriesCount: p.kilometerEntries.length,
        registrationsCount: p.rowingCareCupRegs.length
      })),
      total,
      pages: Math.ceil(total / limit)
    };
  },

  async update(id: string, data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    club?: string;
  }) {
    return await prisma.participant.update({
      where: { id },
      data
    });
  },

  async delete(id: string) {
    return await prisma.participant.delete({
      where: { id }
    });
  }
};

export const adminKilometerService = {
  async getAll(page = 1, limit = 20, filters: {
    validated?: boolean;
    participantId?: string;
    activityType?: string;
    dateFrom?: Date;
    dateTo?: Date;
  } = {}) {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters.validated !== undefined) where.validated = filters.validated;
    if (filters.participantId) where.participantId = filters.participantId;
    if (filters.activityType) where.activityType = filters.activityType;
    if (filters.dateFrom || filters.dateTo) {
      where.date = {};
      if (filters.dateFrom) where.date.gte = filters.dateFrom;
      if (filters.dateTo) where.date.lte = filters.dateTo;
    }

    const [entries, total] = await Promise.all([
      prisma.kilometerEntry.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          participant: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              club: true
            }
          }
        }
      }),
      prisma.kilometerEntry.count({ where })
    ]);

    return {
      entries,
      total,
      pages: Math.ceil(total / limit)
    };
  },

  async update(id: string, data: {
    date?: Date;
    activityType?: 'INDOOR' | 'OUTDOOR' | 'AVIFIT';
    kilometers?: number;
    duration?: string;
    location?: string;
    participationType?: 'INDIVIDUAL' | 'COLLECTIVE';
    participantCount?: number;
    description?: string;
    validated?: boolean;
  }) {
    return await prisma.kilometerEntry.update({
      where: { id },
      data
    });
  },

  async validate(id: string) {
    return await prisma.kilometerEntry.update({
      where: { id },
      data: { validated: true }
    });
  },

  async validateMany(ids: string[]) {
    return await prisma.kilometerEntry.updateMany({
      where: { id: { in: ids } },
      data: { validated: true }
    });
  },

  async delete(id: string) {
    return await prisma.kilometerEntry.delete({
      where: { id }
    });
  }
};

export const adminEventService = {
  async getAll() {
    return await prisma.event.findMany({
      orderBy: { dateStart: 'desc' }
    });
  },

  async create(data: {
    title: string;
    description: string;
    dateStart: Date;
    dateEnd?: Date;
    timeInfo?: string;
    eventType: string;
    color?: string;
    activities?: any;
    status?: 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'FEATURED';
  }) {
    return await prisma.event.create({
      data
    });
  },

  async update(id: string, data: {
    title?: string;
    description?: string;
    dateStart?: Date;
    dateEnd?: Date;
    timeInfo?: string;
    eventType?: string;
    color?: string;
    activities?: any;
    status?: 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'FEATURED';
  }) {
    return await prisma.event.update({
      where: { id },
      data
    });
  },

  async delete(id: string) {
    return await prisma.event.delete({
      where: { id }
    });
  }
};

export const adminRowingCareCupService = {
  async getAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [registrations, total] = await Promise.all([
      prisma.rowingCareCupRegistration.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          participant: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              club: true
            }
          }
        }
      }),
      prisma.rowingCareCupRegistration.count()
    ]);

    return {
      registrations,
      total,
      pages: Math.ceil(total / limit)
    };
  },

  async update(id: string, data: {
    category?: string;
    distance?: string;
    gender?: string;
    teamType?: string;
    price?: number;
    paid?: boolean;
  }) {
    return await prisma.rowingCareCupRegistration.update({
      where: { id },
      data
    });
  },

  async markAsPaid(id: string) {
    return await prisma.rowingCareCupRegistration.update({
      where: { id },
      data: { paid: true }
    });
  },

  async delete(id: string) {
    return await prisma.rowingCareCupRegistration.delete({
      where: { id }
    });
  }
};

export const adminPhotoService = {
  async getAll(approved?: boolean) {
    const where = approved !== undefined ? { approved } : {};

    return await prisma.photo.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
  },

  async approve(id: string) {
    return await prisma.photo.update({
      where: { id },
      data: { approved: true }
    });
  },

  async update(id: string, data: {
    caption?: string;
    approved?: boolean;
  }) {
    return await prisma.photo.update({
      where: { id },
      data
    });
  },

  async delete(id: string) {
    return await prisma.photo.delete({
      where: { id }
    });
  }
};

export const adminClubService = {
  async getAll() {
    return await prisma.club.findMany({
      orderBy: { totalKm: 'desc' }
    });
  },

  async create(data: {
    name: string;
    city: string;
    country: string;
    totalKm?: number;
    memberCount?: number;
  }) {
    return await prisma.club.create({
      data
    });
  },

  async update(id: string, data: {
    name?: string;
    city?: string;
    country?: string;
    totalKm?: number;
    memberCount?: number;
  }) {
    return await prisma.club.update({
      where: { id },
      data
    });
  },

  async delete(id: string) {
    return await prisma.club.delete({
      where: { id }
    });
  }
};

export const adminContentService = {
  async getAll(category?: string) {
    const where = category ? { category } : {};

    return await prisma.siteContent.findMany({
      where,
      orderBy: { category: 'asc' }
    });
  },

  async getByKey(key: string) {
    return await prisma.siteContent.findUnique({
      where: { key }
    });
  },

  async upsert(data: {
    key: string;
    value: string;
    type?: 'TEXT' | 'NUMBER' | 'HTML' | 'JSON' | 'IMAGE_URL';
    category: string;
    label: string;
    description?: string;
  }) {
    return await prisma.siteContent.upsert({
      where: { key: data.key },
      update: {
        value: data.value,
        type: data.type,
        category: data.category,
        label: data.label,
        description: data.description
      },
      create: data
    });
  },

  async delete(key: string) {
    return await prisma.siteContent.delete({
      where: { key }
    });
  }
};
