import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { IClass, IAttendance, IAssignment, IAnnouncement } from '../../types';
import {
  Calendar,
  Camera,
  CheckCircle2,
  Clock,
  FileCheck,
  AlertCircle,
  TrendingUp,
  ArrowUpRight,
  Bell,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FaceScannerModal } from '../camera/FaceScannerModal';

interface StudentDashboardProps {
  onNavigate: (tab: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<IClass[]>([]);
  const [attendanceSummary, setAttendanceSummary] = useState<{
    total: number;
    present: number;
    late: number;
    absent: number;
    percentage: number;
    isDefaulter: boolean;
  }>({ total: 8, present: 7, late: 1, absent: 0, percentage: 87.5, isDefaulter: false });
  const [assignments, setAssignments] = useState<IAssignment[]>([]);
  const [announcements, setAnnouncements] = useState<IAnnouncement[]>([]);
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [selectedScanClass, setSelectedScanClass] = useState<IClass | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?._id) {
          const attRes = await api.getStudentAttendance(user._id);
          if (attRes.summary) setAttendanceSummary(attRes.summary);
        }
        const schedRes = await api.getSchedules();
        setClasses(schedRes.classes || []);

        const asgRes = await api.getAssignments();
        setAssignments(asgRes.assignments || []);

        const ancRes = await api.getAnnouncements();
        setAnnouncements(ancRes.announcements || []);
      } catch (err) {
        console.warn('Error loading student dashboard data', err);
      }
    };

    fetchData();
  }, [user]);

  const donutData = [
    { name: 'Present', value: attendanceSummary.present || 7, color: '#10b981' },
    { name: 'Late', value: attendanceSummary.late || 1, color: '#f59e0b' },
    { name: 'Absent', value: attendanceSummary.absent || 0, color: '#ef4444' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 border border-slate-800 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold border border-brand-500/30">
                Enrollment: {user?.enrollment_no || 'ST-2026-CS001'}
              </span>
              <span className="text-xs text-slate-400">• B.Tech CSE Semester V</span>
            </div>
            <h2 className="text-2xl font-bold text-white mt-1">Welcome back, {user?.name}!</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Your biometric verification is fully active. Today you have {classes.length} scheduled lectures.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedScanClass(classes[0] || null);
                setIsScannerOpen(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-sky-600 hover:from-brand-600 hover:to-sky-700 font-bold text-xs text-white shadow-lg shadow-brand-500/20 transition-all"
            >
              <Camera className="w-4 h-4" />
              Mark Face Attendance
            </button>

            <button
              onClick={() => onNavigate('queries')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
            >
              Ask Doubt
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Attendance KPI Donut + Today's Classes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Attendance Rate Donut Widget */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-200">Aggregate Attendance</h3>
                <p className="text-xs text-slate-400">NAAC / UGC Benchmark: 75%</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                attendanceSummary.percentage >= 75
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}>
                {attendanceSummary.percentage >= 75 ? 'Compliant' : 'Defaulter Alert'}
              </span>
            </div>

            {/* Recharts Pie Chart Donut */}
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
                <span className="text-2xl font-black text-white">{attendanceSummary.percentage}%</span>
                <span className="text-[10px] text-slate-400 font-medium">Verified</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-4 border-t border-slate-800 text-xs">
            <div className="p-2 rounded-lg bg-slate-800/60">
              <span className="text-[10px] text-slate-400">Present</span>
              <p className="font-bold text-emerald-400">{attendanceSummary.present}</p>
            </div>
            <div className="p-2 rounded-lg bg-slate-800/60">
              <span className="text-[10px] text-slate-400">Late</span>
              <p className="font-bold text-amber-400">{attendanceSummary.late}</p>
            </div>
            <div className="p-2 rounded-lg bg-slate-800/60">
              <span className="text-[10px] text-slate-400">Absent</span>
              <p className="font-bold text-rose-400">{attendanceSummary.absent}</p>
            </div>
          </div>
        </div>

        {/* Today's Schedule List */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-400" />
                <h3 className="text-sm font-bold text-slate-200">Today's Class Timetable</h3>
              </div>
              <button
                onClick={() => onNavigate('schedules')}
                className="text-xs text-brand-400 hover:text-brand-300 font-medium flex items-center gap-1"
              >
                View Full Week <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {classes.slice(0, 3).map((cls, idx) => (
                <div
                  key={cls._id}
                  className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/60 flex items-center justify-between hover:border-brand-500/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center font-bold text-xs">
                      {cls.code.split('-')[1] || `0${idx+1}`}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-100">{cls.subject}</h4>
                      <p className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{cls.room}</span>
                        <span>•</span>
                        <span>{cls.faculty_name || 'Faculty Member'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-300 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-700">
                      {cls.schedule[0]?.startTime || '09:00 AM'}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedScanClass(cls);
                        setIsScannerOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-brand-500/20 text-brand-300 hover:bg-brand-500 hover:text-white text-xs font-semibold transition-all border border-brand-500/30"
                    >
                      Check-In
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Row: Pending Assignments & Recent Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pending Assignments */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-200">Pending Assignments</h3>
            </div>
            <button
              onClick={() => onNavigate('assignments')}
              className="text-xs text-brand-400 hover:text-brand-300 font-medium"
            >
              All Assignments ({assignments.length})
            </button>
          </div>

          <div className="space-y-3">
            {assignments.slice(0, 3).map(asg => (
              <div key={asg._id} className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-100">{asg.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {asg.class_name} • Due: {new Date(asg.deadline).toLocaleDateString()}
                  </p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  asg.my_submission
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {asg.my_submission ? 'Submitted' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Institutional Notices & Announcements */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-slate-200">Campus Notices</h3>
            </div>
            <button
              onClick={() => onNavigate('announcements')}
              className="text-xs text-brand-400 hover:text-brand-300 font-medium"
            >
              View Bulletin
            </button>
          </div>

          <div className="space-y-3">
            {announcements.slice(0, 2).map(anc => (
              <div key={anc._id} className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-100 truncate">{anc.title}</h4>
                  <span className="text-[9px] font-mono text-slate-400">{new Date(anc.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {anc.body}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Face Scanner Modal */}
      <FaceScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        selectedClass={selectedScanClass}
        onSuccess={() => {
          if (user?._id) {
            api.getStudentAttendance(user._id).then(res => {
              if (res.summary) setAttendanceSummary(res.summary);
            });
          }
        }}
      />

    </div>
  );
};
