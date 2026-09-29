import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { IAnnouncement } from '../../types';
import {
  Bell,
  Plus,
  Send,
  Sparkles,
  AlertTriangle,
  Radio,
  Tag
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export const AnnouncementsHub: React.FC = () => {
  const { role } = useAuth();
  const { showToast } = useNotification();
  const [announcements, setAnnouncements] = useState<IAnnouncement[]>([]);
  const [filterTarget, setFilterTarget] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [roleTarget, setRoleTarget] = useState<'all' | 'student' | 'faculty' | 'parent'>('all');
  const [priority, setPriority] = useState<'normal' | 'urgent' | 'high'>('normal');

  const loadAnnouncements = async () => {
    try {
      const res = await api.getAnnouncements();
      setAnnouncements(res.announcements || []);
    } catch (err: any) {
      console.warn('Announcements error', err);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body) return;

    try {
      await api.createAnnouncement(title, body, roleTarget, priority);
      showToast('success', 'Announcement Published', 'Campus members have been notified.');
      setIsModalOpen(false);
      setTitle('');
      setBody('');
      loadAnnouncements();
    } catch (err: any) {
      showToast('error', 'Failed to publish', err.message);
    }
  };

  const filteredAnnouncements = announcements.filter(
    a => filterTarget === 'all' || a.role_target === 'all' || a.role_target === filterTarget
  );

  const canPost = role === 'faculty' || role === 'admin';

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            Institutional Announcements Bulletin
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Official directives, examination schedules, and campus-wide notifications.
          </p>
        </div>

        {canPost && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Compose Notice
          </button>
        )}
      </div>

      {/* Target Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['all', 'student', 'faculty', 'parent'].map(target => (
          <button
            key={target}
            onClick={() => setFilterTarget(target)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
              filterTarget === target
                ? 'bg-brand-600 text-white shadow'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {target === 'all' ? 'All Broadcasts' : `Target: ${target}s`}
          </button>
        ))}
      </div>

      {/* Announcements Feed */}
      <div className="space-y-4">
        {filteredAnnouncements.map(anc => (
          <div
            key={anc._id}
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  anc.priority === 'urgent' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                  anc.priority === 'high' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                }`}>
                  {anc.priority || 'Normal'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-medium capitalize">
                  Target: {anc.role_target}
                </span>
              </div>

              <span className="text-xs font-mono text-slate-400">
                {new Date(anc.createdAt).toLocaleDateString()} • {new Date(anc.createdAt).toLocaleTimeString()}
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-100">{anc.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {anc.body}
            </p>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>Posted by: <strong className="text-slate-300">{anc.posted_by_name}</strong></span>
              <span className="flex items-center gap-1 text-brand-400">
                <Radio className="w-3.5 h-3.5 animate-pulse" /> Verified Broadcast
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Compose Notice Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Broadcast Campus Notice</h3>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Notice Title</label>
                <input
                  type="text"
                  placeholder="e.g. Schedule for Biometric Calibration & Examinations"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Detailed Content</label>
                <textarea
                  rows={4}
                  placeholder="Notice body text..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Target Audience</label>
                  <select
                    value={roleTarget}
                    onChange={(e) => setRoleTarget(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                  >
                    <option value="all">Everyone (All)</option>
                    <option value="student">Students Only</option>
                    <option value="faculty">Faculty Only</option>
                    <option value="parent">Parents Only</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Priority Level</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold"
                >
                  Broadcast Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
