import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { GraduationCap, BookOpen, Users, ShieldAlert, Sparkles } from 'lucide-react';

export const RoleQuickSwitcher: React.FC = () => {
  const { role, loginAsRole, isLoading } = useAuth();

  const roles: { key: UserRole; label: string; icon: React.ReactNode; color: string; desc: string }[] = [
    {
      key: 'student',
      label: 'Student',
      icon: <GraduationCap className="w-4 h-4" />,
      color: 'hover:border-sky-400 hover:text-sky-400',
      desc: 'John Doe (CS301/305)'
    },
    {
      key: 'faculty',
      label: 'Faculty',
      icon: <BookOpen className="w-4 h-4" />,
      color: 'hover:border-emerald-400 hover:text-emerald-400',
      desc: 'Dr. Sarah Jenkins'
    },
    {
      key: 'parent',
      label: 'Parent',
      icon: <Users className="w-4 h-4" />,
      color: 'hover:border-purple-400 hover:text-purple-400',
      desc: 'Robert Doe (Child: John)'
    },
    {
      key: 'admin',
      label: 'Admin',
      icon: <ShieldAlert className="w-4 h-4" />,
      color: 'hover:border-rose-400 hover:text-rose-400',
      desc: 'Dean Dr. Arushi'
    }
  ];

  return (
    <div className="bg-slate-900/95 border-b border-slate-800 px-4 py-2 text-slate-200">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gradient-to-r from-brand-500/20 to-sky-500/20 border border-brand-500/30 text-brand-300 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Quick Role Switcher:
          </span>
          <span className="text-slate-400 hidden sm:inline">1-Click Test Any User Role</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {roles.map(r => {
            const isActive = role === r.key;
            return (
              <button
                key={r.key}
                onClick={() => loginAsRole(r.key)}
                disabled={isLoading}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30 font-semibold'
                    : `bg-slate-800/80 text-slate-300 border border-slate-700/60 ${r.color} hover:bg-slate-800`
                }`}
                title={r.desc}
              >
                {r.icon}
                <span>{r.label}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
