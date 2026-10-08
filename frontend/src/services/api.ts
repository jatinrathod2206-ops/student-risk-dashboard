import {
  SummaryKPIs,
  RiskDistributionItem,
  CourseTrendItem,
  SemesterTrendItem,
  Student,
  PredictionResult,
  AIInsightItem,
  EarlyWarningItem,
  ModelPerformanceData
} from '../types';

const BASE_URL = 'http://127.0.0.1:8000/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API Error [${res.status}]: ${errorText}`);
  }
  return res.json();
}

export const api = {
  getSummary: (course?: string, semester?: string): Promise<SummaryKPIs> => {
    const params = new URLSearchParams();
    if (course && course !== 'All') params.append('course', course);
    if (semester && semester !== 'All') params.append('semester', semester);
    return fetchJson<SummaryKPIs>(`${BASE_URL}/dashboard/summary?${params.toString()}`);
  },

  getRiskDistribution: (course?: string, semester?: string): Promise<RiskDistributionItem[]> => {
    const params = new URLSearchParams();
    if (course && course !== 'All') params.append('course', course);
    if (semester && semester !== 'All') params.append('semester', semester);
    return fetchJson<RiskDistributionItem[]>(`${BASE_URL}/dashboard/risk-distribution?${params.toString()}`);
  },

  getTrendByCourse: (): Promise<CourseTrendItem[]> => {
    return fetchJson<CourseTrendItem[]>(`${BASE_URL}/dashboard/trend-by-course`);
  },

  getTrendBySemester: (): Promise<SemesterTrendItem[]> => {
    return fetchJson<SemesterTrendItem[]>(`${BASE_URL}/dashboard/trend-by-semester`);
  },

  getAcademicPerformance: (): Promise<{ attendance_vs_marks: any[]; gpa_distribution: any[] }> => {
    return fetchJson(`${BASE_URL}/dashboard/academic-performance`);
  },

  getKeyInsights: (): Promise<AIInsightItem[]> => {
    return fetchJson<AIInsightItem[]>(`${BASE_URL}/dashboard/insights`);
  },

  getStudents: (paramsObj: {
    course?: string;
    semester?: string;
    risk_level?: string;
    search?: string;
    page?: number;
    limit?: number;
    sort_by?: string;
    sort_order?: string;
  }): Promise<{ total: number; page: number; total_pages: number; students: Student[] }> => {
    const params = new URLSearchParams();
    Object.entries(paramsObj).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '' && v !== 'All') {
        params.append(k, String(v));
      }
    });
    return fetchJson(`${BASE_URL}/students?${params.toString()}`);
  },

  getStudentDetail: (studentId: number): Promise<{ student_info: Student; ai_prediction: PredictionResult }> => {
    return fetchJson(`${BASE_URL}/students/${studentId}`);
  },

  predictRisk: (studentInput: Partial<Student>): Promise<{ prediction: 'Low' | 'Medium' | 'High'; risk_score: number; probabilities: Record<string, number>; risk_factors: string[]; ai_explanation: string; recommendations: string[] }> => {
    return fetchJson(`${BASE_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentInput)
    });
  },

  getCourseAnalysis: (): Promise<any[]> => {
    return fetchJson(`${BASE_URL}/analytics/course-analysis`);
  },

  getSemesterAnalysis: (): Promise<any[]> => {
    return fetchJson(`${BASE_URL}/analytics/semester-analysis`);
  },

  getAcademicVsRisk: (): Promise<any[]> => {
    return fetchJson(`${BASE_URL}/analytics/academic-vs-risk`);
  },

  getEngagementVsRisk: (): Promise<any[]> => {
    return fetchJson(`${BASE_URL}/analytics/engagement-vs-risk`);
  },

  getEarlyWarning: (course?: string, priority?: string): Promise<EarlyWarningItem[]> => {
    const params = new URLSearchParams();
    if (course && course !== 'All') params.append('course', course);
    if (priority && priority !== 'All') params.append('priority', priority);
    return fetchJson<EarlyWarningItem[]>(`${BASE_URL}/early-warning?${params.toString()}`);
  },

  getModelPerformance: (): Promise<ModelPerformanceData> => {
    return fetchJson<ModelPerformanceData>(`${BASE_URL}/model/performance`);
  },

  getExportCsvUrl: (course?: string, semester?: string, risk_level?: string, search?: string): string => {
    const params = new URLSearchParams();
    if (course && course !== 'All') params.append('course', course);
    if (semester && semester !== 'All') params.append('semester', semester);
    if (risk_level && risk_level !== 'All') params.append('risk_level', risk_level);
    if (search) params.append('search', search);
    return `${BASE_URL}/students/export/csv?${params.toString()}`;
  }
};
