def classify_risk(probability: float) -> str:
    """
    Converts a churn probability into 5 risk levels according to requirements:
    Probability >= 0.85 -> Very High
    Probability >= 0.70 -> High
    Probability >= 0.50 -> Medium
    Probability >= 0.25 -> Low
    Probability < 0.25 -> Very Low
    """
    if probability >= 0.85:
        return 'Very High'
    elif probability >= 0.70:
        return 'High'
    elif probability >= 0.50:
        return 'Medium'
    elif probability >= 0.25:
        return 'Low'
    else:
        return 'Very Low'
