import {
  IUser,
  IClass,
  IAttendance,
  IAssignment,
  ISubmission,
  IAnnouncement,
  IQuery,
  ICurriculum,
  IDefaulterReport,
  UserRole
} from '../types';
import { config } from '../config';

const TOKEN_KEY = 'sca_auth_token';
const USER_KEY = 'sca_auth_user';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem(TOKEN_KEY);
  }

  setSession(token: string, user: IUser) {
    this.token = token;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  clearSession() {
    this.token = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  getToken(): string | null {
    return this.token || localStorage.getItem(TOKEN_KEY);
  }

  getUser(): IUser | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as IUser;
    } catch {
      return null;
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${config.apiBaseUrl}${endpoint}`, {
        ...options,
        headers
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data as T;
    } catch (err: any) {
      console.warn(`Fetch error for ${endpoint}:`, err.message);
      throw err;
    }
  }

  // --- Auth API ---
  async login(email: string, password: string): Promise<{ token: string; user: IUser }> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  async register(data: Partial<IUser> & { password: string }): Promise<{ token: string; user: IUser }> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getMe(): Promise<{ user: IUser }> {
    return this.request('/users/me');
  }

  // --- Users CRUD ---
  async getUsers(role?: string): Promise<{ users: IUser[]; count: number }> {
    return this.request(`/users${role ? `?role=${role}` : ''}`);
  }

  async updateUser(id: string, updates: Partial<IUser>): Promise<{ user: IUser }> {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  async deleteUser(id: string): Promise<{ success: boolean }> {
    return this.request(`/users/${id}`, {
      method: 'DELETE'
    });
  }

  // --- Schedules & Curriculum ---
  async getSchedules(): Promise<{ classes: IClass[] }> {
    return this.request('/schedules');
  }

  async getCurriculum(classId?: string): Promise<{ curricula: ICurriculum[] }> {
    return this.request(`/curriculum${classId ? `?classId=${classId}` : ''}`);
  }

  async updateModuleStatus(curriculum_id: string, module_number: number, completed: boolean): Promise<any> {
    return this.request('/curriculum/module-status', {
      method: 'POST',
      body: JSON.stringify({ curriculum_id, module_number, completed })
    });
  }

  // --- Attendance ---
  async markFaceAttendance(class_id: string, image: string, student_id?: string): Promise<{ success: boolean; records: IAttendance[]; low_light_enhanced: boolean; message: string }> {
    return this.request('/attendance/face', {
      method: 'POST',
      body: JSON.stringify({ class_id, image, student_id })
    });
  }

  async markManualAttendance(class_id: string, student_id: string, status: string, date?: string): Promise<{ success: boolean; record: IAttendance }> {
    return this.request('/attendance/manual', {
      method: 'POST',
      body: JSON.stringify({ class_id, student_id, status, date })
    });
  }

  async getStudentAttendance(studentId: string): Promise<{
    summary: { total: number; present: number; late: number; absent: number; percentage: number; isDefaulter: boolean };
    records: IAttendance[];
  }> {
    return this.request(`/attendance/${studentId}`);
  }

  async getClassAttendance(classId: string, date?: string): Promise<{ records: IAttendance[] }> {
    return this.request(`/attendance/class/${classId}${date ? `?date=${date}` : ''}`);
  }

  // --- Assignments ---
  async getAssignments(classId?: string): Promise<{ assignments: IAssignment[] }> {
    return this.request(`/assignments${classId ? `?classId=${classId}` : ''}`);
  }

  async createAssignment(data: Partial<IAssignment>): Promise<{ assignment: IAssignment }> {
    return this.request('/assignments', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async submitAssignment(assignmentId: string, file_url: string): Promise<{ submission: ISubmission }> {
    return this.request(`/assignments/${assignmentId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ file_url })
    });
  }

  async getSubmissions(assignmentId: string): Promise<{ submissions: ISubmission[] }> {
    return this.request(`/assignments/${assignmentId}/submissions`);
  }

  async gradeSubmission(submissionId: string, grade: number | string, feedback: string): Promise<{ submission: ISubmission }> {
    return this.request(`/submissions/${submissionId}/grade`, {
      method: 'POST',
      body: JSON.stringify({ grade, feedback })
    });
  }

  // --- Announcements ---
  async getAnnouncements(): Promise<{ announcements: IAnnouncement[] }> {
    return this.request('/announcements');
  }

  async createAnnouncement(title: string, body: string, role_target = 'all', priority = 'normal'): Promise<{ announcement: IAnnouncement }> {
    return this.request('/announcements', {
      method: 'POST',
      body: JSON.stringify({ title, body, role_target, priority })
    });
  }

  // --- Queries ---
  async getQueries(): Promise<{ queries: IQuery[] }> {
    return this.request('/queries');
  }

  async createQuery(faculty_id: string, subject: string, message: string): Promise<{ query: IQuery }> {
    return this.request('/queries', {
      method: 'POST',
      body: JSON.stringify({ faculty_id, subject, message })
    });
  }

  async replyToQuery(queryId: string, reply: string): Promise<{ query: IQuery }> {
    return this.request(`/queries/${queryId}/reply`, {
      method: 'POST',
      body: JSON.stringify({ reply })
    });
  }

  // --- Reports (Admin Only) ---
  async getAttendanceReport(class_id?: string, startDate?: string, endDate?: string): Promise<any> {
    const params = new URLSearchParams();
    if (class_id) params.append('class_id', class_id);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return this.request(`/reports/attendance?${params.toString()}`);
  }

  async getDefaultersReport(): Promise<{ defaulters: IDefaulterReport[]; allStudentSummaries: IDefaulterReport[]; totalStudentsEvaluated: number; defaulterCount: number }> {
    return this.request('/reports/defaulters');
  }

  async getNAACSummary(): Promise<any> {
    return this.request('/reports/naac-summary');
  }
}

export const api = new ApiService();
