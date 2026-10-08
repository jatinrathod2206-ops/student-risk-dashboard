import React, { useState } from 'react';
import { Search, Bell, Filter, Calendar, UserCheck } from 'lucide-react';

interface TopbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCourse: string;
  onCourseChange: (course: string) => void;
  selectedSemester: string;
  onSemesterChange: (sem: string) => void;
  coursesList: string[];
  semestersList: number[];
}

export const Topbar: React.FC<TopbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCourse,
  onCourseChange,
  selectedSemester,
  onSemesterChange,
  coursesList,
  semestersList,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-20 px-6 py-3.5 flex items-center justify-between gap-4">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by student name, ID or course..."
          className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition"
        />
      </div>

      {/* Filters & Actions */}
      <div className="flex items-center gap-3">
        {/* Course Filter */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/60 rounded-xl px-3 py-1.5 text-xs text-slate-300">
          <Filter className="w-3.5 h-3.5 text-indigo-400" />
          <select
            value={selectedCourse}
            onChange={(e) => onCourseChange(e.target.value)}
            className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="All" className="bg-slate-800 text-slate-200">All Courses</option>
            {coursesList.map((c) => (
              <option key={c} value={c} className="bg-slate-800 text-slate-200">{c}</option>
            ))}
          </select>
        </div>

        {/* Semester Filter */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/60 rounded-xl px-3 py-1.5 text-xs text-slate-300">
          <select
            value={selectedSemester}
            onChange={(e) => onSemesterChange(e.target.value)}
            className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="All" className="bg-slate-800 text-slate-200">All Semesters</option>
            {semestersList.map((s) => (
              <option key={s} value={String(s)} className="bg-slate-800 text-slate-200">Sem {s}</option>
            ))}
          </select>
        </div>

        {/* Date Display */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/40 px-3 py-1.5 rounded-xl border border-slate-800">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{todayStr}</span>
        </div>

        {/* Notifications Icon */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-600 transition relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2 animate-ping"></span>
            <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                <h4 className="text-sm font-semibold text-slate-200">System Alerts</h4>
                <span className="text-[10px] bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-full font-medium">3 Critical</span>
              </div>
              <div className="space-y-3 mt-3 text-xs">
                <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300">
                  <p className="font-semibold">Early Warning Triggered</p>
                  <p className="text-[11px] text-rose-400/80 mt-0.5">134 students classified in High Risk threshold.</p>
                </div>
                <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300">
                  <p className="font-semibold">Model Re-evaluation</p>
                  <p className="text-[11px] text-amber-400/80 mt-0.5">Logistic Regression selected with 100% High Risk Recall.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-bold text-xs">
            AD
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-200 leading-tight">Faculty Admin</p>
            <p className="text-[10px] text-slate-400">GTU Academic Dept</p>
          </div>
        </div>
      </div>
    </header>
  );
};
