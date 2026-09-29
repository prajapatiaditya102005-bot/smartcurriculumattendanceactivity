import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { mockDB } from '../services/mockDb';
import { pythonService } from '../services/pythonClient';
import { IAttendance, AttendanceStatus } from '../types';

export const markFaceAttendance = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { class_id, image, student_id } = req.body;

    if (!class_id || !image) {
      res.status(400).json({ success: false, message: 'class_id and image capture base64 are required.' });
      return;
    }

    const currentClass = mockDB.classes.find(c => c._id === class_id);
    if (!currentClass) {
      res.status(404).json({ success: false, message: 'Class not found.' });
      return;
    }

    let targetStudentIds = currentClass.students;
    if (req.user?.role === 'student') {
      targetStudentIds = [req.user._id];
    } else if (student_id) {
      targetStudentIds = [student_id];
    }

    const aiResult = await pythonService.recognizeFace(image, targetStudentIds);
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toTimeString().split(' ')[0];

    const markedRecords: IAttendance[] = [];

    for (const match of aiResult.matches) {
      const student = mockDB.users.find(u => u._id === match.student_id);
      if (!student) continue;

      const existingAttendance = mockDB.attendance.find(
        a => a.class_id === class_id && a.student_id === student._id && a.date === today
      );

      if (existingAttendance) {
        markedRecords.push(existingAttendance);
        continue;
      }

      const newRecord: IAttendance = {
        _id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        class_id,
        class_name: currentClass.subject,
        student_id: student._id,
        student_name: student.name,
        student_enrollment: student.enrollment_no,
        date: today,
        time: nowTime,
        status: match.confidence >= 0.70 ? 'present' : 'flagged_for_review' as any,
        method: 'face_recognition',
        confidence: match.confidence,
        flagged_for_review: match.confidence < 0.70
      };

      mockDB.attendance.unshift(newRecord);
      markedRecords.push(newRecord);
    }

    res.status(200).json({
      success: true,
      message: markedRecords.length > 0 ? 'Face attendance processed successfully.' : 'No matching registered faces found.',
      records: markedRecords,
      low_light_enhanced: aiResult.low_light_enhanced ?? true
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error marking face attendance', error: err.message });
  }
};

export const markManualAttendance = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { class_id, student_id, status, date } = req.body;

    if (!class_id || !student_id || !status) {
      res.status(400).json({ success: false, message: 'class_id, student_id, and status are required.' });
      return;
    }

    const currentClass = mockDB.classes.find(c => c._id === class_id);
    const student = mockDB.users.find(u => u._id === student_id);

    if (!currentClass || !student) {
      res.status(404).json({ success: false, message: 'Class or Student not found.' });
      return;
    }

    const recordDate = date || new Date().toISOString().split('T')[0];
    const nowTime = new Date().toTimeString().split(' ')[0];

    const existingIndex = mockDB.attendance.findIndex(
      a => a.class_id === class_id && a.student_id === student_id && a.date === recordDate
    );

    let record: IAttendance;

    if (existingIndex !== -1) {
      mockDB.attendance[existingIndex].status = status as AttendanceStatus;
      mockDB.attendance[existingIndex].method = 'manual';
      mockDB.attendance[existingIndex].flagged_for_review = false;
      record = mockDB.attendance[existingIndex];
    } else {
      record = {
        _id: `att_${Date.now()}`,
        class_id,
        class_name: currentClass.subject,
        student_id: student._id,
        student_name: student.name,
        student_enrollment: student.enrollment_no,
        date: recordDate,
        time: nowTime,
        status: status as AttendanceStatus,
        method: 'manual',
        confidence: 1.0,
        flagged_for_review: false
      };
      mockDB.attendance.unshift(record);
    }

    res.status(200).json({
      success: true,
      message: `Manual attendance recorded as ${status}.`,
      record
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error recording manual attendance', error: err.message });
  }
};

export const getStudentAttendance = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { studentId } = req.params;

    if (req.user?.role === 'student' && req.user._id !== studentId) {
      res.status(403).json({ success: false, message: 'Forbidden. Students can only view their own attendance.' });
      return;
    }

    if (req.user?.role === 'parent' && req.user.linked_student_id !== studentId) {
      res.status(403).json({ success: false, message: 'Forbidden. Parents can only view their linked child attendance.' });
      return;
    }

    const records = mockDB.attendance.filter(a => a.student_id === studentId);
    const total = records.length;
    const present = records.filter(a => a.status === 'present').length;
    const late = records.filter(a => a.status === 'late').length;
    const absent = records.filter(a => a.status === 'absent').length;
    const percentage = total > 0 ? Number(((present + late * 0.5) / total * 100).toFixed(1)) : 100;

    res.status(200).json({
      success: true,
      student_id: studentId,
      summary: {
        total,
        present,
        late,
        absent,
        percentage,
        isDefaulter: percentage < 75.0
      },
      records
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error fetching attendance', error: err.message });
  }
};

export const getClassAttendance = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { classId } = req.params;
    const date = req.query.date as string;

    let records = mockDB.attendance.filter(a => a.class_id === classId);
    if (date) {
      records = records.filter(a => a.date === date);
    }

    res.status(200).json({ success: true, count: records.length, records });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error fetching class attendance', error: err.message });
  }
};
