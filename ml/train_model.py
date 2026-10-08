import os
import sys
import json
import joblib
import pandas as pd
import numpy as np

# Ensure ml directory is in python path
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from preprocessing import load_raw_data, create_preprocessing_pipeline

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, classification_report, confusion_matrix

DATA_PATH = os.path.abspath(os.path.join(current_dir, '..', 'data', 'student_data.xlsx'))
MODEL_DIR = os.path.abspath(os.path.join(current_dir, '..', 'backend', 'model'))

os.makedirs(MODEL_DIR, exist_ok=True)

def train_and_evaluate():
    print("--- STEP 1: Loading Dataset ---")
    df = load_raw_data(DATA_PATH)
    print(f"Loaded {len(df)} student records.")

    print("\n--- STEP 2: Preprocessing Data (Target Leakage Protected) ---")
    X, y, preprocessor = create_preprocessing_pipeline(df)
    target_classes = [str(c) for c in preprocessor['target_classes']]
    print("Target classes:", target_classes)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    print(f"Train set: {len(X_train)} samples | Test set: {len(X_test)} samples.")

    print("\n--- STEP 3: Training Multiple Classification Models ---")
    models = {
        "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42, class_weight='balanced'),
        "Random Forest": RandomForestClassifier(n_estimators=150, max_depth=8, random_state=42, class_weight='balanced'),
        "Gradient Boosting": GradientBoostingClassifier(n_estimators=120, max_depth=4, learning_rate=0.08, random_state=42)
    }

    results = {}
    fitted_models = {}

    high_risk_idx = list(target_classes).index('High') if 'High' in target_classes else 0

    for name, model in models.items():
        print(f"\nTraining {name}...")
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)

        acc = accuracy_score(y_test, y_pred)
        prec_macro = precision_score(y_test, y_pred, average='macro', zero_division=0)
        rec_macro = recall_score(y_test, y_pred, average='macro', zero_division=0)
        f1_macro = f1_score(y_test, y_pred, average='macro', zero_division=0)
        
        rec_per_class = recall_score(y_test, y_pred, average=None, zero_division=0)
        high_risk_recall = float(rec_per_class[high_risk_idx])

        cm = confusion_matrix(y_test, y_pred).tolist()
        report = classification_report(y_test, y_pred, target_names=target_classes, output_dict=True)

        results[name] = {
            "accuracy": round(float(acc), 4),
            "precision_macro": round(float(prec_macro), 4),
            "recall_macro": round(float(rec_macro), 4),
            "f1_macro": round(float(f1_macro), 4),
            "high_risk_recall": round(float(high_risk_recall), 4),
            "confusion_matrix": cm,
            "classification_report": report
        }
        fitted_models[name] = model

        print(f"  {name} => Acc: {acc:.4f} | Macro F1: {f1_macro:.4f} | High Risk Recall: {high_risk_recall:.4f}")

    print("\n--- STEP 4: Selecting Best Model ---")
    best_name = max(results.keys(), key=lambda k: (results[k]['high_risk_recall'] * 0.6 + results[k]['f1_macro'] * 0.4))
    best_model = fitted_models[best_name]
    print(f"Selected Best Model: {best_name}")

    print("\n--- STEP 5: Calculating Feature Importances ---")
    feature_names = list(X.columns)
    if hasattr(best_model, 'feature_importances_'):
        importances = best_model.feature_importances_.tolist()
    elif hasattr(best_model, 'coef_'):
        importances = np.abs(best_model.coef_).mean(axis=0).tolist()
    else:
        importances = [1.0 / len(feature_names)] * len(feature_names)

    sum_imp = sum(importances) if sum(importances) > 0 else 1.0
    importances_pct = [round((val / sum_imp) * 100, 2) for val in importances]

    feature_importance_list = sorted([
        {"feature": name, "importance": pct}
        for name, pct in zip(feature_names, importances_pct)
    ], key=lambda x: x["importance"], reverse=True)

    print("\nTop 5 Feature Importances:")
    for item in feature_importance_list[:5]:
        print(f"  {item['feature']}: {item['importance']}%")

    print("\n--- STEP 6: Saving Model Artifacts ---")
    model_path = os.path.join(MODEL_DIR, 'student_risk_model.pkl')
    preprocessor_path = os.path.join(MODEL_DIR, 'preprocessor.pkl')
    metrics_path = os.path.join(MODEL_DIR, 'model_metrics.json')
    features_path = os.path.join(MODEL_DIR, 'feature_names.json')

    joblib.dump(best_model, model_path)
    joblib.dump(preprocessor, preprocessor_path)

    metrics_payload = {
        "selected_model": best_name,
        "target_classes": target_classes,
        "comparison": results,
        "feature_importances": feature_importance_list,
        "feature_names": feature_names
    }

    with open(metrics_path, 'w') as f:
        json.dump(metrics_payload, f, indent=2)

    with open(features_path, 'w') as f:
        json.dump(feature_names, f, indent=2)

    print(f"Saved best model to {model_path}")
    print(f"Saved preprocessor to {preprocessor_path}")
    print(f"Saved metrics report to {metrics_path}")
    print("Training complete successfully!")

if __name__ == "__main__":
    train_and_evaluate()
