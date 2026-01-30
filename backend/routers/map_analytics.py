from fastapi import APIRouter
import pandas as pd
import os
import json

router = APIRouter()

# 데이터 경로 설정 (backend/data 폴더 기준)
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")

def get_stadium_coords(city):
    """
    도시명을 기반으로 구장의 위도, 경도 좌표를 반환합니다.
    추후 정확한 좌표 데이터베이스로 확장 가능합니다.
    """
    coords = {
        '인천광역시': {'lat': 37.528, 'lng': 126.737, 'name': '인천계양체육관'}, # 대한항공, 흥국생명
        '인천': {'lat': 37.508, 'lng': 126.737, 'name': '인천삼산월드체육관'}, # (흥국생명 이전 후)
        '천안시': {'lat': 36.806, 'lng': 127.116, 'name': '천안유관순체육관'}, # 현대캐피탈
        '장충': {'lat': 37.558, 'lng': 127.006, 'name': '서울장충체육관'}, # 우리카드, GS칼텍스
        '서울특별시': {'lat': 37.558, 'lng': 127.006, 'name': '서울장충체육관'},
        '의정부시': {'lat': 37.744, 'lng': 127.050, 'name': '의정부실내체육관'}, # KB손해보험
        '안산시': {'lat': 37.310, 'lng': 126.830, 'name': '안산상록수체육관'}, # OK금융그룹
        '수원시': {'lat': 37.297, 'lng': 127.008, 'name': '수원실내체육관'}, # 한국전력, 현대건설
        '대전광역시': {'lat': 36.317, 'lng': 127.429, 'name': '대전충무체육관'}, # 삼성화재, 정관장
        '김천시': {'lat': 36.140, 'lng': 128.093, 'name': '김천실내체육관'}, # 한국도로공사
        '화성시': {'lat': 37.200, 'lng': 126.830, 'name': '화성종합경기타운'}, # IBK기업은행
        '광주광역시': {'lat': 35.132, 'lng': 126.883, 'name': '페퍼스타디움'}, # 페퍼저축은행
    }
    # 매핑되지 않은 도시는 기본값(서울 중심) 반환 혹은 None 처리
    return coords.get(city, {'lat': 36.5, 'lng': 127.5, 'name': city})

@router.get("/api/map-data")
def get_map_visual_data():
    """
    지도 시각화를 위한 데이터를 가공하여 반환합니다.
    2025-2026 시즌 데이터를 기준으로 집계합니다.
    """
    file_path = os.path.join(DATA_DIR, "V-LEAGUE_2025_Stadium_Updated.csv")
    
    try:
        df = pd.read_csv(file_path)
        
        # 데이터 전처리: 필요한 컬럼만 추출 및 결측치 제거
        # 소속도시가 있는 데이터만 유효
        df = df.dropna(subset=['소속도시', '가구 시청률'])
        
        # 도시별 그룹화 및 평균 시청률 계산
        # as_index=False를 사용하여 '소속도시'를 컬럼으로 유지
        city_stats = df.groupby('소속도시')['가구 시청률'].agg(['mean', 'count', 'max']).reset_index()
        city_stats.columns = ['city', 'avg_rate', 'game_count', 'max_rate']
        
        # 좌표 매핑 및 결과 데이터 생성
        result = []
        for _, row in city_stats.iterrows():
            city_name = row['city']
            avg_rate = row['avg_rate']
            
            coord_info = get_stadium_coords(city_name)
            
            # 버블 크기 (시청률 비례) 및 색상 강도 로직
            # 예: 1.0% 이상이면 강조색(warning/danger), 아니면 기본색(info/teal)
            intensity = "high" if avg_rate >= 1.0 else "normal"
            
            result.append({
                "name": city_name,
                "lat": coord_info['lat'],
                "lng": coord_info['lng'],
                "stadium": coord_info['name'],
                "value": round(avg_rate, 4), # 소수점 4자리까지 (UI에서 % 변환)
                "count": int(row['game_count']),
                "max": round(row['max_rate'], 4),
                "intensity": intensity
            })
            
        return result
        
    except FileNotFoundError:
        return {"error": "Data file not found"}
    except Exception as e:
        return {"error": str(e)}
