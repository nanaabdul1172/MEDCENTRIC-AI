import pandas as pd
import joblib

# 1. Load the saved model and feature columns
model = joblib.load('medcentric_model.pkl')
model_columns = joblib.load('model_columns.pkl')

print("Medcentric AI Model Loaded Successfully!\n")

# 2. Define a sample new patient profile
new_patient = {
    'age': 58,
    'trestbps': 140.0,
    'chol': 245.0,
    'thalch': 130.0,
    'oldpeak': 1.5,
    'fbs_True': 0,
    'exang_True': 1,
    'restecg_normal': 0,
    'restecg_st abnomality': 1,
    'slope_flat': 1,
    'slope_upsloping': 0,
    'thal_normal': 0,
    'thal_reversable defect': 1
}

# Convert dictionary to a DataFrame and align columns
input_df = pd.DataFrame([new_patient])
input_df = input_df.reindex(columns=model_columns, fill_value=0)

# 3. Make a prediction
prediction = model.predict(input_df)
prediction_proba = model.predict_proba(input_df)

# 4. Output the results
print("--- Patient Risk Assessment ---")
if prediction[0] == 1:
    risk_percentage = prediction_proba[0][1] * 100
    print(f"⚠️ RESULT: High Risk of Heart Disease Detected.")
    print(f"Confidence: {risk_percentage:.2f}%")
else:
    safe_percentage = prediction_proba[0][0] * 100
    print(f"✅ RESULT: Low Risk / Normal.")
    print(f"Confidence: {safe_percentage:.2f}%")