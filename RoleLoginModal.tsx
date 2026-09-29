import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import {
  GraduationCap,
  BookOpen,
  Users,
  ShieldCheck,
  Lock,
  Mail,
  User,
  Building,
  ArrowRight,
  X,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  KeyRound,
  IdCard
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

interface RoleLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRole: UserRole;
  onSuccess?: () => void;
}

const ROLE_META: Record<UserRole, {
  name: string;
  portalTitle: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  accent: string;
  tagColor: string;
  description: string;
}> = {
  student: {
    name: 'Student',
    portalTitle: 'Student Portal',
    badge: 'Academic & Attendance Workspace',
    icon: GraduationCap,
    gradient: 'from-sky-500/20 via-blue-500/10 to-transparent',
    accent: 'text-sky-400 border-sky-500/40 bg-sky-500/10',
    tagColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    description: 'Sign in to access lecture schedules, attendance analytics, assignments & doubt forum.'
  },
  faculty: {
    name: 'Faculty',
    portalTitle: 'Faculty Portal',
    badge: 'Instruction & Attendance Control',
    icon: BookOpen,
    gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    accent: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
    tagColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    description: 'Sign in to launch AI face recognition scans, grade submissions & post announcements.'
  },
  parent: {
    name: 'Parent',
    portalTitle: 'Parent Portal',
    badge: 'Ward Tracking & Communications',
    icon: Users,
    gradient: 'from-purple-500/20 via-indigo-500/10 to-transparent',
    accent: 'text-purple-400 border-purple-500/40 bg-purple-500/10',
    tagColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    description: 'Sign in to track real-time attendance percentages, timestamps & institution circulars.'
  },
  admin: {
    name: 'Admin',
    portalTitle: 'Administrator Portal',
    badge: 'Institutional Governance & Audit',
    icon: ShieldCheck,
    gradient: 'from-rose-500/20 via-amber-500/10 to-transparent',
    accent: 'text-rose-400 border-rose-500/40 bg-rose-500/10',
    tagColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    description: 'Sign in to manage curriculum, audit defaulter rosters & export NAAC/AICTE reports.'
  }
};

export const RoleLoginModal: React.FC<RoleLoginModalProps> = ({
  isOpen,
  onClose,
  selectedRole,
  onSuccess
}) => {
  const { login, register, isLoading } = useAuth();
  const { showToast } = useNotification();

  // Mode: 'login' (Sign In) vs 'register' (Create Account)
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [currentRole, setCurrentRole] = useState<UserRole>(selectedRole);

  // Form State - start completely empty
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [enrollmentNo, setEnrollmentNo] = useState('');
  const [linkedStudentId, setLinkedStudentId] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Reset form inputs completely when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentRole(selectedRole);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setName('');
      setEnrollmentNo('');
      setLinkedStudentId('');
      setErrorMsg(null);
      setMode('login');
    }
  }, [isOpen, selectedRole]);

  if (!isOpen) return null;

  const roleMeta = ROLE_META[currentRole] || ROLE_META.student;
  const RoleIcon = roleMeta.icon;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !password) {
      setErrorMsg('Please enter both your email address and password.');
      return;
    }

    try {
      await login(email.trim(), password);
      showToast('success', 'Sign In Successful', `Welcome back to the ${roleMeta.portalTitle}!`);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid email or password. Please check your credentials.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        role: currentRole,
        department: department.trim(),
        enrollment_no: enrollmentNo.trim() || undefined,
        linked_student_id: currentRole === 'parent' ? (linkedStudentId.trim() || undefined) : undefined
      });

      showToast('success', 'Account Created Successfully', `Welcome to ${roleMeta.portalTitle}, ${name.trim()}!`);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. An account with this email may already exist.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col text-slate-100 relative max-h-[90vh]">
        
        {/* Header Banner */}
        <div className={`p-6 bg-gradient-to-b ${roleMeta.gradient} border-b border-slate-800 relative shrink-0`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800/80 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className={`p-3 rounded-2xl border ${roleMeta.accent} shadow-inner`}>
              <RoleIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white tracking-tight">{roleMeta.portalTitle}</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${roleMeta.tagColor}`}>
                  {currentRole}
                </span>
              </div>
              <span className="text-xs text-slate-400 mt-0.5 block">{roleMeta.badge}</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 mt-3 leading-relaxed">
            {roleMeta.description}
          </p>
        </div>

        {/* Tab Switcher: Sign In vs Create Account */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 p-1.5 m-4 mb-2 rounded-2xl shrink-0">
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(null); }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
              mode === 'login'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMsg(null); }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
              mode === 'register'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Create New Account
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="px-6 pb-6 pt-2 overflow-y-auto space-y-4">
          
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-800/80 text-rose-200 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* SIGN IN FORM */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="text-slate-400 hover:text-slate-200 absolute right-3.5 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 font-bold text-xs text-white shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-4"
              >
                {isLoading ? 'Signing In...' : `Sign In to ${roleMeta.portalTitle}`}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center text-xs text-slate-400">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('register'); setErrorMsg(null); }}
                  className="text-brand-400 font-bold hover:underline"
                >
                  Create one now
                </button>
              </div>
            </form>
          ) : (
            /* CREATE ACCOUNT / REGISTER FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              
              {/* Role Selection Segmented Control */}
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5">Registering As</label>
                <div className="grid grid-cols-4 gap-1.5 bg-slate-950/70 p-1 rounded-xl border border-slate-800">
                  {(['student', 'faculty', 'parent', 'admin'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setCurrentRole(r)}
                      className={`py-1.5 text-[11px] font-bold rounded-lg capitalize transition-all ${
                        currentRole === r
                          ? 'bg-brand-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jane Doe"
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Institutional Email */}
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. jane.doe@smartedu.edu"
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Department / Branch */}
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Department / Branch</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Computer Science & Engineering"
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Role Specific Additional Fields */}
              {currentRole === 'student' && (
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Enrollment / Roll No (Optional)</label>
                  <div className="relative">
                    <IdCard className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={enrollmentNo}
                      onChange={(e) => setEnrollmentNo(e.target.value)}
                      placeholder="e.g. ST-2026-CS101 (Auto-assigned if blank)"
                      className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              {currentRole === 'parent' && (
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Linked Student ID or Roll No</label>
                  <div className="relative">
                    <IdCard className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={linkedStudentId}
                      onChange={(e) => setLinkedStudentId(e.target.value)}
                      placeholder="e.g. usr_student_1 or ST-2026-CS001"
                      className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 6 chars"
                      className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Confirm Password</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPassword ? 'Hide Passwords' : 'Show Passwords'}</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-sky-600 hover:from-brand-500 hover:to-sky-500 font-bold text-xs text-white shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-4"
              >
                {isLoading ? 'Creating Account...' : `Create ${roleMeta.name} Account`}
                <CheckCircle2 className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center text-xs text-slate-400">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrorMsg(null); }}
                  className="text-brand-400 font-bold hover:underline"
                >
                  Sign In instead
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
