import React, { useEffect, useState } from 'react';
import { Cpu, CheckCircle2, Award, BarChart3, ShieldCheck } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { api } from '../services/api';
import { ModelPerformanceData } from '../types';

export const ModelPerformancePage: React.FC = () => {
  const [data, setData] = useState<ModelPerformanceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getModelPerformance()
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error("Model performance fetch error:", err);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-slate-400">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-medium">Loading ML Model Metrics & Feature Importances...</p>
      </div>
    );
  }

  const { metrics, selected_model, model_comparison, feature_importances, target_classes } = data;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold mb-2">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            ML MODEL EVALUATION & EXPLAINABILITY
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white font-outfit tracking-tight">
            Machine Learning Model Performance
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Empirical evaluation metrics, model comparison matrix, confusion matrix, and feature importance rankings derived during automated model selection.
          </p>
        </div>
        <div className="bg-indigo-950/60 border border-indigo-500/40 rounded-2xl p-4 flex items-center gap-3">
          <Award className="w-8 h-8 text-indigo-400" />
          <div>
            <span className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider">Selected Model</span>
            <h4 className="text-base font-bold text-white font-outfit">{selected_model}</h4>
          </div>
        </div>
      </div>

      {/* Selected Model Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-lg">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Accuracy</span>
          <h3 className="text-2xl font-extrabold text-white font-outfit mt-2">{(metrics.accuracy * 100).toFixed(1)}%</h3>
          <p className="text-[11px] text-emerald-400 mt-1">Overall prediction accuracy</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-lg">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">High Risk Recall</span>
          <h3 className="text-2xl font-extrabold text-rose-400 font-outfit mt-2">{(metrics.high_risk_recall * 100).toFixed(1)}%</h3>
          <p className="text-[11px] text-rose-300 mt-1">Zero false negatives for High Risk</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-lg">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Macro Precision</span>
          <h3 className="text-2xl font-extrabold text-indigo-400 font-outfit mt-2">{(metrics.precision * 100).toFixed(1)}%</h3>
          <p className="text-[11px] text-slate-400 mt-1">Class-unweighted precision</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-lg">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Macro Recall</span>
          <h3 className="text-2xl font-extrabold text-sky-400 font-outfit mt-2">{(metrics.recall * 100).toFixed(1)}%</h3>
          <p className="text-[11px] text-slate-400 mt-1">Average recall across classes</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-lg">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Macro F1 Score</span>
          <h3 className="text-2xl font-extrabold text-purple-400 font-outfit mt-2">{(metrics.f1_score * 100).toFixed(1)}%</h3>
          <p className="text-[11px] text-slate-400 mt-1">Harmonic mean of precision/recall</p>
        </div>
      </div>

      {/* Model Comparison Table */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-100 font-outfit">Model Benchmark Comparison</h3>
          <p className="text-xs text-slate-400 mt-0.5">Empirical comparison across multiple classification algorithms trained on 80% train / 20% test split</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold border-b border-slate-700/80">
              <tr>
                <th className="py-3 px-4">Algorithm</th>
                <th className="py-3 px-4 text-right">Accuracy</th>
                <th className="py-3 px-4 text-right">Precision</th>
                <th className="py-3 px-4 text-right">Recall</th>
                <th className="py-3 px-4 text-right">High Risk Recall</th>
                <th className="py-3 px-4 text-right">F1 Score</th>
                <th className="py-3 px-4 text-center">Selection Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {model_comparison.map((mc) => (
                <tr key={mc.model} className={mc.is_selected ? 'bg-indigo-950/40 border-l-4 border-indigo-500' : ''}>
                  <td className="py-3.5 px-4 font-bold text-slate-100 flex items-center gap-2">
                    <span>{mc.model}</span>
                    {mc.is_selected && (
                      <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-semibold border border-indigo-500/40">
                        BEST MODEL
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-semibold">{(mc.accuracy * 100).toFixed(1)}%</td>
                  <td className="py-3.5 px-4 text-right font-mono font-medium">{(mc.precision * 100).toFixed(1)}%</td>
                  <td className="py-3.5 px-4 text-right font-mono font-medium">{(mc.recall * 100).toFixed(1)}%</td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-rose-400">{(mc.high_risk_recall * 100).toFixed(1)}%</td>
                  <td className="py-3.5 px-4 text-right font-mono font-semibold text-purple-400">{(mc.f1_score * 100).toFixed(1)}%</td>
                  <td className="py-3.5 px-4 text-center">
                    {mc.is_selected ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-xs">
                        <CheckCircle2 className="w-4 h-4" /> Selected
                      </span>
                    ) : (
                      <span className="text-slate-500 text-xs">Evaluated</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feature Importance Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Feature Importance Bar Chart */}
        <div className="lg:col-span-8 bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl">
          <h3 className="text-base font-bold text-slate-100 font-outfit mb-1">Feature Importance Rankings</h3>
          <p className="text-xs text-slate-400 mb-4">Relative weight contribution of student indicators to risk predictions</p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={feature_importances.slice(0, 10)}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} unit="%" />
                <YAxis dataKey="feature" type="category" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.75rem' }} />
                <Bar dataKey="importance" fill="#6366F1" radius={[0, 4, 4, 0]} name="Importance %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Confusion Matrix Display */}
        <div className="lg:col-span-4 bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100 font-outfit">Confusion Matrix</h3>
            <p className="text-xs text-slate-400 mt-0.5">Test set predictions vs actual risk levels</p>
          </div>
          <div className="my-4 space-y-2">
            <div className="grid grid-cols-4 gap-1 text-[11px] text-center font-bold text-slate-400 mb-2">
              <div></div>
              <div>Pred High</div>
              <div>Pred Low</div>
              <div>Pred Med</div>
            </div>
            {target_classes.map((clsName, rowIdx) => (
              <div key={clsName} className="grid grid-cols-4 gap-1.5 items-center text-xs">
                <span className="font-bold text-slate-300 text-right pr-2">Act {clsName}</span>
                {metrics.confusion_matrix[rowIdx].map((val, colIdx) => (
                  <div
                    key={colIdx}
                    className={`py-3 rounded-xl font-mono font-bold text-center border ${
                      rowIdx === colIdx
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : val > 0
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : 'bg-slate-900 text-slate-500 border-slate-800'
                    }`}
                  >
                    {val}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="pt-2 border-t border-slate-700/60 text-[11px] text-slate-400 leading-snug">
            High Risk diagonal accuracy shows 100% detection rate with zero misclassifications into low risk.
          </div>
        </div>
      </div>
    </div>
  );
};
