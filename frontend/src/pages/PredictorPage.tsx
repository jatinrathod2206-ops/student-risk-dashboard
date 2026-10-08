import React, { useState } from 'react';
import { BrainCircuit, Sparkles, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { PredictionResult } from '../types';

interface PredictorPageProps {
  coursesList: string[];
}

export const PredictorPage: React.FC<PredictorPageProps> = ({ coursesList }) => {
  const [formData, setFormData] = useState({
    Age: 20,
    Course: coursesList[0] || 'Computer Engineering',
    Semester: 4,
    Attendance_Percent: 62.0,
    Study_Hours_Per_Day: 2.0,
    Assignment_Completion_Percent: 55.0,
    Average_Marks_Percent: 50.0,
    Previous_GPA: 6.0,
    Failed_Subjects: 1,
    Backlogs: 1,
    Internal_Marks_Percent: 54.0,
    Class_Participation_Score: 5,
    Late_Submissions: 3,
    Absences_Last_30_Days: 6,
    Library_Visits_Per_Month: 3,
    Online_Learning_Hours_Per_Week: 2.5,
    Stress_Level: 4,
    Financial_Pressure_Level: 3
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    api.predictRisk(formData)
      .then(res => {
        setResult(res);
        setLoading(false);
      })
      .catch(err => {
        console.error("Prediction error:", err);
        setError("Prediction service failed. Ensure backend API is active.");
        setLoading(false);
      });
  };

  const handleReset = () => {
    setFormData({
      Age: 20,
      Course: coursesList[0] || 'Computer Engineering',
      Semester: 4,
      Attendance_Percent: 85.0,
      Study_Hours_Per_Day: 4.0,
      Assignment_Completion_Percent: 90.0,
      Average_Marks_Percent: 82.0,
      Previous_GPA: 8.5,
      Failed_Subjects: 0,
      Backlogs: 0,
      Internal_Marks_Percent: 85.0,
      Class_Participation_Score: 8,
      Late_Submissions: 0,
      Absences_Last_30_Days: 1,
      Library_Visits_Per_Month: 10,
      Online_Learning_Hours_Per_Week: 6.0,
      Stress_Level: 2,
      Financial_Pressure_Level: 2
    });
    setResult(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold mb-2">
            <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" />
            SUPERVISED ML CLASSIFIER
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white font-outfit tracking-tight">
            AI Student Risk Predictor
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Input student academic and behavioral indicators to generate real-time risk predictions using the trained Logistic Regression model.
          </p>
        </div>
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-600 transition cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Preset Strong Performance</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-7 bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl">
          <h3 className="text-base font-bold text-slate-100 font-outfit mb-4">Student Indicators Form</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Course Program</label>
                <select
                  name="Course"
                  value={formData.Course}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {coursesList.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Semester</label>
                <select
                  name="Semester"
                  value={formData.Semester}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Attendance Rate (%)</label>
                <input
                  type="number"
                  name="Attendance_Percent"
                  value={formData.Attendance_Percent}
                  onChange={handleChange}
                  min={0}
                  max={100}
                  step={0.5}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Daily Study Hours</label>
                <input
                  type="number"
                  name="Study_Hours_Per_Day"
                  value={formData.Study_Hours_Per_Day}
                  onChange={handleChange}
                  min={0}
                  max={16}
                  step={0.5}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Assignment Completion (%)</label>
                <input
                  type="number"
                  name="Assignment_Completion_Percent"
                  value={formData.Assignment_Completion_Percent}
                  onChange={handleChange}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Average Marks (%)</label>
                <input
                  type="number"
                  name="Average_Marks_Percent"
                  value={formData.Average_Marks_Percent}
                  onChange={handleChange}
                  min={0}
                  max={100}
                  step={0.5}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Previous GPA (0 - 10)</label>
                <input
                  type="number"
                  name="Previous_GPA"
                  value={formData.Previous_GPA}
                  onChange={handleChange}
                  min={0}
                  max={10}
                  step={0.1}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Active Backlogs</label>
                <input
                  type="number"
                  name="Backlogs"
                  value={formData.Backlogs}
                  onChange={handleChange}
                  min={0}
                  max={10}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Failed Subjects</label>
                <input
                  type="number"
                  name="Failed_Subjects"
                  value={formData.Failed_Subjects}
                  onChange={handleChange}
                  min={0}
                  max={10}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Late Submissions</label>
                <input
                  type="number"
                  name="Late_Submissions"
                  value={formData.Late_Submissions}
                  onChange={handleChange}
                  min={0}
                  max={20}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Stress Level (1 to 5)</label>
                <input
                  type="number"
                  name="Stress_Level"
                  value={formData.Stress_Level}
                  onChange={handleChange}
                  min={1}
                  max={5}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Financial Pressure (1 to 5)</label>
                <input
                  type="number"
                  name="Financial_Pressure_Level"
                  value={formData.Financial_Pressure_Level}
                  onChange={handleChange}
                  min={1}
                  max={5}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Computing AI Risk Prediction...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>PREDICT STUDENT RISK</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Prediction Output Column */}
        <div className="lg:col-span-5">
          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs text-rose-300">
              {error}
            </div>
          )}

          {!result ? (
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-8 text-center text-slate-400 space-y-3 h-full flex flex-col items-center justify-center">
              <BrainCircuit className="w-12 h-12 text-slate-600" />
              <h4 className="text-sm font-semibold text-slate-300">Ready for Prediction</h4>
              <p className="text-xs text-slate-400 max-w-xs">
                Fill in the student indicators form and click "PREDICT STUDENT RISK" to run the ML classifier.
              </p>
            </div>
          ) : (
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-6 animate-in fade-in duration-300">
              {/* Prediction Hero Header */}
              <div className="text-center p-5 rounded-2xl bg-slate-900/80 border border-slate-700/80">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Model Output Classification</span>
                <h3 className={`text-3xl font-extrabold font-outfit mt-1 ${
                  result.prediction === 'High' ? 'text-rose-400' :
                  result.prediction === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {result.prediction.toUpperCase()} RISK
                </h3>
                <div className="mt-2 text-xs font-medium text-slate-300">
                  Risk Score Index: <span className="font-mono font-bold text-indigo-400 text-sm">{result.risk_score} / 100</span>
                </div>
              </div>

              {/* Probabilities */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Class Probabilities</h4>
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-rose-400">High Risk</span>
                    <span className="text-slate-200">{(result.probabilities.High * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500" style={{ width: `${result.probabilities.High * 100}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-amber-400">Medium Risk</span>
                    <span className="text-slate-200">{(result.probabilities.Medium * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: `${result.probabilities.Medium * 100}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-emerald-400">Low Risk</span>
                    <span className="text-slate-200">{(result.probabilities.Low * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${result.probabilities.Low * 100}%` }}></div>
                  </div>
                </div>
              </div>

              {/* AI Explanation */}
              <div className="p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-xl">
                <h4 className="text-xs font-bold text-indigo-300 mb-1">AI Explanation</h4>
                <p className="text-xs text-indigo-100 leading-relaxed">{result.ai_explanation}</p>
              </div>

              {/* Actionable Recommendations */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Recommended Interventions</h4>
                <div className="space-y-2">
                  {result.recommendations.map((rec, i) => (
                    <div key={i} className="p-2.5 bg-slate-900/60 border border-slate-700/50 rounded-xl text-xs text-slate-200 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
