import pandas as pd
from .model_loader import get_model
from .risk_logic import classify_risk

def predict_churn(df: pd.DataFrame):
    model = get_model()
    if not model:
        raise Exception("Model not loaded")

    if 'TotalCharges' in df.columns:
        df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')
        df['TotalCharges'].fillna(0, inplace=True)
    
    customer_ids = df.get('customerID', pd.Series(range(len(df))))
    X = df.drop(columns=['customerID', 'Churn'], errors='ignore')
    
    probas = model.predict_proba(X)[:, 1]
    
    results = []
    for cid, prob in zip(customer_ids, probas):
        results.append({
            'customerID': cid,
            'churn_probability': float(prob),
            'risk_level': classify_risk(float(prob))
        })
        
    return results, df


def generate_analytics_summary(predictions, df):
    total_customers = len(predictions)
    
    distribution = {
        "Very High": {"count": 0, "percentage": 0},
        "High":      {"count": 0, "percentage": 0},
        "Medium":    {"count": 0, "percentage": 0},
        "Low":       {"count": 0, "percentage": 0},
        "Very Low":  {"count": 0, "percentage": 0}
    }
    
    for p in predictions:
        distribution[p['risk_level']]['count'] += 1
        
    for k in distribution.keys():
        distribution[k]['percentage'] = round(
            (distribution[k]['count'] / total_customers) * 100, 1
        ) if total_customers > 0 else 0

    # ── Field-level churn contribution ──────────────────────────────
    # ── Field-level risk via PREVALENCE of churn-associated attributes ──────────
    # For each key field, compute what % of ALL customers have the "bad" value.
    # This varies dramatically between low-risk and high-risk datasets.
    # Thresholds: 0-20% → Very Low, 20-40% → Low, 40-60% → Medium,
    #             60-80% → High, 80-100% → Very High
    def prevalence_to_risk(pct):
        if pct >= 80: return 'Very High', 5
        if pct >= 60: return 'High',      4
        if pct >= 40: return 'Medium',    3
        if pct >= 20: return 'Low',       2
        return 'Very Low', 1

    # Map: column -> (churn-associated value, readable label)
    FIELD_MAP = {
        'Contract':         ('Month-to-month', 'Month-to-month Contract'),
        'InternetService':  ('Fiber optic',    'Fiber Optic Internet'),
        'TechSupport':      ('No',             'No Tech Support'),
        'OnlineSecurity':   ('No',             'No Online Security'),
        'PaymentMethod':    ('Electronic check','Electronic Check Pay'),
        'PaperlessBilling': ('Yes',            'Paperless Billing'),
    }

    n = len(df)
    field_churn = []
    for col, (bad_val, label) in FIELD_MAP.items():
        if col not in df.columns:
            continue
        count = int((df[col] == bad_val).sum())
        pct   = round((count / n) * 100, 1) if n > 0 else 0.0
        risk_level, score = prevalence_to_risk(pct)
        field_churn.append({
            'field':      label,
            'risk_level': risk_level,
            'score':      score,
            'prevalence': pct,   # % of customers with this churn-associated attribute
        })

    field_churn.sort(key=lambda x: x['score'], reverse=True)

    return {
        "total_customers":   total_customers,
        "risk_distribution": distribution,
        "field_churn":       field_churn,
    }
