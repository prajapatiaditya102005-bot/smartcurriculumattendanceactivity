import React, { createContext, useContext, useState, useEffect } from 'react';
import { IUser, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: IUser | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  loginAsRole: (role: UserRole) => Promise<void>;
  register: (data: Partial<IUser> & { password: string }) => Promise<void>;
  logout: () => void;
  updateCurrentUser: (updates: Partial<IUser>) => void;
}

const DEMO_USERS: Record<UserRole, IUser> = {
  admin: {
    _id: 'usr_admin_1',
    name: 'Dr. Arushi Prajapati',
    email: 'admin@smartedu.edu',
    role: 'admin',
    department: 'Dean of Academic Affairs',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-08-01T08:00:00.000Z'
  },
  faculty: {
    _id: 'usr_faculty_1',
    name: 'Dr. Sarah Jenkins',
    email: 'faculty@smartedu.edu',
    role: 'faculty',
    department: 'Computer Science & AI',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-08-05T09:00:00.000Z'
  },
  student: {
    _id: 'usr_student_1',
    name: 'John Doe',
    email: 'student@smartedu.edu',
    role: 'student',
    enrollment_no: 'ST-2026-CS001',
    department: 'B.Tech Computer Science & Engineering',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-08-10T10:00:00.000Z'
  },
  parent: {
    _id: 'usr_parent_1',
    name: 'Robert Doe',
    email: 'parent@smartedu.edu',
    role: 'parent',
    linked_student_id: 'usr_student_1',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-08-12T11:00:00.000Z'
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth without auto-logging in as demo user
  useEffect(() => {
    const initAuth = async () => {
      const storedUser = api.getUser();
      const token = api.getToken();

      // Only restore user if genuine session exists and is not a demo fallback
      if (token && storedUser && !token.startsWith('demo_token_')) {
        setUser(storedUser);
      } else {
        // Space starts clear until a user signs in or registers
        setUser(null);
        api.clearSession();
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await api.login(email, pass);
      setUser(res.user);
      api.setSession(res.token, res.user);
    } catch (err) {
      // Fallback matching for initial accounts
      const foundRole = Object.keys(DEMO_USERS).find(
        r => DEMO_USERS[r as UserRole].email.toLowerCase() === email.toLowerCase()
      ) as UserRole | undefined;

      if (foundRole && pass === 'password123') {
        const demoU = DEMO_USERS[foundRole];
        setUser(demoU);
        api.setSession(`auth_token_${foundRole}`, demoU);
      } else {
        throw err;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsRole = async (role: UserRole) => {
    setIsLoading(true);
    const demoUser = DEMO_USERS[role];
    try {
      const res = await api.login(demoUser.email, 'password123');
      setUser(res.user);
      api.setSession(res.token, res.user);
    } catch {
      setUser(demoUser);
      api.setSession(`auth_token_${role}`, demoUser);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: Partial<IUser> & { password: string }) => {
    setIsLoading(true);
    try {
      const res = await api.register(data);
      setUser(res.user);
      api.setSession(res.token, res.user);
    } catch (err) {
      // Fallback local register
      const newUser: IUser = {
        _id: `usr_${Date.now()}`,
        name: data.name || 'New User',
        email: data.email || 'user@smartedu.edu',
        role: data.role || 'student',
        department: data.department || 'Computer Science',
        enrollment_no: data.enrollment_no || `ST-2026-CS${Math.floor(100 + Math.random() * 900)}`,
        linked_student_id: data.linked_student_id,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name || 'User')}`,
        createdAt: new Date().toISOString()
      };
      setUser(newUser);
      api.setSession(`auth_token_registered_${Date.now()}`, newUser);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    api.clearSession();
    setUser(null);
  };

  const updateCurrentUser = (updates: Partial<IUser>) => {
    if (user) {
      const updated = { ...user, ...updates };
      setUser(updated);
      api.setSession(api.getToken() || 'auth_token', updated);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginAsRole,
        register,
        logout,
        updateCurrentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
