import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { mockDB } from '../services/mockDb';
import { IAssignment, ISubmission } from '../types';

export const getAssignments = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    let assignments = mockDB.assignments;
    const classId = req.query.classId as string;

    if (classId) {
      assignments = assignments.filter(a => a.class_id === classId);
    }

    let responseData = assignments.map(a => {
      const submission = mockDB.submissions.find(s => s.assignment_id === a._id && s.student_id === user._id);
      return {
        ...a,
        my_submission: submission || null
      };
    });

    res.status(200).json({ success: true, count: responseData.length, assignments: responseData });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error retrieving assignments', error: err.message });
  }
};

export const createAssignment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { class_id, title, description, deadline, file_url, total_marks } = req.body;

    if (!class_id || !title || !description || !deadline) {
      res.status(400).json({ success: false, message: 'class_id, title, description, and deadline are required.' });
      return;
    }

    const currentClass = mockDB.classes.find(c => c._id === class_id);
    const newAssignment: IAssignment = {
      _id: `asg_${Date.now()}`,
      class_id,
      class_name: currentClass ? currentClass.subject : 'General Course',
      title,
      description,
      deadline,
      file_url,
      created_by: req.user!._id,
      created_by_name: req.user!.name,
      total_marks: total_marks ? Number(total_marks) : 100,
      createdAt: new Date().toISOString()
    };

    mockDB.assignments.unshift(newAssignment);
    res.status(201).json({ success: true, message: 'Assignment created successfully.', assignment: newAssignment });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error creating assignment', error: err.message });
  }
};

export const submitAssignment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { file_url } = req.body;
    const user = req.user!;

    if (!file_url) {
      res.status(400).json({ success: false, message: 'file_url or submission link is required.' });
      return;
    }

    const assignment = mockDB.assignments.find(a => a._id === id);
    if (!assignment) {
      res.status(404).json({ success: false, message: 'Assignment not found.' });
      return;
    }

    const existingIndex = mockDB.submissions.findIndex(s => s.assignment_id === id && s.student_id === user._id);
    const isLate = new Date() > new Date(assignment.deadline);

    if (existingIndex !== -1) {
      mockDB.submissions[existingIndex].file_url = file_url;
      mockDB.submissions[existingIndex].submitted_at = new Date().toISOString();
      mockDB.submissions[existingIndex].status = isLate ? 'late' : 'submitted';

      res.status(200).json({
        success: true,
        message: 'Assignment resubmitted successfully.',
        submission: mockDB.submissions[existingIndex]
      });
      return;
    }

    const newSubmission: ISubmission = {
      _id: `sub_${Date.now()}`,
      assignment_id: id,
      assignment_title: assignment.title,
      student_id: user._id,
      student_name: user.name,
      file_url,
      submitted_at: new Date().toISOString(),
      status: isLate ? 'late' : 'submitted'
    };

    mockDB.submissions.unshift(newSubmission);
    res.status(201).json({ success: true, message: 'Assignment submitted successfully.', submission: newSubmission });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error submitting assignment', error: err.message });
  }
};

export const gradeSubmission = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { grade, feedback } = req.body;

    const submission = mockDB.submissions.find(s => s._id === id);
    if (!submission) {
      res.status(404).json({ success: false, message: 'Submission not found.' });
      return;
    }

    submission.grade = grade;
    submission.feedback = feedback;
    submission.status = 'graded';

    res.status(200).json({ success: true, message: 'Submission graded successfully.', submission });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error grading submission', error: err.message });
  }
};

export const getSubmissionsForAssignment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const submissions = mockDB.submissions.filter(s => s.assignment_id === id);
    res.status(200).json({ success: true, count: submissions.length, submissions });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error fetching submissions', error: err.message });
  }
};
