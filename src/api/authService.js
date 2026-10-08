/**
 * Authentication Service (Local Mock API Layer)
 * Manages user authentication, session persistence, registration, and active passes.
 */

import { apiClient } from './apiClient';
import { mockUsers, defaultGuestUser } from '../data/mock/users.mock';

const { storage } = apiClient;

// Seed initial users into local storage if not present
const initializeUsers = () => {
  const existing = storage.get(storage.KEYS.USERS);
  if (!existing || !Array.isArray(existing) || existing.length === 0) {
    storage.set(storage.KEYS.USERS, mockUsers);
  }
};

initializeUsers();

/**
 * Helper to check whether the active session is genuinely authenticated
 */
export const isUserAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  try {
    if (localStorage.getItem('american_dream_is_guest') === 'true') return false;
    if (localStorage.getItem('american_dream_user_logged_in') === 'true') return true;
    const active = localStorage.getItem('american_dream_active_user');
    if (active) {
      const parsed = JSON.parse(active);
      if (parsed && (parsed.id || parsed.phone) && parsed.id !== 'guest') return true;
    }
  } catch (e) {}
  return false;
};

export const authService = {
  /**
   * Fetch currently logged-in user session
   */
  async getCurrentUser() {
    await apiClient.get('/api/auth/me');

    const isGuest = typeof window !== 'undefined' && localStorage.getItem('american_dream_is_guest') === 'true';
    const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('american_dream_user_logged_in') === 'true';

    // If client is a guest or not explicitly logged in, return default guest
    if (isGuest || !isLoggedIn) {
      return defaultGuestUser;
    }

    const storedUser = storage.get(storage.KEYS.ACTIVE_USER);
    if (storedUser && storedUser.id !== 'guest') {
      return storedUser;
    }

    if (typeof window !== 'undefined') {
      const profile = localStorage.getItem('american_dream_user_profile');
      if (profile) {
        try {
          const parsed = JSON.parse(profile);
          if (parsed && (parsed.id || parsed.phone)) {
            storage.set(storage.KEYS.ACTIVE_USER, parsed);
            return parsed;
          }
        } catch {}
      }
    }

    // Default VIP user if logged in
    const defaultUser = mockUsers[0];
    storage.set(storage.KEYS.ACTIVE_USER, defaultUser);
    storage.set(storage.KEYS.TOKEN, 'mock-jwt-token-default-vip');
    return defaultUser;
  },

  /**
   * Log in user with email/phone and password
   */
  async login({ identifier, password }) {
    await apiClient.post('/api/auth/login', { identifier });

    const users = storage.get(storage.KEYS.USERS, mockUsers);
    const trimmedId = (identifier || '').trim().toLowerCase();

    // Match by email, phone, or name
    let matched = users.find(u => 
      u.email?.toLowerCase() === trimmedId || 
      u.phone === trimmedId ||
      u.name?.toLowerCase() === trimmedId
    );

    // If not found in seed, create an account on the fly for convenience in testing
    if (!matched) {
      matched = {
        id: 'user-' + Date.now().toString().slice(-4),
        name: identifier.includes('@') ? identifier.split('@')[0] : `Guest ${identifier}`,
        phone: identifier.includes('@') ? '01012345678' : identifier,
        email: identifier.includes('@') ? identifier : `${identifier}@americandream.com`,
        membership: 'Explorer Member',
        points: 50,
        zoneVisits: 1,
        avatar: '/photo/kid-area-pic/icon/user-icon.png',
        activePasses: []
      };
      users.push(matched);
      storage.set(storage.KEYS.USERS, users);
    }

    const token = 'mock-jwt-token-' + Date.now();
    storage.set(storage.KEYS.ACTIVE_USER, matched);
    storage.set(storage.KEYS.TOKEN, token);

    if (typeof window !== 'undefined') {
      localStorage.setItem('american_dream_user_logged_in', 'true');
      localStorage.removeItem('american_dream_is_guest');
      localStorage.setItem('american_dream_active_user', JSON.stringify(matched));
      localStorage.setItem('american_dream_user_profile', JSON.stringify(matched));
    }

    return {
      success: true,
      token,
      user: matched
    };
  },

  /**
   * Register a new user
   */
  async register({ name, phone, email, password }) {
    await apiClient.post('/api/auth/register', { name, phone, email });

    const users = storage.get(storage.KEYS.USERS, mockUsers);
    
    // Check if phone or email exists
    const existing = users.find(u => 
      (phone && u.phone === phone) || 
      (email && u.email?.toLowerCase() === email.toLowerCase())
    );

    if (existing) {
      // Log them in if already registered
      storage.set(storage.KEYS.ACTIVE_USER, existing);
      storage.set(storage.KEYS.TOKEN, 'mock-jwt-token-' + existing.id);
      if (typeof window !== 'undefined') {
        localStorage.setItem('american_dream_user_logged_in', 'true');
        localStorage.removeItem('american_dream_is_guest');
        localStorage.setItem('american_dream_active_user', JSON.stringify(existing));
        localStorage.setItem('american_dream_user_profile', JSON.stringify(existing));
      }
      return { success: true, user: existing, isExisting: true };
    }

    const newUser = {
      id: 'user-' + Date.now().toString().slice(-4),
      name: name || 'New Explorer',
      phone: phone || '',
      email: email || '',
      membership: 'Club Member',
      points: 100, // Welcome bonus points!
      zoneVisits: 1,
      avatar: '/photo/kid-area-pic/icon/user-icon.png',
      activePasses: []
    };

    users.push(newUser);
    storage.set(storage.KEYS.USERS, users);
    storage.set(storage.KEYS.ACTIVE_USER, newUser);
    storage.set(storage.KEYS.TOKEN, 'mock-jwt-token-' + newUser.id);

    if (typeof window !== 'undefined') {
      localStorage.setItem('american_dream_user_logged_in', 'true');
      localStorage.removeItem('american_dream_is_guest');
      localStorage.setItem('american_dream_active_user', JSON.stringify(newUser));
      localStorage.setItem('american_dream_user_profile', JSON.stringify(newUser));
    }

    return {
      success: true,
      user: newUser,
      token: 'mock-jwt-token-' + newUser.id
    };
  },

  /**
   * Log out active user
   */
  async logout() {
    await apiClient.post('/api/auth/logout');
    storage.remove(storage.KEYS.ACTIVE_USER);
    storage.remove(storage.KEYS.TOKEN);
    if (typeof window !== 'undefined') {
      localStorage.setItem('american_dream_user_logged_in', 'false');
      localStorage.setItem('american_dream_is_guest', 'true');
      localStorage.removeItem('american_dream_active_user');
      localStorage.removeItem('american_dream_user_profile');
    }
    return { success: true };
  },

  /**
   * Update user profile data
   */
  async updateProfile(updates) {
    await apiClient.put('/api/auth/profile', updates);

    const currentUser = storage.get(storage.KEYS.ACTIVE_USER) || defaultGuestUser;
    const updatedUser = { ...currentUser, ...updates };

    storage.set(storage.KEYS.ACTIVE_USER, updatedUser);

    // Also update in users list
    const users = storage.get(storage.KEYS.USERS, mockUsers);
    const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    storage.set(storage.KEYS.USERS, updatedUsers);

    return {
      success: true,
      user: updatedUser
    };
  },

  /**
   * Add a newly booked ticket pass directly to user's wallet
   */
  async addPassToWallet(passDetails) {
    const user = storage.get(storage.KEYS.ACTIVE_USER) || defaultGuestUser;
    const newPass = {
      code: passDetails.code || ('PZ-' + Math.floor(100000 + Math.random() * 900000)),
      zone: passDetails.zone || 'Play Zone Pass',
      name: passDetails.name || 'General Admission',
      quantity: passDetails.quantity || 1,
      date: passDetails.date || 'Today',
      price: passDetails.price || '100 EGP',
      status: 'Active',
      createdAt: new Date().toISOString()
    };

    const passes = Array.isArray(user.activePasses) ? [newPass, ...user.activePasses] : [newPass];
    const earnedPoints = (passDetails.priceNum ? Math.floor(passDetails.priceNum * 0.1) : 10) * (passDetails.quantity || 1);
    const updatedPoints = (user.points || 0) + earnedPoints;

    return this.updateProfile({
      activePasses: passes,
      points: updatedPoints
    });
  }
};
