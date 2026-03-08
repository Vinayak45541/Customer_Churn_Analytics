import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, f1_score, roc_auc_score
import joblib
import os

def load_and_prepare_data(filepath):
    df = pd.read_csv(filepath)
    # Convert TotalCharges to numeric, dropping the row if we can't
    df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')
    df = df.dropna()
    
    # Drop customerID
    df = df.drop(columns=['customerID'])
    
    # Separate features and target
    X = df.drop(columns=['Churn'])
    y = df['Churn'].map({'Yes': 1, 'No': 0})
    
    return X, y

def build_pipeline(classifier):
    # Categorical and numerical columns
    # Based on our data schema
    numeric_features = ['tenure', 'MonthlyCharges', 'TotalCharges']
    categorical_features = ['SeniorCitizen', 'Partner', 'Dependents', 'InternetService', 
                            'OnlineSecurity', 'TechSupport', 'Contract', 
                            'PaperlessBilling', 'PaymentMethod']
    
    numeric_transformer = Pipeline(steps=[
        ('scaler', StandardScaler())
    ])

    categorical_transformer = Pipeline(steps=[
        ('onehot', OneHotEncoder(handle_unknown='ignore'))
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numeric_features),
            ('cat', categorical_transformer, categorical_features)
        ])

    clf_pipeline = Pipeline(steps=[('preprocessor', preprocessor),
                                   ('classifier', classifier)])
    
    return clf_pipeline

def train_and_evaluate():
    data_path = os.path.join(os.path.dirname(__file__), '../datasets/telco_churn.csv')
    X, y = load_and_prepare_data(data_path)
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    models = {
        'Logistic Regression': LogisticRegression(random_state=42, max_iter=1000),
        'Random Forest': RandomForestClassifier(random_state=42, n_estimators=100),
        'XGBoost': XGBClassifier(random_state=42, eval_metric='logloss')
    }
    
    results = {}
    best_f1 = 0
    best_model_name = ""
    best_pipeline = None

    print("Training models...")
    for name, model in models.items():
        pipeline = build_pipeline(model)
        pipeline.fit(X_train, y_train)
        
        y_pred = pipeline.predict(X_test)
        y_proba = pipeline.predict_proba(X_test)[:, 1]
        
        acc = accuracy_score(y_test, y_pred)
        f1 = f1_score(y_test, y_pred)
        roc_auc = roc_auc_score(y_test, y_proba)
        
        results[name] = {'Accuracy': acc, 'F1 Score': f1, 'ROC AUC': roc_auc}
        print(f"Model: {name} | acc: {acc:.4f} | f1: {f1:.4f} | auc: {roc_auc:.4f}")
        
        if f1 > best_f1:
            best_f1 = f1
            best_model_name = name
            best_pipeline = pipeline
            
    print(f"\nEvaluating complete. Best model by F1 Score: {best_model_name} (F1: {best_f1:.4f})")
    
    # Save best model
    model_dir = os.path.join(os.path.dirname(__file__), '../models')
    os.makedirs(model_dir, exist_ok=True)
    model_path = os.path.join(model_dir, 'churn_model.pkl')
    
    joblib.dump(best_pipeline, model_path)
    print(f"Saved the best model ({best_model_name}) to {model_path}")

if __name__ == "__main__":
    train_and_evaluate()
