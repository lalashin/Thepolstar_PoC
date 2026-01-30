from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import pandas as pd
import os
import subprocess
import webbrowser
import threading
import time
import sys
from typing import List, Dict, Any

app = FastAPI()

# CORS Configuration
origins = [
    "http://localhost:5173", # Vite default
    "http://localhost:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Determine paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
FRONTEND_DIR = os.path.join(os.path.dirname(BASE_DIR), "frontend")
DIST_DIR = os.path.join(FRONTEND_DIR, "dist")

def read_csv_data(filename: str) -> List[Dict[str, Any]]:
    file_path = os.path.join(DATA_DIR, filename)
    if not os.path.exists(file_path):
        print(f"Warning: File not found {file_path}")
        return []
    
    try:
        df = pd.read_csv(file_path)
        # NaN handling for JSON serialization
        df = df.where(pd.notnull(df), None)
        return df.to_dict(orient="records")
    except Exception as e:
        print(f"Error reading {filename}: {e}")
        return []

@app.get("/api/widgets")
def get_widgets_config():
    # Load Data
    d1 = read_csv_data("w1_daily_viewership.csv")
    d2 = read_csv_data("w2_season_avg.csv")
    d3 = read_csv_data("w3_men_stats.csv")
    d4 = read_csv_data("w4_women_stats.csv")
    d5 = read_csv_data("w5_top_ratings.csv")
    d6 = read_csv_data("w6_season_trend.csv")
    d7 = read_csv_data("w7_daily_calendar.csv")

    widgets = [
        {
            "id": "w1",
            "type": "metric",
            "title": d1[0]['title'] if d1 and 'title' in d1[0] else "어제 경기 시청률",
            "colSpan": "lg:col-span-1",
            "data": {
                "value": d1[0]['value'] if d1 else "2.4%",
                "trend": d1[0]['trend'] if d1 else "+0.3%",
                "trendUp": str(d1[0]['trendUp']).lower() == 'true' if d1 else True,
                "label": d1[0]['label'] if d1 else "vs 전일 대비",
                "icon": "tv"
            }
        },
        {
            "id": "w2",
            "type": "metric",
            "title": d2[0]['title'] if d2 and 'title' in d2[0] else "2025-26 시즌 평균",
            "colSpan": "lg:col-span-1",
            "data": {
                "value": d2[0]['value'] if d2 else "1.85%",
                "trend": d2[0]['trend'] if d2 else "-0.05%",
                "trendUp": str(d2[0]['trendUp']).lower() == 'true' if d2 else False,
                "label": d2[0]['label'] if d2 else "vs 지난 시즌",
                "icon": "chart"
            }
        },
        {
            "id": "w3",
            "type": "list",
            "title": "남자부 주요 지표",
            "colSpan": "lg:col-span-1",
            "data": {
                "items": d3 if d3 else []
            }
        },
        {
            "id": "w4",
            "type": "list",
            "title": "여자부 주요 지표",
            "colSpan": "lg:col-span-1",
            "data": {
                "items": d4 if d4 else []
            }
        },
        {
            "id": "w6",
            "type": "chart",
            "title": "시즌별 시청률 추이",
            "colSpan": "lg:col-span-4 md:col-span-2 row-span-2",
            "height": "h-96",
            "data": {
                "labels": [r['label'] for r in d6] if d6 else [],
                "values": [float(r['value']) for r in d6] if d6 else [],
                "prevValues": [float(r['prevValue']) for r in d6] if d6 else []
            }
        },
        {
            "id": "w5",
            "type": "ranking",
            "title": "역대 최고 시청률 TOP 5",
            "colSpan": "lg:col-span-1",
            "data": {
                "list": d5 if d5 else []
            }
        },
        {
            "id": "w7",
            "type": "calendar",
            "title": "일자별 시청률",
            "colSpan": "lg:col-span-1",
            "data": {
                "maxRate": 3.5,
                "days": d7 if d7 else []
            }
        },
        {
            "id": "w8",
            "type": "map",
            "title": "지역별 시청률 히트맵",
            "colSpan": "lg:col-span-2 md:col-span-2 row-span-2",
            "height": "h-96",
            "data": {} 
        },
        {
            "id": "w9",
            "type": "pyramid",
            "title": "남녀부 시청률 분포 (피라미드)",
            "colSpan": "lg:col-span-2 md:col-span-2 row-span-2",
            "height": "h-96",
            "data": {}
        }
    ]
    return widgets

# --- Router Registration ---
from routers import map_analytics, gender_distribution
app.include_router(map_analytics.router)
app.include_router(gender_distribution.router)

# --- Serve Static Files (Production Build Support) ---
# If 'dist' exists, serve it. Otherwise, rely on separate dev server
if os.path.exists(DIST_DIR):
    app.mount("/assets", StaticFiles(directory=os.path.join(DIST_DIR, "assets")), name="assets")
    
    @app.get("/{full_path:path}")
    async def serve_react_app(full_path: str):
        # API requests are handled by specific routes above.
        # Everything else returns index.html for SPA routing
        if full_path.startswith("api"):
            raise HTTPException(status_code=404, detail="Not Found")
        
        file_path = os.path.join(DIST_DIR, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
            
        return FileResponse(os.path.join(DIST_DIR, "index.html"))

# --- Development Helper ---
def start_frontend_dev_server():
    """Starts the Vite dev server in a subprocess."""
    print("🚀 Starting Frontend Dev Server...")
    # Using shell=True for Windows compatibility with 'npm'
    subprocess.Popen("npm run dev", shell=True, cwd=FRONTEND_DIR)

def open_browser(url):
    """Opens the browser after a short delay."""
    time.sleep(2)
    print(f"🌍 Opening browser at {url}")
    webbrowser.open(url)

if __name__ == "__main__":
    import uvicorn
    import argparse
    
    # Simple logic: If we are running directly, try to be helpful
    
    # Check if 'dist' exists. If not, we probably want dev mode.
    HAS_BUILD = os.path.exists(DIST_DIR)
    
    # For user convenience: If they run 'python main.py', we want to launch everything.
    # We will favor the Dev Server if no build exists, or if explicit argument?
    # Let's default to Dev Server for "Developer Experience" unless build is present and robust.
    # Actually, user asked for "python main.py" to open frontend.
    
    if not HAS_BUILD:
        print("⚠️ No production build found in frontend/dist.")
        print("ℹ️  Running in DEVELOPMENT mode. Starting Vite server...")
        start_frontend_dev_server()
        TARGET_URL = "http://localhost:5173"
    else:
        print("✅ Production build found. Serving statically via FastAPI.")
        TARGET_URL = "http://localhost:8000"

    # Launch browser in a separate thread
    threading.Thread(target=open_browser, args=(TARGET_URL,), daemon=True).start()

    print(f"🔥 Starting Backend Server on port 8000...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
