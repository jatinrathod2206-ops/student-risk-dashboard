# AI-Based Student Risk Dashboard & Early Warning Intelligence System

[![Python](https://img.shields.io/badge/Python-3.13-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.143-emerald.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.2-sky.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-1.9-orange.svg)](https://scikit-learn.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38bdf8.svg)](https://tailwindcss.com/)

An end-to-end, production-grade **AI-Based Student Risk Dashboard** built for educational institutions, academic advisors, and faculty administrators. The system leverages machine learning classification algorithms trained on a 1,000-student academic and behavioral dataset to predict student risk levels (`Low`, `Medium`, `High`), identify critical risk factors, and provide automated early-warning intervention recommendations.

---

## 📌 Problem Statement

In higher education institutions, students undergoing academic distress, attendance drop-offs, or personal challenges are frequently identified too late—often after semester examination failures or severe backlog accumulation. Traditional ERP systems provide static reports but lack predictive early warning capabilities.

This project solves this problem by training a supervised Machine Learning model to evaluate 18 academic and behavioral indicators simultaneously, generating early predictions of student risk before failures occur.

---

## 🎯 Objectives

1. **Dataset Integration**: Process and validate the primary 1,000-student Excel dataset (`AI_Student_Risk_Dashboard_1000_Students.xlsx`).
2. **Target Leakage Protection**: Exclude derived features like `Risk_Score` from input feature matrix `X` to ensure true supervised learning integrity.
3. **ML Pipeline Benchmark**: Train and compare Logistic Regression, Random Forest, and Gradient Boosting models, prioritizing **High Risk Recall** to ensure zero missed critical cases.
4. **REST API Backend**: Build a modular FastAPI backend delivering dashboard summaries, filtering, model inferences, and early-warning queues.
5. **Interactive UI/UX**: Build a responsive React + TypeScript + Tailwind CSS dashboard with dark glassmorphism aesthetics, Recharts visualizations, student directory, individual student profiles, and real-time risk predictor.

---

## 🚀 Key Features

- **Executive Dashboard**: KPI stat cards, Risk Level distribution donut chart, Course & Semester risk trends, Attendance vs Marks scatter/bin charts, and automated AI Insights.
- **Searchable Student Directory**: Full text search across 1,000 students, filters by Course, Semester, and Risk Level (`Low 🟢`, `Medium 🟡`, `High 🔴`), column sorting, pagination, and CSV export.
- **Individual Student Profile**: Comprehensive student dossier displaying attendance, GPA, marks, backlogs, failed subjects, stress level, continuous Risk Score (0-100), AI risk probabilities, and top risk factors.
- **Interactive AI Risk Predictor**: Form interface allowing faculty to enter custom student parameters and instantly compute ML risk classification, exact probability breakdown, and actionable interventions.
- **Institutional Analytics**: Deep analytics across course risk concentration, semester progression, academic parameters, and student engagement indicators.
- **Faculty Early Warning System**: Automated priority queue categorizing students into `Critical`, `High Priority`, `Monitor`, and `Stable` tiers with recommended interventions.
- **Model Performance & Explainability**: Model comparison benchmark table, confusion matrix, and feature importance rankings (`Failed Subjects`, `Backlogs`, `Attendance %`, `Assignment Rate %`).

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + Vanilla CSS Design System
- **Icons**: Lucide React
- **Charting**: Recharts

### Backend API
- **Framework**: Python 3.13 + FastAPI
- **Web Server**: Uvicorn
- **Data Engineering**: pandas, openpyxl, numpy
- **Serialization**: joblib, pydantic

### Machine Learning
- **Libraries**: scikit-learn (Logistic Regression, Random Forest, Gradient Boosting)
- **Evaluation Metrics**: Accuracy, Precision (Macro), Recall (Macro), **High Risk Recall (100.0%)**, Macro F1-Score, Confusion Matrix, Classification Report

---

## 📊 Dataset & Target Leakage Analysis

- **File Source**: `AI_Student_Risk_Dashboard_1000_Students.xlsx` (1,000 synthetic student records, 22 columns).
- **Target Variable (`y`)**: `Risk_Level` (`Low`: 226, `Medium`: 640, `High`: 134).
- **Target Leakage Audit**: `Risk_Score` was identified as directly correlated with target cutoffs. Consequently, `Risk_Score` is **excluded from model training input features** `X`.

### Included Features (18 Parameters)
`Age`, `Course`, `Semester`, `Attendance_Percent`, `Study_Hours_Per_Day`, `Assignment_Completion_Percent`, `Average_Marks_Percent`, `Previous_GPA`, `Failed_Subjects`, `Backlogs`, `Internal_Marks_Percent`, `Class_Participation_Score`, `Late_Submissions`, `Absences_Last_30_Days`, `Library_Visits_Per_Month`, `Online_Learning_Hours_Per_Week`, `Stress_Level`, `Financial_Pressure_Level`.

---

## 🤖 Machine Learning Pipeline & Results

Models were trained on an 80% train / 20% test stratified split:

| Algorithm | Accuracy | Precision (Macro) | Recall (Macro) | High Risk Recall | F1 Score (Macro) | Status |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Logistic Regression (Class-Weighted)** | **93.00%** | **91.56%** | **95.68%** | **100.00%** | **91.56%** | **SELECTED BEST MODEL** |
| Random Forest Classifier | 81.50% | 76.80% | 71.40% | 62.96% | 76.30% | Evaluated |
| Gradient Boosting Classifier | 75.00% | 68.20% | 58.10% | 33.33% | 63.47% | Evaluated |

> **Selection Rationale**: Logistic Regression achieved **100% High Risk Recall**, ensuring that **zero at-risk students are missed** (no false negatives for critical cases).

### Top Feature Importance Rankings
1. `Failed_Subjects` — **14.71%**
2. `Backlogs` — **13.04%**
3. `Attendance_Percent` — **11.49%**
4. `Assignment_Completion_Percent` — **10.47%**
5. `Average_Marks_Percent` — **9.64%**
6. `Study_Hours_Per_Day` — **8.22%**

---

## 🏗️ Project Architecture

```
student-risk-dashboard/
│
├── data/
│   └── student_data.xlsx              # Primary 1,000 student Excel dataset
│
├── ml/
│   ├── inspect_dataset.py            # Dataset EDA & correlation audit
│   ├── preprocessing.py              # Data cleaning, scaling, & encoding
│   └── train_model.py                # ML pipeline training & evaluation
│
├── backend/
│   ├── app/
│   │   ├── main.py                   # FastAPI app entry point
│   │   ├── start_server.py           # Uvicorn launcher script
│   │   ├── routes/                   # API Routers (dashboard, students, predict, etc.)
│   │   └── services/                 # Business logic (DataService, PredictionService)
│   ├── model/                        # Saved joblib models & metrics JSON
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/               # Sidebar, Topbar, Footer, KPICard
│   │   ├── pages/                    # 7 Dashboard Pages
│   │   ├── services/api.ts           # REST API Client
│   │   ├── types.ts                  # TypeScript interfaces
│   │   ├── App.tsx                   # Main App Router
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── test_all_endpoints.py             # Automated REST API unit tests
├── verify_system.py                  # Full-stack integration test
└── README.md
```

---

## ⚡ Quick Start & Installation

### 1. Prerequisites
- **Python**: 3.10+ (Tested on Python 3.13)
- **Node.js**: 18+ (Tested on Node v24.20)

### 2. Machine Learning Model Training
```bash
# Navigate to project root
cd student-risk-dashboard

# Run ML pipeline to train models and export artifacts
python ml/train_model.py
```

### 3. Start Backend REST API
```bash
# Navigate to backend
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start FastAPI server (runs on http://127.0.0.1:8000)
python app/start_server.py
```

### 4. Start React Frontend
```bash
# In a new terminal, navigate to frontend
cd frontend

# Install Node dependencies
npm install

# Start Vite dev server (runs on http://127.0.0.1:3000)
npm run dev
```

Open your browser at **`http://127.0.0.1:3000`**.

---

## 📡 API Endpoints Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health status and data/model load state |
| `GET` | `/api/dashboard/summary` | KPI stat metrics (total, low/med/high, averages) |
| `GET` | `/api/dashboard/risk-distribution` | Risk level breakdown counts & percentages |
| `GET` | `/api/dashboard/trend-by-course` | Risk distribution grouped by course |
| `GET` | `/api/dashboard/trend-by-semester` | Risk distribution grouped by semester |
| `GET` | `/api/students` | Searchable, filterable, paginated student list |
| `GET` | `/api/students/{id}` | Detailed student profile + live ML risk prediction |
| `GET` | `/api/students/export/csv` | Download filtered student list as CSV |
| `POST` | `/api/predict` | Predict risk for custom student parameters |
| `GET` | `/api/early-warning` | Categorized intervention queue (`Critical`, `High Priority`) |
| `GET` | `/api/model/performance` | Model evaluation comparison, confusion matrix, feature importances |

---

## 🔮 Future Scope & Enhancements

1. **University ERP Integration**: Connect directly via Webhooks/REST to active university management databases (e.g. Canvas, Moodle, Banner).
2. **Automated Faculty Alerts**: Send automated email/SMS notifications to academic advisors when a student enters `Critical` risk tier.
3. **Student Portal Mobile App**: Provide students with personalized academic wellness dashboards and study time tracking.
4. **Advanced SHAP Explainable AI**: Integrate SHAP force plots for individual feature impact visualization.

---

## 📄 License & Disclaimer

*This application is developed as an academic portfolio project for Computer Engineering demonstration. All student records in `AI_Student_Risk_Dashboard_1000_Students.xlsx` are synthetic for demonstration purposes.*
