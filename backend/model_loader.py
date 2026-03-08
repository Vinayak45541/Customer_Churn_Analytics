import joblib
import os
from functools import lru_cache

@lru_cache(maxsize=1)
def get_model():
    model_path = os.path.join(os.path.dirname(__file__), 'models', 'churn_model.pkl')
    try:
        model = joblib.load(model_path)
        return model
    except FileNotFoundError:
        print(f"Model not found at {model_path}. Ensure it has been trained.")
        return None
