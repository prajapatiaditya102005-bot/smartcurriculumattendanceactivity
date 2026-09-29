import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { Navbar } from './components/ui/Navbar';
import { Sidebar } from './components/ui/Sidebar';
import { RoleLoginModal } from './components/auth/RoleLoginModal';
import { UserRole } from './types';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { FacultyDashboard } from './components/dashboard/FacultyDashboard';
import { ParentDashboard } from './components/dashboard/ParentDashboard';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { CurriculumView } from './components/curriculum/CurriculumView';
import { AssignmentHub } from './components/assignments/AssignmentHub';
import { AttendanceHub } from './components/attendance/AttendanceHub';
import { QueriesHub } from './components/queries/QueriesHub';
import { AnnouncementsHub } from './components/announcements/AnnouncementsHub';
import { ReportsHub } from './components/reports/ReportsHub';
import { SupportHub } from './components/ui/SupportHub';
import {
  GraduationCap,
  BookOpen,
  Users,
  ShieldCheck,
  LogIn,
  Layers,
  ArrowRight
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { user, role } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [loginModalRole, setLoginModalRole] = useState<UserRole | null>(null);

  const renderContent = () => {
    // If not logged in, show clean institutional portal entry
    if (!user || !role) {
      return (
        <div className="py-12 px-4 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-brand-500/10 text-brand-300 border border-brand-500/30">
              <Layers className="w-3.5 h-3.5" />
              Smart Curriculum & Automated Biometric Attendance
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Select Your Portal to Sign In
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
              Please sign in with your institutional credentials or create a new account to enter your dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => setLoginModalRole('student')}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-900 transition-all text-left group shadow-lg"
            >
              <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 w-fit mb-3 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors flex items-center justify-between">
                <span>Student</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">Lecture schedules, attendance donut & doubt forum</p>
            </button>

            <button
              onClick={() => setLoginModalRole('faculty')}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 transition-all text-left group shadow-lg"
            >
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 w-fit mb-3 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors flex items-center justify-between">
                <span>Faculty</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">WebRTC face scanner & assignment evaluation</p>
            </button>

            <button
              onClick={() => setLoginModalRole('parent')}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-900 transition-all text-left group shadow-lg"
            >
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 w-fit mb-3 group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors flex items-center justify-between">
                <span>Parent</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">Real-time attendance logs & circular notices</p>
            </button>

            <button
              onClick={() => setLoginModalRole('admin')}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-rose-500/50 hover:bg-slate-900 transition-all text-left group shadow-lg"
            >
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 w-fit mb-3 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors flex items-center justify-between">
                <span>Admin</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">User administration & NAAC/AICTE reports</p>
            </button>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => setLoginModalRole('student')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 font-bold text-xs text-white shadow-lg shadow-brand-500/25 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In / Create Account</span>
            </button>
          </div>
        </div>
      );
    }

    // Authenticated views
    switch (activeTab) {
      case 'dashboard':
        if (role === 'student') return <StudentDashboard onNavigate={setActiveTab} />;
        if (role === 'faculty') return <FacultyDashboard onNavigate={setActiveTab} />;
        if (role === 'parent') return <ParentDashboard onNavigate={setActiveTab} />;
        return <AdminDashboard />;

      case 'attendance':
        return <AttendanceHub />;

      case 'schedules':
        return <CurriculumView />;

      case 'assignments':
        return <AssignmentHub />;

      case 'queries':
        return <QueriesHub />;

      case 'announcements':
        return <AnnouncementsHub />;

      case 'reports':
        return <ReportsHub />;

      case 'users':
        return <AdminDashboard />;

      case 'support':
        return <SupportHub />;

      default:
        return <StudentDashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-brand-500 selection:text-white">
      {/* Primary Clean Navbar with integrated Role login buttons */}
      <Navbar activeTab={activeTab} />

      {/* App Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {user && role && (
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
        
        {/* Main Content Area */}
        <main className={`flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto ${user ? 'max-w-5xl' : 'max-w-7xl'} w-full`}>
          {renderContent()}
        </main>
      </div>

      {/* Global Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <span>Smart Curriculum & Attendance App • Educational Institution Portal</span>
        </div>
      </footer>

      {/* Login Modal for Landing Selection */}
      {loginModalRole && (
        <RoleLoginModal
          isOpen={!!loginModalRole}
          selectedRole={loginModalRole}
          onClose={() => setLoginModalRole(null)}
        />
      )}
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <MainAppContent />
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
