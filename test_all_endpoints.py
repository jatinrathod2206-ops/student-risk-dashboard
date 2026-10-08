import urllib.request
import urllib.parse
import json

BASE_URL = "http://127.0.0.1:8000"

def test_endpoint(name, url, method="GET", body=None):
    try:
        req = urllib.request.Request(url, method=method)
        if body:
            json_bytes = json.dumps(body).encode('utf-8')
            req.add_header('Content-Type', 'application/json')
            req.data = json_bytes

        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            print(f"[SUCCESS] {name}: {resp.status}")
            return data
    except Exception as e:
        print(f"[FAILED] {name}: {e}")
        return None

print("=== TESTING BACKEND REST ENDPOINTS ===")
test_endpoint("Health Check", f"{BASE_URL}/api/health")
test_endpoint("Dashboard Summary", f"{BASE_URL}/api/dashboard/summary")
test_endpoint("Risk Distribution", f"{BASE_URL}/api/dashboard/risk-distribution")
test_endpoint("Students List (limit 3)", f"{BASE_URL}/api/students?limit=3")
test_endpoint("Student Detail (ID 1)", f"{BASE_URL}/api/students/1")

sample_prediction = {
    "Age": 21,
    "Course": "Computer Engineering",
    "Semester": 6,
    "Attendance_Percent": 55.0,
    "Study_Hours_Per_Day": 1.5,
    "Assignment_Completion_Percent": 48.0,
    "Average_Marks_Percent": 42.0,
    "Previous_GPA": 5.8,
    "Failed_Subjects": 2,
    "Backlogs": 2,
    "Internal_Marks_Percent": 50.0,
    "Class_Participation_Score": 4,
    "Late_Submissions": 5,
    "Absences_Last_30_Days": 8,
    "Library_Visits_Per_Month": 2,
    "Online_Learning_Hours_Per_Week": 2.0,
    "Stress_Level": 4,
    "Financial_Pressure_Level": 3
}

pred_res = test_endpoint("AI Risk Predictor", f"{BASE_URL}/api/predict", method="POST", body=sample_prediction)
if pred_res:
    print("  -> Prediction Output:", pred_res.get("prediction"), "| Score:", pred_res.get("risk_score"))
    print("  -> Explanation:", pred_res.get("ai_explanation"))

test_endpoint("Early Warning System", f"{BASE_URL}/api/early-warning?limit=3")
test_endpoint("Model Performance", f"{BASE_URL}/api/model/performance")
print("=== ENDPOINT TESTS COMPLETE ===")
