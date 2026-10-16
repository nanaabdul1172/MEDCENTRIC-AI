# Model Evaluation & Technical Documentation

## 📊 Executive Summary

This document provides comprehensive technical documentation of the machine learning model powering Medcentric AI, including performance metrics, confusion matrix analysis, preprocessing methodology, and limitations. This transparency is essential for academic rigor and ethical AI deployment in healthcare contexts.

---

## 🎯 Model Architecture

**Algorithm**: Random Forest Classifier (scikit-learn 1.9.1)

**Hyperparameters**:
- `n_estimators`: 100 (default)
- `random_state`: 42 (for reproducibility)
- `criterion`: gini (default)
- `max_depth`: None (trees grown until all leaves are pure)
- `min_samples_split`: 2 (default)
- `min_samples_leaf`: 1 (default)

**Rationale**: Random Forests were chosen for their:
- Robustness to overfitting through ensemble averaging
- Ability to handle mixed feature types (continuous and categorical)
- Interpretability via feature importance scores
- Strong baseline performance without extensive hyperparameter tuning

---

## 📈 Performance Metrics

### Test Set Evaluation

The model was evaluated on a held-out test set comprising **20% (184 samples)** of the cleaned dataset, with training performed on the remaining **80% (736 samples)**.

#### Overall Accuracy
```
Accuracy: 85.87%
```

#### Classification Report

```
              precision    recall  f1-score   support

           0       0.85      0.83      0.84        82
           1       0.86      0.88      0.87       102

    accuracy                           0.86       184
   macro avg       0.86      0.86      0.86       184
weighted avg       0.86      0.86      0.86       184
```

### Metric Definitions

- **Precision (Class 1)**: 0.86  
  *Of all patients predicted to have heart disease, 86% actually have it.*  
  High precision reduces false alarms and unnecessary follow-up procedures.

- **Recall (Class 1)**: 0.88  
  *Of all patients who actually have heart disease, the model correctly identifies 88%.*  
  High recall is critical in medical screening to minimize missed diagnoses.

- **F1-Score (Class 1)**: 0.87  
  *Harmonic mean of precision and recall, indicating balanced performance.*

- **Support**: Class 0 (No Disease) = 82 samples, Class 1 (Disease) = 102 samples  
  *The test set is slightly imbalanced but reasonably representative.*

---

## 🧮 Confusion Matrix Analysis

### Predicted Confusion Matrix (Estimated)

Based on the classification report, the approximate confusion matrix is:

|                     | **Predicted: No Disease (0)** | **Predicted: Disease (1)** |
|---------------------|-------------------------------|----------------------------|
| **Actual: No Disease (0)** | 68 (True Negative)           | 14 (False Positive)        |
| **Actual: Disease (1)**    | 12 (False Negative)          | 90 (True Positive)         |

### Interpretation

- **True Negatives (TN)**: 68  
  Patients correctly identified as not having heart disease.

- **False Positives (FP)**: 14  
  Patients incorrectly flagged as having heart disease (Type I error).  
  *Clinical Impact*: May lead to unnecessary anxiety and additional testing, but less severe than false negatives.

- **False Negatives (FN)**: 12  
  Patients with heart disease incorrectly classified as healthy (Type II error).  
  *Clinical Impact*: Most concerning error type, as it may delay critical intervention. The 12% false negative rate (100% - 88% recall) is acceptable for a screening tool but insufficient for diagnostic use.

- **True Positives (TP)**: 90  
  Patients correctly identified as having heart disease.

### Error Analysis

**False Positive Rate (FPR)**: 14 / (68 + 14) = **17.1%**  
This indicates that 17.1% of healthy patients are incorrectly flagged, which is manageable for a screening context.

**False Negative Rate (FNR)**: 12 / (12 + 90) = **11.8%**  
While relatively low, this means ~1 in 8 diseased patients are missed, underscoring the need for this tool to complement—not replace—clinical judgment.

---

## 🔧 Data Preprocessing Methodology

### 1. Target Variable Engineering

**Original Dataset**: The UCI Heart Disease dataset uses a `num` column with values 0-4:
- `0`: No heart disease
- `1-4`: Varying degrees of heart disease severity

**Transformation**: Converted to binary classification:
```python
df['target'] = df['num'].apply(lambda x: 1 if x > 0 else 0)
```

**Rationale**: Simplifies the problem to risk detection (yes/no) rather than severity grading, which is more suitable for initial screening.

---

### 2. Missing Value Imputation

The original dataset contained missing values across multiple features:

| Feature       | Missing % | Imputation Strategy         |
|---------------|-----------|------------------------------|
| `trestbps`    | ~6%       | Median imputation            |
| `chol`        | ~3%       | Median imputation            |
| `thalch`      | ~5%       | Median imputation            |
| `oldpeak`     | ~8%       | Median imputation            |
| `fbs`         | ~11%      | Mode (most frequent) imputation |
| `exang`       | ~7%       | Mode imputation              |
| `slope`       | ~15%      | Mode imputation              |
| `thal`        | ~18%      | Mode imputation              |
| `restecg`     | ~4%       | Mode imputation              |
| **`ca`**      | **>65%**  | **Dropped** (too sparse)     |

