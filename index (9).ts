export type UserRole = 'student' | 'faculty' | 'parent' | 'admin';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  supabase_uid?: string;
  linked_student_id?: string; // For parents linking to their student
  face_embedding?: number[];   // 128-d or 512-d facial embedding vector
  avatar?: string;
  department?: string;
  enrollment_no?: string;
  createdAt: string;
}

export interface IScheduleSlot {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startTime: string; // e.g. '09:00 AM'
  endTime: string;   // e.g. '10:00 AM'
}

export interface IClass {
  _id: string;
  subject: string;
  code: string;
  faculty_id: string;
  faculty_name?: string;
  room: string;
  schedule: IScheduleSlot[];
  students: string[]; // Array of student user IDs
  semester?: string;
  department?: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';
export type AttendanceMethod = 'face_recognition' | 'manual' | 'qr_code' | 'biometric';

export interface IAttendance {
  _id: string;
  class_id: string;
  class_name?: string;
  student_id: string;
  student_name?: string;
  student_enrollment?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm:ss
  status: AttendanceStatus;
  method: AttendanceMethod;
  confidence?: number;
  flagged_for_review?: boolean;
}

export interface IAssignment {
  _id: string;
  class_id: string;
  class_name?: string;
  title: string;
  description: string;
  deadline: string; // ISO date string or YYYY-MM-DD
  file_url?: string;
  created_by: string; // Faculty ID
  created_by_name?: string;
  total_marks?: number;
  createdAt: string;
}

export interface ISubmission {
  _id: string;
  assignment_id: string;
  assignment_title?: string;
  student_id: string;
  student_name?: string;
  file_url: string;
  submitted_at: string;
  grade?: number | string; // e.g., 95 or 'A'
  feedback?: string;
  status: 'submitted' | 'graded' | 'late';
}

export interface IAnnouncement {
  _id: string;
  title: string;
  body: string;
  posted_by: string; // User ID
  posted_by_name: string;
  role_target: 'all' | 'student' | 'faculty' | 'parent';
  priority?: 'normal' | 'urgent' | 'high';
  createdAt: string;
}

export interface IQuery {
  _id: string;
  student_id: string;
  student_name?: string;
  faculty_id: string;
  faculty_name?: string;
  subject?: string;
  message: string;
  reply?: string;
  reply_at?: string;
  status: 'open' | 'answered' | 'resolved';
  createdAt: string;
}

export interface ISyllabusModule {
  module_number: number;
  title: string;
  topics: string[];
  completed: boolean;
  hours_allocated: number;
}

export interface ICurriculumResource {
  title: string;
  type: 'pdf' | 'video' | 'link' | 'notes';
  url: string;
}

export interface ICurriculum {
  _id: string;
  class_id: string;
  subject_name?: string;
  syllabus: ISyllabusModule[];
  resources: ICurriculumResource[];
}

export interface IAuthResponse {
  token: string;
  user: Omit<IUser, 'password'>;
}

export interface IDefaulterReport {
  student_id: string;
  student_name: string;
  enrollment_no: string;
  total_classes: number;
  attended_classes: number;
  attendance_percentage: number;
  defaulter_status: boolean; // < 75% per UGC/AICTE guidelines
  parent_contacted?: boolean;
}
