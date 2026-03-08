from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
import pandas as pd
import io
import os
import traceback
from predict import predict_churn, generate_analytics_summary
from report_generator import generate_pdf_report

app = FastAPI(title="Customer Churn Analytics Platform API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze_csv(file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        return JSONResponse(status_code=400, content={"error": "File must be a CSV"})
    
    content = await file.read()
    df = pd.read_csv(io.StringIO(content.decode('utf-8')))
    
    try:
        predictions, df_processed = predict_churn(df)
        analytics = generate_analytics_summary(predictions, df_processed)
        
        # Determine path to save report
        report_dir = os.path.join(os.path.dirname(__file__), 'reports')
        os.makedirs(report_dir, exist_ok=True)
        report_path = os.path.join(report_dir, 'churn_analysis_report.pdf')
        
        # Generate the report
        generate_pdf_report(analytics, report_path)
        
        return analytics
    except Exception as e:
        traceback.print_exc()  # Print full error to uvicorn console
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.get("/sample_data/{filename}")
async def get_sample_data(filename: str):
    valid_files = [
        "sample_data_1.csv", "sample_data_2.csv", "sample_data_3.csv",
        "sample_data_4.csv", "sample_data_5.csv",
    ]
    if filename not in valid_files:
        return JSONResponse(status_code=404, content={"error": "Sample file not found"})
        
    file_path = os.path.join(os.path.dirname(__file__), 'sample_data', filename)
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type='text/csv', filename=filename)
    else:
        return JSONResponse(status_code=404, content={"error": "Sample file does not exist on disk"})

@app.get("/download_report")
async def download_report():
    report_path = os.path.join(os.path.dirname(__file__), 'reports', 'churn_analysis_report.pdf')
    if os.path.exists(report_path):
        return FileResponse(report_path, media_type='application/pdf', filename='churn_analysis_report.pdf')
    else:
        return JSONResponse(status_code=404, content={"error": "Report not found"})
