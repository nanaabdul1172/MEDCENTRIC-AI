# Testing Checklist - Medcentric AI

Use this checklist to verify that all features work correctly after updates or deployment.

## 🧪 Pre-Deployment Testing (Local)

### Backend API Testing

#### 1. Server Startup
- [ ] Activate virtual environment: `venv\Scripts\activate` (Windows)
- [ ] Start FastAPI: `uvicorn main:app --reload`
- [ ] Server starts without errors
- [ ] Console shows: "Application startup complete"
- [ ] Server accessible at: `http://127.0.0.1:8000`

#### 2. Root Endpoint Test
- [ ] Visit: `http://127.0.0.1:8000/`
- [ ] Response: `{"message": "Welcome to Medcentric AI API"}`
- [ ] Status code: 200

#### 3. API Documentation Test
- [ ] Visit: `http://127.0.0.1:8000/docs`
- [ ] Swagger UI loads successfully
- [ ] See two endpoints: `/` (GET) and `/predict` (POST)
- [ ] Swagger UI displays schema for `PatientData`

#### 4. Prediction Endpoint Test (Valid Data)
**Test Case 1: High Risk Patient**
```json
{
  "age": 58,
  "trestbps": 140,
  "chol": 245,
  "thalch": 130,
  "oldpeak": 1.5,
  "fbs_True": 0,
  "exang_True": 1,
  "restecg_normal": 1,
  "restecg_st_abnomality": 0,
  "slope_flat": 1,
  "slope_upsloping": 0,
  "thal_normal": 1,
  "thal_reversable_defect": 0
}
```
- [ ] POST to `/predict` via Swagger UI
- [ ] Response contains: `status`, `risk_detected`, `confidence`
- [ ] `confidence` is a number between 0-100
- [ ] Status code: 200

**Test Case 2: Low Risk Patient**
```json
{
  "age": 30,
  "trestbps": 110,
  "chol": 180,
  "thalch": 170,
  "oldpeak": 0.0,
  "fbs_True": 0,
  "exang_True": 0,
  "restecg_normal": 1,
  "restecg_st_abnomality": 0,
  "slope_flat": 0,
  "slope_upsloping": 1,
  "thal_normal": 1,
  "thal_reversable_defect": 0
}
```
- [ ] Response: `"status": "Low Risk"`
- [ ] `risk_detected` is `false`

#### 5. CORS Headers Test
- [ ] Check response headers include:
  - `Access-Control-Allow-Origin: *`
  - `Access-Control-Allow-Methods: *`
  - `Access-Control-Allow-Headers: *`

---

### Frontend Testing

#### 1. Development Server Startup
- [ ] Navigate to `frontend/` directory
- [ ] Run: `npm run dev`
- [ ] Server starts without errors
- [ ] Console shows: "Local: http://localhost:5173"
- [ ] No compilation errors

#### 2. Initial Page Load
- [ ] Open: `http://localhost:5173`
- [ ] Page loads within 2 seconds
- [ ] No browser console errors
- [ ] No 404 errors in Network tab

#### 3. Clinical Disclaimer Banner ⚠️ **CRITICAL**
- [ ] **Amber banner** visible at top of page
- [ ] Banner has warning icon (⚠️)
- [ ] Text: "Clinical Disclaimer & Safety Notice"
- [ ] Content includes:
  - "Educational prototype"
  - "NOT a medical diagnostic tool"
  - "NEVER be used for clinical decision-making"
  - "call 911 immediately"
- [ ] Banner is **prominent and unmissable**
- [ ] Banner appears **before** any form inputs

#### 4. Form Input Fields
**Numerical Inputs:**
- [ ] Age field accepts numbers
- [ ] Resting BP field accepts numbers
- [ ] Cholesterol field accepts numbers
- [ ] Max Heart Rate field accepts numbers
- [ ] Oldpeak field accepts decimals (e.g., 1.5)

**Dropdown Inputs:**
- [ ] Fasting Blood Sugar dropdown: No/Yes options
- [ ] Exercise Induced Angina dropdown: No/Yes options
- [ ] ST Slope Type dropdown: Downsloping/Flat/Upsloping options

**Field Validation:**
- [ ] All fields have labels
- [ ] Labels are clear and readable
- [ ] Fields have proper styling (borders, focus states)

#### 5. Form Submission (Valid Input)
**Test Scenario: Default Values**
- [ ] Click "Evaluate Heart Risk" button
- [ ] Button text changes to "Analyzing Vitals..."
- [ ] Loading state shows for 1-3 seconds
- [ ] No browser console errors

**Expected Result:**
- [ ] Assessment Result section populates
- [ ] Shows either "⚠️ High Risk Detected" or "✅ Low Risk / Normal"
- [ ] Confidence percentage displayed (e.g., "Confidence: 87.45%")
- [ ] Risk meter gauge appears
- [ ] Gauge bar width matches confidence percentage
- [ ] Gauge color matches risk level (red for high, green for low)

