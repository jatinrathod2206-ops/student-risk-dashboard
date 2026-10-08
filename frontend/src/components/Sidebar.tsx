import React from 'react';
import {
  LayoutDashboard,
  Users,
  BrainCircuit,
  BarChart3,
  Sparkles,
  AlertTriangle,
  Cpu,
  GraduationCap
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  highRiskCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange, highRiskCount = 134 }) => {
  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'directory', label: 'Student Directory', icon: Users },
    { id: 'predictor', label: 'AI Risk Predictor', icon: BrainCircuit, badge: 'ML' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'insights', label: 'AI Insights', icon: Sparkles },
    { id: 'early-warning', label: 'Early Warning', icon: AlertTriangle, badge: `${highRiskCount}` },
    { id: 'model-performance', label: 'Model Performance', icon: Cpu },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0 z-30">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-500/10">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-slate-100 text-base leading-snug tracking-tight font-outfit">
              EdRisk <span className="text-indigo-400">AI</span>
            </h1>
            <p className="text-xs text-slate-400">Student Risk Intelligence</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.id === 'early-warning'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Dataset & System Info */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <div>
            <p className="text-xs font-semibold text-slate-300">Model Status: Active</p>
            <p className="text-[11px] text-slate-500 truncate">1,000 Student Records</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
