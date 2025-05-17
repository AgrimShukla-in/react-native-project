import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = 'https://arriving-nice-ant.ngrok-free.app/api/v1';

export const useAuthStore = create((set) => ({
  uri:API_BASE,
  user: null,
  token: null,
  loading: false,

  register: async (username, email, password) => {
    set({ loading: true });
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      await AsyncStorage.setItem('otpEmail', email);
      return { success: true, data: data.message };
    } catch (error) {
      return { success: false, data: error.message };
    } finally {
      set({ loading: false });
    }
  },

  sendOtp: async () => {
    set({ loading: true });
    try {
      const email = await AsyncStorage.getItem('otpEmail');
      if (!email) throw new Error('Email not found.');

      const response = await fetch(`${API_BASE}/auth/resend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      return { success: true, data: data.message };
    } catch (err) {
      return { success: false, data: err.message };
    } finally {
      set({ loading: false });
    }
  },

  verifyOtp: async (code) => {
    set({ loading: true });
    try {
      const email = await AsyncStorage.getItem('otpEmail');
      if (!email) throw new Error('Email not found.');

      const response = await fetch(`${API_BASE}/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();
      if (!response.ok) return { success: false, data: data.message };

      await AsyncStorage.multiSet([
        ['accessToken', data.accessToken],
        ['refreshToken', data.refreshToken],
        ['user', JSON.stringify(data.user)],
      ]);

      set({ user: data.user, token: data.accessToken });
      return { success: true, data: data.user };
    } catch (err) {
      return { success: false, data: err.message };
    } finally {
      set({ loading: false });
    }
  },

  checkAuth: async () => {
    set({ loading: true });
    try {
      const result = await AsyncStorage.multiGet(['accessToken', 'refreshToken', 'user']);
      const accessToken = result[0][1];
      const refreshToken = result[1][1];
      const storageUser = result[2][1];

      if (accessToken && storageUser) {
        set({ user: JSON.parse(storageUser), token: accessToken });
        return { success: true };
      }

      if (refreshToken) {
        const response = await fetch(`${API_BASE}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message);

        await AsyncStorage.setItem('accessToken', data.accessToken);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));

        set({ user: data.user, token: data.accessToken });
        return { success: true };
      }

      return { success: false };
    } catch (err) {
      console.error('Auth check failed:', err);
      return { success: false };
    } finally {
      set({ loading: false });
    }
  },
  

  login: async (email, password) => {
    set({ loading: true });
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      await AsyncStorage.multiSet([
        ['accessToken', data.accessToken],
        ['refreshToken', data.refreshToken],
        ['user', JSON.stringify(data.user)],
      ]);

      set({ user: data.user, token: data.accessToken ,loading: false});
      return { success: true, data: data.user };
    } catch (err) {
      return { success: false, data: err.message };
    } finally {
      set({ loading: false });
    }
  },


}));
