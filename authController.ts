import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { mockDB } from '../services/mockDb';
import { ENV } from '../config/env';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { IUser, UserRole } from '../types';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role = 'student', linked_student_id, department, enrollment_no } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
      return;
    }

    const existingUser = mockDB.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      res.status(409).json({ success: false, message: 'An account with this email already exists.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: IUser = {
      _id: `usr_${Date.now()}`,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role as UserRole,
      department: department || 'Computer Science & Engineering',
      enrollment_no: enrollment_no || `ST-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      linked_student_id: role === 'parent' ? linked_student_id : undefined,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      createdAt: new Date().toISOString()
    };

    mockDB.users.push(newUser);

    const token = jwt.sign({ id: newUser._id, role: newUser.role, email: newUser.email }, ENV.JWT_SECRET, {
      expiresIn: '7d'
    });

    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      token,
      user: userWithoutPassword
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Internal server error during registration.', error: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required.' });
      return;
    }

    const user = mockDB.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password || '');
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid credentials. Incorrect password.' });
      return;
    }

    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, ENV.JWT_SECRET, {
      expiresIn: '7d'
    });

    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: userWithoutPassword
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Internal server error during login.', error: error.message });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authenticated.' });
    return;
  }

  const { password: _, ...userWithoutPassword } = req.user;
  res.status(200).json({ success: true, user: userWithoutPassword });
};
