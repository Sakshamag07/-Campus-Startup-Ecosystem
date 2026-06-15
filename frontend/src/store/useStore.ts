import { create } from 'zustand';
import api from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  isPremium: boolean;
}

interface ChatRoom {
  id: string;
  name?: string;
  type: string;
  members: any[];
  messages: any[];
  project?: any;
}

interface StoreState {
  user: User | null;
  isAuthenticated: boolean;
  activeTab: string;
  rooms: ChatRoom[];
  activeRoomId: string | null;
  messages: any[];
  notifications: any[];
  
  // Actions
  setUser: (user: User | null) => void;
  setActiveTab: (tab: string) => void;
  login: (credentials: { email: string; password: string }) => Promise<any>;
  register: (data: any) => Promise<any>;
  logout: () => Promise<void>;
  
  // Chat Actions
  fetchRooms: () => Promise<void>;
  fetchMessages: (roomId: string) => Promise<void>;
  addMessage: (message: any) => void;
  setActiveRoomId: (roomId: string | null) => void;
  
  // Notification Actions
  addNotification: (notification: any) => void;
  setNotifications: (notifications: any[]) => void;
}

export const useStore = create<StoreState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  activeTab: 'dashboard',
  rooms: [],
  activeRoomId: null,
  messages: [],
  notifications: [],

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  
  setActiveTab: (tab) => set({ activeTab: tab }),

  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    const { accessToken, refreshToken, user } = res.data;
    
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    
    set({ user, isAuthenticated: true, activeTab: 'dashboard' });
    return user;
  },

  register: async (data) => {
    const res = await api.post('/auth/register', data);
    const { accessToken, refreshToken, user } = res.data;
    
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    
    set({ user, isAuthenticated: true, activeTab: 'dashboard' });
    return user;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout request failed:', err);
    } finally {
      localStorage.clear();
      set({ user: null, isAuthenticated: false, rooms: [], activeRoomId: null, messages: [], activeTab: 'dashboard' });
    }
  },

  fetchRooms: async () => {
    try {
      const res = await api.get('/chat/rooms');
      set({ rooms: res.data });
    } catch (err) {
      console.error('Failed to fetch chat channels:', err);
    }
  },

  fetchMessages: async (roomId) => {
    try {
      const res = await api.get(`/chat/rooms/${roomId}/messages`);
      set({ messages: res.data, activeRoomId: roomId });
    } catch (err) {
      console.error('Failed to load chat history:', err);
    }
  },

  addMessage: (message) => {
    const currentMessages = get().messages;
    const currentRoomId = get().activeRoomId;
    
    if (message.roomId === currentRoomId) {
      set({ messages: [...currentMessages, message] });
    }
    
    // Refresh rooms list to display latest messages
    get().fetchRooms();
  },

  setActiveRoomId: (roomId) => set({ activeRoomId: roomId }),

  addNotification: (notification) => {
    const current = get().notifications;
    set({ notifications: [notification, ...current] });
  },

  setNotifications: (notifications) => set({ notifications }),
}));
