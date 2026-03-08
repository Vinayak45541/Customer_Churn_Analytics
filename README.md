# 📊 Customer Churn Analytics Platform

An end-to-end **machine learning web application** that predicts telecom customer churn risk, visualizes analytics dashboards, and generates downloadable PDF reports.

The system allows users to upload customer datasets, run ML inference, and instantly view churn analytics without requiring any data science expertise.

---

# 🚀 Live Demo

Try the deployed application here:

🔗 **Live App:**  https://customer-churn-analytics-frontend.onrender.com

### Quick Test

1. Click **Try Sample Data**
2. Select one of the datasets
3. Click **Analyze**

The platform will instantly generate:

* churn risk analytics
* interactive charts
* downloadable PDF report

---

# ✨ Features

| Feature           | Description                                         |
| ----------------- | --------------------------------------------------- |
| 📂 CSV Upload     | Upload telecom customer datasets for churn analysis |
| 🧪 Sample Data    | Built-in datasets to test the system instantly      |
| 📊 Risk Dashboard | Interactive charts showing churn risk distribution  |
| 🔍 Field Analysis | Identifies service attributes contributing to churn |
| 📄 PDF Reports    | Generates downloadable churn analysis reports       |
| 🔁 New Analysis   | Reset dashboard and run new dataset analysis        |

---

# 🛠 Tech Stack

### Backend

| Technology       | Purpose                                 |
| ---------------- | --------------------------------------- |
| FastAPI          | REST API framework                      |
| Uvicorn          | ASGI server                             |
| Pandas           | Data processing                         |
| NumPy            | Numerical operations                    |
| Scikit-learn     | ML preprocessing utilities              |
| XGBoost          | Gradient boosted churn prediction model |
| Joblib           | Model serialization                     |
| ReportLab        | PDF report generation                   |
| python-multipart | File upload handling                    |

### Frontend

| Technology   | Purpose                      |
| ------------ | ---------------------------- |
| React        | UI framework                 |
| Vite         | Development server & bundler |
| Recharts     | Interactive charts           |
| Tailwind CSS | Styling framework            |
| Lucide React | Icons                        |

---

# ⚙️ How It Works

```
User uploads CSV
        │
        ▼
FastAPI /analyze endpoint
        │
        ▼
Pandas loads and cleans data
        │
        ▼
Trained ML model predicts churn probability
        │
        ▼
Risk classification engine assigns risk levels
        │
        ▼
Analytics summary generated
        │
        ▼
PDF report generated
        │
        ▼
React dashboard displays interactive charts
```

---

# 🚦 Risk Classification

Each customer is classified into one of five churn risk tiers.

| Risk Level   | Probability Range | Meaning                   |
| ------------ | ----------------- | ------------------------- |
| 🔴 Very High | ≥ 85%             | Immediate churn risk      |
| 🟠 High      | 70 – 84%          | High probability of churn |
| 🟡 Medium    | 50 – 69%          | Moderate churn risk       |
| 🟢 Low       | 25 – 49%          | Low churn risk            |
| 🔵 Very Low  | < 25%             | Very unlikely to churn    |

---

# 📁 Project Structure

```
Customer_Churn_Prediction/

backend/
│
├── main.py
├── predict.py
├── model_loader.py
├── risk_logic.py
├── report_generator.py
├── requirements.txt
│
├── models/
│   └── churn_model.pkl
│
├── datasets/
│
├── sample_data/
│   ├── sample_data_1.csv
│   ├── sample_data_2.csv
│   ├── sample_data_3.csv
│   ├── sample_data_4.csv
│   └── sample_data_5.csv
│
├── reports/
└── training/


frontend/
│
├── index.html
├── package.json
├── vite.config.js
│
└── src/
    ├── main.jsx
    ├── App.jsx
    └── components/
        ├── UploadPanel.jsx
        ├── SampleDataDropdown.jsx
        ├── ChartsDashboard.jsx
        └── DownloadReportButton.jsx
```

---

# 🚀 Getting Started

## Prerequisites

Install the following:

* Python 3.9+
* Node.js 18+
* npm
* Git

---

# 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/Customer_Churn_Prediction.git
cd Customer_Churn_Prediction
```

---

# 2️⃣ Backend Setup

Create and activate virtual environment:

```bash
python -m venv venv
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r backend/requirements.txt
```

Ensure the trained model exists:

```
backend/models/churn_model.pkl
```

---

# 3️⃣ Frontend Setup

```bash
cd frontend
npm install
```

---

# 4️⃣ Running the Application

Run the backend:

```bash
uvicorn backend.main:app --reload --port 8000
```

Backend runs at:

```
http://localhost:8000
```

Start the frontend:

```bash
cd frontend
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

# 📡 API Reference

## POST `/analyze`

Uploads a CSV dataset and returns churn analytics.

**Request**

```
multipart/form-data
file = <CSV file>
```

**Response Example**

```json
{
  "total_customers": 180,
  "risk_distribution": {
    "Very High": { "count": 24, "percentage": 13.3 },
    "High": { "count": 41, "percentage": 22.8 },
    "Medium": { "count": 57, "percentage": 31.7 },
    "Low": { "count": 38, "percentage": 21.1 },
    "Very Low": { "count": 20, "percentage": 11.1 }
  }
}
```

---

## GET `/sample_data/{filename}`

Downloads built-in sample datasets.

Valid files:

```
sample_data_1.csv
sample_data_2.csv
sample_data_3.csv
sample_data_4.csv
sample_data_5.csv
```

---

## GET `/download_report`

Downloads the generated PDF churn analysis report.

---

# 📄 CSV File Format

The uploaded dataset must contain telecom customer attributes.

Example columns:

| Column           | Example          |
| ---------------- | ---------------- |
| SeniorCitizen    | 0                |
| Partner          | Yes              |
| Dependents       | No               |
| tenure           | 12               |
| InternetService  | Fiber optic      |
| OnlineSecurity   | No               |
| TechSupport      | No               |
| Contract         | Month-to-month   |
| PaperlessBilling | Yes              |
| PaymentMethod    | Electronic check |
| MonthlyCharges   | 79.85            |
| TotalCharges     | 958.2            |

The **Churn column is not required**, since the model predicts it.

---

# 🧪 Sample Datasets

Five built-in datasets are included for quick testing.

| Dataset           | Description                 |
| ----------------- | --------------------------- |
| sample_data_1.csv | Balanced churn distribution |
| sample_data_2.csv | Balanced churn distribution |
| sample_data_3.csv | Balanced churn distribution |
| sample_data_4.csv | High churn dataset          |
| sample_data_5.csv | High churn dataset          |

These datasets can be accessed through the **Try Sample Data** dropdown in the UI.

---

# 🌍 Environment

| Service  | URL                   |
| -------- | --------------------- |
| Frontend | http://localhost:5173 |
| Backend  | http://localhost:8000 |

If deploying to another host, update API URLs in:

```
frontend/src/components/
```

---

# 📜 License

This project is built for educational and demonstration purposes.

---

Built with ❤️ using **FastAPI, XGBoost, React, and Recharts**
