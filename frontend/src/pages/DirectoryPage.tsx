import React, { useEffect, useState } from 'react';
import { Search, Download, ArrowUpDown, ChevronLeft, ChevronRight, User, Filter } from 'lucide-react';
import { api } from '../services/api';
import { Student } from '../types';

interface DirectoryPageProps {
  selectedCourse: string;
  selectedSemester: string;
  onSelectStudent: (id: number) => void;
  coursesList: string[];
}

export const DirectoryPage: React.FC<DirectoryPageProps> = ({
  selectedCourse,
  selectedSemester,
  onSelectStudent,
  coursesList
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [riskLevel, setRiskLevel] = useState('All');
  const [sortBy, setSortBy] = useState('Student_ID');
  const [sortOrder, setSortOrder] = useState('asc');

  const loadData = () => {
    setLoading(true);
    api.getStudents({
      course: selectedCourse,
      semester: selectedSemester,
      risk_level: riskLevel,
      search,
      page,
      limit,
      sort_by: sortBy,
      sort_order: sortOrder
    }).then(res => {
      setStudents(res.students);
      setTotal(res.total);
      setTotalPages(res.total_pages);
      setLoading(false);
    }).catch(err => {
      console.error("Failed to load students:", err);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, [selectedCourse, selectedSemester, riskLevel, search, page, sortBy, sortOrder]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleExportCsv = () => {
    const exportUrl = api.getExportCsvUrl(selectedCourse, selectedSemester, riskLevel, search);
    window.open(exportUrl, '_blank');
  };

  const getRiskBadge = (level: string) => {
    if (level === 'High') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
          🔴 High
        </span>
      );
    } else if (level === 'Medium') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          🟡 Medium
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        🟢 Low
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white font-outfit">Student Directory</h2>
          <p className="text-xs text-slate-400 mt-0.5">Search, filter, and inspect individual student profiles ({total} records found)</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-[240px]">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by student name or ID..."
              className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter by Risk Level */}
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Filter className="w-3.5 h-3.5 text-indigo-400" />
            <span>Risk Level:</span>
            <select
              value={riskLevel}
              onChange={(e) => { setRiskLevel(e.target.value); setPage(1); }}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="All">All Risk Levels</option>
              <option value="Low">🟢 Low Risk</option>
              <option value="Medium">🟡 Medium Risk</option>
              <option value="High">🔴 High Risk</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold border-b border-slate-700/80">
              <tr>
                <th className="py-3.5 px-4 cursor-pointer hover:text-slate-200" onClick={() => handleSort('Student_ID')}>
                  <div className="flex items-center gap-1">
                    ID <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4 cursor-pointer hover:text-slate-200" onClick={() => handleSort('Student_Name')}>
                  <div className="flex items-center gap-1">
                    Student Name <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Course</th>
                <th className="py-3.5 px-4 text-center">Sem</th>
                <th className="py-3.5 px-4 text-right cursor-pointer hover:text-slate-200" onClick={() => handleSort('Attendance_Percent')}>
                  <div className="flex items-center justify-end gap-1">
                    Attendance <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-right cursor-pointer hover:text-slate-200" onClick={() => handleSort('Previous_GPA')}>
                  <div className="flex items-center justify-end gap-1">
                    GPA <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-right cursor-pointer hover:text-slate-200" onClick={() => handleSort('Average_Marks_Percent')}>
                  <div className="flex items-center justify-end gap-1">
                    Marks % <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-right">Assign %</th>
                <th className="py-3.5 px-4 text-right cursor-pointer hover:text-slate-200" onClick={() => handleSort('Risk_Score')}>
                  <div className="flex items-center justify-end gap-1">
                    Risk Score <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-center">Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {loading ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin inline-block mr-2"></div>
                    Loading student records...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    No student records match the selected search and filters.
                  </td>
                </tr>
              ) : (
                students.map((st) => (
                  <tr
                    key={st.Student_ID}
                    onClick={() => onSelectStudent(st.Student_ID)}
                    className="hover:bg-slate-700/40 transition cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">#{st.Student_ID}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-100 group-hover:text-indigo-300 transition">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold text-[10px]">
                          {st.Student_Name.charAt(0)}
                        </div>
                        <span>{st.Student_Name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{st.Course}</td>
                    <td className="py-3.5 px-4 text-center text-slate-300 font-medium">Sem {st.Semester}</td>
                    <td className={`py-3.5 px-4 text-right font-semibold ${st.Attendance_Percent < 75 ? 'text-rose-400' : 'text-slate-200'}`}>
                      {st.Attendance_Percent}%
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-medium">{st.Previous_GPA.toFixed(2)}</td>
                    <td className="py-3.5 px-4 text-right font-medium">{st.Average_Marks_Percent}%</td>
                    <td className="py-3.5 px-4 text-right">{st.Assignment_Completion_Percent}%</td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-200">{st.Risk_Score.toFixed(1)}</td>
                    <td className="py-3.5 px-4 text-center">{getRiskBadge(st.Risk_Level)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="py-3 px-6 bg-slate-900/60 border-t border-slate-700/80 flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing <span className="font-semibold text-slate-200">{students.length > 0 ? (page - 1) * limit + 1 : 0}</span> to{' '}
            <span className="font-semibold text-slate-200">{Math.min(page * limit, total)}</span> of{' '}
            <span className="font-semibold text-slate-200">{total}</span> records
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-medium text-slate-300">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
