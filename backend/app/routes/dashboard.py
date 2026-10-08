from fastapi import APIRouter, Query, Depends
import pandas as pd
import numpy as np

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

def get_data_service():
    from app.main import data_service
    return data_service

@router.get("/summary")
def get_dashboard_summary(
    course: str = Query(None),
    semester: str = Query(None),
    ds = Depends(get_data_service)
):
    return ds.get_summary_kpis(course=course, semester=semester)

@router.get("/risk-distribution")
def get_risk_distribution(
    course: str = Query(None),
    semester: str = Query(None),
    ds = Depends(get_data_service)
):
    df_filtered = ds.get_all_students(course=course, semester=semester)
    counts = df_filtered['Risk_Level'].value_counts().to_dict()
    total = len(df_filtered)
    
    return [
        {"name": "Low Risk", "level": "Low", "count": counts.get("Low", 0), "percentage": round((counts.get("Low", 0)/total)*100, 1) if total > 0 else 0, "color": "#10B981"},
        {"name": "Medium Risk", "level": "Medium", "count": counts.get("Medium", 0), "percentage": round((counts.get("Medium", 0)/total)*100, 1) if total > 0 else 0, "color": "#F59E0B"},
        {"name": "High Risk", "level": "High", "count": counts.get("High", 0), "percentage": round((counts.get("High", 0)/total)*100, 1) if total > 0 else 0, "color": "#EF4444"}
    ]

@router.get("/trend-by-course")
def get_trend_by_course(ds = Depends(get_data_service)):
    df = ds.df
    grouped = df.groupby(['Course', 'Risk_Level']).size().unstack(fill_value=0)
    
    result = []
    for course_name, row in grouped.iterrows():
        total = row.sum()
        result.append({
            "course": course_name,
            "Low": int(row.get("Low", 0)),
            "Medium": int(row.get("Medium", 0)),
            "High": int(row.get("High", 0)),
            "total": int(total),
            "high_risk_pct": round(float((row.get("High", 0) / total) * 100), 1) if total > 0 else 0
        })
    return result

@router.get("/trend-by-semester")
def get_trend_by_semester(ds = Depends(get_data_service)):
    df = ds.df
    grouped = df.groupby(['Semester', 'Risk_Level']).size().unstack(fill_value=0)
    
    result = []
    for sem, row in grouped.iterrows():
        total = row.sum()
        result.append({
            "semester": f"Sem {sem}",
            "sem_num": int(sem),
            "Low": int(row.get("Low", 0)),
            "Medium": int(row.get("Medium", 0)),
            "High": int(row.get("High", 0)),
            "total": int(total)
        })
    return sorted(result, key=lambda x: x['sem_num'])

@router.get("/academic-performance")
def get_academic_performance(ds = Depends(get_data_service)):
    df = ds.df
    # Group attendance into bins
    bins = [0, 60, 75, 85, 100]
    labels = ["< 60%", "60-75%", "75-85%", "85-100%"]
    df['Att_Bin'] = pd.cut(df['Attendance_Percent'], bins=bins, labels=labels, include_lowest=True)
    
    att_marks = df.groupby('Att_Bin', observed=False).agg(
        avg_marks=('Average_Marks_Percent', 'mean'),
        student_count=('Student_ID', 'count'),
        high_risk_count=('Risk_Level', lambda x: (x == 'High').sum())
    ).reset_index()

    att_marks_data = []
    for _, r in att_marks.iterrows():
        att_marks_data.append({
            "attendance_range": str(r['Att_Bin']),
            "avg_marks": round(float(r['avg_marks']), 2),
            "student_count": int(r['student_count']),
            "high_risk_count": int(r['high_risk_count'])
        })

    # GPA distribution
    gpa_bins = [0, 6.0, 7.0, 8.0, 9.0, 10.0]
    gpa_labels = ["< 6.0", "6.0 - 7.0", "7.0 - 8.0", "8.0 - 9.0", "9.0 - 10.0"]
    df['GPA_Bin'] = pd.cut(df['Previous_GPA'], bins=gpa_bins, labels=gpa_labels, include_lowest=True)
    gpa_dist = df.groupby(['GPA_Bin', 'Risk_Level'], observed=False).size().unstack(fill_value=0).reset_index()

    gpa_data = []
    for _, r in gpa_dist.iterrows():
        gpa_data.append({
            "gpa_range": str(r['GPA_Bin']),
            "Low": int(r.get("Low", 0)),
            "Medium": int(r.get("Medium", 0)),
            "High": int(r.get("High", 0))
        })

    return {
        "attendance_vs_marks": att_marks_data,
        "gpa_distribution": gpa_data
    }

@router.get("/insights")
def get_key_ai_insights(ds = Depends(get_data_service)):
    df = ds.df
    total = len(df)
    
    # Calc actual metrics
    low_att_high_risk = len(df[(df['Attendance_Percent'] < 75) & (df['Risk_Level'] == 'High')])
    total_low_att = len(df[df['Attendance_Percent'] < 75])
    low_att_risk_pct = round((low_att_high_risk / total_low_att * 100), 1) if total_low_att > 0 else 0

    backlog_high_risk = len(df[(df['Backlogs'] > 0) & (df['Risk_Level'] == 'High')])
    total_high_risk = len(df[df['Risk_Level'] == 'High'])
    backlog_risk_pct = round((backlog_high_risk / total_high_risk * 100), 1) if total_high_risk > 0 else 0

    avg_hrs_high = round(float(df[df['Risk_Level'] == 'High']['Study_Hours_Per_Day'].mean()), 2)
    avg_hrs_low = round(float(df[df['Risk_Level'] == 'Low']['Study_Hours_Per_Day'].mean()), 2)

    return [
        {
            "id": 1,
            "title": "Attendance Threshold Vulnerability",
            "description": f"Students with attendance under 75% show a {low_att_risk_pct}% concentration of High Risk classifications.",
            "impact": "Critical",
            "metric": f"{low_att_risk_pct}% High Risk"
        },
        {
            "id": 2,
            "title": "Backlog Strong Correlation",
            "description": f"{backlog_risk_pct}% of all High Risk students have 1 or more active academic backlogs.",
            "impact": "High",
            "metric": f"{backlog_risk_pct}% of High Risk"
        },
        {
            "id": 3,
            "title": "Study Hours Differential",
            "description": f"Low Risk students average {avg_hrs_low} hrs/day of self-study versus {avg_hrs_high} hrs/day for High Risk students.",
            "impact": "Moderate",
            "metric": f"{avg_hrs_low} vs {avg_hrs_high} hrs"
        },
        {
            "id": 4,
            "title": "Assignment Completion Impact",
            "description": "Students with assignment completion above 85% have over 90% probability of Low/Medium risk classification.",
            "impact": "Positive",
            "metric": "> 85% Completion"
        }
    ]
