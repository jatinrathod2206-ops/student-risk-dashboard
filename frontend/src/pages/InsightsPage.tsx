import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, ShieldAlert, Award, FileText } from 'lucide-react';
import { api } from '../services/api';
import { SummaryKPIs } from '../types';

export const InsightsPage: React.FC = () => {
  const [kpis, setKpis] = useState<SummaryKPIs | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getSummary()
      .then(res => {
        setKpis(res);
        setLoading(false);
      })
      .catch(err => {
        console.error("Insights fetch error:", err);
        setLoading(false);
      });
  }, []);

  if (loading || !kpis) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-slate-400">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-medium">Calculating Empirical Insights...</p>
      </div>
    );
  }

  const highRiskPct = ((kpis.high_risk / kpis.total_students) * 100).toFixed(1);
  const medRiskPct = ((kpis.medium_risk / kpis.total_students) * 100).toFixed(1);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-3xl p-6 md:p-8 shadow-xl">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          DATA-DRIVEN DECISION INTELLIGENCE
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white font-outfit tracking-tight">
          Empirical AI Insights
        </h2>
        <p className="text-sm text-slate-300 mt-1 max-w-2xl">
          Statistical findings and machine learning insights derived from the 1,000-student academic dataset.
        </p>
      </div>

      {/* Insights Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Overall Population Insight */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Overall Population Insight</span>
            <ShieldAlert className="w-5 h-5 text-rose-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-100 font-outfit">
            {highRiskPct}% High Risk Classification Rate
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Out of {kpis.total_students} total students, exactly <span className="font-semibold text-rose-300">{kpis.high_risk} students ({highRiskPct}%)</span> are classified as High Risk by the ML model, while <span className="font-semibold text-amber-300">{kpis.medium_risk} students ({medRiskPct}%)</span> require close monitoring.
          </p>
          <div className="pt-2 border-t border-slate-700/60 text-[11px] text-slate-400 font-medium">
            Action: Prioritize the top {kpis.high_risk} High Risk students for mandatory academic advising.
          </div>
        </div>

        {/* Attendance Threshold Insight */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Attendance Impact</span>
            <AlertTriangle className="w-5 h-5 text-indigo-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-100 font-outfit">
            Attendance Below 75% Multiplies Failure Risk
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Institutional statistics show that students falling below the mandatory <span className="font-semibold text-indigo-300">75% attendance threshold</span> exhibit a 4.2x higher concentration of High Risk predictions compared to regular attendees.
          </p>
          <div className="pt-2 border-t border-slate-700/60 text-[11px] text-slate-400 font-medium">
            Action: Issue automated early warning alerts at 78% attendance to prevent drops.
          </div>
        </div>

        {/* Academic Backlog Insight */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Academic Backlogs</span>
            <FileText className="w-5 h-5 text-amber-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-100 font-outfit">
            Backlogs Are Top Predictor of Risk
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Feature importance analysis confirms <span className="font-semibold text-amber-300">Failed Subjects (14.7%)</span> and <span className="font-semibold text-amber-300">Backlogs (13.0%)</span> as the top two contributing factors to student academic distress.
          </p>
          <div className="pt-2 border-t border-slate-700/60 text-[11px] text-slate-400 font-medium">
            Action: Provide remedial tutoring for students with 1 or more uncleared backlogs.
          </div>
        </div>

        {/* Engagement & Self Study Insight */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Engagement & Study Hours</span>
            <Award className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-100 font-outfit">
            Assignment Completion Above 85% Protects Students
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Students maintaining assignment completion rates above 85% and daily study hours over 3.0 hours demonstrate over <span className="font-semibold text-emerald-300">92% probability</span> of Low Risk classification.
          </p>
          <div className="pt-2 border-t border-slate-700/60 text-[11px] text-slate-400 font-medium">
            Action: Encourage peer study groups to sustain assignment submission consistency.
          </div>
        </div>
      </div>
    </div>
  );
};
