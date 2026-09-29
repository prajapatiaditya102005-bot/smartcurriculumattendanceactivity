import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { IClass, IAssignment, IQuery } from '../../types';
import {
  Camera,
  Calendar,
  FileCheck,
  MessageSquare,
  Users,
  CheckCircle,
  Clock,
  Plus,
  Send
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { FaceScannerModal } from '../camera/FaceScannerModal';
import { useNotification } from '../../context/NotificationContext';

interface FacultyDashboardProps {
  onNavigate: (tab: string) => void;
}

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [classes, setClasses] = useState<IClass[]>([]);
  const [assignments, setAssignments] = useState<IAssignment[]>([]);
  const [queries, setQueries] = useState<IQuery[]>([]);
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [activeScanClass, setActiveScanClass] = useState<IClass | null>(null);
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadFacultyData = async () => {
      try {
        const schedRes = await api.getSchedules();
        setClasses(schedRes.classes || []);

        const asgRes = await api.getAssignments();
        setAssignments(asgRes.assignments || []);

        const qryRes = await api.getQueries();
        setQueries(qryRes.queries || []);
      } catch (err) {
        console.warn('Faculty data load error', err);
      }
    };

    loadFacultyData();
  }, []);

  const chartData = [
    { subject: 'Data Structs (CS301)', attendance: 92 },
    { subject: 'Computer Vision (CS305)', attendance: 96 },
    { subject: 'Database Systems (CS310)', attendance: 88 },
    { subject: 'Cloud Systems (CS320)', attendance: 84 }
  ];

  const handleReplySubmit = async (queryId: string) => {
    const text = replyTextMap[queryId];
    if (!text) return;

    try {
      await api.replyToQuery(queryId, text);
      showToast('success', 'Reply Sent', 'Student has been notified of your response.');
      const qryRes = await api.getQueries();
      setQueries(qryRes.queries || []);
      setReplyTextMap(prev => ({ ...prev, [queryId]: '' }));
    } catch (err: any) {
      showToast('error', 'Failed to send reply', err.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Stat Strip */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            Faculty Portal • {user?.department || 'Department of Computer Science'}
          </span>
          <h2 className="text-2xl font-bold text-white mt-1">Hello, {user?.name}!</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            You have {classes.length} active courses and {queries.filter(q => q.status === 'open').length} pending student questions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setActiveScanClass(classes[0] || null);
              setIsScannerOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 font-bold text-xs text-white shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Camera className="w-4 h-4" />
            Start Classroom Face Scan
          </button>
        </div>
      </div>

      {/* Grid: Classes with Camera Launchers + Performance Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Classes Card */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              Today's Teaching Lectures
            </h3>
            <span className="text-xs text-slate-400">{classes.length} Courses Assigned</span>
          </div>

          <div className="space-y-3">
            {classes.map(cls => (
              <div
                key={cls._id}
                className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                      {cls.code}
                    </span>
                    <h4 className="text-xs font-bold text-slate-100">{cls.subject}</h4>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                    <span>{cls.room}</span>
                    <span>•</span>
                    <span>{cls.students.length} Enrolled Students</span>
                    <span>•</span>
                    <span>{cls.schedule[0]?.startTime} - {cls.schedule[0]?.endTime}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setActiveScanClass(cls);
                      setIsScannerOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition-all"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    Biometric Scan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Performance Chart */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-200">Class Attendance Rates</h3>
            <p className="text-xs text-slate-400 mb-4">Live biometric check-in aggregates</p>

            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 10 }}>
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis type="category" dataKey="subject" width={110} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px', borderRadius: '8px' }}
                    formatter={(value: any) => [`${value}%`, 'Attendance']}
                  />
                  <Bar dataKey="attendance" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <p className="text-[10px] text-slate-500 text-center border-t border-slate-800 pt-3">
            All classes exceeding NAAC minimum 75% threshold.
          </p>
        </div>

      </div>

      {/* Row: Student Doubts Queue with Inline Reply */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-brand-400" />
            <h3 className="text-sm font-bold text-slate-200">Student Doubts & Academic Queries</h3>
          </div>
          <span className="text-xs text-slate-400">{queries.length} Total Threads</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {queries.map(q => (
            <div key={q._id} className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-100">{q.subject}</h4>
                  <p className="text-[10px] text-slate-400">From: {q.student_name || 'Student'}</p>
                </div>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  q.status === 'answered' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {q.status}
                </span>
              </div>

              <p className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 leading-relaxed">
                "{q.message}"
              </p>

              {q.reply ? (
                <div className="text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-800/40 p-2.5 rounded-lg">
                  <strong className="block text-[10px] text-emerald-400 uppercase">Your Answer:</strong>
                  {q.reply}
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type academic clarification..."
                    value={replyTextMap[q._id] || ''}
                    onChange={(e) => setReplyTextMap(prev => ({ ...prev, [q._id]: e.target.value }))}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                  />
                  <button
                    onClick={() => handleReplySubmit(q._id)}
                    className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shrink-0"
                  >
                    <Send className="w-3 h-3" /> Reply
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Face Scanner Modal */}
      <FaceScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        selectedClass={activeScanClass}
      />

    </div>
  );
};
