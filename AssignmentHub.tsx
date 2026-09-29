import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { IAssignment, ISubmission } from '../../types';
import {
  FileCheck,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Upload,
  Send,
  ExternalLink,
  Award
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export const AssignmentHub: React.FC = () => {
  const { role, user } = useAuth();
  const { showToast } = useNotification();
  const [assignments, setAssignments] = useState<IAssignment[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'submitted' | 'grading'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [submissionModalAsg, setSubmissionModalAsg] = useState<IAssignment | null>(null);
  const [submissionUrl, setSubmissionUrl] = useState<string>('');
  
  // Create form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [classId, setClassId] = useState('cls_cs301');
  const [deadline, setDeadline] = useState('2026-10-10');
  const [totalMarks, setTotalMarks] = useState('100');

  // Grading state
  const [selectedAsgForGrading, setSelectedAsgForGrading] = useState<string | null>(null);
  const [submissionsList, setSubmissionsList] = useState<ISubmission[]>([]);
  const [gradeInput, setGradeInput] = useState<Record<string, string>>({});
  const [feedbackInput, setFeedbackInput] = useState<Record<string, string>>({});

  const loadAssignments = async () => {
    try {
      const res = await api.getAssignments();
      setAssignments(res.assignments || []);
    } catch (err: any) {
      console.warn('Assignments load error', err);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createAssignment({
        class_id: classId,
        title,
        description,
        deadline: new Date(deadline).toISOString(),
        total_marks: parseInt(totalMarks, 10)
      });
      showToast('success', 'Assignment Created', 'Students have been notified of the new assessment task.');
      setIsCreateModalOpen(false);
      setTitle('');
      setDescription('');
      loadAssignments();
    } catch (err: any) {
      showToast('error', 'Creation Failed', err.message);
    }
  };

  const handleSubmitAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionModalAsg || !submissionUrl) return;

    try {
      await api.submitAssignment(submissionModalAsg._id, submissionUrl);
      showToast('success', 'Assignment Submitted!', 'Your solution has been sent to faculty for grading.');
      setSubmissionModalAsg(null);
      setSubmissionUrl('');
      loadAssignments();
    } catch (err: any) {
      showToast('error', 'Submission Failed', err.message);
    }
  };

  const handleOpenGrading = async (asgId: string) => {
    setSelectedAsgForGrading(asgId);
    try {
      const res = await api.getSubmissions(asgId);
      setSubmissionsList(res.submissions || []);
    } catch (err: any) {
      showToast('error', 'Failed to fetch submissions', err.message);
    }
  };

  const handleGradeSubmission = async (submissionId: string) => {
    const grade = gradeInput[submissionId];
    const feedback = feedbackInput[submissionId] || 'Good effort.';
    if (!grade) {
      showToast('warning', 'Input Required', 'Please enter marks before grading.');
      return;
    }

    try {
      await api.gradeSubmission(submissionId, parseInt(grade, 10), feedback);
      showToast('success', 'Graded Successfully', `Recorded ${grade} marks with feedback.`);
      if (selectedAsgForGrading) {
        handleOpenGrading(selectedAsgForGrading);
      }
    } catch (err: any) {
      showToast('error', 'Grading error', err.message);
    }
  };

  const canCreate = role === 'faculty' || role === 'admin';

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-brand-400" />
            Assignments & Assessments Portal
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Submit coursework, track rubric deadlines, and manage grading feedback.
          </p>
        </div>

        {canCreate && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Create Assignment
          </button>
        )}
      </div>

      {/* Assignment List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {assignments.map(asg => (
          <div
            key={asg._id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="px-2 py-0.5 rounded bg-brand-500/10 text-brand-300 text-[10px] font-bold">
                  {asg.class_name}
                </span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3 text-amber-400" />
                  Due: {new Date(asg.deadline).toLocaleDateString()}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-100 mt-2">{asg.title}</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-3">
                {asg.description}
              </p>
            </div>

            {/* Submission / Status Footer */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500">Max Score: {asg.total_marks || 100} Marks</span>
                {asg.my_submission && (
                  <p className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {asg.my_submission.status === 'graded'
                      ? `Graded: ${asg.my_submission.grade}/${asg.total_marks || 100}`
                      : 'Submitted'}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {canCreate ? (
                  <button
                    onClick={() => handleOpenGrading(asg._id)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700"
                  >
                    Grade Submissions
                  </button>
                ) : (
                  <button
                    onClick={() => setSubmissionModalAsg(asg)}
                    className="px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-sm"
                  >
                    {asg.my_submission ? 'Resubmit' : 'Submit Work'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Assignment Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Create New Coursework Assessment</h3>

            <form onSubmit={handleCreateAssignment} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Subject</label>
                <select
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                >
                  <option value="cls_cs301">Data Structures & Algorithms (CS301)</option>
                  <option value="cls_cs305">AI & Computer Vision Biometrics (CS305)</option>
                  <option value="cls_cs310">Database Systems & NoSQL Atlas (CS310)</option>
                  <option value="cls_cs320">Cloud & Distributed Computing (CS320)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Assignment Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Lab 4: CLAHE Facial Verification Pipeline"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Instructions & Rubric</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide detailed submission requirements..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Deadline Date</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold"
                >
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Submit Modal */}
      {submissionModalAsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Submit Work</h3>
            <p className="text-xs text-slate-400">{submissionModalAsg.title}</p>

            <form onSubmit={handleSubmitAssignment} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Repository URL / Cloud Document Link</label>
                <input
                  type="url"
                  placeholder="https://github.com/your-username/solution-repo"
                  value={submissionUrl}
                  onChange={(e) => setSubmissionUrl(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setSubmissionModalAsg(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold"
                >
                  Confirm Submission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Faculty Grading Modal */}
      {selectedAsgForGrading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Submission Review & Grading Queue</h3>
              <button onClick={() => setSelectedAsgForGrading(null)} className="text-xs text-slate-400 hover:text-white">Close</button>
            </div>

            {submissionsList.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center">No student submissions received yet for this task.</p>
            ) : (
              <div className="space-y-3">
                {submissionsList.map(sub => (
                  <div key={sub._id} className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-100">{sub.student_name}</h4>
                        <a href={sub.file_url} target="_blank" rel="noreferrer" className="text-[11px] text-brand-400 hover:underline flex items-center gap-1 mt-0.5">
                          View Code / Solution Document <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        sub.status === 'graded' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {sub.status === 'graded' ? `Score: ${sub.grade}` : 'Pending Grade'}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Marks"
                        value={gradeInput[sub._id] !== undefined ? gradeInput[sub._id] : (sub.grade?.toString() || '')}
                        onChange={(e) => setGradeInput(prev => ({ ...prev, [sub._id]: e.target.value }))}
                        className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100"
                      />
                      <input
                        type="text"
                        placeholder="Feedback note..."
                        value={feedbackInput[sub._id] !== undefined ? feedbackInput[sub._id] : (sub.feedback || '')}
                        onChange={(e) => setFeedbackInput(prev => ({ ...prev, [sub._id]: e.target.value }))}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100"
                      />
                      <button
                        onClick={() => handleGradeSubmission(sub._id)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shrink-0"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
