from fastapi import APIRouter, Depends
import pandas as pd
import numpy as np

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])

def get_data_service():
    from app.main import data_service
    return data_service

@router.get("/course-analysis")
def get_course_analysis(ds = Depends(get_data_service)):
    df = ds.df
    grouped = df.groupby('Course').agg(
        total_students=('Student_ID', 'count'),
        avg_attendance=('Attendance_Percent', 'mean'),
        avg_gpa=('Previous_GPA', 'mean'),
        avg_marks=('Average_Marks_Percent', 'mean'),
        high_risk_count=('Risk_Level', lambda x: (x == 'High').sum()),
        medium_risk_count=('Risk_Level', lambda x: (x == 'Medium').sum()),
        low_risk_count=('Risk_Level', lambda x: (x == 'Low').sum())
    ).reset_index()

    result = []
    for _, r in grouped.iterrows():
        tot = r['total_students']
        result.append({
            "course": r['Course'],
            "total_students": int(tot),
            "avg_attendance": round(float(r['avg_attendance']), 1),
            "avg_gpa": round(float(r['avg_gpa']), 2),
            "avg_marks": round(float(r['avg_marks']), 1),
            "High": int(r['high_risk_count']),
            "Medium": int(r['medium_risk_count']),
            "Low": int(r['low_risk_count']),
            "high_risk_pct": round(float(r['high_risk_count'] / tot * 100), 1) if tot > 0 else 0
        })
    return result

@router.get("/semester-analysis")
def get_semester_analysis(ds = Depends(get_data_service)):
    df = ds.df
    grouped = df.groupby('Semester').agg(
        avg_attendance=('Attendance_Percent', 'mean'),
        avg_gpa=('Previous_GPA', 'mean'),
        avg_marks=('Average_Marks_Percent', 'mean'),
        high_risk_count=('Risk_Level', lambda x: (x == 'High').sum()),
        total_students=('Student_ID', 'count')
    ).reset_index()

    result = []
    for _, r in grouped.iterrows():
        result.append({
            "semester": f"Sem {int(r['Semester'])}",
            "sem_num": int(r['Semester']),
            "avg_attendance": round(float(r['avg_attendance']), 1),
            "avg_gpa": round(float(r['avg_gpa']), 2),
            "avg_marks": round(float(r['avg_marks']), 1),
            "high_risk_count": int(r['high_risk_count']),
            "total_students": int(r['total_students'])
        })
    return sorted(result, key=lambda x: x['sem_num'])

@router.get("/academic-vs-risk")
def get_academic_vs_risk(ds = Depends(get_data_service)):
    df = ds.df
    grouped = df.groupby('Risk_Level').agg(
        avg_gpa=('Previous_GPA', 'mean'),
        avg_marks=('Average_Marks_Percent', 'mean'),
        avg_failed=('Failed_Subjects', 'mean'),
        avg_backlogs=('Backlogs', 'mean'),
        avg_attendance=('Attendance_Percent', 'mean')
    ).reset_index()

    result = []
    for _, r in grouped.iterrows():
        result.append({
            "risk_level": r['Risk_Level'],
            "avg_gpa": round(float(r['avg_gpa']), 2),
            "avg_marks": round(float(r['avg_marks']), 1),
            "avg_failed": round(float(r['avg_failed']), 2),
            "avg_backlogs": round(float(r['avg_backlogs']), 2),
            "avg_attendance": round(float(r['avg_attendance']), 1)
        })
    return result

@router.get("/engagement-vs-risk")
def get_engagement_vs_risk(ds = Depends(get_data_service)):
    df = ds.df
    grouped = df.groupby('Risk_Level').agg(
        avg_study_hours=('Study_Hours_Per_Day', 'mean'),
        avg_assignment_pct=('Assignment_Completion_Percent', 'mean'),
        avg_participation=('Class_Participation_Score', 'mean'),
        avg_library_visits=('Library_Visits_Per_Month', 'mean'),
        avg_online_hrs=('Online_Learning_Hours_Per_Week', 'mean')
    ).reset_index()

    result = []
    for _, r in grouped.iterrows():
        result.append({
            "risk_level": r['Risk_Level'],
            "avg_study_hours": round(float(r['avg_study_hours']), 2),
            "avg_assignment_pct": round(float(r['avg_assignment_pct']), 1),
            "avg_participation": round(float(r['avg_participation']), 2),
            "avg_library_visits": round(float(r['avg_library_visits']), 1),
            "avg_online_hrs": round(float(r['avg_online_hrs']), 1)
        })
    return result