#### 6. Risk Meter Visual
- [ ] Risk meter displays below result card
- [ ] Shows "Risk Meter" label
- [ ] Shows confidence percentage on right
- [ ] Animated bar fills from 0% to actual percentage
- [ ] Smooth CSS transition (duration ~500ms)
- [ ] High Risk = Red bar
- [ ] Low Risk = Green bar

#### 7. Download Report Feature
- [ ] "Download Report (.txt)" button appears after prediction
- [ ] Click button initiates download
- [ ] File name format: `Medcentric_Report_[timestamp].txt`
- [ ] File contains:
  - Timestamp
  - ⚠️ Disclaimer
  - Patient vitals (age, BP, chol, etc.)
  - Clinical indicators (FBS, Exang, Slope)
  - Assessment result
  - Confidence score
  - Warning about consultation with healthcare professional

#### 8. Session History Log
**After First Submission:**
- [ ] "Session History Log" section appears below form
- [ ] Table contains 1 row
- [ ] Columns: Time, Age, BP, Chol, FBS, Status, Confidence
- [ ] Time shows HH:MM:SS format
- [ ] FBS column shows "Y" or "N"
- [ ] Status is color-coded (red or green)

**After Multiple Submissions:**
- [ ] Submit form 3 times with different values
- [ ] History table shows 3 rows
- [ ] Most recent submission at top
- [ ] All data correctly displayed
- [ ] Table scrollable if many entries

#### 9. Responsive Design
**Desktop (>1024px):**
- [ ] Form and result side-by-side
- [ ] Disclaimer banner full width
- [ ] All elements properly spaced

**Tablet (768px-1024px):**
- [ ] Form stacks vertically
- [ ] All fields remain readable
- [ ] Buttons full width

**Mobile (<768px):**
- [ ] All content in single column
- [ ] Form inputs full width
- [ ] Disclaimer banner readable
- [ ] No horizontal scrolling
- [ ] Touch targets large enough (min 44px)

#### 10. Accessibility Testing
**Keyboard Navigation:**
- [ ] Tab through all form fields
- [ ] Tab order is logical (top to bottom)
- [ ] Focus indicators visible (blue outline)
- [ ] Enter key submits form
- [ ] Escape key does not break UI

**Screen Reader Testing (Optional):**
- [ ] Labels properly associated with inputs
- [ ] Disclaimer banner has proper heading
- [ ] Result status is announced
- [ ] Error messages are announced (if applicable)

---

## 🚀 Post-Deployment Testing (Cloud)

### Backend (Render/Heroku/etc.)

#### 1. Production API Health
- [ ] Visit: `https://your-backend-url.onrender.com/`
- [ ] Response: Welcome message
- [ ] Response time < 2 seconds (after cold start)
- [ ] Status code: 200

#### 2. Production API Docs
- [ ] Visit: `https://your-backend-url.onrender.com/docs`
- [ ] Swagger UI loads
- [ ] All endpoints visible
- [ ] Test predict endpoint with sample data

#### 3. CORS in Production
- [ ] Frontend can call backend from different domain
- [ ] No CORS errors in browser console
- [ ] Preflight OPTIONS requests succeed

#### 4. Model Files Loaded
- [ ] Check logs for "Model loaded successfully" message
- [ ] No file not found errors
- [ ] `medcentric_model.pkl` and `model_columns.pkl` present

#### 5. Performance Testing
- [ ] Send 10 concurrent requests
- [ ] All return within 5 seconds
- [ ] No 500 errors
- [ ] No rate limiting issues

---

### Frontend (Vercel/Netlify/etc.)

#### 1. Production Build
- [ ] Visit: `https://your-frontend-url.vercel.app`
- [ ] Page loads within 3 seconds
- [ ] No 404 errors
- [ ] All assets load (CSS, JS, images)

#### 2. Environment Variables
- [ ] Backend API calls use production URL
- [ ] Check browser Network tab: calls go to Render backend
- [ ] No localhost URLs in production

#### 3. API Integration
- [ ] Submit form in production
- [ ] Request sent to production backend
- [ ] Response received successfully
- [ ] Results display correctly

#### 4. HTTPS Verification
- [ ] Frontend URL uses HTTPS
- [ ] Backend URL uses HTTPS
- [ ] No mixed content warnings
- [ ] Valid SSL certificate (green padlock)

#### 5. Cross-Browser Testing (Production)
Test on all major browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Chrome Mobile (Android)
- [ ] Safari Mobile (iOS)

#### 6. Mobile Testing (Production)
- [ ] Test on actual mobile device
- [ ] Disclaimer banner readable
- [ ] Form fields usable
- [ ] Submit button tappable
- [ ] Results display properly
- [ ] No layout breaks

---

## 🐛 Error Handling Tests

