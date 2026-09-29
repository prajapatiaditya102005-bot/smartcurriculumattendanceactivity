import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { mockDB } from '../services/mockDb';
import { IQuery } from '../types';

export const getQueries = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    let queries = mockDB.queries;

    if (user.role === 'student') {
      queries = queries.filter(q => q.student_id === user._id);
    } else if (user.role === 'faculty') {
      queries = queries.filter(q => q.faculty_id === user._id);
    } else if (user.role === 'parent') {
      res.status(403).json({ success: false, message: 'Forbidden. Queries are not accessible for Parent role.' });
      return;
    }

    res.status(200).json({ success: true, count: queries.length, queries });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error retrieving queries', error: err.message });
  }
};

export const createQuery = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { faculty_id, subject, message } = req.body;
    const user = req.user!;

    if (!faculty_id || !message) {
      res.status(400).json({ success: false, message: 'faculty_id and message are required.' });
      return;
    }

    const faculty = mockDB.users.find(u => u._id === faculty_id);

    const newQuery: IQuery = {
      _id: `qry_${Date.now()}`,
      student_id: user._id,
      student_name: user.name,
      faculty_id,
      faculty_name: faculty ? faculty.name : 'Faculty Member',
      subject: subject || 'Academic Doubt',
      message,
      status: 'open',
      createdAt: new Date().toISOString()
    };

    mockDB.queries.unshift(newQuery);
    res.status(201).json({ success: true, message: 'Query submitted to faculty successfully.', query: newQuery });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error submitting query', error: err.message });
  }
};

export const replyToQuery = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reply } = req.body;

    if (!reply) {
      res.status(400).json({ success: false, message: 'Reply content is required.' });
      return;
    }

    const query = mockDB.queries.find(q => q._id === id);
    if (!query) {
      res.status(404).json({ success: false, message: 'Query not found.' });
      return;
    }

    query.reply = reply;
    query.reply_at = new Date().toISOString();
    query.status = 'answered';

    res.status(200).json({ success: true, message: 'Reply posted successfully.', query });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error replying to query', error: err.message });
  }
};
