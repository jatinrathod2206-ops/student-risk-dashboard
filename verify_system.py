import urllib.request
import json

print("=== VERIFYING FULL APPLICATION STACK ===")

# Test 1: Frontend Server at http://127.0.0.1:3000
try:
    with urllib.request.urlopen("http://127.0.0.1:3000") as resp:
        html = resp.read().decode()
        print(f"[OK] React Frontend Dev Server is LIVE on http://127.0.0.1:3000 (HTML size: {len(html)} bytes)")
except Exception as e:
    print(f"[FAIL] React Frontend check failed: {e}")

# Test 2: FastAPI Backend at http://127.0.0.1:8000
try:
    with urllib.request.urlopen("http://127.0.0.1:8000/api/health") as resp:
        data = json.loads(resp.read().decode())
        print(f"[OK] FastAPI Backend Server is LIVE on http://127.0.0.1:8000/api/health => {data}")
except Exception as e:
    print(f"[FAIL] FastAPI Backend check failed: {e}")

# Test 3: Prediction API
try:
    sample_student = {
        "Age": 20, "Course": "Computer Engineering", "Semester": 5, "Attendance_Percent": 58.0,
        "Study_Hours_Per_Day": 1.5, "Assignment_Completion_Percent": 50.0, "Average_Marks_Percent": 48.0,
        "Previous_GPA": 5.9, "Failed_Subjects": 2, "Backlogs": 2, "Internal_Marks_Percent": 52.0,
        "Class_Participation_Score": 4, "Late_Submissions": 4, "Absences_Last_30_Days": 7,
        "Library_Visits_Per_Month": 2, "Online_Learning_Hours_Per_Week": 2.0, "Stress_Level": 4, "Financial_Pressure_Level": 3
    }
    req = urllib.request.Request("http://127.0.0.1:8000/api/predict", method="POST")
    req.add_header('Content-Type', 'application/json')
    req.data = json.dumps(sample_student).encode('utf-8')
    with urllib.request.urlopen(req) as resp:
        pred = json.loads(resp.read().decode())
        print(f"[OK] ML Risk Prediction API => Risk Level: {pred['prediction']} | Risk Score: {pred['risk_score']}/100")
except Exception as e:
    print(f"[FAIL] ML Risk Prediction API check failed: {e}")

print("=== FULL SYSTEM VERIFICATION COMPLETE ===")
