from fastapi import APIRouter, HTTPException
import os
import json

router = APIRouter(prefix="/api/model", tags=["Model Performance"])

MODEL_DIR = r'C:\Users\Baps\.gemini\antigravity-ide\scratch\student-risk-dashboard\backend\model'

@router.get("/performance")
def get_model_performance():
    metrics_path = os.path.join(MODEL_DIR, "model_metrics.json")
    if not os.path.exists(metrics_path):
        raise HTTPException(status_code=404, detail="Model metrics file not found. Train the model first.")

    with open(metrics_path, "r") as f:
        data = json.load(f)

    # Format model comparison table
    comparison = data.get("comparison", {})
    comparison_table = []
    for model_name, m in comparison.items():
        comparison_table.append({
            "model": model_name,
            "accuracy": m.get("accuracy"),
            "precision": m.get("precision_macro"),
            "recall": m.get("recall_macro"),
            "high_risk_recall": m.get("high_risk_recall"),
            "f1_score": m.get("f1_macro"),
            "is_selected": model_name == data.get("selected_model")
        })

    best_name = data.get("selected_model")
    best_metrics = comparison.get(best_name, {})

    return {
        "selected_model": best_name,
        "target_classes": data.get("target_classes"),
        "metrics": {
            "accuracy": best_metrics.get("accuracy"),
            "precision": best_metrics.get("precision_macro"),
            "recall": best_metrics.get("recall_macro"),
            "high_risk_recall": best_metrics.get("high_risk_recall"),
            "f1_score": best_metrics.get("f1_macro"),
            "confusion_matrix": best_metrics.get("confusion_matrix"),
            "classification_report": best_metrics.get("classification_report")
        },
        "model_comparison": comparison_table,
        "feature_importances": data.get("feature_importances", [])
    }
