import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { IDefaulterReport, IAttendance } from '../../types';
import {
  BarChart3,
  FileDown,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  FileText,
  Clock,
  Sparkles,
  TrendingUp,
  Printer
} from 'lucide-react';
import { exportNAACReportPDF, exportDefaultersCSV } from '../../services/exportPdf';
import { useNotification } from '../../context/NotificationContext';

export const ReportsHub: React.FC = () => {
  const { role } = useAuth();
  const { showToast } = useNotification();
  const [defaulters, setDefaulters] = useState<IDefaulterReport[]>([]);
  const [naacData, setNaacData] = useState<any>(null);
  const [attendanceLogs, setAttendanceLogs] = useState<IAttendance[]>([]);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const defRes = await api.getDefaultersReport();
        setDefaulters(defRes.defaulters || []);

        const naacRes = await api.getNAACSummary();
        setNaacData(naacRes);

        const attRes = await api.getAttendanceReport();
        setAttendanceLogs(attRes.records || []);
      } catch (err: any) {
        console.warn('Reports load error', err);
      }
    };

    loadReports();
  }, []);

  const handleDownloadPDF = () => {
    try {
      exportNAACReportPDF(naacData, defaulters, attendanceLogs);
      showToast('success', 'NAAC PDF Exported', 'Official accreditation compliance document generated.');
    } catch (err: any) {
      showToast('error', 'Export Failed', err.message);
    }
  };

  const handleDownloadCSV = () => {
    try {
      exportDefaultersCSV(defaulters);
      showToast('success', 'CSV Spreadsheet Exported', 'Defaulter list downloaded for offline parent dispatch.');
    } catch (err: any) {
      showToast('error', 'CSV Error', err.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-rose-400" />
            NAAC / AICTE Statutory Attendance & Audit Generator
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Criterion 2.3 Teaching-Learning metrics, AI biometric audit logs, and defaulter tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-sky-600 hover:from-brand-500 hover:to-sky-500 text-white font-bold text-xs shadow-lg shadow-brand-500/20 transition-all"
          >
            <Printer className="w-4 h-4" />
            Download Official NAAC PDF
          </button>

          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
          >
            <FileDown className="w-4 h-4" />
            Export Defaulters CSV
          </button>
        </div>
      </div>

      {/* KPI Criteria Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-brand-400">NAAC Criterion 2.3</span>
            <ShieldCheck className="w-4 h-4 text-brand-400" />
          </div>
          <h3 className="text-sm font-bold text-white">Teaching-Learning Process</h3>
          <p className="text-xs text-slate-400">
            Biometric verification adoption: <strong className="text-emerald-400">96.8%</strong> across all departments.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-emerald-400">AICTE Norm 75%</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className="text-sm font-bold text-white">Aggregate Attendance Rate</h3>
          <p className="text-xs text-slate-400">
            Current Institutional Average: <strong className="text-white">91.4%</strong> (Compliant).
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-rose-400">UGC Defaulters</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <h3 className="text-sm font-bold text-white">Flagged Students</h3>
          <p className="text-xs text-slate-400">
            <strong className="text-rose-400">{defaulters.length} students</strong> currently below 75% attendance threshold.
          </p>
        </div>
      </div>

      {/* Defaulter Records Table */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-200">Statutory Defaulters Ledger (&lt;75% Attendance)</h3>
            <p className="text-xs text-slate-400">Automated Parent Dispatch Status</p>
          </div>
          <span className="text-xs text-rose-400 font-bold">{defaulters.length} Non-Compliant Students</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="p-3 rounded-l-lg">Student Name</th>
                <th className="p-3">Enrollment ID</th>
                <th className="p-3">Attended / Total</th>
                <th className="p-3">Attendance %</th>
                <th className="p-3">Compliance Status</th>
                <th className="p-3 rounded-r-lg">Parent Notice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {defaulters.map(d => (
                <tr key={d.student_id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-3 font-semibold text-slate-200">{d.student_name}</td>
                  <td className="p-3 font-mono text-slate-400">{d.enrollment_no}</td>
                  <td className="p-3">{d.attended_classes} / {d.total_classes} lectures</td>
                  <td className="p-3 font-bold text-rose-400">{d.attendance_percentage}%</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300">
                      Defaulter
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 text-[10px] font-semibold">
                      Dispatched
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
