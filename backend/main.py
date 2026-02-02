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
            "title": "어제경기 시청률",
            "colSpan": "lg:col-span-2",
            "data": {
                "isComplex": True,
                "date": "2025.01.29",
                "section1": {
                    "title": "어제경기 시청률",
                    "headers": ["구분", "채널", "대전", "전체", "CATV", "시청자수"], 
                    "rows": [
                        {"category": "프로배구", "channel": "KBS N", "match": "대한항공 vs 현대캐피탈", "total": "1.24%", "catv": "1.10%", "viewers": "150,000"},
                        {"category": "프로배구", "channel": "SBS Sports", "match": "OK금융그룹 vs KB손해보험", "total": "0.98%", "catv": "0.90%", "viewers": "120,000"},
                        {"category": "여자부", "channel": "KBS N", "match": "흥국생명 vs IBK기업은행", "total": "1.85%", "catv": "1.78%", "viewers": "210,000"},
                        {"category": "여자부", "channel": "SBS Sports", "match": "현대건설 vs GS칼텍스", "total": "1.50%", "catv": "1.45%", "viewers": "180,000"}
                    ]
                },
                "section2": {
                    "title": "동시간대 타 종목 시청률",
                    "headers": ["구분", "채널", "대전", "전체", "CATV"],
                    "rows": [
                        {"category": "농구", "channel": "SPOTV", "match": "KBL 경기", "total": "0.40%", "catv": "0.38%"},
                        {"category": "배구", "channel": "KBS", "match": "V-League 재방", "total": "0.30%", "catv": "0.29%"},
                        {"category": "야구", "channel": "MBC Sports", "match": "KBO 하이라이트", "total": "0.80%", "catv": "0.75%"},
                        {"category": "골프", "channel": "JTBC Golf", "match": "PGA 투어", "total": "0.50%", "catv": "0.48%"},
                        {"category": "축구", "channel": "tvN Sports", "match": "아시안컵 재방", "total": "1.20%", "catv": "1.15%"}
                    ]
                }
            }
        },
        {
            "id": "w2",
            "type": "metric",
            "title": "2025~2026시즌 평균 시청률",
            "colSpan": "lg:col-span-2",
            "data": {
                "viewType": "season_avg",
                "season": "2025~2026",
                "currentRate": "0.98%",
                "trend": "0.05%",
                "trendUp": True,
                "comparison": "vs 2024~2025",
                "topRankings": [
                    {"rank": 1, "season": "2023-2024", "rate": "1.22%"},
                    {"rank": 2, "season": "2024-2025", "rate": "1.15%"},
                    {"rank": 3, "season": "2021-2022", "rate": "1.12%"},
                    {"rank": 4, "season": "2020-2021", "rate": "1.08%"},
                    {"rank": 5, "season": "2018-2019", "rate": "1.02%"},
                    {"rank": 6, "season": "2017-2018", "rate": "0.99%"},
                    {"rank": 7, "season": "2016-2017", "rate": "0.95%"},
                    {"rank": 8, "season": "2015-2016", "rate": "0.92%"},
                    {"rank": 9, "season": "2012-2013", "rate": "0.88%"},
                    {"rank": 10, "season": "2011-2012", "rate": "0.85%"}
                ]
            }
        },
        {
            "id": "w3",
            "type": "metric",
            "title": "남자부",
            "colSpan": "lg:col-span-1",
            "data": {
                "viewType": "season_avg",
                "season": "2025~2026",
                "currentRate": "0.55%",
                "trend": "0.02%",
                "trendUp": True,
                "comparison": "vs 2024~2025",
                "topRankings": [] 
            }
        },
        {
            "id": "w4",
            "type": "metric",
            "title": "여자부",
            "colSpan": "lg:col-span-1",
            "data": {
                "viewType": "season_avg",
                "season": "2025~2026",
                "currentRate": "1.05%",
                "trend": "0.12%",
                "trendUp": True,
                "comparison": "vs 2024~2025",
                "topRankings": []
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
            "title": "역대 시청률 TOP5",
            "colSpan": "lg:col-span-2",
            "data": {
                "viewType": "ranking_split",
                "top1": {
                    "rank": 1,
                    "match": "흥국생명 vs 한국도로공사",
                    "date": "2023년 4월 6일",
                    "rate": "3.40%"
                },
                "others": [
                    {"rank": 2, "date": "2025년 4월 6일", "match": "흥국생명 vs 정관장", "rate": "3.08%"},
                    {"rank": 3, "date": "2024년 4월 1일", "match": "흥국생명 vs 현대건설", "rate": "2.71%"},
                    {"rank": 4, "date": "2019년 3월 25일", "match": "한국도로공사 vs 흥국생명", "rate": "2.67%"},
                    {"rank": 5, "date": "2018년 3월 28일", "match": "대한항공 vs 현대캐피탈", "rate": "2.64%"},
                    {"rank": 6, "date": "2017년 3월 15일", "match": "IBK기업은행 vs 흥국생명", "rate": "2.55%"},
                    {"rank": 7, "date": "2016년 3월 20일", "match": "현대캐피탈 vs OK저축은행", "rate": "2.50%"},
                    {"rank": 8, "date": "2015년 3월 10일", "match": "삼성화재 vs OK저축은행", "rate": "2.45%"},
                    {"rank": 9, "date": "2014년 3월 05일", "match": "GS칼텍스 vs IBK기업은행", "rate": "2.40%"},
                    {"rank": 10, "date": "2013년 3월 12일", "match": "삼성화재 vs 대한항공", "rate": "2.35%"}
                ]
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
