import React, { useEffect, useState } from 'react';
import {
  Users,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  BookOpen,
  GraduationCap,
  Percent,
  CheckSquare,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts';
import { KPICard } from '../components/KPICard';
import { api } from '../services/api';
import { SummaryKPIs, RiskDistributionItem, CourseTrendItem, SemesterTrendItem, AIInsightItem } from '../types';

interface OverviewPageProps {
  selectedCourse: string;
  selectedSemester: string;
  onNavigatePage: (page: string) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ selectedCourse, selectedSemester, onNavigatePage }) => {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<SummaryKPIs | null>(null);
  const [riskDist, setRiskDist] = useState<RiskDistributionItem[]>([]);
  const [courseTrends, setCourseTrends] = useState<CourseTrendItem[]>([]);
  const [semesterTrends, setSemesterTrends] = useState<SemesterTrendItem[]>([]);
  const [academicPerf, setAcademicPerf] = useState<{ attendance_vs_marks: any[]; gpa_distribution: any[] }>({ attendance_vs_marks: [], gpa_distribution: [] });
  const [insights, setInsights] = useState<AIInsightItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([
      api.getSummary(selectedCourse, selectedSemester),
      api.getRiskDistribution(selectedCourse, selectedSemester),
      api.getTrendByCourse(),
      api.getTrendBySemester(),
      api.getAcademicPerformance(),
      api.getKeyInsights()
    ]).then(([sum, dist, courseTr, semTr, acad, ins]) => {
      if (isMounted) {
        setKpis(sum);
        setRiskDist(dist);
        setCourseTrends(courseTr);
        setSemesterTrends(semTr);
        setAcademicPerf(acad);
        setInsights(ins);
        setLoading(false);
      }
    }).catch(err => {
      console.error("Overview fetch error:", err);
      if (isMounted) setLoading(false);
    });

    return () => { isMounted = false; };
  }, [selectedCourse, selectedSemester]);

  if (loading || !kpis) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-slate-400">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-medium">Loading AI Student Risk Intelligence...</p>
      </div>
    );
  }

  const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl shadow-slate-950/40">
        <div>
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            AI-POWERED RISK INTELLIGENCE
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white font-outfit tracking-tight">
            AI Student Risk Intelligence Dashboard
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Real-time machine learning predictions, early warning intervention triggers, and holistic student academic performance analytics.
          </p>
        </div>
        <button
          onClick={() => onNavigatePage('early-warning')}
          className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs px-4 py-3 rounded-xl shadow-lg shadow-rose-600/20 transition cursor-pointer"
        >
          <span>View Early Warning System</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Students"
          value={kpis.total_students.toLocaleString()}
          subtitle="Enrolled population dataset"
          icon={Users}
          color="indigo"
        />
        <KPICard
          title="Low Risk"
          value={kpis.low_risk}
          subtitle={`${((kpis.low_risk / kpis.total_students) * 100).toFixed(1)}% of total`}
          icon={CheckCircle2}
          color="emerald"
        />
        <KPICard
          title="Medium Risk"
          value={kpis.medium_risk}
          subtitle={`${((kpis.medium_risk / kpis.total_students) * 100).toFixed(1)}% of total`}
          icon={AlertCircle}
          color="amber"
        />
        <KPICard
          title="High Risk"
          value={kpis.high_risk}
          subtitle={`${((kpis.high_risk / kpis.total_students) * 100).toFixed(1)}% requires immediate action`}
          icon={AlertTriangle}
          color="rose"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Average Attendance"
          value={`${kpis.avg_attendance}%`}
          subtitle="Target threshold: >= 75%"
          icon={Percent}
          color="sky"
        />
        <KPICard
          title="Average GPA"
          value={kpis.avg_gpa}
          subtitle="Scale: 0.0 to 10.0"
          icon={GraduationCap}
          color="purple"
        />
        <KPICard
          title="Average Marks"
          value={`${kpis.avg_marks}%`}
          subtitle="Overall academic score"
          icon={BookOpen}
          color="indigo"
        />
        <KPICard
          title="Assignment Rate"
          value={`${kpis.avg_assignment_completion}%`}
          subtitle="Timely submission score"
          icon={CheckSquare}
          color="emerald"
        />
      </div>

      {/* Charts Section 1: Risk Distribution & Course Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Risk Distribution Pie Chart */}
        <div className="lg:col-span-4 bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100 font-outfit">Risk Level Distribution</h3>
            <p className="text-xs text-slate-400 mt-0.5">Machine learning predicted risk categories</p>
          </div>
          <div className="h-64 my-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDist}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {riskDist.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 pt-2 border-t border-slate-700/60">
            {riskDist.map((r, i) => (
              <div key={r.level} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></span>
                  <span className="text-slate-300 font-medium">{r.name}</span>
                </div>
                <span className="text-slate-200 font-semibold">{r.count} students ({r.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Breakdown across Courses */}
        <div className="lg:col-span-8 bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-100 font-outfit">Risk Distribution by Course</h3>
              <p className="text-xs text-slate-400 mt-0.5">Comparison of risk levels across academic engineering programs</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courseTrends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="course" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.75rem' }} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="Low" fill="#10B981" radius={[4, 4, 0, 0]} name="Low Risk" />
                <Bar dataKey="Medium" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Medium Risk" />
                <Bar dataKey="High" fill="#EF4444" radius={[4, 4, 0, 0]} name="High Risk" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Section 2: Semester Trends & Academic Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Risk by Semester */}
        <div className="lg:col-span-6 bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl">
          <h3 className="text-base font-bold text-slate-100 font-outfit">Risk Trend Across Semesters</h3>
          <p className="text-xs text-slate-400 mt-0.5">Progression of student risk levels from Semester 1 to 8</p>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={semesterTrends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="semester" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.75rem' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="Low" stackId="a" fill="#10B981" name="Low Risk" />
                <Bar dataKey="Medium" stackId="a" fill="#F59E0B" name="Medium Risk" />
                <Bar dataKey="High" stackId="a" fill="#EF4444" name="High Risk" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attendance vs Marks Relationship */}
        <div className="lg:col-span-6 bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl">
          <h3 className="text-base font-bold text-slate-100 font-outfit">Attendance vs Average Marks</h3>
          <p className="text-xs text-slate-400 mt-0.5">Impact of class attendance rate on average examination marks</p>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={academicPerf.attendance_vs_marks} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="attendance_range" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.75rem' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="avg_marks" fill="#6366F1" radius={[4, 4, 0, 0]} name="Average Marks %" />
                <Bar dataKey="high_risk_count" fill="#EF4444" radius={[4, 4, 0, 0]} name="High Risk Students Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Key AI Insights Section */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 font-outfit">Key AI Insights</h3>
            <p className="text-xs text-slate-400">Automated empirical findings calculated from the student dataset</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((item) => (
            <div key={item.id} className="p-4 bg-slate-900/60 border border-slate-700/50 rounded-xl space-y-1.5 hover:border-indigo-500/40 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-300">{item.title}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  item.impact === 'Critical' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                  item.impact === 'High' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {item.impact}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
              <p className="text-[11px] font-semibold text-slate-400 pt-1">Key Metric: <span className="text-slate-200">{item.metric}</span></p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