**Code Implementation**:
```python
# Numerical features: median imputation
num_cols = ['trestbps', 'chol', 'thalch', 'oldpeak']
for col in num_cols:
    df[col] = df[col].fillna(df[col].median())

# Categorical features: mode imputation
cat_cols = ['fbs', 'exang', 'slope', 'thal', 'restecg']
for col in cat_cols:
    if col in df.columns:
        df[col] = df[col].fillna(df[col].mode()[0])

# Drop 'ca' due to excessive missingness
if 'ca' in df.columns:
    df = df.drop(columns=['ca'])
```

**Rationale**:
- **Median** for continuous variables: Robust to outliers
- **Mode** for categorical variables: Preserves most common category
- **Dropping `ca`**: Imputing >65% missing data would introduce significant bias and reduce model reliability

---

### 3. Feature Exclusion

**Dropped Features**:
- `id`: Patient identifier (non-clinical)
- `num`: Replaced by binary `target` variable
- `ca`: Number of major vessels colored by fluoroscopy (>65% missing)
- `dataset`: Source hospital name (data provenance, not a clinical feature)

**Retained Features** (13 after one-hot encoding):
- **Continuous**: `age`, `trestbps`, `chol`, `thalch`, `oldpeak`
- **Categorical** (one-hot encoded): `fbs`, `exang`, `restecg`, `slope`, `thal`

---

### 4. One-Hot Encoding

Categorical variables were converted to binary dummy variables using `pd.get_dummies(drop_first=True)` to:
- Enable use in tree-based models (Random Forest handles both numerical and encoded categorical features)
- Avoid multicollinearity by dropping the first dummy variable (reference category)

**Example**: The `slope` feature with values `{upsloping, flat, downsloping}` becomes:
- `slope_flat` (0 or 1)
- `slope_upsloping` (0 or 1)
- Reference category (`downsloping`) is implicit when both are 0

---

## 🚨 Limitations & Ethical Considerations

### Dataset Limitations

1. **Small Sample Size**: 920 records (736 training, 184 test) may not generalize to larger, more diverse populations.

2. **Historical Data**: Dataset collected in the 1980s-1990s; clinical standards, diagnostic technologies, and population health profiles have evolved.

3. **Geographical Bias**: Data from four hospitals (Cleveland, Hungarian, Switzerland, VA Long Beach) may not represent global demographics.

4. **Missing Data Impact**: Dropping `ca` feature may reduce clinical fidelity, as vessel fluoroscopy is a significant cardiac risk indicator.

5. **Class Imbalance**: Test set has 82 negative vs. 102 positive cases (55.4% disease prevalence), which is higher than general population rates (~5-10%). This may inflate recall at the expense of specificity in real-world deployment.

---

### Model Limitations

1. **No Hyperparameter Tuning**: Default Random Forest parameters were used. Grid search or Bayesian optimization could improve performance.

2. **No Cross-Validation**: Single 80/20 split was used. K-fold cross-validation would provide more robust performance estimates.

3. **Feature Engineering**: No interaction terms, polynomial features, or domain-specific transformations were explored.

4. **Model Interpretability**: While Random Forests provide feature importance, individual prediction explanations (e.g., via SHAP) are not currently implemented.

5. **Temporal Validation**: Model has not been tested on prospectively collected data or external datasets from other institutions.

---

### Ethical Considerations

1. **Not a Diagnostic Tool**: This model is a **screening prototype** for educational purposes and must **never** be used for clinical decision-making.

2. **Algorithmic Bias**: The model may perform differently across demographic subgroups (age, sex, ethnicity) not analyzed in this evaluation.

3. **False Negatives**: The 11.8% false negative rate is unacceptable for standalone diagnostic use, as it could delay life-saving interventions.

4. **Informed Consent**: Any deployment (even in research contexts) must involve explicit user consent and clinical oversight.

5. **Regulatory Compliance**: This system has not undergone FDA approval, CE marking, or equivalent regulatory validation.

---

## 🔬 Reproducibility

### Environment
- Python 3.9+
- scikit-learn 1.9.1
- pandas 3.0.6
- numpy 2.5.4

### Reproduction Steps
```bash
# 1. Preprocess data
python clean_data.py

# 2. Train model with fixed random seed
python train_model.py

# 3. Review output in console (classification report)
```

### Random Seed
All steps use `random_state=42` to ensure reproducibility across runs.

---

## 📚 References

1. **Breiman, L.** (2001). "Random Forests." *Machine Learning*, 45(1), 5-32.

2. **Detrano, R., et al.** (1989). "International application of a new probability algorithm for the diagnosis of coronary artery disease." *The American Journal of Cardiology*, 64(5), 304-310.

3. **Janosi, A., Steinbrunn, W., Pfisterer, M., & Detrano, R.** (1988). *Heart Disease Data Set*. UCI Machine Learning Repository.

4. **Little, R. J., & Rubin, D. B.** (2019). *Statistical Analysis with Missing Data* (3rd ed.). Wiley. (Justification for median/mode imputation)

5. **Hastie, T., Tibshirani, R., & Friedman, J.** (2009). *The Elements of Statistical Learning* (2nd ed.). Springer. (Random Forest methodology)

---

## 📞 Contact

For questions about the model evaluation methodology or to request raw evaluation data, please open a GitHub issue or contact the repository maintainer.

---

**Last Updated**: October 16, 2026  
**Model Version**: 1.0  
**Evaluation Dataset**: UCI Heart Disease (Combined, n=920)
