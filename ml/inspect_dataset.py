import pandas as pd
import numpy as np

file_path = r'C:\Users\Baps\.gemini\antigravity-ide\scratch\student-risk-dashboard\data\student_data.xlsx'
df = pd.read_excel(file_path)

print("Dataset Shape:", df.shape)
print("\nColumns and Data Types:")
print(df.dtypes)

print("\nMissing Values:")
print(df.isnull().sum())

print("\nFirst 5 rows:")
print(df.head())

print("\nRisk Level Distribution:")
print(df['Risk_Level'].value_counts())

if 'Risk_Score' in df.columns:
    print("\nRisk Score Stats:")
    print(df['Risk_Score'].describe())
    
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    correlations = df[numeric_cols].corrwith(df['Risk_Score']).sort_values(ascending=False)
    print("\nCorrelations with Risk_Score:")
    print(correlations)
