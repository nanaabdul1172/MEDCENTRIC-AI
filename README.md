# Medcentric AI — Cardiovascular Risk Assessment Platform

[![FastAPI](https://img.shields.io/badge/FastAPI-0.143.1-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19.2.8-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=flat&logo=python)](https://www.python.org/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-1.9.1-F7931E?style=flat&logo=scikit-learn)](https://scikit-learn.org/)

## 🚨 Clinical Disclaimer

**Medcentric AI is an educational prototype and research demonstration.** This system is **NOT a medical diagnostic tool** and should **NEVER be used for clinical decision-making or patient care**. All predictions are statistical estimates based on historical data and must not replace professional medical evaluation, testing, or physician consultation.

---

## 📋 Table of Contents

- [Problem Statement](#-problem-statement)
- [Personal Contribution & Architecture](#-personal-contribution--architecture)
- [Model Performance Metrics](#-model-performance-metrics)
- [Dataset Background & Preprocessing](#-dataset-background--preprocessing)
- [Features & Technology Stack](#-features--technology-stack)
- [Setup Instructions](#-setup-instructions)
  - [Local Development Setup](#local-development-setup)
  - [Cloud Deployment](#cloud-deployment)
- [Usage Guide](#-usage-guide)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Future Roadmap](#-future-roadmap)
- [Academic References](#-academic-references)
- [License](#-license)

---

## 🎯 Problem Statement

Cardiovascular disease remains the leading cause of mortality worldwide, accounting for approximately 17.9 million deaths annually (WHO, 2021). Early risk stratification using clinical indicators can facilitate timely intervention and improve patient outcomes. However, manual risk assessment is time-intensive, subject to human error, and often lacks consistent probabilistic quantification.

**Medcentric AI** addresses this challenge by providing a machine learning-powered web application that:
- Accepts standard clinical vitals as input (age, blood pressure, cholesterol, ECG metrics, etc.)
- Generates probabilistic cardiovascular risk predictions in real-time
- Offers an intuitive dashboard for clinical research and educational exploration
- Demonstrates the feasibility of ML-augmented clinical decision support systems

---

## 🏗️ Personal Contribution & Architecture

This project is a **full-stack machine learning application** built from scratch with the following architectural components:

### **Backend (FastAPI + Python)**
- **FastAPI REST API** serving model predictions via `/predict` endpoint
- **scikit-learn Random Forest Classifier** trained on preprocessed UCI Heart Disease dataset
- **Joblib model persistence** for production deployment
- **Pydantic validation** ensuring type-safe input schemas
- **CORS middleware** enabling secure cross-origin frontend-backend communication

### **Frontend (React + Tailwind CSS)**
- **React 19** with modern hooks for state management
- **Vite build system** for optimized production bundles
- **Tailwind CSS** for responsive, professional medical UI
- **Dynamic API configuration** supporting local development and cloud deployment
- **Clinical disclaimer banner** ensuring ethical usage transparency
- **Session history log** tracking patient assessments within a session
- **Text report export** for documentation and record-keeping

### **Machine Learning Pipeline**
- **Data cleaning script** (`clean_data.py`) handling missing values with median/mode imputation
- **Feature engineering** using one-hot encoding for categorical variables
- **Model training script** (`train_model.py`) with stratified train-test split (80/20)
- **Prediction script** (`predict.py`) demonstrating inference workflow

### **Deployment Strategy**
- **Backend**: Deployable to Render, Heroku, Railway, or AWS EC2
- **Frontend**: Deployable to Vercel, Netlify, or static hosting via Vite build
- **Environment-based API URL resolution** for seamless dev-to-prod transition

---

## 📊 Model Performance Metrics

The Random Forest Classifier was trained on 736 samples (80% of cleaned dataset) and evaluated on 184 test samples (20%), achieving the following performance:

| Metric                | Value       |
|-----------------------|-------------|
| **Accuracy**          | **85.87%**  |
| **Precision (Class 1)** | ~0.86       |
| **Recall (Class 1)**    | ~0.88       |
| **F1-Score (Class 1)**  | ~0.87       |
| **Training Samples**    | 736         |
| **Test Samples**        | 184         |

### Interpretation
- **High Recall (88%)**: The model successfully identifies 88% of true positive cases (patients with heart disease), minimizing false negatives — a critical requirement in clinical screening contexts.
- **High Precision (86%)**: 86% of positive predictions are correct, reducing unnecessary alarm and follow-up procedures.
- **Balanced F1-Score (87%)**: Demonstrates strong overall performance across both precision and recall.

For detailed evaluation metrics including confusion matrix and per-class statistics, see [MODEL_EVALUATION.md](MODEL_EVALUATION.md).

---

## 🗂️ Dataset Background & Preprocessing

### Dataset Source
- **Name**: UCI Heart Disease Dataset (combined from Cleveland, Hungarian, Switzerland, and VA Long Beach databases)
- **Original Size**: 920 patient records
- **Source**: [UCI Machine Learning Repository](https://archive.ics.uci.edu/ml/datasets/Heart+Disease)
- **Target Variable**: Binary classification (0 = No disease, 1 = Disease present)

### Preprocessing Steps

#### 1. **Target Binarization**
The original `num` column (0-4 scale indicating disease severity) was converted to binary:
- `0` → No heart disease
- `1-4` → Heart disease present

#### 2. **Missing Value Imputation**
- **Numerical features** (`trestbps`, `chol`, `thalch`, `oldpeak`): Filled with **median** values
- **Categorical features** (`fbs`, `exang`, `slope`, `thal`, `restecg`): Filled with **mode** (most frequent value)

#### 3. **Feature Exclusion**
- **`ca` (number of major vessels)**: Dropped due to **>65% missing values**, which would introduce significant bias even with imputation
- **`dataset` (source hospital)**: Dropped as it represents data provenance, not a clinical feature

#### 4. **One-Hot Encoding**
Categorical variables (`fbs`, `exang`, `slope`, `thal`, `restecg`) were one-hot encoded using `pd.get_dummies()` with `drop_first=True` to avoid multicollinearity.

### Limitations & Ethical Considerations
- **Small Sample Size**: 920 records may not generalize to diverse populations
- **Historical Data**: Dataset collected in the 1980s-1990s; may not reflect modern clinical trends
- **Selection Bias**: Data from four specific hospitals may not represent global patient demographics
- **Missing Data Impact**: Dropping `ca` feature may reduce model's clinical fidelity
- **No External Validation**: Model has not been validated on independent datasets from other institutions

---

## ✨ Features & Technology Stack

### Core Features
- ✅ Real-time cardiovascular risk prediction
- ✅ Interactive patient vitals input form
- ✅ Visual risk meter with confidence scoring
- ✅ Session history log tracking multiple assessments
- ✅ Downloadable text reports for documentation
- ✅ Prominent clinical disclaimer banner
- ✅ Responsive design for desktop and mobile devices

### Technology Stack

**Backend**
- Python 3.9+
- FastAPI 0.143.1
- scikit-learn 1.9.1
- pandas 3.0.6
- joblib 1.6.0
- uvicorn 0.54.0

**Frontend**
- React 19.2.8
- Vite 8.3.0
- Tailwind CSS 3.4.19
- Modern ES6+ JavaScript

**Machine Learning**
- Random Forest Classifier (scikit-learn)
- One-hot encoding for categorical features
- 80/20 train-test split with `random_state=42`

---

## 🚀 Setup Instructions

### Prerequisites
- **Python 3.9+** (with pip)
- **Node.js 16+** and npm (for frontend)
- **Git** (for cloning the repository)

---

### Local Development Setup

#### **Step 1: Clone the Repository**
```bash
git clone https://github.com/yourusername/medcentric-ai.git
cd medcentric-ai
```

#### **Step 2: Backend Setup**

##### Create Python Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

##### Install Python Dependencies
```bash
pip install -r requirements.txt
```

##### Train the Model (if not already trained)
```bash
python clean_data.py
python train_model.py
```
This will generate:
- `cleaned_heart.csv` (preprocessed dataset)
- `medcentric_model.pkl` (trained Random Forest model)
- `model_columns.pkl` (feature column structure)

##### Start FastAPI Backend
```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```
Backend will be available at: `http://127.0.0.1:8000`

API Documentation: `http://127.0.0.1:8000/docs`

---

#### **Step 3: Frontend Setup**

##### Navigate to Frontend Directory
```bash
cd frontend
```

##### Install Node Dependencies
```bash
npm install
```

##### Start Development Server
```bash
npm run dev
```
Frontend will be available at: `http://localhost:5173`

---

### Cloud Deployment

#### **Backend Deployment (Render)**

1. **Create a `render.yaml` file** (if not present):
```yaml
services:
  - type: web
    name: medcentric-backend
    env: python
    buildCommand: "pip install -r requirements.txt"
    startCommand: "uvicorn main:app --host 0.0.0.0 --port $PORT"
```

2. **Push to GitHub** and connect Render to your repository
3. **Set Environment Variables** (if needed)
4. **Deploy** — Render will automatically build and serve your FastAPI backend

**Alternative Options**: Heroku, Railway, AWS EC2, Google Cloud Run

---

#### **Frontend Deployment (Vercel)**

1. **Create a `.env.production` file** in `frontend/`:
```bash
VITE_API_URL=https://your-backend-url.onrender.com
```

2. **Build the frontend**:
```bash
npm run build
```

3. **Deploy to Vercel**:
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

**Alternative Options**: Netlify, GitHub Pages, AWS S3 + CloudFront

---

## 📖 Usage Guide

### 1. **Open the Dashboard**
Navigate to `http://localhost:5173` (local) or your deployed frontend URL.

### 2. **Enter Patient Vitals**
Fill in the following clinical parameters:
- **Age** (years)
- **Resting Blood Pressure** (trestbps, mmHg)
- **Cholesterol** (chol, mg/dl)
- **Maximum Heart Rate** (thalch, bpm)
- **Oldpeak** (ST depression induced by exercise relative to rest)
- **Exercise Induced Angina** (exang_True: 0 = No, 1 = Yes)
- **ST Slope (Flat)** (slope_flat: 0 = No, 1 = Yes)

### 3. **Evaluate Risk**
Click **"Evaluate Heart Risk"** to send data to the backend API.

### 4. **Interpret Results**
- **High Risk**: Red indicator with confidence percentage
- **Low Risk**: Green indicator with confidence percentage
- **Risk Meter**: Visual gauge showing prediction confidence

### 5. **Download Report**
Click **"Download Report (.txt)"** to export a timestamped assessment report.

### 6. **Review Session History**
Scroll down to view all assessments made during the current session in a tabulated log.

---

## 🔌 API Documentation

### **Endpoint: `POST /predict`**

**URL**: `http://127.0.0.1:8000/predict`

**Request Body** (JSON):
```json
{
  "age": 58,
  "trestbps": 140.0,
  "chol": 245.0,
  "thalch": 130.0,
  "oldpeak": 1.5,
  "fbs_True": 0,
  "exang_True": 1,
  "restecg_normal": 0,
  "restecg_st_abnomality": 0,
  "slope_flat": 1,
  "slope_upsloping": 0,
  "thal_normal": 0,
  "thal_reversable_defect": 0
}
```

**Response** (JSON):
```json
{
  "status": "High Risk",
  "risk_detected": true,
  "confidence": 87.45
}
```

**Interactive API Docs**: Visit `http://127.0.0.1:8000/docs` for Swagger UI

---

## 📁 Project Structure

```
medcentric-ai/
├── frontend/                   # React frontend application
│   ├── src/
│   │   ├── App.jsx            # Main React component with disclaimer banner
│   │   ├── main.jsx           # React entry point
│   │   └── index.css          # Tailwind CSS imports
│   ├── public/                # Static assets
│   ├── index.html             # HTML template
│   ├── package.json           # Node dependencies
│   ├── vite.config.js         # Vite configuration
│   └── tailwind.config.js     # Tailwind configuration
├── heart.csv                  # Original raw dataset
├── cleaned_heart.csv          # Preprocessed dataset
├── clean_data.py              # Data preprocessing script
├── train_model.py             # Model training script
├── predict.py                 # Standalone prediction demo
├── main.py                    # FastAPI backend application
├── medcentric_model.pkl       # Trained Random Forest model
├── model_columns.pkl          # Feature column structure
├── requirements.txt           # Python dependencies
├── README.md                  # This file
└── MODEL_EVALUATION.md        # Detailed model evaluation report
```

---

## 🛣️ Future Roadmap

### Short-Term Enhancements
- [ ] **User Authentication**: Add login/signup for personalized patient records
- [ ] **Database Integration**: Store patient history in PostgreSQL/MongoDB
- [ ] **Extended Feature Set**: Reintroduce `ca` feature with advanced imputation techniques (e.g., KNN, MICE)
- [ ] **Model Explainability**: Integrate SHAP or LIME for feature importance visualization
- [ ] **Mobile App**: Develop React Native version for iOS/Android

### Long-Term Goals
- [ ] **Multi-Model Ensemble**: Combine Random Forest with Gradient Boosting (XGBoost, LightGBM) and Neural Networks
- [ ] **External Validation**: Test on independent datasets from other institutions
- [ ] **Real-Time ECG Integration**: Accept ECG waveform data for enhanced risk prediction
- [ ] **Regulatory Compliance**: Pursue FDA/CE marking for clinical validation (if applicable)
- [ ] **Federated Learning**: Enable privacy-preserving collaborative model training across hospitals

---

## 📚 Academic References

1. **UCI Heart Disease Dataset**  
   Janosi, A., Steinbrunn, W., Pfisterer, M., & Detrano, R. (1988). *Heart Disease Data Set*. UCI Machine Learning Repository.  
   [https://archive.ics.uci.edu/ml/datasets/Heart+Disease](https://archive.ics.uci.edu/ml/datasets/Heart+Disease)

2. **Random Forest Algorithm**  
   Breiman, L. (2001). "Random Forests." *Machine Learning*, 45(1), 5-32.

3. **Cardiovascular Disease Statistics**  
   World Health Organization (2021). *Cardiovascular Diseases (CVDs) Fact Sheet*.  
   [https://www.who.int/news-room/fact-sheets/detail/cardiovascular-diseases-(cvds)](https://www.who.int/news-room/fact-sheets/detail/cardiovascular-diseases-(cvds))

---

## 📄 License

This project is licensed under the **MIT License**.

**Disclaimer**: Medcentric AI is provided "as-is" for educational and research purposes only. The authors disclaim all liability for any medical decisions made based on this software. Always consult qualified healthcare professionals for medical advice.

---

## 👨‍💻 Author

**Nana Abdul**  
Full-Stack ML Engineer | Healthcare AI Researcher

For questions, contributions, or collaboration opportunities, please contact via GitHub Issues or email.

---

**⚠️ Remember**: This is a **research prototype**, not a medical device. Never use for actual clinical diagnosis or treatment decisions.
