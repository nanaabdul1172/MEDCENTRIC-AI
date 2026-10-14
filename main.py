from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib

app = FastAPI(title="Medcentric AI API", version="1.0")

# Enable CORS so your frontend can communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the saved model and columns
model = joblib.load('medcentric_model.pkl')
model_columns = joblib.load('model_columns.pkl')

# Define the expected input schema
class PatientData(BaseModel):
    age: int
    trestbps: float
    chol: float
    thalch: float
    oldpeak: float
    fbs_True: int = 0
    exang_True: int = 0
    restecg_normal: int = 0
    restecg_st_abnomality: int = 0  # matches encoded column if applicable
    slope_flat: int = 0
    slope_upsloping: int = 0
    thal_normal: int = 0
    thal_reversable_defect: int = 0

@app.get("/")
def home():
    return {"message": "Welcome to Medcentric AI API"}

@app.post("/predict")
def predict_heart_disease(data: PatientData):
    # Convert incoming JSON to a dictionary, then to a DataFrame
    input_dict = data.dict()
    input_df = pd.DataFrame([input_dict])
    
    # Align columns with model expectations
    input_df = input_df.reindex(columns=model_columns, fill_value=0)
    
    # Make prediction
    prediction = model.predict(input_df)[0]
    probabilities = model.predict_proba(input_df)[0]
    
    risk_confidence = float(probabilities[1] * 100) if prediction == 1 else float(probabilities[0] * 100)
    
    return {
        "status": "High Risk" if prediction == 1 else "Low Risk",
        "risk_detected": bool(prediction == 1),
        "confidence": round(risk_confidence, 2)
    }