### Backend Error Scenarios

#### 1. Invalid Input Data
**Test Case: Missing Required Field**
```json
{
  "age": 58
  // Missing all other fields
}
```
- [ ] Returns 422 Unprocessable Entity
- [ ] Error message indicates missing fields

**Test Case: Invalid Data Type**
```json
{
  "age": "not a number",
  "trestbps": 140,
  ...
}
```
- [ ] Returns 422 Unprocessable Entity
- [ ] Error message indicates type mismatch

#### 2. Model File Missing
- [ ] Temporarily rename `medcentric_model.pkl`
- [ ] Restart backend
- [ ] Server logs show error about missing file
- [ ] Restore file and verify recovery

### Frontend Error Scenarios

#### 1. Backend Unavailable
- [ ] Stop backend server
- [ ] Submit form in frontend
- [ ] Alert shows: "Could not connect to the backend server."
- [ ] No crash or blank screen
- [ ] Frontend remains usable

#### 2. Network Timeout
- [ ] Simulate slow network (Chrome DevTools → Network → Throttling)
- [ ] Submit form
- [ ] Loading indicator shows during delay
- [ ] Result appears when request completes

#### 3. Invalid Backend Response
- [ ] Mock a malformed JSON response
- [ ] Frontend handles gracefully (shows error or ignores)
- [ ] No console errors crash the app

---

## 📊 Model Verification Tests

### 1. Known High-Risk Case
**Input:**
- Age: 65
- Resting BP: 160
- Cholesterol: 300
- Max Heart Rate: 100
- Oldpeak: 3.0
- Exercise Induced Angina: Yes
- ST Slope: Flat

**Expected:**
- [ ] Status: "High Risk"
- [ ] Confidence: >70%

### 2. Known Low-Risk Case
**Input:**
- Age: 30
- Resting BP: 110
- Cholesterol: 180
- Max Heart Rate: 180
- Oldpeak: 0.0
- Exercise Induced Angina: No
- ST Slope: Upsloping

**Expected:**
- [ ] Status: "Low Risk"
- [ ] Confidence: >70%

### 3. Edge Case: Middle-Aged, Mixed Indicators
**Input:**
- Age: 50
- Resting BP: 130
- Cholesterol: 220
- Max Heart Rate: 140
- Oldpeak: 1.0
- Exercise Induced Angina: No
- ST Slope: Flat

**Expected:**
- [ ] Returns valid prediction (either risk level)
- [ ] Confidence between 50-90%
- [ ] No errors or crashes

---

## ✅ Final Checklist

### Documentation
- [ ] README.md is comprehensive and accurate
- [ ] MODEL_EVALUATION.md reflects actual model performance
- [ ] DEPLOYMENT.md instructions work end-to-end
- [ ] All links in documentation are valid

### Code Quality
- [ ] No commented-out code
- [ ] No console.log statements in production
- [ ] No hardcoded API URLs (use environment variables)
- [ ] All files have proper formatting

### Security
- [ ] No API keys or secrets in code
- [ ] `.env` files in `.gitignore`
- [ ] CORS properly configured for production
- [ ] HTTPS enforced in production

### Ethical Compliance
- [ ] Clinical disclaimer prominent on all user-facing pages
- [ ] Disclaimer included in exported reports
- [ ] LICENSE contains medical disclaimer
- [ ] README emphasizes educational purpose

### Performance
- [ ] Frontend loads in <3 seconds
- [ ] Backend responds in <2 seconds (after warmup)
- [ ] No memory leaks observed
- [ ] Images/assets optimized

---

## 📝 Test Execution Log

**Tester Name:** _____________________  
**Date:** _____________________  
**Environment:** [ ] Local [ ] Production  
**Browser/OS:** _____________________  

**Overall Result:**  
[ ] All tests passed ✅  
[ ] Some tests failed ⚠️ (see notes below)  
[ ] Critical issues found ❌ (deployment blocked)  

**Notes:**
```
_____________________________________________
_____________________________________________
_____________________________________________
```

**Sign-off:** _____________________

---

## 🆘 Troubleshooting Guide

### Issue: Backend not starting
- Check if port 8000 is already in use
- Verify `medcentric_model.pkl` exists
- Check virtual environment is activated
- Review `requirements.txt` installation

### Issue: Frontend not connecting to backend
- Verify backend is running
- Check `VITE_API_URL` environment variable
- Inspect browser console for CORS errors
- Verify backend CORS middleware configuration

### Issue: Predictions always same result
- Re-train model: `python train_model.py`
- Verify `model_columns.pkl` matches feature names
- Check input data format matches backend schema

### Issue: Disclaimer banner not showing
- Clear browser cache
- Check if `App.jsx` has been updated
- Verify no CSS conflicts hiding the banner

---

**Last Updated:** October 16, 2026  
**Version:** 1.0.0  
**Status:** Ready for Testing ✅
