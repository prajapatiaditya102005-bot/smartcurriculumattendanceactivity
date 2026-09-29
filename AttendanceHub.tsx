import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { IAttendance, IClass } from '../../types';
import {
  Camera,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  UserCheck,
  ShieldCheck,
  Search,
  Sparkles
} from 'lucide-react';
import { FaceScannerModal } from '../camera/FaceScannerModal';
import { useNotification } from '../../context/NotificationContext';

export const AttendanceHub: React.FC = () => {
  const { role, user } = useAuth();
  const { showToast } = useNotification();
  const [records, setRecords] = useState<IAttendance[]>([]);
  const [classes, setClasses] = useState<IClass[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);

  const loadData = async () => {
    try {
      if (role === 'student' && user?._id) {
        const res = await api.getStudentAttendance(user._id);
        setRecords(res.records || []);
      } else if (role === 'parent' && user?.linked_student_id) {
        const res = await api.getStudentAttendance(user.linked_student_id);
        setRecords(res.records || []);
      } else {
        const res = await api.getAttendanceReport();
        setRecords(res.records || []);
      }

      if (role !== 'parent') {
        const schedRes = await api.getSchedules();
        setClasses(schedRes.classes || []);
      }
    } catch (err: any) {
      console.warn('Attendance records error', err);
    }
  };

  useEffect(() => {
    loadData();
  }, [role, user]);

  const filteredRecords = records.filter(r => {
    const matchesClass = selectedClassId === 'all' || r.class_id === selectedClassId;
    const matchesQuery = (r.student_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (r.class_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (r.date || '').includes(searchQuery);
    return matchesClass && matchesQuery;
  });

  const canMark = role === 'student' || role === 'faculty' || role === 'admin';

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Camera className="w-5 h-5 text-brand-400" />
            Biometric Attendance Registry
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable 128-d biometric facial recognition audit logs and timestamps.
          </p>
        </div>

        {canMark && (
          <button
            onClick={() => setIsScannerOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-sky-600 hover:from-brand-500 hover:to-sky-500 text-white text-xs font-bold shadow-lg shadow-brand-500/20 transition-all"
          >
            <Camera className="w-4 h-4" />
            Launch Face Scanner
          </button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student, subject, or date (YYYY-MM-DD)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
          />
        </div>

        {classes.length > 0 && (
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
            >
              <option value="all">Filter: All Courses</option>
              {classes.map(c => (
                <option key={c._id} value={c._id}>{c.subject}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Attendance Table */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="p-3 rounded-l-lg">Student</th>
                <th className="p-3">Subject / Course</th>
                <th className="p-3">Date</th>
                <th className="p-3">Time</th>
                <th className="p-3">Method</th>
                <th className="p-3">Confidence</th>
                <th className="p-3 rounded-r-lg">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    No attendance records found matching filters.
                  </td>
                </tr>
              ) : (
                filteredRecords.map(rec => (
                  <tr key={rec._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3 font-semibold text-slate-200">
                      {rec.student_name || 'Enrolled Student'}
                      {rec.student_enrollment && (
                        <span className="block text-[10px] text-slate-500 font-mono">{rec.student_enrollment}</span>
                      )}
                    </td>
                    <td className="p-3 text-slate-300">{rec.class_name}</td>
                    <td className="p-3 font-mono text-slate-400">{rec.date}</td>
                    <td className="p-3 font-mono text-slate-400">{rec.time}</td>
                    <td className="p-3">
                      <span className="flex items-center gap-1 text-[11px] text-slate-300">
                        {rec.method === 'face_recognition' ? (
                          <>
                            <Sparkles className="w-3 h-3 text-brand-400" />
                            OpenCV CLAHE
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-3 h-3 text-emerald-400" />
                            Manual Entry
                          </>
                        )}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-brand-500/10 text-brand-300 font-mono text-[11px]">
                        {rec.confidence ? `${(rec.confidence * 100).toFixed(1)}%` : '100%'}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        rec.status === 'present'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : rec.status === 'late'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {rec.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Face Scanner Modal */}
      <FaceScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onSuccess={() => loadData()}
      />

    </div>
  );
};
