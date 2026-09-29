import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { IQuery, IUser } from '../../types';
import {
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
  User,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export const QueriesHub: React.FC = () => {
  const { role, user } = useAuth();
  const { showToast } = useNotification();
  const [queries, setQueries] = useState<IQuery[]>([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [facultyId, setFacultyId] = useState('usr_faculty_1');
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});

  const loadQueries = async () => {
    try {
      const res = await api.getQueries();
      setQueries(res.queries || []);
    } catch (err: any) {
      console.warn('Queries load error', err);
    }
  };

  useEffect(() => {
    loadQueries();
  }, []);

  const handleAskDoubt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;

    try {
      await api.createQuery(facultyId, subject, message);
      showToast('success', 'Question Submitted', 'Your doubt has been forwarded to professor for clarification.');
      setSubject('');
      setMessage('');
      loadQueries();
    } catch (err: any) {
      showToast('error', 'Submission Failed', err.message);
    }
  };

  const handleSendReply = async (queryId: string) => {
    const text = replyTextMap[queryId];
    if (!text) return;

    try {
      await api.replyToQuery(queryId, text);
      showToast('success', 'Clarification Sent', 'Student has received your response.');
      setReplyTextMap(prev => ({ ...prev, [queryId]: '' }));
      loadQueries();
    } catch (err: any) {
      showToast('error', 'Failed to reply', err.message);
    }
  };

  const isStudent = role === 'student';
  const isFacultyOrAdmin = role === 'faculty' || role === 'admin';

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-brand-400" />
          Academic Doubts & Professor Direct Queries
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Asynchronous doubt clearance threads between students and subject faculty.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Ask Question Form (Student / Admin) */}
        {isStudent && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-brand-400" />
              Raise Academic Query
            </h3>

            <form onSubmit={handleAskDoubt} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Select Professor</label>
                <select
                  value={facultyId}
                  onChange={(e) => setFacultyId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                >
                  <option value="usr_faculty_1">Dr. Sarah Jenkins (AI & Computer Vision)</option>
                  <option value="usr_faculty_2">Prof. Alan Turing (Databases & Clouds)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Subject Topic</label>
                <input
                  type="text"
                  placeholder="e.g. CLAHE parameter tuning in low-light"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Detailed Doubt / Problem</label>
                <textarea
                  rows={4}
                  placeholder="Explain the theoretical or implementation doubt..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-brand-500/20"
              >
                <Send className="w-3.5 h-3.5" /> Submit to Faculty
              </button>
            </form>
          </div>
        )}

        {/* Doubt Threads List */}
        <div className={`space-y-4 ${isStudent ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200">Active Academic Discussion Threads</h3>
            <span className="text-xs text-slate-400">{queries.length} Threads</span>
          </div>

          <div className="space-y-3">
            {queries.map(q => (
              <div
                key={q._id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">{q.subject}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Asked by <strong className="text-slate-300">{q.student_name}</strong> • Addressed to <strong className="text-brand-300">{q.faculty_name}</strong>
                    </p>
                  </div>

                  <span className={`text-[9px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                    q.status === 'answered'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {q.status}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/60 text-xs text-slate-300 leading-relaxed">
                  "{q.message}"
                </div>

                {q.reply ? (
                  <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-900/50 text-xs text-emerald-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                        Professor's Clarification:
                      </span>
                      {q.reply_at && (
                        <span className="text-[9px] font-mono text-emerald-400/80">{new Date(q.reply_at).toLocaleDateString()}</span>
                      )}
                    </div>
                    <p className="leading-relaxed">{q.reply}</p>
                  </div>
                ) : (
                  isFacultyOrAdmin && (
                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Write clear explanation or recommendation..."
                        value={replyTextMap[q._id] || ''}
                        onChange={(e) => setReplyTextMap(prev => ({ ...prev, [q._id]: e.target.value }))}
                        className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
                      />
                      <button
                        onClick={() => handleSendReply(q._id)}
                        className="px-4 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition-all shadow"
                      >
                        Reply
                      </button>
                    </div>
                  )
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
