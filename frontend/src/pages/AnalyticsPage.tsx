import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, BookOpen, Clock, Activity } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { api } from '../services/api';

export const AnalyticsPage: React.FC = () => {
  const [courseData, setCourseData] = useState<any[]>([]);
  const [semesterData, setSemesterData] = useState<any[]>([]);
  const [academicData, setAcademicData] = useState<any[]>([]);
  const [engagementData, setEngagementData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.getCourseAnalysis(),
      api.getSemesterAnalysis(),
      api.getAcademicVsRisk(),
      api.getEngagementVsRisk()
    ]).then(([c, s, a, e]) => {
      setCourseData(c);
      setSemesterData(s);
      setAcademicData(a);
      setEngagementData(e);
      setLoading(false);
    }).catch(err => {
      console.error("Analytics fetch error:", err);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-slate-400">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-medium">Loading Institutional Analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-3xl p-6 md:p-8 shadow-xl">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold mb-2">
          <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
          ADVANCED MULTI-DIMENSIONAL ANALYTICS
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white font-outfit tracking-tight">
          Institutional Risk Analytics
        </h2>
        <p className="text-sm text-slate-300 mt-1 max-w-2xl">
          Comparative performance metrics across academic courses, semester progression, academic performance indicators, and student engagement parameters.
        </p>
      </div>

      {/* Grid 1: Course & Semester Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Course Risk Breakdown */}
        <div className="lg:col-span-6 bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl">
          <h3 className="text-base font-bold text-slate-100 font-outfit flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            Course-Level Risk Concentrations
          </h3>
          <p className="text-xs text-slate-400 mb-4">Percentage of High Risk students across engineering disciplines</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courseData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="course" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit="%" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.75rem' }} />
                <Bar dataKey="high_risk_pct" fill="#EF4444" radius={[4, 4, 0, 0]} name="High Risk %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Semester Analysis */}
        <div className="lg:col-span-6 bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl">
          <h3 className="text-base font-bold text-slate-100 font-outfit flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-emerald-400" />
            Semester Performance Metrics
          </h3>
          <p className="text-xs text-slate-400 mb-4">Average attendance and marks percentage by semester</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={semesterData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="semester" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.75rem' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="avg_attendance" fill="#38BDF8" radius={[4, 4, 0, 0]} name="Avg Attendance %" />
                <Bar dataKey="avg_marks" fill="#6366F1" radius={[4, 4, 0, 0]} name="Avg Marks %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid 2: Academic & Engagement Correlations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Academic Parameters vs Risk */}
        <div className="lg:col-span-6 bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl">
          <h3 className="text-base font-bold text-slate-100 font-outfit flex items-center gap-2 mb-1">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            Academic Parameters vs Risk Classification
          </h3>
          <p className="text-xs text-slate-400 mb-4">Average failed subjects and backlogs by risk category</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={academicData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="risk_level" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.75rem' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="avg_backlogs" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Avg Backlogs" />
                <Bar dataKey="avg_failed" fill="#EF4444" radius={[4, 4, 0, 0]} name="Avg Failed Subjects" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Student Engagement Parameters vs Risk */}
        <div className="lg:col-span-6 bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl">
          <h3 className="text-base font-bold text-slate-100 font-outfit flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-purple-400" />
            Engagement Parameters vs Risk Classification
          </h3>
          <p className="text-xs text-slate-400 mb-4">Daily self-study hours and assignment completion rate</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="risk_level" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.75rem' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="avg_study_hours" fill="#A855F7" radius={[4, 4, 0, 0]} name="Daily Study Hours" />
                <Bar dataKey="avg_assignment_pct" fill="#10B981" radius={[4, 4, 0, 0]} name="Assignment Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
