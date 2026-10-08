import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
import joblib

FEATURE_COLS = [
    'Age',
    'Course',
    'Semester',
    'Attendance_Percent',
    'Study_Hours_Per_Day',
    'Assignment_Completion_Percent',
    'Average_Marks_Percent',
    'Previous_GPA',
    'Failed_Subjects',
    'Backlogs',
    'Internal_Marks_Percent',
    'Class_Participation_Score',
    'Late_Submissions',
    'Absences_Last_30_Days',
    'Library_Visits_Per_Month',
    'Online_Learning_Hours_Per_Week',
    'Stress_Level',
    'Financial_Pressure_Level'
]

NUMERIC_COLS = [
    'Age',
    'Semester',
    'Attendance_Percent',
    'Study_Hours_Per_Day',
    'Assignment_Completion_Percent',
    'Average_Marks_Percent',
    'Previous_GPA',
    'Failed_Subjects',
    'Backlogs',
    'Internal_Marks_Percent',
    'Class_Participation_Score',
    'Late_Submissions',
    'Absences_Last_30_Days',
    'Library_Visits_Per_Month',
    'Online_Learning_Hours_Per_Week',
    'Stress_Level',
    'Financial_Pressure_Level'
]

CATEGORICAL_COLS = ['Course']
TARGET_COL = 'Risk_Level'

def load_raw_data(file_path: str) -> pd.DataFrame:
    df = pd.read_excel(file_path)
    # Basic validation
    missing = df[FEATURE_COLS + [TARGET_COL]].isnull().sum().sum()
    if missing > 0:
        df = df.dropna(subset=FEATURE_COLS + [TARGET_COL])
    return df

def create_preprocessing_pipeline(df: pd.DataFrame):
    """
    Fits encoders and scalers on dataset.
    Returns processed X, y, and preprocessor dictionary.
    """
    X = df[FEATURE_COLS].copy()
    y = df[TARGET_COL].copy()

    # Encoders
    course_encoder = LabelEncoder()
    X['Course_Encoded'] = course_encoder.fit_transform(X['Course'])

    target_encoder = LabelEncoder()
    # Ensure standard order: Low, Medium, High
    target_encoder.fit(['Low', 'Medium', 'High'])
    y_encoded = target_encoder.transform(y)

    # Feature column order for training
    model_feature_cols = [c for c in NUMERIC_COLS if c != 'Course'] + ['Course_Encoded']
    X_model = X[model_feature_cols]

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X_model)
    X_scaled_df = pd.DataFrame(X_scaled, columns=model_feature_cols)

    preprocessor = {
        'course_encoder': course_encoder,
        'target_encoder': target_encoder,
        'scaler': scaler,
        'feature_cols': model_feature_cols,
        'raw_feature_cols': FEATURE_COLS,
        'target_classes': list(target_encoder.classes_)
    }

    return X_scaled_df, y_encoded, preprocessor

def transform_input(input_dict: dict, preprocessor: dict) -> np.ndarray:
    """
    Transforms a single student input dict or dataframe row into model-ready array.
    """
    course_enc = preprocessor['course_encoder']
    scaler = preprocessor['scaler']
    feature_cols = preprocessor['feature_cols']

    df_single = pd.DataFrame([input_dict])
    
    # Handle course encoding
    course_val = df_single['Course'].iloc[0]
    if course_val in course_enc.classes_:
        df_single['Course_Encoded'] = course_enc.transform([course_val])[0]
    else:
        # Fallback to most frequent or 0 if unknown
        df_single['Course_Encoded'] = 0

    model_features = [c for c in NUMERIC_COLS if c != 'Course'] + ['Course_Encoded']
    X_input = df_single[model_features]
    X_scaled = scaler.transform(X_input)
    return X_scaled
