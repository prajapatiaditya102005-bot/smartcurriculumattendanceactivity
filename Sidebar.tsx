import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  Camera,
  FileCheck,
  MessageSquare,
  Bell,
  BarChart3,
  Users,
  HelpCircle
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { role } = useAuth();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      roles: ['student', 'faculty', 'parent', 'admin']
    },
    {
      id: 'attendance',
      label: role === 'parent' ? 'Child Attendance' : 'Attendance Hub',
      icon: <Camera className="w-4 h-4" />,
      roles: ['student', 'faculty', 'parent', 'admin']
    },
    {
      id: 'schedules',
      label: 'Schedules & Syllabus',
      icon: <Calendar className="w-4 h-4" />,
      roles: ['student', 'faculty', 'admin']
    },
    {
      id: 'assignments',
      label: role === 'faculty' ? 'Assignments & Grading' : 'Assignments',
      icon: <FileCheck className="w-4 h-4" />,
      roles: ['student', 'faculty', 'admin']
    },
    {
      id: 'queries',
      label: role === 'faculty' ? 'Student Doubts Inbox' : 'Academic Doubts',
      icon: <MessageSquare className="w-4 h-4" />,
      roles: ['student', 'faculty', 'admin']
    },
    {
      id: 'announcements',
      label: 'Announcements',
      icon: <Bell className="w-4 h-4" />,
      roles: ['student', 'faculty', 'parent', 'admin']
    },
    {
      id: 'reports',
      label: 'NAAC / AICTE Reports',
      icon: <BarChart3 className="w-4 h-4" />,
      roles: ['admin']
    },
    {
      id: 'users',
      label: 'User Management',
      icon: <Users className="w-4 h-4" />,
      roles: ['admin']
    },
    {
      id: 'support',
      label: 'Support & Feedback',
      icon: <HelpCircle className="w-4 h-4" />,
      roles: ['student', 'faculty', 'parent', 'admin']
    }
  ];

  const visibleItems = navItems.filter(item => item.roles.includes(role || 'student'));

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col justify-between shrink-0 hidden md:flex">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Navigation Menu
        </div>

        {visibleItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
