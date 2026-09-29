import React, { useState } from 'react';
import { HelpCircle, Send, CheckCircle2, Mail, Phone, Clock, ShieldCheck } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export const SupportHub: React.FC = () => {
  const { showToast } = useNotification();
  const [feedback, setFeedback] = useState('');
  const [category, setCategory] = useState('Face Recognition & Attendance');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback) return;

    showToast('success', 'Inquiry Submitted', 'Your ticket has been logged with the Academic Support desk.');
    setSubmitted(true);
    setFeedback('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-brand-400" />
          Academic Support & Helpdesk
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Submit technical queries, report attendance logging issues, or contact the academic administration.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Support Form */}
        <div className="md:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-200">Submit an Inquiry or Ticket</h3>

          {submitted ? (
            <div className="p-6 rounded-xl bg-emerald-950/30 border border-emerald-900/50 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="text-sm font-bold text-emerald-200">Ticket Logged Successfully</h4>
              <p className="text-xs text-slate-400">The technical support staff will follow up on your request shortly.</p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-3 px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Issue Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
                >
                  <option value="Face Recognition & Attendance">Biometric Face Recognition & Attendance</option>
                  <option value="Curriculum & Timetable">Course Timetable & Schedules</option>
                  <option value="Assignments & Assessments">Assignments & Submissions</option>
                  <option value="Account & Permissions">Account Access & Permissions</option>
                  <option value="General Inquiry">General Academic Inquiry</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Description</label>
                <textarea
                  rows={4}
                  placeholder="Provide detailed description of the issue or inquiry..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-brand-500/20 transition-all"
              >
                <Send className="w-3.5 h-3.5" /> Submit Ticket
              </button>
            </form>
          )}
        </div>

        {/* Institutional Contact Information */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-200">Campus IT Helpdesk</h3>

          <div className="space-y-3 text-xs text-slate-400">
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
              <div className="flex items-center gap-2 text-slate-200 font-semibold">
                <Mail className="w-3.5 h-3.5 text-brand-400" />
                <span>Email Support</span>
              </div>
              <p className="text-slate-400 text-[11px]">support@smartedu.edu</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
              <div className="flex items-center gap-2 text-slate-200 font-semibold">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Operating Hours</span>
              </div>
              <p className="text-slate-400 text-[11px]">Mon – Fri: 8:00 AM – 5:00 PM</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
              <div className="flex items-center gap-2 text-slate-200 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                <span>Academic Office</span>
              </div>
              <p className="text-slate-400 text-[11px]">Block A, Academic Affairs Desk</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
