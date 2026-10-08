import os
import sys
import joblib
import numpy as np
import pandas as pd

current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, '..', '..', '..'))
ml_dir = os.path.join(project_root, 'ml')
if ml_dir not in sys.path:
    sys.path.insert(0, ml_dir)

from preprocessing import transform_input, NUMERIC_COLS

MODEL_DIR = os.path.abspath(os.path.join(current_dir, '..', '..', 'model'))

class PredictionService:
    def __init__(self, model_dir: str = MODEL_DIR):
        self.model_dir = model_dir
        self.model = None
        self.preprocessor = None
        self.load_model_artifacts()

    def load_model_artifacts(self):
        model_path = os.path.join(self.model_dir, 'student_risk_model.pkl')
        preprocessor_path = os.path.join(self.model_dir, 'preprocessor.pkl')

        if not os.path.exists(model_path) or not os.path.exists(preprocessor_path):
            raise FileNotFoundError(f"Model or Preprocessor missing at {self.model_dir}")

        self.model = joblib.load(model_path)
        self.preprocessor = joblib.load(preprocessor_path)

    def generate_recommendations(self, data: dict) -> list:
        recs = []
        att = float(data.get('Attendance_Percent', 100))
        assign = float(data.get('Assignment_Completion_Percent', 100))
        backlogs = int(data.get('Backlogs', 0))
        failed = int(data.get('Failed_Subjects', 0))
        study_hrs = float(data.get('Study_Hours_Per_Day', 0))
        stress = int(data.get('Stress_Level', 1))
        late = int(data.get('Late_Submissions', 0))
        avg_marks = float(data.get('Average_Marks_Percent', 100))

        if att < 60:
            recs.append("Attendance improvement required immediately (below 60%). Contact academic coordinator.")
        elif att < 75:
            recs.append("Monitor attendance closely to reach the 75% mandatory threshold.")

        if assign < 60:
            recs.append("Create an assignment completion plan and request extended guidance for pending tasks.")

        if backlogs >= 2:
            recs.append("Schedule academic counseling to clear backlogs before the upcoming semester exams.")

        if failed >= 2:
            recs.append("Recommend subject-specific academic tutoring and remedial classes.")

        if study_hrs < 2.0:
            recs.append("Establish a structured daily study timetable with at least 2.5 hours of dedicated self-study.")

        if stress >= 4:
            recs.append("Recommend contacting student wellness and counseling support services for stress management.")

        if late >= 4:
            recs.append("Implement a task priority list to prevent late submission penalties.")

        if avg_marks < 50:
            recs.append("Join peer study groups and attend weekly professor office hours for concept revision.")

        if not recs:
            recs.append("Maintain current academic performance and continue consistent study habits.")

        return recs

    def predict_risk(self, student_data: dict) -> dict:
        X_scaled = transform_input(student_data, self.preprocessor)
        
        # Get model predictions
        pred_class_idx = self.model.predict(X_scaled)[0]
        target_classes = [str(c) for c in self.preprocessor['target_classes']]
        predicted_level = str(target_classes[pred_class_idx])

        # Get class probabilities
        if hasattr(self.model, 'predict_proba'):
            probs = self.model.predict_proba(X_scaled)[0]
            prob_dict = {str(target_classes[i]): round(float(probs[i]), 4) for i in range(len(target_classes))}
        else:
            prob_dict = {"Low": 0.33, "Medium": 0.33, "High": 0.34}

        # Calculate continuous Risk Score (0 - 100)
        high_p = prob_dict.get('High', 0.0)
        med_p = prob_dict.get('Medium', 0.0)
        low_p = prob_dict.get('Low', 0.0)

        risk_score = round(float(high_p * 100 + med_p * 45 + low_p * 10), 2)
        risk_score = min(100.0, max(0.0, risk_score))

        # Identify key risk factors specific to student
        key_risk_factors = []
        if float(student_data.get('Attendance_Percent', 100)) < 75:
            key_risk_factors.append(f"Low Attendance ({student_data.get('Attendance_Percent')}%)")
        if int(student_data.get('Backlogs', 0)) > 0:
            key_risk_factors.append(f"Active Backlogs ({student_data.get('Backlogs')} subjects)")
        if int(student_data.get('Failed_Subjects', 0)) > 0:
            key_risk_factors.append(f"Failed Subjects ({student_data.get('Failed_Subjects')} subjects)")
        if float(student_data.get('Assignment_Completion_Percent', 100)) < 70:
            key_risk_factors.append(f"Low Assignment Completion ({student_data.get('Assignment_Completion_Percent')}%)")
        if float(student_data.get('Average_Marks_Percent', 100)) < 55:
            key_risk_factors.append(f"Low Average Marks ({student_data.get('Average_Marks_Percent')}%)")
        if float(student_data.get('Study_Hours_Per_Day', 0)) < 2:
            key_risk_factors.append(f"Low Daily Study Hours ({student_data.get('Study_Hours_Per_Day')} hrs/day)")
        if int(student_data.get('Late_Submissions', 0)) >= 3:
            key_risk_factors.append(f"Frequent Late Submissions ({student_data.get('Late_Submissions')} times)")
        if int(student_data.get('Stress_Level', 1)) >= 4:
            key_risk_factors.append(f"High Stress Level ({student_data.get('Stress_Level')}/5)")

        if not key_risk_factors:
            key_risk_factors.append("No critical risk factors identified. Consistent academic standing.")

        # AI explanation
        if predicted_level == "High":
            ai_explanation = f"Student is classified as HIGH RISK ({prob_dict.get('High', 0)*100:.1f}% probability) primarily due to {', '.join(key_risk_factors[:3])}."
        elif predicted_level == "Medium":
            ai_explanation = f"Student is classified as MEDIUM RISK ({prob_dict.get('Medium', 0)*100:.1f}% probability). Academic monitoring recommended for {', '.join(key_risk_factors[:2])}."
        else:
            ai_explanation = f"Student is classified as LOW RISK ({prob_dict.get('Low', 0)*100:.1f}% probability) with strong performance metrics."

        recommendations = self.generate_recommendations(student_data)

        return {
            "prediction": predicted_level,
            "risk_score": risk_score,
            "probabilities": prob_dict,
            "risk_factors": key_risk_factors,
            "ai_explanation": ai_explanation,
            "recommendations": recommendations
        }
