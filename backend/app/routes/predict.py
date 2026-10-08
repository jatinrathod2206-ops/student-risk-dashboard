from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import List, Optional

router = APIRouter(prefix="/api/predict", tags=["AI Risk Predictor"])

def get_prediction_service():
    from app.main import prediction_service
    return prediction_service

class StudentInputSchema(BaseModel):
    Age: int = Field(..., ge=15, le=60, example=20)
    Course: str = Field(..., example="Computer Engineering")
    Semester: int = Field(..., ge=1, le=10, example=5)
    Attendance_Percent: float = Field(..., ge=0, le=100, example=65.5)
    Study_Hours_Per_Day: float = Field(..., ge=0, le=24, example=2.5)
    Assignment_Completion_Percent: float = Field(..., ge=0, le=100, example=60.0)
    Average_Marks_Percent: float = Field(..., ge=0, le=100, example=52.0)
    Previous_GPA: float = Field(..., ge=0, le=10, example=6.2)
    Failed_Subjects: int = Field(..., ge=0, le=20, example=1)
    Backlogs: int = Field(..., ge=0, le=20, example=1)
    Internal_Marks_Percent: float = Field(..., ge=0, le=100, example=58.0)
    Class_Participation_Score: int = Field(..., ge=1, le=10, example=5)
    Late_Submissions: int = Field(..., ge=0, le=30, example=3)
    Absences_Last_30_Days: int = Field(..., ge=0, le=30, example=5)
    Library_Visits_Per_Month: int = Field(..., ge=0, le=50, example=4)
    Online_Learning_Hours_Per_Week: float = Field(..., ge=0, le=100, example=3.0)
    Stress_Level: int = Field(..., ge=1, le=5, example=4)
    Financial_Pressure_Level: int = Field(..., ge=1, le=5, example=3)

@router.post("")
def predict_single_student(
    student_data: StudentInputSchema,
    ps = Depends(get_prediction_service)
):
    try:
        data_dict = student_data.model_dump()
        result = ps.predict_risk(data_dict)
        return {
            "status": "success",
            "input": data_dict,
            "prediction": result["prediction"],
            "risk_score": result["risk_score"],
            "probabilities": result["probabilities"],
            "risk_factors": result["risk_factors"],
            "ai_explanation": result["ai_explanation"],
            "recommendations": result["recommendations"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@router.post("/batch")
def predict_batch_students(
    students: List[StudentInputSchema],
    ps = Depends(get_prediction_service)
):
    results = []
    for s in students:
        d = s.model_dump()
        res = ps.predict_risk(d)
        results.append({
            "course": d["Course"],
            "semester": d["Semester"],
            "prediction": res["prediction"],
            "risk_score": res["risk_score"],
            "probabilities": res["probabilities"],
            "risk_factors": res["risk_factors"]
        })
    return {
        "count": len(results),
        "results": results
    }
