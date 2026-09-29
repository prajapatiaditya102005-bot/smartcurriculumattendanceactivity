import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { IClass, ICurriculum } from '../../types';
import {
  Calendar,
  BookOpen,
  CheckCircle,
  FileText,
  Video,
  ExternalLink,
  Layers,
  Clock,
  Sparkles
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export const CurriculumView: React.FC = () => {
  const { role } = useAuth();
  const { showToast } = useNotification();
  const [classes, setClasses] = useState<IClass[]>([]);
  const [curricula, setCurricula] = useState<ICurriculum[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('cls_cs301');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const schedRes = await api.getSchedules();
        setClasses(schedRes.classes || []);

        const curRes = await api.getCurriculum();
        setCurricula(curRes.curricula || []);
      } catch (err) {
        console.warn('Curriculum fetch error', err);
      }
    };

    fetchData();
  }, []);

  const currentCurriculum = curricula.find(c => c.class_id === selectedClassId) || curricula[0];
  const currentClass = classes.find(c => c._id === selectedClassId) || classes[0];

  const handleToggleModule = async (curriculumId: string, moduleNumber: number, currentCompleted: boolean) => {
    if (role !== 'faculty' && role !== 'admin') {
      showToast('warning', 'Access Restricted', 'Only faculty members and admins can update syllabus completion.');
      return;
    }

    try {
      await api.updateModuleStatus(curriculumId, moduleNumber, !currentCompleted);
      showToast('success', 'Syllabus Updated', `Module #${moduleNumber} marked as ${!currentCompleted ? 'Completed' : 'In Progress'}.`);
      const curRes = await api.getCurriculum();
      setCurricula(curRes.curricula || []);
    } catch (err: any) {
      showToast('error', 'Update Failed', err.message);
    }
  };

  const completedModules = currentCurriculum?.syllabus.filter(m => m.completed).length || 0;
  const totalModules = currentCurriculum?.syllabus.length || 1;
  const progressPercent = Math.round((completedModules / totalModules) * 100);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-400" />
            Curriculum & Class Timetable
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time syllabus milestone tracking, weekly schedule, and resource repository.
          </p>
        </div>

        {/* Course Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Select Subject:</span>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
          >
            {classes.map(c => (
              <option key={c._id} value={c._id}>
                {c.code} - {c.subject}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Progress & Class Details Strip */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Current Course</span>
          <h3 className="text-lg font-bold text-white mt-1">{currentClass?.subject}</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Room: {currentClass?.room} • Faculty: {currentClass?.faculty_name || 'Dr. Sarah Jenkins'}
          </p>
        </div>

        <div>
          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Weekly Schedule</span>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {currentClass?.schedule.map((s, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300">
                {s.day.slice(0, 3)}: {s.startTime} - {s.endTime}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-slate-300">Syllabus Completion</span>
            <span className="font-bold text-emerald-400">{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            {completedModules} of {totalModules} Modules Covered
          </span>
        </div>
      </div>

      {/* Grid: Syllabus Modules + Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Modules List */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-400" />
              Syllabus Structure & Topics
            </h3>
            <span className="text-xs text-slate-400">NAAC Aligned Curriculum</span>
          </div>

          <div className="space-y-3">
            {currentCurriculum?.syllabus.map(mod => (
              <div
                key={mod.module_number}
                className={`p-4 rounded-xl border transition-all ${
                  mod.completed
                    ? 'bg-emerald-950/20 border-emerald-900/40'
                    : 'bg-slate-800/60 border-slate-700/60'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleModule(currentCurriculum._id, mod.module_number, mod.completed)}
                      className={`p-1 rounded-lg border transition-all mt-0.5 ${
                        mod.completed
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                          : 'bg-slate-700 border-slate-600 text-slate-400 hover:text-white'
                      }`}
                      title={role === 'faculty' || role === 'admin' ? 'Click to toggle status' : 'Completion indicator'}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <div>
                      <h4 className="text-xs font-bold text-slate-100">
                        Module {mod.module_number}: {mod.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Allocated: {mod.hours_allocated} Teaching Hours
                      </p>
                    </div>
                  </div>

                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    mod.completed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-400'
                  }`}>
                    {mod.completed ? 'Completed' : 'Pending'}
                  </span>
                </div>

                <div className="mt-3 pl-8 flex flex-wrap gap-1.5">
                  {mod.topics.map((t, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-900/80 text-slate-300 border border-slate-800">
                      • {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resources Vault */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            Course Resource Vault
          </h3>

          <div className="space-y-3">
            {currentCurriculum?.resources.map((res, idx) => (
              <a
                key={idx}
                href={res.url}
                target="_blank"
                rel="noreferrer"
                className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between hover:border-brand-500/40 group transition-all"
              >
                <div className="flex items-center gap-2.5">
                  {res.type === 'pdf' && <FileText className="w-4 h-4 text-rose-400" />}
                  {res.type === 'video' && <Video className="w-4 h-4 text-sky-400" />}
                  {res.type === 'link' && <ExternalLink className="w-4 h-4 text-emerald-400" />}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200 group-hover:text-brand-300 transition-colors">
                      {res.title}
                    </h4>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400">{res.type} document</span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
              </a>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
