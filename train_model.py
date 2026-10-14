import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib

# 1. Load the cleaned dataset
df = pd.read_csv('cleaned_heart.csv')

# 2. Separate features (X) and the target label (y)
X = df.drop(columns=['target'])
y = df['target']

# 3. Split the data into training (80%) and testing (20%) sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print(f"Training samples: {X_train.shape[0]}")
print(f"Testing samples: {X_test.shape[0]}")

# 4. Initialize and train the Random Forest Classifier
print("\nTraining the model...")
model = RandomForestClassifier(random_state=42)
model.fit(X_train, y_train)
print("Training complete!")

# 5. Make predictions on the test set
y_pred = model.predict(X_test)

# 6. Evaluate the model performance
print("\n--- Model Evaluation Metrics ---")
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy * 100:.2f}%\n")

print("Classification Report:")
print(classification_report(y_test, y_pred))

# 7. Save the trained model and column structure for future predictions
joblib.dump(model, 'medcentric_model.pkl')
# Save the feature columns so we know the exact input structure later
joblib.dump(list(X.columns), 'model_columns.pkl')

print("\nModel saved successfully as 'medcentric_model.pkl'!")