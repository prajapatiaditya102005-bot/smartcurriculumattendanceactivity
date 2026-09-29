import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { mockDB } from '../services/mockDb';

export const getSchedules = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    let classes = mockDB.classes;

    if (user.role === 'student') {
      classes = classes.filter(c => c.students.includes(user._id));
    } else if (user.role === 'faculty') {
      classes = classes.filter(c => c.faculty_id === user._id);
    } else if (user.role === 'parent') {
      // Parent role does not have direct access to schedules in matrix
      res.status(403).json({ success: false, message: 'Forbidden. Schedules are not accessible for Parent role.' });
      return;
    }

    res.status(200).json({ success: true, count: classes.length, classes });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error retrieving schedules', error: err.message });
  }
};

export const getCurriculum = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const classId = req.query.classId as string;
    let curricula = mockDB.curriculum;

    if (classId) {
      curricula = curricula.filter(c => c.class_id === classId);
    }

    res.status(200).json({ success: true, curricula });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error retrieving curriculum', error: err.message });
  }
};

export const updateModuleStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { curriculum_id, module_number, completed } = req.body;
    const curriculum = mockDB.curriculum.find(c => c._id === curriculum_id);

    if (!curriculum) {
      res.status(404).json({ success: false, message: 'Curriculum not found.' });
      return;
    }

    const mod = curriculum.syllabus.find(m => m.module_number === module_number);
    if (!mod) {
      res.status(404).json({ success: false, message: 'Module number not found.' });
      return;
    }

    mod.completed = completed;
    res.status(200).json({ success: true, message: 'Module status updated.', curriculum });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error updating module', error: err.message });
  }
};
