import os
from pathlib import Path
import pandas as pd
import numpy as np

# Project root:
# student-risk-dashboard/
# ├── data/
# │   └── student_data.xlsx
# └── backend/
#     └── app/
#         └── services/
#             └── data_service.py

PROJECT_ROOT = Path(__file__).resolve().parents[3]
DATA_PATH = PROJECT_ROOT / "data" / "student_data.xlsx"
class DataService:
    def __init__(self, data_path: str = DATA_PATH):
        self.data_path = data_path
        self.df = None
        self.load_data()

    def load_data(self):
        if not os.path.exists(self.data_path):
            raise FileNotFoundError(f"Dataset file not found at {self.data_path}")
        self.df = pd.read_excel(self.data_path)
        # Clean & validate
        self.df['Student_ID'] = self.df['Student_ID'].astype(int)
        self.df['Semester'] = self.df['Semester'].astype(int)
        self.df['Attendance_Percent'] = self.df['Attendance_Percent'].round(2)
        self.df['Average_Marks_Percent'] = self.df['Average_Marks_Percent'].round(2)
        self.df['Previous_GPA'] = self.df['Previous_GPA'].round(2)
        self.df['Assignment_Completion_Percent'] = self.df['Assignment_Completion_Percent'].round(2)
        self.df['Risk_Score'] = self.df['Risk_Score'].round(2)

    def get_all_students(self, course=None, semester=None, risk_level=None, min_attendance=None, max_attendance=None, search=None):
        filtered = self.df.copy()

        if course and course != 'All':
            filtered = filtered[filtered['Course'] == course]

        if semester and semester != 'All':
            try:
                sem_val = int(semester)
                filtered = filtered[filtered['Semester'] == sem_val]
            except ValueError:
                pass

        if risk_level and risk_level != 'All':
            filtered = filtered[filtered['Risk_Level'] == risk_level]

        if min_attendance is not None:
            filtered = filtered[filtered['Attendance_Percent'] >= float(min_attendance)]

        if max_attendance is not None:
            filtered = filtered[filtered['Attendance_Percent'] <= float(max_attendance)]

        if search:
            s_lower = str(search).lower().strip()
            filtered = filtered[
                filtered['Student_Name'].astype(str).str.lower().str.contains(s_lower) |
                filtered['Student_ID'].astype(str).str.contains(s_lower) |
                filtered['Course'].astype(str).str.lower().str.contains(s_lower)
            ]

        return filtered

    def get_student_by_id(self, student_id: int):
        student_rows = self.df[self.df['Student_ID'] == int(student_id)]
        if student_rows.empty:
            return None
        return student_rows.iloc[0].to_dict()

    def get_summary_kpis(self, course=None, semester=None):
        df_filtered = self.df.copy()
        if course and course != 'All':
            df_filtered = df_filtered[df_filtered['Course'] == course]
        if semester and semester != 'All':
            df_filtered = df_filtered[df_filtered['Semester'] == int(semester)]

        total_students = len(df_filtered)
        if total_students == 0:
            return {
                "total_students": 0, "low_risk": 0, "medium_risk": 0, "high_risk": 0,
                "avg_attendance": 0, "avg_gpa": 0, "avg_marks": 0, "avg_assignment_completion": 0
            }

        risk_counts = df_filtered['Risk_Level'].value_counts().to_dict()

        return {
            "total_students": total_students,
            "low_risk": risk_counts.get('Low', 0),
            "medium_risk": risk_counts.get('Medium', 0),
            "high_risk": risk_counts.get('High', 0),
            "avg_attendance": round(float(df_filtered['Attendance_Percent'].mean()), 2),
            "avg_gpa": round(float(df_filtered['Previous_GPA'].mean()), 2),
            "avg_marks": round(float(df_filtered['Average_Marks_Percent'].mean()), 2),
            "avg_assignment_completion": round(float(df_filtered['Assignment_Completion_Percent'].mean()), 2)
        }

    def get_courses_list(self):
        return sorted(self.df['Course'].unique().tolist())

    def get_semesters_list(self):
        return sorted(self.df['Semester'].unique().tolist())
