import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { config } from '../../config';
import { RoleLoginModal } from '../auth/RoleLoginModal';
import {
  LogIn,
  LogOut,
  User,
  Layers,
  GraduationCap,
  BookOpen,
  Users,
  ShieldCheck
} from 'lucide-react';

interface NavbarProps {
  activeTab?: string;
  onOpenLoginModal?: (role?: UserRole) => void;
}

const ROLES_LIST: Array<{
  id: UserRole;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  activeBg: string;
  activeBorder: string;
  activeText: string;
  dotColor: string;
}> = [
  {
    id: 'student',
    label: 'Student',
    icon: GraduationCap,
    activeBg: 'bg-sky-500/15',
    activeBorder: 'border-sky-500/50',
    activeText: 'text-sky-300',
    dotColor: 'bg-sky-400'
  },
  {
    id: 'faculty',
    label: 'Faculty',
    icon: BookOpen,
    activeBg: 'bg-emerald-500/15',
    activeBorder: 'border-emerald-500/50',
    activeText: 'text-emerald-300',
    dotColor: 'bg-emerald-400'
  },
  {
    id: 'parent',
    label: 'Parent',
    icon: Users,
    activeBg: 'bg-purple-500/15',
    activeBorder: 'border-purple-500/50',
    activeText: 'text-purple-300',
    dotColor: 'bg-purple-400'
  },
  {
    id: 'admin',
    label: 'Admin',
    icon: ShieldCheck,
    activeBg: 'bg-rose-500/15',
    activeBorder: 'border-rose-500/50',
    activeText: 'text-rose-300',
    dotColor: 'bg-rose-400'
  }
];

export const Navbar: React.FC<NavbarProps> = () => {
  const { user, role, logout } = useAuth();
  const [selectedRoleForLogin, setSelectedRoleForLogin] = useState<UserRole | null>(null);

  const getRoleBadge = () => {
    switch (role) {
      case 'student':
        return { label: 'Student', bg: 'bg-sky-500/10 text-sky-400 border-sky-500/30', icon: <GraduationCap className="w-3.5 h-3.5" /> };
      case 'faculty':
        return { label: 'Faculty', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', icon: <BookOpen className="w-3.5 h-3.5" /> };
      case 'parent':
        return { label: 'Parent', bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30', icon: <Users className="w-3.5 h-3.5" /> };
      case 'admin':
        return { label: 'Administrator', bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30', icon: <ShieldCheck className="w-3.5 h-3.5" /> };
      default:
        return null;
    }
  };

  const badge = getRoleBadge();

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2.5 text-left">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-brand-500/20">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-white tracking-tight block">
                  {config.projectName}
                </span>
                <p className="text-[11px] text-slate-400">Smart Academic Portal</p>
              </div>
            </div>
          </div>

          {/* Center Navigation: Student, Faculty, Parent, Admin Role Portals */}
          <nav className="flex items-center bg-slate-950/70 border border-slate-800 rounded-2xl p-1 shadow-inner overflow-x-auto max-w-full">
            <div className="flex items-center gap-1">
              {ROLES_LIST.map((r) => {
                const IconComponent = r.icon;
                const isActive = role === r.id;

                return (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRoleForLogin(r.id)}
                    className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? `${r.activeBg} ${r.activeBorder} ${r.activeText} border shadow-sm`
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                    }`}
                    title={`Click to login or switch to ${r.label} Portal`}
                  >
                    <IconComponent className="w-3.5 h-3.5 shrink-0" />
                    <span>{r.label}</span>
                    {isActive && (
                      <span className={`w-1.5 h-1.5 rounded-full ${r.dotColor} animate-pulse shrink-0 ml-0.5`} />
                    )}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Right Section: Clear until user logs in; shows Login arrow, then becomes profile + Logout arrow */}
          <div className="flex items-center gap-3 shrink-0">

            {user && badge ? (
              /* LOGGED IN STATE: Show Role Badge, User Info, and Logout arrow [-> */
              <div className="flex items-center gap-3">
                {/* Role Badge */}
                <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${badge.bg}`}>
                  {badge.icon}
                  <span>{badge.label}</span>
                </div>

                {/* User Pill */}
                <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                    alt={user.name || 'User'}
                    className="w-8 h-8 rounded-full border border-slate-700 object-cover"
                  />
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-semibold text-slate-200 leading-none">{user.name}</p>
                    <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{user.department || user.email}</p>
                  </div>

                  {/* Arrow becomes Logout button when logged in */}
                  <button
                    onClick={logout}
                    title="Sign Out / Logout"
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors ml-1"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* LOGGED OUT STATE: Clear space with direct Login arrow button */
              <button
                onClick={() => setSelectedRoleForLogin('student')}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-600/20 transition-all"
                title="Click to Sign In or Create Account"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </button>
            )}

          </div>

        </div>
      </header>

      {/* Role Login / Sign Up Modal */}
      {selectedRoleForLogin && (
        <RoleLoginModal
          isOpen={!!selectedRoleForLogin}
          selectedRole={selectedRoleForLogin}
          onClose={() => setSelectedRoleForLogin(null)}
        />
      )}
    </>
  );
};
