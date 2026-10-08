import React, { useEffect, useState } from 'react';
import { AlertTriangle, ShieldAlert, Filter, CheckCircle2, UserCheck, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { EarlyWarningItem } from '../types';

interface EarlyWarningPageProps {
  selectedCourse: string;
  onSelectStudent: (id: number) => void;
}

export const EarlyWarningPage: React.FC<EarlyWarningPageProps> = ({ selectedCourse, onSelectStudent }) => {
  const [warnings, setWarnings] = useState<EarlyWarningItem[]>([]);
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getEarlyWarning(selectedCourse, priorityFilter)
      .then(res => {
        setWarnings(res);
        setLoading(false);
      })
      .catch(err => {
        console.error("Early warning fetch error:", err);
        setLoading(false);
      });
  }, [selectedCourse, priorityFilter]);

  const getCategoryBadge = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5" />
            CRITICAL
          </span>
        );
      case 'High Priority':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-300 border border-orange-500/40">
            <AlertTriangle className="w-3.5 h-3.5" />
            HIGH PRIORITY
          </span>
        );
      case 'Monitor':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            MONITOR
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            STABLE
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/30 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 text-rose-300 px-3 py-1 rounded-full text-xs font-semibold mb-2">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            FACULTY EARLY WARNING SYSTEM
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white font-outfit tracking-tight">
            Early Warning & Intervention Queue
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Automated priority matrix identifying students requiring urgent academic counseling, attendance intervention, or remedial support.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Filter className="w-3.5 h-3.5 text-indigo-400" />
            <span>Priority Filter:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="All">All Priority Categories</option>
              <option value="Critical">🚨 Critical Priority</option>
              <option value="High Priority">⚠️ High Priority</option>
              <option value="Monitor">🟡 Monitor</option>
              <option value="Stable">🟢 Stable</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-400">
          Showing <span className="font-bold text-slate-200">{warnings.length}</span> students requiring review
        </div>
      </div>

      {/* Early Warning Table */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold border-b border-slate-700/80">
              <tr>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Course & Sem</th>
                <th className="py-3.5 px-4 text-center">Priority</th>
                <th className="py-3.5 px-4 text-right">Attendance</th>
                <th className="py-3.5 px-4 text-right">GPA</th>
                <th className="py-3.5 px-4 text-right">Risk Score</th>
                <th className="py-3.5 px-4">Main Risk Factor</th>
                <th className="py-3.5 px-4">Recommended Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin inline-block mr-2"></div>
                    Loading Early Warning Queue...
                  </td>
                </tr>
              ) : warnings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No students match the selected priority filter.
                  </td>
                </tr>
              ) : (
                warnings.map((w) => (
                  <tr
                    key={w.student_id}
                    onClick={() => onSelectStudent(w.student_id)}
                    className="hover:bg-slate-700/40 transition cursor-pointer group"
                  >
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-semibold text-slate-100 group-hover:text-indigo-300 transition">
                          {w.student_name}
                        </p>
                        <span className="font-mono text-[10px] text-slate-400">ID #{w.student_id}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {w.course}
                      <span className="block text-[10px] text-slate-400">Sem {w.semester}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">{getCategoryBadge(w.priority)}</td>
                    <td className={`py-3.5 px-4 text-right font-semibold ${w.attendance < 75 ? 'text-rose-400' : 'text-slate-200'}`}>
                      {w.attendance}%
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-medium">{w.gpa.toFixed(2)}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-100">{w.risk_score.toFixed(1)}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-rose-300 font-medium text-[11px]">
                        {w.main_risk_factor}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 max-w-xs leading-snug">
                      {w.recommended_action}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
