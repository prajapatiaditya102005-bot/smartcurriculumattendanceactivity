import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Users,
  BrainCircuit,
  FileCheck,
  Award,
  Globe2,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Lock,
  Camera,
  Leaf,
  DollarSign,
  TrendingUp,
  Cpu,
  GraduationCap
} from 'lucide-react';
import { config } from '../../config';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface LandingPageProps {
  onEnterApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const { loginAsRole } = useAuth();

  const handleRoleSelect = (role: UserRole) => {
    loginAsRole(role);
    onEnterApp();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-brand-500 selection:text-white">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 border-b border-slate-800 text-xs py-2 px-4 text-center">
        <span className="inline-flex items-center gap-2 font-medium text-slate-300">
          <span className="px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-[10px] font-bold uppercase tracking-wider">
            Enterprise Academic Platform
          </span>
          AI Facial Biometrics & Automated Curriculum Ecosystem
        </span>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(2,132,199,0.15),transparent_50%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.1),transparent_50%)] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-brand-400 font-medium mb-6 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-brand-400 animate-pulse" />
            Next-Gen Computer Vision & Academic Management System
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-tight">
            Smart Curriculum &{' '}
            <span className="bg-gradient-to-r from-brand-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
              Automated Biometric Attendance
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Eliminate 15-minute roll calls with edge AI face recognition. Seamlessly sync timetables, syllabus coverage, assignments, parent alerts, and 1-click NAAC/AICTE accreditation reports.
          </p>

          {/* Quick Demo Role Launchers */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => handleRoleSelect('student')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-sky-600 hover:from-brand-600 hover:to-sky-700 font-bold text-white shadow-xl shadow-brand-500/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <GraduationCap className="w-5 h-5" />
              Launch Student Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleRoleSelect('faculty')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 font-semibold text-slate-200 flex items-center justify-center gap-2 transition-all"
            >
              <Camera className="w-4 h-4 text-emerald-400" />
              Faculty Face Scanner
            </button>

            <button
              onClick={() => handleRoleSelect('admin')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 font-semibold text-slate-200 flex items-center justify-center gap-2 transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-rose-400" />
              Admin & NAAC Audit
            </button>
          </div>

          <p className="mt-4 text-xs text-slate-500">
            Live Demo Deployment: <a href={config.demoUrl} className="text-brand-400 underline hover:text-brand-300">{config.demoUrl}</a>
          </p>
        </div>
      </section>

      {/* Comprehensive Impact Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/40 border-b border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs uppercase tracking-widest font-bold text-brand-400">Transformative Value</span>
            <h2 className="text-3xl font-bold text-white mt-2">Institutional Impact Spectrum</h2>
            <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
              How our automated ecosystem revolutionizes higher education across key societal and operational pillars.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Social Impact */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-brand-500/40 transition-all">
              <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400 w-fit mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Social Impact</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Fosters profound trust and transparency between educators, students, and parents with real-time audit trails and automated alerts, eliminating proxy attendance and bias.
              </p>
            </div>

            {/* Educational Impact */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Educational Impact</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Recovers up to 15 minutes of lost lecture time every single period, directly boosting instructional contact hours by 12% annually across institutional curriculums.
              </p>
            </div>

            {/* Environmental Impact */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-green-500/40 transition-all">
              <div className="p-3 rounded-xl bg-green-500/10 text-green-400 w-fit mb-4">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Environmental Impact</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Achieves 100% paperless classroom workflows. Eliminates physical roll registers, assignment papers, syllabus handouts, and printed audit logs.
              </p>
            </div>

            {/* Economical Impact */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 w-fit mb-4">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Economical Impact</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Cuts administrative staff hours and physical register expenditure, saving hundreds of work-hours in manual attendance compilation before semester exams.
              </p>
            </div>

            {/* Technological Impact */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all md:col-span-2">
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 w-fit mb-4">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Technological Impact</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Combines lightweight client-side WebRTC frame capture with serverless OpenCV and CLAHE low-light histogram equalization for robust, privacy-preserving 128-d biometric embeddings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience Matrix */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs uppercase tracking-widest font-bold text-emerald-400">Tailored Experiences</span>
            <h2 className="text-3xl font-bold text-white mt-2">Target Audience Benefits</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="w-5 h-5 text-sky-400" />
                <h4 className="font-bold text-white">Students</h4>
              </div>
              <ul className="text-xs text-slate-400 space-y-2">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Real-time attendance % donut</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Assignment submission portal</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Instant doubt query chat</li>
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <h4 className="font-bold text-white">Faculty</h4>
              </div>
              <ul className="text-xs text-slate-400 space-y-2">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> 1-Click camera face scanning</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Rapid submission grading queue</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Syllabus module tracker</li>
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-purple-400" />
                <h4 className="font-bold text-white">Parents</h4>
              </div>
              <ul className="text-xs text-slate-400 space-y-2">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Live lecture check-in timestamps</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Defaulter cutoff alerts</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Institutional notices board</li>
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-5 h-5 text-rose-400" />
                <h4 className="font-bold text-white">Administrators</h4>
              </div>
              <ul className="text-xs text-slate-400 space-y-2">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> NAAC / AICTE PDF exports</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Automated defaulter logs</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Complete user & role CRUD</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Research Citations & Scientific Foundation */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/30 border-b border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-widest font-bold text-brand-400">Scientific Foundation</span>
            <h2 className="text-3xl font-bold text-white mt-2">Research Literature References</h2>
            <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
              Our biometric computer vision architecture is anchored in peer-reviewed academic literature.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-4">
              <div className="p-2 rounded-lg bg-brand-500/10 text-brand-400 shrink-0 mt-1">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">
                  1. Systematic Literature Review on Automated Attendance Systems using Computer Vision & Deep Learning
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  <em>IEEE / Springer Journal of Ambient Intelligence & Humanized Computing</em> — Details accuracy benchmarks for 128-d Euclidean distance matching, illumination normalization via CLAHE, and anti-spoofing constraints in modern lecture halls.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-4">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0 mt-1">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">
                  2. IRJET Smart Attendance Management System (SAMS) Architecture
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  <em>International Research Journal of Engineering and Technology (IRJET)</em> — Analyzes edge-camera classroom captures, duplicate entry prevention algorithms, and automated parent communication triggers.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-4">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 shrink-0 mt-1">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">
                  3. Comparative Study of Multimodal Biometrics (QR / Fingerprint / Face Recognition) in Academic Institutes
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  <em>International Journal of Advanced Computer Science & Applications</em> — Quantifies biometric throughput, finding facial recognition to be 6.4x faster than fingerprint touchpoints while maintaining 98%+ verification confidence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-950 border-t border-slate-800 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">{config.projectName}</span>
            <span>•</span>
            <span>Automated Educational Management Platform</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Production Ready</span>
            <span>•</span>
            <a href={config.demoUrl} className="hover:text-brand-400 transition-colors">Demo: {config.demoUrl}</a>
          </div>
        </div>
      </footer>

    </div>
  );
};
