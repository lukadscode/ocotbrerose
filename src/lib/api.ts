const API_URL = import.meta.env.VITE_APP_URL || 'http://localhost:3003';

// Authentification
export const authService = {
  async sendOTP(email: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/api/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error sending OTP:', error);
      return false;
    }
  },

  async verifyOTP(email: string, code: string): Promise<{ success: boolean; participant?: any }> {
    try {
      const response = await fetch(`${API_URL}/api/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return { success: false };
    }
  }
};

export const adminAuthService = {
  async login(email: string, password: string): Promise<{ success: boolean; admin?: any }> {
    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      return data;
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
    const response = await fetch(`${API_URL}/api/participants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await response.json();
  },

  async getStats() {
    const response = await fetch(`${API_URL}/api/participants/stats`);
    return await response.json();
  },

  async getAll() {
    const response = await fetch(`${API_URL}/api/participants`);
    return await response.json();
  },

  async update(id: string, data: {
    firstName: string;
    lastName: string;
    email: string;
    club?: string;
  }) {
    const response = await fetch(`${API_URL}/api/participants/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await response.json();
  },

  async delete(id: string) {
    const response = await fetch(`${API_URL}/api/participants/${id}`, {
      method: 'DELETE'
    });
    return await response.json();
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
    const response = await fetch(`${API_URL}/api/kilometers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        date: data.date.toISOString()
      })
    });
    return await response.json();
  },

  async getByParticipant(participantId: string) {
    const response = await fetch(`${API_URL}/api/kilometers/participant/${participantId}`);
    return await response.json();
  },

  async getAll() {
    const response = await fetch(`${API_URL}/api/kilometers`);
    return await response.json();
  },

  async getValidated() {
    const response = await fetch(`${API_URL}/api/kilometers/validated`);
    return await response.json();
  }
};

// API pour les événements
export const eventAPI = {
  async getAll() {
    const response = await fetch(`${API_URL}/api/events`);
    return await response.json();
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
    const response = await fetch(`${API_URL}/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        dateStart: data.dateStart.toISOString(),
        dateEnd: data.dateEnd?.toISOString()
      })
    });
    return await response.json();
  }
};

// API pour les photos
export const photoAPI = {
  async getApproved() {
    const response = await fetch(`${API_URL}/api/photos/approved`);
    return await response.json();
  },

  async create(data: {
    participantId: string;
    url: string;
    caption?: string;
  }) {
    const response = await fetch(`${API_URL}/api/photos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await response.json();
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
    const response = await fetch(`${API_URL}/api/rowing-care-cup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await response.json();
  },

  async getStats() {
    const response = await fetch(`${API_URL}/api/rowing-care-cup/stats`);
    return await response.json();
  }
};

// API pour les clubs
export const clubAPI = {
  async getAll() {
    const response = await fetch(`${API_URL}/api/clubs`);
    return await response.json();
  }
};

// API pour l'admin
export const adminAPI = {
  async getDashboardStats() {
    const response = await fetch(`${API_URL}/api/admin/stats`);
    return await response.json();
  }
};
