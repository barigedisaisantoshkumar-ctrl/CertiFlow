import { INITIAL_INTERNS } from './mockData';
import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEY = 'certiflow_interns';

const getStoredInterns = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_INTERNS));
    return INITIAL_INTERNS;
  }
  return JSON.parse(data);
};

const saveStoredInterns = (interns) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(interns));
};

export const internService = {
  async getInterns() {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('interns')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to local storage', err);
      }
    }
    return getStoredInterns();
  },

  async getInternById(id) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('interns')
          .select('*')
          .eq('id', id)
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase fetch by ID failed, using local storage fallback', err);
      }
    }
    const list = getStoredInterns();
    return list.find((i) => i.id === id) || null;
  },

  async createIntern(internData) {
    const newIntern = {
      id: 'int-' + Date.now(),
      intern_code: `INT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`,
      ...internData,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('interns').insert([newIntern]).select().single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase create failed, saving locally', err);
      }
    }

    const list = getStoredInterns();
    const updated = [newIntern, ...list];
    saveStoredInterns(updated);
    return newIntern;
  },

  async updateIntern(id, internData) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('interns')
          .update(internData)
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase update failed, saving locally', err);
      }
    }

    const list = getStoredInterns();
    const updated = list.map((i) => (i.id === id ? { ...i, ...internData, updated_at: new Date().toISOString() } : i));
    saveStoredInterns(updated);
    return updated.find((i) => i.id === id);
  },

  async deleteIntern(id) {
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('interns').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete failed', err);
      }
    }
    const list = getStoredInterns();
    const filtered = list.filter((i) => i.id !== id);
    saveStoredInterns(filtered);
    return true;
  }
};
