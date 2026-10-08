from fastapi import APIRouter, Query, HTTPException, Depends
from fastapi.responses import StreamingResponse
import io
import pandas as pd

router = APIRouter(prefix="/api/students", tags=["Students"])

def get_data_service():
    from app.main import data_service
    return data_service

def get_prediction_service():
    from app.main import prediction_service
    return prediction_service

@router.get("")
def get_students_list(
    course: str = Query(None),
    semester: str = Query(None),
    risk_level: str = Query(None),
    search: str = Query(None),
    min_attendance: float = Query(None),
    max_attendance: float = Query(None),
    sort_by: str = Query("Student_ID"),
    sort_order: str = Query("asc"),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=200),
    ds = Depends(get_data_service)
):
    df_filtered = ds.get_all_students(
        course=course,
        semester=semester,
        risk_level=risk_level,
        search=search,
        min_attendance=min_attendance,
        max_attendance=max_attendance
    )

    # Sorting
    ascending = True if sort_order.lower() == 'asc' else False
    if sort_by in df_filtered.columns:
        df_filtered = df_filtered.sort_values(by=sort_by, ascending=ascending)

    total_records = len(df_filtered)
    total_pages = max(1, (total_records + limit - 1) // limit)

    start_idx = (page - 1) * limit
    end_idx = start_idx + limit

    paged_df = df_filtered.iloc[start_idx:end_idx]
    students_list = paged_df.to_dict(orient="records")

    return {
        "total": total_records,
        "page": page,
        "limit": limit,
        "total_pages": total_pages,
        "students": students_list
    }

@router.get("/export/csv")
def export_students_csv(
    course: str = Query(None),
    semester: str = Query(None),
    risk_level: str = Query(None),
    search: str = Query(None),
    ds = Depends(get_data_service)
):
    df_filtered = ds.get_all_students(
        course=course,
        semester=semester,
        risk_level=risk_level,
        search=search
    )

    stream = io.StringIO()
    df_filtered.to_csv(stream, index=False)
    response = StreamingResponse(
        iter([stream.getvalue()]),
        media_type="text/csv"
    )
    response.headers["Content-Disposition"] = "attachment; filename=student_risk_export.csv"
    return response

@router.get("/{student_id}")
def get_student_detail(
    student_id: int,
    ds = Depends(get_data_service),
    ps = Depends(get_prediction_service)
):
    student = ds.get_student_by_id(student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student record not found.")

    # Get live AI model prediction for this student
    prediction_result = ps.predict_risk(student)

    return {
        "student_info": student,
        "ai_prediction": prediction_result
    }
