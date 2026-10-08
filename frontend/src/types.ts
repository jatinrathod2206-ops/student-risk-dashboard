export interface Student {
  Student_ID: number;
  Student_Name: string;
  Age: number;
  Course: string;
  Semester: number;
  Attendance_Percent: number;
  Study_Hours_Per_Day: number;
  Assignment_Completion_Percent: number;
  Average_Marks_Percent: number;
  Previous_GPA: number;
  Failed_Subjects: number;
  Backlogs: number;
  Internal_Marks_Percent: number;
  Class_Participation_Score: number;
  Late_Submissions: number;
  Absences_Last_30_Days: number;
  Library_Visits_Per_Month: number;
  Online_Learning_Hours_Per_Week: number;
  Stress_Level: number;
  Financial_Pressure_Level: number;
  Risk_Score: number;
  Risk_Level: 'Low' | 'Medium' | 'High';
}

export interface SummaryKPIs {
  total_students: number;
  low_risk: number;
  medium_risk: number;
  high_risk: number;
  avg_attendance: number;
  avg_gpa: number;
  avg_marks: number;
  avg_assignment_completion: number;
}

export interface RiskDistributionItem {
  name: string;
  level: string;
  count: number;
  percentage: number;
  color: string;
}

export interface CourseTrendItem {
  course: string;
  Low: number;
  Medium: number;
  High: number;
  total: number;
  high_risk_pct: number;
}

export interface SemesterTrendItem {
  semester: string;
  sem_num: number;
  Low: number;
  Medium: number;
  High: number;
  total: number;
}

export interface PredictionResult {
  prediction: 'Low' | 'Medium' | 'High';
  risk_score: number;
  probabilities: {
    Low: number;
    Medium: number;
    High: number;
  };
  risk_factors: string[];
  ai_explanation: string;
  recommendations: string[];
}

export interface AIInsightItem {
  id: number;
  title: string;
  description: string;
  impact: 'Critical' | 'High' | 'Moderate' | 'Positive';
  metric: string;
}

export interface EarlyWarningItem {
  student_id: number;
  student_name: string;
  course: string;
  semester: number;
  attendance: number;
  gpa: number;
  risk_score: number;
  risk_level: 'Low' | 'Medium' | 'High';
  priority: 'Critical' | 'High Priority' | 'Monitor' | 'Stable';
  badge_color: string;
  main_risk_factor: string;
  recommended_action: string;
}

export interface ModelComparisonItem {
  model: string;
  accuracy: number;
  precision: number;
  recall: number;
  high_risk_recall: number;
  f1_score: number;
  is_selected: boolean;
}

export interface FeatureImportanceItem {
  feature: string;
  importance: number;
}

export interface ModelPerformanceData {
  selected_model: string;
  target_classes: string[];
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    high_risk_recall: number;
    f1_score: number;
    confusion_matrix: number[][];
    classification_report: Record<string, any>;
  };
  model_comparison: ModelComparisonItem[];
  feature_importances: FeatureImportanceItem[];
}
