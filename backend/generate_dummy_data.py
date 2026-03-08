import os
import pandas as pd
import numpy as np
import random

def generate_telecom_data(num_samples=5000):
    np.random.seed(42)
    random.seed(42)

    data = {
        'customerID': [f"{random.randint(1000, 9999)}-{random.randint(10000, 99999)}" for _ in range(num_samples)],
        'SeniorCitizen': np.random.choice([0, 1], size=num_samples, p=[0.8, 0.2]),
        'Partner': np.random.choice(['Yes', 'No'], size=num_samples),
        'Dependents': np.random.choice(['Yes', 'No'], size=num_samples),
        'tenure': np.random.randint(0, 73, size=num_samples),
        'InternetService': np.random.choice(['DSL', 'Fiber optic', 'No'], size=num_samples, p=[0.3, 0.5, 0.2]),
        'OnlineSecurity': np.random.choice(['Yes', 'No', 'No internet service'], size=num_samples),
        'TechSupport': np.random.choice(['Yes', 'No', 'No internet service'], size=num_samples),
        'Contract': np.random.choice(['Month-to-month', 'One year', 'Two year'], size=num_samples, p=[0.5, 0.3, 0.2]),
        'PaperlessBilling': np.random.choice(['Yes', 'No'], size=num_samples),
        'PaymentMethod': np.random.choice(['Electronic check', 'Mailed check', 'Bank transfer (automatic)', 'Credit card (automatic)'], size=num_samples),
    }

    df = pd.DataFrame(data)

    # Adjust conditionally
    df.loc[df['InternetService'] == 'No', ['OnlineSecurity', 'TechSupport']] = 'No internet service'
    
    # Generate MonthlyCharges
    base_charge = 20.0
    internet_add = df['InternetService'].map({'DSL': 30.0, 'Fiber optic': 50.0, 'No': 0.0})
    extra_add = df['OnlineSecurity'].map({'Yes': 10.0, 'No': 0.0, 'No internet service': 0.0}) + df['TechSupport'].map({'Yes': 10.0, 'No': 0.0, 'No internet service': 0.0})
    df['MonthlyCharges'] = base_charge + internet_add + extra_add + np.random.uniform(0, 10, num_samples)
    df['MonthlyCharges'] = df['MonthlyCharges'].round(2)
    
    # Generate TotalCharges
    df['TotalCharges'] = df['MonthlyCharges'] * df['tenure'] + np.random.uniform(0, 50, num_samples)
    # Handle zero tenure
    df.loc[df['tenure'] == 0, 'TotalCharges'] = 0
    df['TotalCharges'] = df['TotalCharges'].round(2).astype(str) # some spaces for missing value sim
    df.loc[df['tenure'] == 0, 'TotalCharges'] = ' '

    # Generate Churn based on logic
    churn_prob = 0.1
    churn_prob += np.where(df['Contract'] == 'Month-to-month', 0.3, 0)
    churn_prob += np.where(df['InternetService'] == 'Fiber optic', 0.15, 0)
    churn_prob -= np.where(df['TechSupport'] == 'Yes', 0.1, 0)
    churn_prob -= np.where(df['tenure'] > 24, 0.15, 0)
    churn_prob = np.clip(churn_prob, 0.05, 0.95)
    
    df['Churn'] = [np.random.choice(['Yes', 'No'], p=[p, 1-p]) for p in churn_prob]

    return df

if __name__ == "__main__":
    print("Generating main dataset...")
    df = generate_telecom_data(5000)
    
    base_dir = os.path.dirname(os.path.abspath(__file__))
    os.makedirs(os.path.join(base_dir, 'datasets'), exist_ok=True)
    os.makedirs(os.path.join(base_dir, 'sample_data'), exist_ok=True)
    
    main_path = os.path.join(base_dir, 'datasets', 'telco_churn.csv')
    df.to_csv(main_path, index=False)
    print(f"Saved {main_path}")

    print("Generating sample datasets...")
    # Sample files should not have 'Churn' column
    df_samples = df.drop(columns=['Churn'])
    
    sample_small = df_samples.sample(n=50, random_state=1)
    sample_small.to_csv(os.path.join(base_dir, 'sample_data', 'sample_small.csv'), index=False)
    
    sample_medium = df_samples.sample(n=200, random_state=2)
    sample_medium.to_csv(os.path.join(base_dir, 'sample_data', 'sample_medium.csv'), index=False)
    
    sample_large = df_samples.sample(n=500, random_state=3)
    sample_large.to_csv(os.path.join(base_dir, 'sample_data', 'sample_large.csv'), index=False)
    
    print("Sample datasets created.")
