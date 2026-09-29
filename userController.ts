import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { mockDB } from '../services/mockDb';
import { IUser } from '../types';

export const getAllUsers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const roleFilter = req.query.role as string;
    let users = mockDB.users;

    if (roleFilter) {
      users = users.filter(u => u.role === roleFilter);
    }

    const sanitizedUsers = users.map(({ password, ...rest }) => rest);
    res.status(200).json({ success: true, count: sanitizedUsers.length, users: sanitizedUsers });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve users', error: err.message });
  }
};

export const getUserById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = mockDB.users.find(u => u._id === id);

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    const { password, ...userWithoutPassword } = user;
    res.status(200).json({ success: true, user: userWithoutPassword });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error retrieving user', error: err.message });
  }
};

export const updateUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, department, enrollment_no, linked_student_id, role } = req.body;

    const userIndex = mockDB.users.findIndex(u => u._id === id);
    if (userIndex === -1) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    // Only admin can change role or modify any user, or self updating profile
    if (req.user?.role !== 'admin' && req.user?._id !== id) {
      res.status(403).json({ success: false, message: 'Forbidden. You cannot modify other users.' });
      return;
    }

    const user = mockDB.users[userIndex];
    if (name) user.name = name;
    if (department) user.department = department;
    if (enrollment_no) user.enrollment_no = enrollment_no;
    if (linked_student_id) user.linked_student_id = linked_student_id;
    if (role && req.user?.role === 'admin') user.role = role;

    const { password, ...updatedUser } = user;
    res.status(200).json({ success: true, message: 'User updated successfully', user: updatedUser });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error updating user', error: err.message });
  }
};

export const deleteUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const index = mockDB.users.findIndex(u => u._id === id);

    if (index === -1) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    mockDB.users.splice(index, 1);
    res.status(200).json({ success: true, message: 'User deleted successfully.' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error deleting user', error: err.message });
  }
};
