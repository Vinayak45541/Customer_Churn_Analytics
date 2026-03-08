import joblib
import os
from functools import lru_cache

@lru_cache(maxsize=1)
def get_model():
    model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models', 'churn_model.pkl')
    print(f"[model_loader] Looking for model at: {model_path}")
    print(f"[model_loader] File exists: {os.path.exists(model_path)}")
    try:
        model = joblib.load(model_path)
        print(f"[model_loader] Model loaded successfully!")
        return model
    except Exception as e:
        print(f"[model_loader] ERROR loading model: {type(e).__name__}: {e}")
        return None
