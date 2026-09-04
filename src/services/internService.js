import { INITIAL_INTERNS } from './mockData';
import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEY = 'certiflow_hps_interns_v3';

const getStoredInterns = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_INTERNS));
      return INITIAL_INTERNS;
    }
    return JSON.parse(data);
  } catch (err) {
    console.warn('Error reading stored interns', err);
    return INITIAL_INTERNS;
  }
};

const saveStoredInterns = (interns) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(interns));
  } catch (err) {
    console.warn('Error saving stored interns', err);
  }
};

export const internService = {
  async getInterns() {
    let localList = getStoredInterns();

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('interns')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          // Merge local-only items that may not have synced to Supabase yet
          const supabaseIds = new Set(data.map((item) => item.id));
          const localOnly = localList.filter((item) => !supabaseIds.has(item.id));
          const merged = [...localOnly, ...data].sort(
            (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
          );
          saveStoredInterns(merged);
          return merged;
        }
      } catch (err) {
        console.warn('Supabase fetch failed, using local storage fallback', err);
      }
    }

    return localList.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  },

  async getInternById(id) {
    const list = await this.getInterns();
    return list.find((i) => i.id === id) || null;
  },

  async createIntern(internData) {
    const list = getStoredInterns();
    const nextCounter = list.length + 38;
    const newIntern = {
      id: 'int-' + Date.now(),
      intern_code: internData.intern_code || `HPS26${String(nextCounter).padStart(4, '0')}`,
      full_name: internData.full_name || '',
      gender: internData.gender || 'Female',
      email: internData.email || '',
      phone: internData.phone || '',
      college: internData.college || '',
      course: internData.course || '',
      department: internData.department || 'Software Development',
      internship_title: internData.internship_title || 'SDE Intern',
      duration: internData.duration || '3 Months',
      start_date: internData.start_date || new Date().toISOString().split('T')[0],
      end_date: internData.end_date || new Date().toISOString().split('T')[0],
      supervisor_name: internData.supervisor_name || 'Director',
      supervisor_email: internData.supervisor_email || 'director@thehps.in',
      created_at: new Date().toISOString(),
    };

    // Save locally immediately so new intern appears in UI regardless of DB state
    const updatedList = [newIntern, ...list.filter((i) => i.id !== newIntern.id)];
    saveStoredInterns(updatedList);

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('interns').insert([newIntern]).select().single();
        if (!error && data) {
          const syncedList = [data, ...list.filter((i) => i.id !== data.id && i.id !== newIntern.id)];
          saveStoredInterns(syncedList);
          return data;
        } else if (error) {
          console.warn('Supabase create returned error, retained local copy:', error);
        }
      } catch (err) {
        console.warn('Supabase create exception, retained local copy', err);
      }
    }

    return newIntern;
  },

  async updateIntern(id, internData) {
    const list = getStoredInterns();
    const updatedList = list.map((i) =>
      i.id === id ? { ...i, ...internData, updated_at: new Date().toISOString() } : i
    );
    saveStoredInterns(updatedList);

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('interns')
          .update(internData)
          .eq('id', id)
          .select()
          .single();
        if (!error && data) {
          const syncedList = updatedList.map((i) => (i.id === id ? { ...i, ...data } : i));
          saveStoredInterns(syncedList);
          return data;
        }
      } catch (err) {
        console.warn('Supabase update failed, retained local update', err);
      }
    }

    return updatedList.find((i) => i.id === id);
  },

  async deleteIntern(id) {
    const list = getStoredInterns();
    const filtered = list.filter((i) => i.id !== id);
    saveStoredInterns(filtered);

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('interns').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete failed', err);
      }
    }
    return true;
  }
};
