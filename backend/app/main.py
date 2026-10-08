import os
import sys

# Absolute path to project root and ml folder
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, '..', '..'))
ml_dir = os.path.join(project_root, 'ml')
backend_dir = os.path.join(project_root, 'backend')

for d in [project_root, ml_dir, backend_dir]:
    if d not in sys.path:
        sys.path.insert(0, d)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.services.data_service import DataService
from app.services.prediction_service import PredictionService

from app.routes.dashboard import router as dashboard_router
from app.routes.students import router as students_router
from app.routes.predict import router as predict_router
from app.routes.analytics import router as analytics_router
from app.routes.early_warning import router as early_warning_router
from app.routes.model import router as model_router

data_service: DataService = None
prediction_service: PredictionService = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global data_service, prediction_service
    print("[INFO] Initializing AI Student Risk Dashboard Backend Services...")
    data_service = DataService()
    prediction_service = PredictionService()
    print("[SUCCESS] Backend services initialized successfully!")
    yield
    print("[INFO] Shutting down backend services...")

app = FastAPI(
    title="AI Student Risk Dashboard API",
    description="Production REST API for AI-based student risk analysis, prediction, early-warning system, and performance analytics.",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(dashboard_router)
app.include_router(students_router)
app.include_router(predict_router)
app.include_router(analytics_router)
app.include_router(early_warning_router)
app.include_router(model_router)

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "AI Student Risk Dashboard API",
        "version": "1.0.0",
        "dataset_records": len(data_service.df) if data_service else 0,
        "docs_url": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "data_loaded": data_service is not None and data_service.df is not None,
        "model_loaded": prediction_service is not None and prediction_service.model is not None
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
