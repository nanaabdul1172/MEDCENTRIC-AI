import pandas as pd

# Load the dataset
df = pd.read_csv('heart.csv')
print(f"Original dataset shape: {df.shape}")

# 1. Binarize the target column 'num' (0 = No disease, 1 = Disease present)
df['target'] = df['num'].apply(lambda x: 1 if x > 0 else 0)
df = df.drop(columns=['num', 'id'])  # Drop original 'num' and unnecessary 'id' column

# 2. Handle missing values
# For numerical columns with missing values, fill with the median
num_cols = ['trestbps', 'chol', 'thalch', 'oldpeak']
for col in num_cols:
    df[col] = df[col].fillna(df[col].median())

# For categorical/object columns with missing values, fill with the most frequent value (mode)
cat_cols = ['fbs', 'exang', 'slope', 'thal', 'restecg']
for col in cat_cols:
    if col in df.columns:
        df[col] = df[col].fillna(df[col].mode()[0])

# Drop 'ca' if it has too many missing values, or fill it. Let's drop 'ca' and 'dataset' source for simplicity if needed, 
# or let's drop rows/columns. Let's drop 'ca' for now since over 65% of it is missing.
if 'ca' in df.columns:
    df = df.drop(columns=['ca'])

if 'dataset' in df.columns:
    df = df.drop(columns=['dataset']) # Drop the source hospital name column as it's not a clinical feature

# 3. Convert categorical variables into numeric format using One-Hot Encoding
df_encoded = pd.get_dummies(df, drop_first=True)

print(f"Cleaned and encoded dataset shape: {df_encoded.shape}")
print("\n--- First 3 Rows of Cleaned Data ---")
print(df_encoded.head(3))

# Save the cleaned dataset to a new CSV file for training later
df_encoded.to_csv('cleaned_heart.csv', index=False)
print("\nSuccess! Cleaned dataset saved as 'cleaned_heart.csv'.")