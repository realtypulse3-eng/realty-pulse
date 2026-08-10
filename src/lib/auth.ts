import { User, UserRole } from '../types';

const CURRENT_USER_KEY = 'realtypulse_current_user';
const USERS_LIST_KEY = 'realtypulse_registered_users';

export const DEFAULT_USERS: User[] = [
  {
    id: 'usr_alex',
    organization_id: 'org_default',
    name: 'Alex Vance',
    email: 'alex.vance@realtypulse.io',
    role: 'broker',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    created_at: new Date().toISOString(),
  },
  {
    id: 'usr_elena',
    organization_id: 'org_default',
    name: 'Elena Rostova',
    email: 'elena.rostova@realtypulse.io',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    created_at: new Date().toISOString(),
  },
  {
    id: 'usr_david',
    organization_id: 'org_default',
    name: 'David Chen',
    email: 'david.chen@realtypulse.io',
    role: 'agent',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    created_at: new Date().toISOString(),
  },
];

export const getRegisteredUsers = (): User[] => {
  try {
    const raw = localStorage.getItem(USERS_LIST_KEY);
    if (!raw) {
      localStorage.setItem(USERS_LIST_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_USERS;
  }
};

export const getCurrentUser = (): User | null => {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
};

export const setCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
  window.dispatchEvent(new Event('realtypulse_auth_change'));
};

export const registerUser = (userData: {
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  organizationName?: string;
}): User => {
  const users = getRegisteredUsers();
  
  // Check existing
  const existing = users.find((u) => u.email.toLowerCase() === userData.email.toLowerCase());
  if (existing) {
    throw new Error('An account with this email address already exists.');
  }

  const newUser: User = {
    id: 'usr_' + Math.random().toString(36).substring(2, 9),
    organization_id: 'org_default',
    name: userData.name,
    email: userData.email,
    role: userData.role,
    avatar:
      userData.avatar ||
      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userData.name)}&backgroundColor=8b5cf6,6366f1`,
    created_at: new Date().toISOString(),
  };

  const updatedUsers = [newUser, ...users];
  localStorage.setItem(USERS_LIST_KEY, JSON.stringify(updatedUsers));
  setCurrentUser(newUser);

  return newUser;
};

export const loginUser = (email: string): User => {
  const users = getRegisteredUsers();
  const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!found) {
    // Auto-create for seamless login if valid email structure
    const fallbackName = email.split('@')[0].replace('.', ' ');
    const formattedName = fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1);
    
    return registerUser({
      name: formattedName || 'Broker Agent',
      email: email,
      role: 'agent',
    });
  }

  setCurrentUser(found);
  return found;
};

export const logoutUser = (): void => {
  setCurrentUser(null);
};

export const updateCurrentUser = (updates: Partial<User>): User | null => {
  const current = getCurrentUser();
  if (!current) return null;

  const updated: User = {
    ...current,
    ...updates,
  };

  const users = getRegisteredUsers();
  const updatedUsers = users.map((u) => (u.id === current.id ? updated : u));
  localStorage.setItem(USERS_LIST_KEY, JSON.stringify(updatedUsers));

  setCurrentUser(updated);
  return updated;
};
