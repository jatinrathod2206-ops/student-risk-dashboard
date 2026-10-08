from fastapi import APIRouter, Query, Depends
import pandas as pd

router = APIRouter(prefix="/api/early-warning", tags=["Early Warning System"])

def get_data_service():
    from app.main import data_service
    return data_service

def get_prediction_service():
    from app.main import prediction_service
    return prediction_service

@router.get("")
def get_early_warning_list(
    course: str = Query(None),
    priority: str = Query(None),
    limit: int = Query(50, le=500),
    ds = Depends(get_data_service),
    ps = Depends(get_prediction_service)
):
    df_filtered = ds.get_all_students(course=course)
    
    warning_list = []

    for _, row in df_filtered.iterrows():
        st = row.to_dict()
        risk_lvl = st['Risk_Level']
        att = st['Attendance_Percent']
        backlogs = st['Backlogs']
        failed = st['Failed_Subjects']

        # Determine Priority Category
        if risk_lvl == 'High' and (backlogs >= 2 or att < 50 or failed >= 2):
            category = "Critical"
            badge_color = "red"
        elif risk_lvl == 'High':
            category = "High Priority"
            badge_color = "orange"
        elif risk_lvl == 'Medium':
            category = "Monitor"
            badge_color = "yellow"
        else:
            category = "Stable"
            badge_color = "green"

        if priority and priority != "All" and category.lower() != priority.lower():
            continue

        # Dynamic Recommendation & Main Risk Factor
        recs = ps.generate_recommendations(st)
        main_rec = recs[0] if recs else "Maintain academic momentum."

        # Main factor
        if att < 60:
            main_factor = f"Critical Attendance ({att}%)"
        elif backlogs >= 2:
            main_factor = f"Multiple Backlogs ({backlogs})"
        elif failed >= 2:
            main_factor = f"Multiple Failed Subjects ({failed})"
        elif st['Assignment_Completion_Percent'] < 60:
            main_factor = f"Low Assignment Rate ({st['Assignment_Completion_Percent']}%)"
        elif st['Average_Marks_Percent'] < 50:
            main_factor = f"Low Average Marks ({st['Average_Marks_Percent']}%)"
        else:
            main_factor = "General Academic Monitoring"

        warning_list.append({
            "student_id": int(st['Student_ID']),
            "student_name": str(st['Student_Name']),
            "course": str(st['Course']),
            "semester": int(st['Semester']),
            "attendance": float(att),
            "gpa": float(st['Previous_GPA']),
            "risk_score": float(st['Risk_Score']),
            "risk_level": risk_lvl,
            "priority": category,
            "badge_color": badge_color,
            "main_risk_factor": main_factor,
            "recommended_action": main_rec
        })

    # Sort critical first, then high priority
    priority_order = {"Critical": 0, "High Priority": 1, "Monitor": 2, "Stable": 3}
    warning_list = sorted(warning_list, key=lambda x: (priority_order[x['priority']], -x['risk_score']))

    return warning_list[:limit]
