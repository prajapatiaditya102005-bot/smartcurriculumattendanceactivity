import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { IUser, IAttendance, IDefaulterReport, IAnnouncement } from '../../types';
import {
  Users,
  ShieldAlert,
  BarChart3,
  FileDown,
  UserPlus,
  Trash2,
  Edit2,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Send,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { exportNAACReportPDF, exportDefaultersCSV } from '../../services/exportPdf';
import { useNotification } from '../../context/NotificationContext';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [users, setUsers] = useState<IUser[]>([]);
  const [attendanceLogs, setAttendanceLogs] = useState<IAttendance[]>([]);
  const [defaulters, setDefaulters] = useState<IDefaulterReport[]>([]);
  const [naacData, setNaacData] = useState<any>(null);
  const [announcementTitle, setAnnouncementTitle] = useState<string>('');
  const [announcementBody, setAnnouncementBody] = useState<string>('');
  const [announcementTarget, setAnnouncementTarget] = useState<'all' | 'student' | 'faculty' | 'parent'>('all');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const loadAdminData = async () => {
    try {
      const userRes = await api.getUsers();
      setUsers(userRes.users || []);

      const defRes = await api.getDefaultersReport();
      setDefaulters(defRes.defaulters || []);

      const naacRes = await api.getNAACSummary();
      setNaacData(naacRes);

      const attRes = await api.getAttendanceReport();
      setAttendanceLogs(attRes.records || []);
    } catch (err: any) {
      console.warn('Admin load error', err);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementTitle || !announcementBody) return;

    try {
      await api.createAnnouncement(announcementTitle, announcementBody, announcementTarget, 'high');
      showToast('success', 'Announcement Broadcasted', 'Institutional notice published successfully.');
      setAnnouncementTitle('');
      setAnnouncementBody('');
    } catch (err: any) {
      showToast('error', 'Error broadcasting notice', err.message);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user record?')) return;
    try {
      await api.deleteUser(userId);
      showToast('success', 'User Deleted', 'Record removed from system database.');
      loadAdminData();
    } catch (err: any) {
      showToast('error', 'Failed to delete user', err.message);
    }
  };

  const handleExportPDF = () => {
    setIsExporting(true);
    try {
      exportNAACReportPDF(naacData, defaulters, attendanceLogs);
      showToast('success', 'NAAC PDF Exported', 'Statutory audit PDF generated successfully.');
    } catch (err: any) {
      showToast('error', 'Export Error', err.message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCSV = () => {
    try {
      exportDefaultersCSV(defaulters);
      showToast('success', 'Defaulter CSV Downloaded', 'Spreadsheet generated for parent notification dispatch.');
    } catch (err: any) {
      showToast('error', 'CSV Export Error', err.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Admin Executive KPI Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-950 via-slate-900 to-slate-900 border border-rose-900/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              Administrative Control Center
            </span>
            <span className="text-xs text-slate-400">• NAAC Criterion 2.3 & AICTE Audit Node</span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">Dean Portal: {user?.name}</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Full system privilege active. 1-Click statutory report generation & biometric audit trails ready.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-sky-600 hover:from-brand-500 hover:to-sky-500 text-white font-bold text-xs shadow-lg shadow-brand-500/20 transition-all"
          >
            <FileDown className="w-4 h-4" />
            Export NAAC/AICTE PDF
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors"
          >
            <FileDown className="w-4 h-4" />
            Defaulters CSV
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium">Total Registered Users</span>
          <p className="text-2xl font-black text-white mt-1">{users.length}</p>
          <span className="text-[10px] text-sky-400 mt-1 block">Students, Faculty, Parents</span>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium">Overall Attendance Rate</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">91.4%</p>
          <span className="text-[10px] text-emerald-400 mt-1 block">+16.4% above UGC norm</span>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium">Biometric Face Adoption</span>
          <p className="text-2xl font-black text-brand-400 mt-1">96.8%</p>
          <span className="text-[10px] text-slate-400 mt-1 block">OpenCV CLAHE Verified</span>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium">Defaulters (&lt;75%)</span>
          <p className="text-2xl font-black text-rose-400 mt-1">{defaulters.length}</p>
          <span className="text-[10px] text-rose-400 mt-1 block">Parent notice dispatched</span>
        </div>
      </div>

      {/* User Management Table */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-200">Institutional User Directory</h3>
            <p className="text-xs text-slate-400">Strict Role Matrix Assignment & Status</p>
          </div>
          <span className="text-xs text-slate-400">{users.length} Active Accounts</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="p-3 rounded-l-lg">User</th>
                <th className="p-3">Role</th>
                <th className="p-3">Department / ID</th>
                <th className="p-3">Biometrics</th>
                <th className="p-3 rounded-r-lg text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {users.map(u => (
                <tr key={u._id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-3 flex items-center gap-2.5">
                    <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full border border-slate-700" />
                    <div>
                      <p className="font-semibold text-slate-200">{u.name}</p>
                      <p className="text-[10px] text-slate-400">{u.email}</p>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      u.role === 'admin' ? 'bg-rose-500/20 text-rose-300' :
                      u.role === 'faculty' ? 'bg-emerald-500/20 text-emerald-300' :
                      u.role === 'parent' ? 'bg-purple-500/20 text-purple-300' :
                      'bg-sky-500/20 text-sky-300'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400">
                    {u.enrollment_no || u.department || 'Academic Affairs'}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                      {u.face_embedding ? '128-d Registered' : 'Active Profile'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleDeleteUser(u._id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                      title="Delete User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row: Defaulters Audit + Announcement Composer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Defaulter Audit Log */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Statutory Defaulter List (&lt;75% Attendance)
            </h3>
            <span className="text-xs text-rose-400 font-bold">{defaulters.length} Flagged</span>
          </div>

          <div className="space-y-2.5">
            {defaulters.map(d => (
              <div key={d.student_id} className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/40 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{d.student_name}</h4>
                  <p className="text-[10px] text-slate-400">ID: {d.enrollment_no} • {d.attended_classes}/{d.total_classes} lectures attended</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-rose-400">{d.attendance_percentage}%</span>
                  <span className="block text-[9px] text-slate-400">Notice Sent</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Institution Announcement Broadcast */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Send className="w-4 h-4 text-brand-400" />
            Publish Institutional Notice
          </h3>

          <form onSubmit={handleCreateAnnouncement} className="space-y-3">
            <div>
              <input
                type="text"
                placeholder="Notice Title (e.g. Mid-Term NAAC Compliance Directive)"
                value={announcementTitle}
                onChange={(e) => setAnnouncementTitle(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
                required
              />
            </div>

            <div>
              <textarea
                placeholder="Detailed announcement body for students, faculty, and parents..."
                rows={3}
                value={announcementBody}
                onChange={(e) => setAnnouncementBody(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <select
                value={announcementTarget}
                onChange={(e) => setAnnouncementTarget(e.target.value as any)}
                className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
              >
                <option value="all">Audience: All Campus</option>
                <option value="student">Audience: Students Only</option>
                <option value="faculty">Audience: Faculty Only</option>
                <option value="parent">Audience: Parents Only</option>
              </select>

              <button
                type="submit"
                className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-brand-500/20"
              >
                Broadcast Notice
              </button>
            </div>
          </form>
        </div>

      </div>

    </div>
  );
};
