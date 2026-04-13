import { create } from 'zustand';
import api from './api';

interface User {
  _id: string;
  email: string;
  name: string;
  company: string;
  plan: {
    type: string;
    creditsIncluded: number;
    creditsUsed: number;
    overageCredits: number;
    billingCycleEnd: string;
  };
  settings: {
    interviewerFeedback: boolean;
  };
}

interface CreditInfo {
  plan: string;
  creditsIncluded: number;
  creditsUsed: number;
  creditsRemaining: number;
  overageCredits: number;
  billingCycleEnd: string;
}

interface AppStore {
  // Auth
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User, token: string) => void;
  logout: () => void;
  loadUser: () => Promise<void>;

  // Credits
  credits: CreditInfo | null;
  loadCredits: () => Promise<void>;

  // Active jobs tracking
  activeJobs: Map<string, any>;
  addActiveJob: (jobId: string, data: any) => void;
  updateJob: (jobId: string, data: any) => void;
  removeJob: (jobId: string) => void;
}

export const useStore = create<AppStore>((set, get) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('talentscore_token') : null,
  isAuthenticated: false,
  isLoading: true,
  credits: null,
  activeJobs: new Map(),

  setUser: (user, token) => {
    localStorage.setItem('talentscore_token', token);
    set({ user, token, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    localStorage.removeItem('talentscore_token');
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },

  loadUser: async () => {
    try {
      const token = localStorage.getItem('talentscore_token');
      if (!token) {
        set({ isLoading: false });
        return;
      }
      const { user } = await api.getProfile();
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch {
      localStorage.removeItem('talentscore_token');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },

  loadCredits: async () => {
    try {
      const credits = await api.getUsage();
      set({ credits });
    } catch {
      // silent fail
    }
  },

  addActiveJob: (jobId, data) => {
    const jobs = new Map(get().activeJobs);
    jobs.set(jobId, data);
    set({ activeJobs: jobs });
  },

  updateJob: (jobId, data) => {
    const jobs = new Map(get().activeJobs);
    const existing = jobs.get(jobId) || {};
    jobs.set(jobId, { ...existing, ...data });
    set({ activeJobs: jobs });
  },

  removeJob: (jobId) => {
    const jobs = new Map(get().activeJobs);
    jobs.delete(jobId);
    set({ activeJobs: jobs });
  },
}));
