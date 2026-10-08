import React, { useEffect, useState } from 'react';
import {
  User,
  GraduationCap,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  BookOpen,
  Clock,
  FileCheck,
  Zap,
  ShieldAlert,
  Brain
} from 'lucide-react';
import { api } from '../services/api';
import { Student, PredictionResult } from '../types';

interface ProfilePageProps {
  studentId: number;
  onBack: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ studentId, onBack }) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getStudentDetail(studentId)
      .then(res => {
        setStudent(res.student_info);
        setPrediction(res.ai_prediction);
        setLoading(false);
      })
      .catch(err => {
        console.error("Student detail fetch error:", err);
        setLoading(false);
      });
  }, [studentId]);

  if (loading || !student || !prediction) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-slate-400">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-medium">Loading Student Profile & AI Risk Predictions...</p>
      </div>
    );
  }

  const getBadgeStyle = (level: string) => {
    if (level === 'High') return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    if (level === 'Medium') return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Navigation Header */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/80 border border-slate-700/60 px-3.5 py-2 rounded-xl transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Directory</span>
      </button>

      {/* Student Overview Hero Header */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-bold text-2xl shadow-lg shadow-indigo-600/10 font-outfit">
            {student.Student_Name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-white font-outfit">{student.Student_Name}</h2>
              <span className="text-xs font-mono bg-slate-900 text-indigo-400 px-2.5 py-1 rounded-lg border border-slate-700">
                ID #{student.Student_ID}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-1.5">
              <span className="flex items-center gap-1.5"><GraduationCap className="w-4 h-4 text-indigo-400" /> {student.Course}</span>
              <span>•</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-indigo-400" /> Semester {student.Semester}</span>
              <span>•</span>
              <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-indigo-400" /> Age {student.Age}</span>
            </div>
          </div>
        </div>

        {/* Prediction Hero Badge */}
        <div className={`p-4 rounded-2xl border ${getBadgeStyle(prediction.prediction)} flex items-center gap-4`}>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider opacity-80">AI Risk Assessment</p>
            <h3 className="text-xl font-extrabold font-outfit mt-0.5">{prediction.prediction} RISK</h3>
            <p className="text-xs font-medium mt-0.5">
              Risk Score: <span className="font-mono font-bold">{prediction.risk_score}/100</span>
            </p>
          </div>
        </div>
      </div>

      {/* Grid: 2 Columns - Academic Summary Cards vs AI Risk Prediction Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Academic & Behavioral Parameters */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl">
            <h3 className="text-base font-bold text-slate-100 font-outfit mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              Academic Performance Summary
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-3.5 bg-slate-900/60 border border-slate-700/50 rounded-xl">
                <span className="text-[11px] text-slate-400">Attendance Rate</span>
                <p className={`text-lg font-bold font-outfit mt-0.5 ${student.Attendance_Percent < 75 ? 'text-rose-400' : 'text-slate-100'}`}>
                  {student.Attendance_Percent}%
                </p>
              </div>

              <div className="p-3.5 bg-slate-900/60 border border-slate-700/50 rounded-xl">
                <span className="text-[11px] text-slate-400">Previous GPA</span>
                <p className="text-lg font-bold font-outfit text-slate-100 mt-0.5">
                  {student.Previous_GPA.toFixed(2)}
                </p>
              </div>

              <div className="p-3.5 bg-slate-900/60 border border-slate-700/50 rounded-xl">
                <span className="text-[11px] text-slate-400">Average Marks</span>
                <p className="text-lg font-bold font-outfit text-slate-100 mt-0.5">
                  {student.Average_Marks_Percent}%
                </p>
              </div>

              <div className="p-3.5 bg-slate-900/60 border border-slate-700/50 rounded-xl">
                <span className="text-[11px] text-slate-400">Assignment Rate</span>
                <p className="text-lg font-bold font-outfit text-slate-100 mt-0.5">
                  {student.Assignment_Completion_Percent}%
                </p>
              </div>

              <div className="p-3.5 bg-slate-900/60 border border-slate-700/50 rounded-xl">
                <span className="text-[11px] text-slate-400">Daily Study Hours</span>
                <p className="text-lg font-bold font-outfit text-slate-100 mt-0.5">
                  {student.Study_Hours_Per_Day} hrs
                </p>
              </div>

              <div className="p-3.5 bg-slate-900/60 border border-slate-700/50 rounded-xl">
                <span className="text-[11px] text-slate-400">Internal Marks</span>
                <p className="text-lg font-bold font-outfit text-slate-100 mt-0.5">
                  {student.Internal_Marks_Percent}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl">
            <h3 className="text-base font-bold text-slate-100 font-outfit mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              Risk Factors & Behavioral Indicators
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-3.5 bg-slate-900/60 border border-slate-700/50 rounded-xl">
                <span className="text-[11px] text-slate-400">Active Backlogs</span>
                <p className={`text-lg font-bold font-outfit mt-0.5 ${student.Backlogs > 0 ? 'text-rose-400' : 'text-slate-100'}`}>
                  {student.Backlogs} subjects
                </p>
              </div>

              <div className="p-3.5 bg-slate-900/60 border border-slate-700/50 rounded-xl">
                <span className="text-[11px] text-slate-400">Failed Subjects</span>
                <p className={`text-lg font-bold font-outfit mt-0.5 ${student.Failed_Subjects > 0 ? 'text-rose-400' : 'text-slate-100'}`}>
                  {student.Failed_Subjects} subjects
                </p>
              </div>

              <div className="p-3.5 bg-slate-900/60 border border-slate-700/50 rounded-xl">
                <span className="text-[11px] text-slate-400">Late Submissions</span>
                <p className="text-lg font-bold font-outfit text-slate-100 mt-0.5">
                  {student.Late_Submissions} times
                </p>
              </div>

              <div className="p-3.5 bg-slate-900/60 border border-slate-700/50 rounded-xl">
                <span className="text-[11px] text-slate-400">Absences (30 Days)</span>
                <p className="text-lg font-bold font-outfit text-slate-100 mt-0.5">
                  {student.Absences_Last_30_Days} days
                </p>
              </div>

              <div className="p-3.5 bg-slate-900/60 border border-slate-700/50 rounded-xl">
                <span className="text-[11px] text-slate-400">Stress Level</span>
                <p className="text-lg font-bold font-outfit text-slate-100 mt-0.5">
                  {student.Stress_Level} / 5
                </p>
              </div>

              <div className="p-3.5 bg-slate-900/60 border border-slate-700/50 rounded-xl">
                <span className="text-[11px] text-slate-400">Financial Pressure</span>
                <p className="text-lg font-bold font-outfit text-slate-100 mt-0.5">
                  {student.Financial_Pressure_Level} / 5
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Risk Prediction Breakdown & Recommended Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-slate-100 font-outfit">AI Prediction Probabilities</h3>
            </div>

            {/* Probability Bars */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-rose-400">High Risk</span>
                  <span className="text-slate-200">{(prediction.probabilities.High * 100).toFixed(1)}%</span>
                </div>
                <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: `${prediction.probabilities.High * 100}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-amber-400">Medium Risk</span>
                  <span className="text-slate-200">{(prediction.probabilities.Medium * 100).toFixed(1)}%</span>
                </div>
                <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${prediction.probabilities.Medium * 100}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-emerald-400">Low Risk</span>
                  <span className="text-slate-200">{(prediction.probabilities.Low * 100).toFixed(1)}%</span>
                </div>
                <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${prediction.probabilities.Low * 100}%` }}></div>
                </div>
              </div>
            </div>

            {/* AI Explanation Text */}
            <div className="p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-xl space-y-1">
              <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Model Explanation</span>
              <p className="text-xs text-indigo-100 leading-relaxed">{prediction.ai_explanation}</p>
            </div>

            {/* Key Risk Factors List */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Identified Risk Factors</h4>
              <ul className="space-y-2">
                {prediction.risk_factors.map((rf, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-xl">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>{rf}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actionable Recommendations */}
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-3">
            <h3 className="text-base font-bold text-slate-100 font-outfit flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Recommended Academic Interventions
            </h3>
            <div className="space-y-2.5">
              {prediction.recommendations.map((rec, i) => (
                <div key={i} className="p-3 bg-slate-900/60 border border-slate-700/50 rounded-xl text-xs text-slate-200 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
