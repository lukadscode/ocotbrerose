import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type ParticipantType = 'individual' | 'club' | 'kine_cabinet';
export type ActivityType = 'indoor' | 'outdoor' | 'avifit';
export type ParticipationType = 'individual' | 'collective';

export interface Participant {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  club?: string;
  participant_type: ParticipantType;
  organization_name?: string;
  city?: string;
  created_at: string;
  updated_at: string;
}

export interface KilometerEntry {
  id: string;
  participant_id: string;
  date: string;
  activity_type: ActivityType;
  kilometers: number;
  duration?: string;
  location?: string;
  participation_type: ParticipationType;
  participant_count: number;
  description?: string;
  photo_url?: string;
  validated: boolean;
  created_at: string;
  updated_at: string;
}

export const supabaseService = {
  async createKilometerEntry(data: Omit<KilometerEntry, 'id' | 'created_at' | 'updated_at' | 'validated'>) {
    const { data: entry, error } = await supabase
      .from('kilometer_entries')
      .insert([data])
      .select()
      .maybeSingle();

    if (error) throw error;
    return entry;
  },

  async getKilometerEntriesByParticipant(participantId: string) {
    const { data, error } = await supabase
      .from('kilometer_entries')
      .select('*')
      .eq('participant_id', participantId)
      .order('date', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getParticipantByEmail(email: string) {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async createParticipant(data: Omit<Participant, 'id' | 'created_at' | 'updated_at'>) {
    const { data: participant, error } = await supabase
      .from('participants')
      .insert([data])
      .select()
      .maybeSingle();

    if (error) throw error;
    return participant;
  },

  async updateParticipant(id: string, data: Partial<Participant>) {
    const { data: participant, error } = await supabase
      .from('participants')
      .update(data)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;
    return participant;
  },

  async getStats() {
    const { data: participants, error: participantsError } = await supabase
      .from('participants')
      .select('*');

    if (participantsError) throw participantsError;

    const { data: entries, error: entriesError } = await supabase
      .from('kilometer_entries')
      .select('*')
      .eq('validated', true);

    if (entriesError) throw entriesError;

    const totalKilometers = entries?.reduce((sum, entry) => sum + Number(entry.kilometers), 0) || 0;

    const uniqueOrganizations = new Set(
      participants
        ?.filter(p => p.organization_name)
        .map(p => p.organization_name)
    );

    return {
      totalParticipants: participants?.length || 0,
      totalKilometers: Math.round(totalKilometers * 10) / 10,
      totalClubs: uniqueOrganizations.size,
      entries: entries || []
    };
  }
};
