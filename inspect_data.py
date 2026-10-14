import pandas as pd

# Load the dataset (update 'heart.csv' if your file has a different name)
try:
    df = pd.read_csv('heart.csv')
    print("Dataset loaded successfully!\n")
except FileNotFoundError:
    print("Error: Could not find 'heart.csv'. Make sure the file is in your project directory.")
    exit()

# 1. Check the dimensions (rows, columns)
print("--- Dataset Shape (Rows, Columns) ---")
print(df.shape)

# 2. Preview the first few rows
print("\n--- First 5 Rows ---")
print(df.head())

# 3. Check data types and non-null counts
print("\n--- Dataset Info ---")
print(df.info())

# 4. Check for any missing or null values
print("\n--- Missing Values Per Column ---")
print(df.isnull().sum())