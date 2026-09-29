import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { IAttendance, IAnnouncement } from '../../types';
import {
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Bell,
  GraduationCap,
  ShieldCheck,
  TrendingUp,
  HeartHandshake
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ParentDashboardProps {
  onNavigate: (tab: string) => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [childSummary, setChildSummary] = useState<{
    total: number;
    present: number;
    late: number;
    absent: number;
    percentage: number;
    isDefaulter: boolean;
  }>({ total: 8, present: 7, late: 1, absent: 0, percentage: 87.5, isDefaulter: false });
  const [attendanceLogs, setAttendanceLogs] = useState<IAttendance[]>([]);
  const [announcements, setAnnouncements] = useState<IAnnouncement[]>([]);

  const linkedStudentId = user?.linked_student_id || 'usr_student_1';

  useEffect(() => {
    const loadParentData = async () => {
      try {
        const attRes = await api.getStudentAttendance(linkedStudentId);
        if (attRes.summary) setChildSummary(attRes.summary);
        if (attRes.records) setAttendanceLogs(attRes.records);

        const ancRes = await api.getAnnouncements();
        setAnnouncements(ancRes.announcements || []);
      } catch (err) {
        console.warn('Parent data fetch error', err);
      }
    };

    loadParentData();
  }, [linkedStudentId]);

  const donutData = [
    { name: 'Present', value: childSummary.present || 7, color: '#10b981' },
    { name: 'Late', value: childSummary.late || 1, color: '#f59e0b' },
    { name: 'Absent', value: childSummary.absent || 0, color: '#ef4444' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Parent Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-slate-900 border border-purple-900/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30 flex items-center gap-1.5">
              <HeartHandshake className="w-3.5 h-3.5" />
              Parent Portal
            </span>
            <span className="text-xs text-slate-400">• Linked Ward: John Doe (ST-2026-CS001)</span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">Welcome, {user?.name}!</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor real-time biometric attendance timestamps and institutional communications for your child.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-900/30 border border-purple-700/40 text-right">
            <span className="text-[10px] text-purple-300 uppercase tracking-wider block font-bold">Child Attendance</span>
            <span className="text-xl font-black text-white">{childSummary.percentage}%</span>
          </div>
        </div>
      </div>

      {/* Grid: Attendance Donut & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Gauge Card */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-200">Ward Attendance Rate</h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                childSummary.percentage >= 75 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
              }`}>
                {childSummary.percentage >= 75 ? 'Regular' : 'Defaulter'}
              </span>
            </div>

            <div className="h-44 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={72}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-white">{childSummary.percentage}%</span>
                <span className="text-[10px] text-slate-400">Aggregated</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-3 border-t border-slate-800 text-xs">
            <div className="p-2 rounded-lg bg-slate-800/60">
              <span className="text-[10px] text-slate-400">Present</span>
              <p className="font-bold text-emerald-400">{childSummary.present}</p>
            </div>
            <div className="p-2 rounded-lg bg-slate-800/60">
              <span className="text-[10px] text-slate-400">Late</span>
              <p className="font-bold text-amber-400">{childSummary.late}</p>
            </div>
            <div className="p-2 rounded-lg bg-slate-800/60">
              <span className="text-[10px] text-slate-400">Absent</span>
              <p className="font-bold text-rose-400">{childSummary.absent}</p>
            </div>
          </div>
        </div>

        {/* Real-time Facial Biometric Scan Logs */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              Real-Time Biometric Check-In Feed
            </h3>
            <span className="text-xs text-slate-400">{attendanceLogs.length} Verified Entries</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/60 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-2.5 rounded-l-lg">Date</th>
                  <th className="p-2.5">Time</th>
                  <th className="p-2.5">Subject</th>
                  <th className="p-2.5">Biometric Confidence</th>
                  <th className="p-2.5 rounded-r-lg">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {attendanceLogs.slice(0, 5).map(log => (
                  <tr key={log._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-2.5 font-mono">{log.date}</td>
                    <td className="p-2.5 font-mono text-slate-400">{log.time}</td>
                    <td className="p-2.5 font-semibold text-slate-200">{log.class_name}</td>
                    <td className="p-2.5">
                      <span className="px-2 py-0.5 rounded bg-brand-500/10 text-brand-300 font-mono text-[11px]">
                        {log.confidence ? `${(log.confidence * 100).toFixed(1)}%` : '100%'}
                      </span>
                    </td>
                    <td className="p-2.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300">
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Institutional Notices for Parents */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-slate-200">Parent Notices & Academic Advisories</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {announcements.map(anc => (
            <div key={anc._id} className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-100">{anc.title}</h4>
                <span className="text-[9px] font-mono text-slate-400">{new Date(anc.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {anc.body}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
