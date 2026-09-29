import { Router } from 'express';
import * as authController from '../controllers/authController';
import * as userController from '../controllers/userController';
import * as attendanceController from '../controllers/attendanceController';
import * as scheduleController from '../controllers/scheduleController';
import * as assignmentController from '../controllers/assignmentController';
import * as announcementController from '../controllers/announcementController';
import * as queryController from '../controllers/queryController';
import * as reportController from '../controllers/reportController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleGuard';

const router = Router();

// --- Auth Routes ---
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/users/me', authenticateJWT, authController.getMe);

// --- User Management (Admin / Authorized) ---
router.get('/users', authenticateJWT, requireRole(['admin']), userController.getAllUsers);
router.get('/users/:id', authenticateJWT, userController.getUserById);
router.put('/users/:id', authenticateJWT, userController.updateUser);
router.delete('/users/:id', authenticateJWT, requireRole(['admin']), userController.deleteUser);

// --- Schedules & Curriculum ---
// View Schedules: Student, Faculty, Admin
router.get('/schedules', authenticateJWT, requireRole(['student', 'faculty', 'admin']), scheduleController.getSchedules);
router.get('/curriculum', authenticateJWT, scheduleController.getCurriculum);
router.post('/curriculum/module-status', authenticateJWT, requireRole(['faculty', 'admin']), scheduleController.updateModuleStatus);

// --- Attendance Routes ---
// Mark Attendance: Student (self), Faculty (class), Admin
router.post('/attendance/face', authenticateJWT, requireRole(['student', 'faculty', 'admin']), attendanceController.markFaceAttendance);
router.post('/attendance/manual', authenticateJWT, requireRole(['faculty', 'admin']), attendanceController.markManualAttendance);
// View Attendance: Student (own), Faculty, Parent (child), Admin
router.get('/attendance/:studentId', authenticateJWT, attendanceController.getStudentAttendance);
router.get('/attendance/class/:classId', authenticateJWT, requireRole(['faculty', 'admin']), attendanceController.getClassAttendance);

// --- Assignments & Assessments ---
// Give Assignments: Faculty, Admin
router.get('/assignments', authenticateJWT, assignmentController.getAssignments);
router.post('/assignments', authenticateJWT, requireRole(['faculty', 'admin']), assignmentController.createAssignment);
// Submit Assignments: Student, Admin
router.post('/assignments/:id/submit', authenticateJWT, requireRole(['student', 'admin']), assignmentController.submitAssignment);
router.get('/assignments/:id/submissions', authenticateJWT, requireRole(['faculty', 'admin']), assignmentController.getSubmissionsForAssignment);
router.post('/submissions/:id/grade', authenticateJWT, requireRole(['faculty', 'admin']), assignmentController.gradeSubmission);

// --- Announcements ---
// View Announcements: All
router.get('/announcements', authenticateJWT, announcementController.getAnnouncements);
// Post Announcements: Faculty, Admin
router.post('/announcements', authenticateJWT, requireRole(['faculty', 'admin']), announcementController.createAnnouncement);

// --- Queries & Doubts ---
// Share Problems/Queries: Student (ask), Faculty (receive/reply), Admin
router.get('/queries', authenticateJWT, requireRole(['student', 'faculty', 'admin']), queryController.getQueries);
router.post('/queries', authenticateJWT, requireRole(['student', 'admin']), queryController.createQuery);
router.post('/queries/:id/reply', authenticateJWT, requireRole(['faculty', 'admin']), queryController.replyToQuery);

// --- Reports (Admin Only per Access Matrix) ---
router.get('/reports/attendance', authenticateJWT, requireRole(['admin']), reportController.getAttendanceReport);
router.get('/reports/defaulters', authenticateJWT, requireRole(['admin']), reportController.getDefaultersReport);
router.get('/reports/naac-summary', authenticateJWT, requireRole(['admin']), reportController.getNAACSummary);

export default router;
