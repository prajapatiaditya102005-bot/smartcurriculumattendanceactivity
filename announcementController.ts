import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { mockDB } from '../services/mockDb';
import { IAnnouncement } from '../types';

export const getAnnouncements = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userRole = req.user?.role;
    let announcements = mockDB.announcements;

    if (userRole && userRole !== 'admin') {
      announcements = announcements.filter(a => a.role_target === 'all' || a.role_target === userRole);
    }

    res.status(200).json({ success: true, count: announcements.length, announcements });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error retrieving announcements', error: err.message });
  }
};

export const createAnnouncement = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { title, body, role_target = 'all', priority = 'normal' } = req.body;

    if (!title || !body) {
      res.status(400).json({ success: false, message: 'Title and body are required.' });
      return;
    }

    const newAnnouncement: IAnnouncement = {
      _id: `anc_${Date.now()}`,
      title,
      body,
      posted_by: req.user!._id,
      posted_by_name: `${req.user!.name} (${req.user!.role.toUpperCase()})`,
      role_target,
      priority,
      createdAt: new Date().toISOString()
    };

    mockDB.announcements.unshift(newAnnouncement);
    res.status(201).json({ success: true, message: 'Announcement posted successfully.', announcement: newAnnouncement });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error creating announcement', error: err.message });
  }
};
