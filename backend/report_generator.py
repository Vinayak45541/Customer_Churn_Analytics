from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
import datetime
import os

def generate_pdf_report(analytics_data, filepath):
    doc = SimpleDocTemplate(filepath, pagesize=letter)
    elements = []
    
    styles = getSampleStyleSheet()
    title_style = styles['Title']
    heading_style = styles['Heading2']
    normal_style = styles['Normal']
    
    # Title
    elements.append(Paragraph("Customer Churn Risk Analysis Report", title_style))
    elements.append(Spacer(1, 12))
    
    # Overview
    elements.append(Paragraph("Overview", heading_style))
    elements.append(Paragraph(f"Total customers analyzed: {analytics_data['total_customers']}", normal_style))
    elements.append(Paragraph(f"Date and time: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", normal_style))
    elements.append(Spacer(1, 12))
    
    # Risk Distribution Table
    elements.append(Paragraph("Risk Distribution", heading_style))
    
    data = [['Risk Level', 'Customer Count', 'Percentage (%)']]
    for level, stats in analytics_data['risk_distribution'].items():
        data.append([level, str(stats['count']), str(stats['percentage'])])
        
    t = Table(data, colWidths=[150, 150, 150])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.grey),
        ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0,0), (-1,0), 12),
        ('BACKGROUND', (0,1), (-1,-1), colors.beige),
        ('GRID', (0,0), (-1,-1), 1, colors.black)
    ]))
    elements.append(t)
    elements.append(Spacer(1, 20))
    
    # Churn Drivers by Field
    elements.append(Paragraph("Top Churn Drivers by Service Field", heading_style))
    field_churn = analytics_data.get('field_churn', [])
    if field_churn:
        field_data = [['Service Field', 'Risk Level', '% Customers with Attribute']]
        for item in field_churn:
            field_data.append([
                item['field'],
                item.get('risk_level', '-'),
                f"{item.get('prevalence', item.get('avg_prob', 0))}%"
            ])
        ft = Table(field_data, colWidths=[200, 120, 130])
        ft.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#6366f1')),
            ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0,0), (-1,0), 10),
            ('BACKGROUND', (0,1), (-1,-1), colors.HexColor('#f8fafc')),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0'))
        ]))
        elements.append(ft)
    elements.append(Spacer(1, 20))
    
    # Suggestions
    elements.append(Paragraph("Suggested Retention Strategies", heading_style))
    strategies = [
        "1. Offer personalized discounts to 'Very High' risk customers.",
        "2. Reach out to customers with high monthly charges to review their plans.",
        "3. Improve tech support experiences, as it is a major driver.",
        "4. Transition month-to-month customers to annual contracts."
    ]
    for strategy in strategies:
        elements.append(Paragraph(strategy, normal_style))
        
    doc.build(elements)
    
    return filepath
