"""
Generates 5 sample CSV files with completely distinct risk profiles.
Each file has the exact same columns but very different customer value distributions.

Profile overview:
  sample_data_1.csv → Very Low risk  (loyal, long-tenure, annual contracts)
  sample_data_2.csv → Low risk       (mostly stable, few red flags)
  sample_data_3.csv → Medium risk    (genuine mixed bag)
  sample_data_4.csv → High risk      (short tenure, month-to-month, fiber optic)
  sample_data_5.csv → Very High risk (worst case: all churn signals maxed out)
"""
import pandas as pd
import numpy as np
import random, string, os

COLS = [
    'customerID','SeniorCitizen','Partner','Dependents','tenure',
    'PhoneService','MultipleLines','InternetService','OnlineSecurity',
    'OnlineBackup','DeviceProtection','TechSupport','StreamingTV',
    'StreamingMovies','Contract','PaperlessBilling','PaymentMethod',
    'MonthlyCharges','TotalCharges'
]

def cid():
    return ''.join(random.choices(string.digits,k=4))+'-'+''.join(random.choices(string.ascii_uppercase+string.digits,k=5))

def yn(p_yes): return np.random.choice(['Yes','No'], p=[p_yes, 1-p_yes])
def pick(opts, probs): return np.random.choice(opts, p=probs)

def make_row(profile):
    p = profile
    tenure       = int(np.clip(np.random.normal(p['tenure_mean'], p['tenure_std']), 1, 72))
    monthly      = round(np.clip(np.random.normal(p['monthly_mean'], p['monthly_std']), 19, 115), 2)
    total        = round(monthly * tenure * np.random.uniform(0.92, 1.08), 2)
    contract     = pick(['Month-to-month','One year','Two year'], p['contract'])
    internet     = pick(['Fiber optic','DSL','No'], p['internet'])
    no_service   = 'No internet service' if internet == 'No' else 'No'
    yes_service  = 'No internet service' if internet == 'No' else 'Yes'

    return {
        'customerID':       cid(),
        'SeniorCitizen':    np.random.choice([0,1], p=[1-p['senior'], p['senior']]),
        'Partner':          yn(p['partner']),
        'Dependents':       yn(p['dependents']),
        'tenure':           tenure,
        'PhoneService':     yn(p['phone']),
        'MultipleLines':    yn(p['multi_lines']),
        'InternetService':  internet,
        'OnlineSecurity':   no_service if internet=='No' else yn(p['security']),
        'OnlineBackup':     no_service if internet=='No' else yn(p['backup']),
        'DeviceProtection': no_service if internet=='No' else yn(p['device']),
        'TechSupport':      no_service if internet=='No' else yn(p['tech']),
        'StreamingTV':      no_service if internet=='No' else yn(p['tv']),
        'StreamingMovies':  no_service if internet=='No' else yn(p['movies']),
        'Contract':         contract,
        'PaperlessBilling': yn(p['paperless']),
        'PaymentMethod':    pick(
            ['Electronic check','Mailed check','Bank transfer (automatic)','Credit card (automatic)'],
            p['payment']
        ),
        'MonthlyCharges':   monthly,
        'TotalCharges':     total,
    }

# ── Profile definitions ──────────────────────────────────────────────────────
PROFILES = {
    # Very Low risk: long tenure, two-year contracts, DSL, great support, auto pay
    'sample_data_1': dict(
        n=60,
        senior=0.08, partner=0.75, dependents=0.60,
        tenure_mean=54, tenure_std=10,
        monthly_mean=42, monthly_std=8,
        phone=0.90, multi_lines=0.35,
        internet=[0.10, 0.80, 0.10],  # fiber/DSL/None
        security=0.90, backup=0.85, device=0.85, tech=0.90, tv=0.30, movies=0.25,
        contract=[0.05, 0.25, 0.70],  # m2m/1yr/2yr
        paperless=0.25,
        payment=[0.05, 0.05, 0.50, 0.40],  # e-check/mail/bank/cc
    ),

    # Low risk: mostly stable, mostly long contracts, some new customers
    'sample_data_2': dict(
        n=100,
        senior=0.12, partner=0.60, dependents=0.45,
        tenure_mean=36, tenure_std=14,
        monthly_mean=55, monthly_std=12,
        phone=0.90, multi_lines=0.40,
        internet=[0.25, 0.65, 0.10],
        security=0.70, backup=0.65, device=0.65, tech=0.70, tv=0.45, movies=0.40,
        contract=[0.20, 0.45, 0.35],
        paperless=0.40,
        payment=[0.15, 0.10, 0.40, 0.35],
    ),

    # Medium risk: genuine mixed bag — half stable, half fragile
    'sample_data_3': dict(
        n=180,
        senior=0.20, partner=0.50, dependents=0.35,
        tenure_mean=22, tenure_std=16,
        monthly_mean=65, monthly_std=18,
        phone=0.90, multi_lines=0.45,
        internet=[0.45, 0.45, 0.10],
        security=0.45, backup=0.45, device=0.45, tech=0.45, tv=0.55, movies=0.50,
        contract=[0.50, 0.30, 0.20],
        paperless=0.55,
        payment=[0.35, 0.15, 0.28, 0.22],
    ),

    # High risk: short tenure, month-to-month, fiber optic, no support
    'sample_data_4': dict(
        n=120,
        senior=0.35, partner=0.30, dependents=0.18,
        tenure_mean=9, tenure_std=5,
        monthly_mean=82, monthly_std=12,
        phone=0.95, multi_lines=0.60,
        internet=[0.75, 0.23, 0.02],
        security=0.15, backup=0.25, device=0.25, tech=0.15, tv=0.65, movies=0.65,
        contract=[0.80, 0.15, 0.05],
        paperless=0.78,
        payment=[0.65, 0.10, 0.15, 0.10],
    ),

    # Very High risk: maximum churn signals — new, expensive, no safety net
    'sample_data_5': dict(
        n=90,
        senior=0.50, partner=0.20, dependents=0.10,
        tenure_mean=3, tenure_std=2,
        monthly_mean=97, monthly_std=8,
        phone=0.97, multi_lines=0.70,
        internet=[0.95, 0.05, 0.00],
        security=0.04, backup=0.08, device=0.08, tech=0.04, tv=0.75, movies=0.75,
        contract=[0.96, 0.03, 0.01],
        paperless=0.90,
        payment=[0.85, 0.05, 0.06, 0.04],
    ),
}

out_dir = os.path.join(os.path.dirname(__file__), 'sample_data')

# Remove old files
for old in ['sample_small.csv','sample_medium.csv','sample_large.csv',
            'sample_high_churn_80.csv','sample_high_churn_150.csv']:
    path = os.path.join(out_dir, old)
    if os.path.exists(path):
        os.remove(path)
        print(f"Removed {old}")

# Generate new files
for name, profile in PROFILES.items():
    np.random.seed(PROFILES[name]['n'])
    random.seed(PROFILES[name]['n'])
    rows = [make_row(profile) for _ in range(profile['n'])]
    df = pd.DataFrame(rows, columns=COLS)
    path = os.path.join(out_dir, f'{name}.csv')
    df.to_csv(path, index=False)
    print(f"{name}.csv → {len(df)} rows")

print("\nAll 5 sample data files generated!")
